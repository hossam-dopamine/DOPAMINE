const express = require('express');
const fs = require('fs');
const path = require('path');
const AppData = require('../models/AppData');
const Employee = require('../models/Employee');
const Task = require('../models/Task');
const User = require('../models/User');
const { verifyToken, requireAdmin, requireAdminOrLeader } = require('../middleware/auth');
const { dataMutationLimiter } = require('../middleware/security');
const { encryptTaskFields, decryptTaskFields } = require('../utils/encryption');

const router = express.Router();

// Auto-migration helper: Migrate legacy AppData/data.json into normalized Employee & Task collections
const ensureMigratedData = async () => {
  try {
    const empCount = await Employee.countDocuments();
    if (empCount > 0) return;

    console.log('🔄 Starting data migration to normalized Employee & Task collections...');

    let legacyEmployees = [];
    let initialRate = 50;

    // Check AppData document first
    const legacyDoc = await AppData.findOne();
    if (legacyDoc && Array.isArray(legacyDoc.employees) && legacyDoc.employees.length > 0) {
      legacyEmployees = legacyDoc.employees;
      initialRate = legacyDoc.exchangeRate || 50;
    } else {
      // Check data.json
      const dataPath = path.join(__dirname, '..', '..', 'data.json');
      if (fs.existsSync(dataPath)) {
        try {
          const raw = fs.readFileSync(dataPath, 'utf8');
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.employees)) {
            legacyEmployees = parsed.employees;
            initialRate = parsed.exchangeRate || 50;
          }
        } catch (e) {
          console.error('Error reading data.json during migration:', e.message);
        }
      }
    }

    for (const empData of legacyEmployees) {
      const empId = empData.id || ('emp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5));
      await Employee.create({
        id: empId,
        name: empData.name || 'موظف',
        role: empData.role || 'عضو',
        defaultDeductionRate: typeof empData.defaultDeductionRate === 'number' ? empData.defaultDeductionRate : 10,
        paymentMethod: empData.paymentMethod || 'instapay',
        paymentDetails: empData.paymentDetails || '',
        avatarUrl: empData.avatarUrl || '',
        adjustments: empData.adjustments || {}
      });

      if (Array.isArray(empData.tasks)) {
        for (const t of empData.tasks) {
          const taskId = t.id || ('task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5));
          const encryptedT = encryptTaskFields(t);
          await Task.create({
            id: taskId,
            employeeId: empId,
            type: t.type || 'task',
            taskNumber: t.taskNumber || '',
            title: t.title || 'مهمة',
            gross: typeof t.gross === 'number' ? t.gross : 0,
            currency: t.currency || 'USD',
            deductionRate: typeof t.deductionRate === 'number' ? t.deductionRate : 10,
            delayDeduction: typeof t.delayDeduction === 'number' ? t.delayDeduction : 0,
            advance: typeof t.advance === 'number' ? t.advance : 0,
            fixedDeduction: typeof t.fixedDeduction === 'number' ? t.fixedDeduction : 0,
            status: t.status || 'pending',
            month: t.month || 'january',
            exchangeRate: t.exchangeRate,
            email: encryptedT.email || '',
            password: encryptedT.password || '',
            character: encryptedT.character || '',
            vpn: encryptedT.vpn || '',
            createdAt: t.createdAt ? new Date(t.createdAt) : new Date()
          });
        }
      }
    }

    // Save exchange rate in AppData meta document
    let appData = await AppData.findOne();
    if (!appData) {
      appData = new AppData({ exchangeRate: initialRate });
    } else {
      appData.exchangeRate = initialRate;
    }
    await appData.save();

    console.log('✅ Migration to normalized collections completed successfully!');
  } catch (err) {
    console.error('❌ Data migration error:', err);
  }
};

// GET /data - Load full dataset for Admin or employee-scoped dataset
router.get('/', verifyToken, async (req, res) => {
  try {
    let meta = await AppData.findOne();
    const exchangeRate = meta ? meta.exchangeRate : 50;
    const eurExchangeRate = meta && meta.eurExchangeRate ? meta.eurExchangeRate : 55;

    if (req.user.role === 'admin') {
      const dbEmployees = await Employee.find().lean();
      const dbTasks = await Task.find().lean();

      const employeesWithTasks = dbEmployees.map(emp => {
        const empTasks = dbTasks
          .filter(t => String(t.employeeId) === String(emp.id))
          .map(t => decryptTaskFields(t));
        return { ...emp, tasks: empTasks };
      });

      return res.json({
        success: true,
        data: {
          employees: employeesWithTasks,
          exchangeRate,
          eurExchangeRate
        }
      });
    } else if (req.user.role === 'leader') {
      const allowedIds = new Set((req.user.allowedEmployeeIds || []).map(String));
      if (req.user.employeeId) allowedIds.add(String(req.user.employeeId));

      const targetEmpIds = Array.from(allowedIds);
      const dbEmployees = await Employee.find({ id: { $in: targetEmpIds } }).lean();
      const dbTasks = await Task.find({ employeeId: { $in: targetEmpIds } }).lean();

      const employeesWithTasks = dbEmployees.map(emp => {
        const empTasks = dbTasks
          .filter(t => String(t.employeeId) === String(emp.id))
          .map(t => decryptTaskFields(t));
        return { ...emp, tasks: empTasks };
      });

      return res.json({
        success: true,
        data: {
          employees: employeesWithTasks,
          exchangeRate,
          eurExchangeRate
        }
      });
    } else {
      // Employee sees only their own employee profile & tasks
      const emp = await Employee.findOne({ id: req.user.employeeId }).lean();
      if (!emp) {
        return res.json({ success: true, data: { employees: [], exchangeRate, eurExchangeRate } });
      }

      const dbTasks = await Task.find({ employeeId: emp.id }).lean();
      const decryptedTasks = dbTasks.map(t => decryptTaskFields(t));

      return res.json({
        success: true,
        data: {
          employees: [{ ...emp, tasks: decryptedTasks }],
          exchangeRate,
          eurExchangeRate
        }
      });
    }
  } catch (error) {
    console.error('Get data error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /data - Granular or Bulk Sync Route
router.post('/', dataMutationLimiter, verifyToken, requireAdmin, async (req, res) => {
  try {
    const { employees, exchangeRate } = req.body;

    if (Array.isArray(employees)) {
      // Sync exchange rate
      if (exchangeRate !== undefined) {
        let meta = await AppData.findOne();
        if (!meta) meta = new AppData();
        meta.exchangeRate = exchangeRate;
        meta.lastUpdatedBy = req.user ? req.user.username : 'admin';
        await meta.save();
      }

      // Sync employees and tasks atomically
      const currentEmpIds = employees.map(e => String(e.id));
      await Employee.deleteMany({ id: { $nin: currentEmpIds } });

      for (const empData of employees) {
        const empId = String(empData.id);
        await Employee.findOneAndUpdate(
          { id: empId },
          {
            id: empId,
            name: empData.name,
            role: empData.role || 'عضو',
            defaultDeductionRate: empData.defaultDeductionRate,
            paymentMethod: empData.paymentMethod || 'instapay',
            paymentDetails: empData.paymentDetails || '',
            avatarUrl: empData.avatarUrl || '',
            adjustments: empData.adjustments || {}
          },
          { upsert: true, new: true }
        );

        if (Array.isArray(empData.tasks)) {
          const currentTaskIds = empData.tasks.map(t => String(t.id));
          await Task.deleteMany({ employeeId: empId, id: { $nin: currentTaskIds } });

          for (const t of empData.tasks) {
            const taskId = String(t.id);
            const encryptedT = encryptTaskFields(t);
            await Task.findOneAndUpdate(
              { id: taskId },
              {
                id: taskId,
                employeeId: empId,
                type: t.type || 'task',
                taskNumber: t.taskNumber || '',
                title: t.title || 'مهمة',
                gross: t.gross,
                currency: t.currency || 'USD',
                deductionRate: t.deductionRate,
                delayDeduction: t.delayDeduction || 0,
                advance: t.advance || 0,
                fixedDeduction: t.fixedDeduction || 0,
                status: t.status || 'pending',
                month: t.month || 'january',
                exchangeRate: t.exchangeRate,
                eurExchangeRate: t.eurExchangeRate,
                email: encryptedT.email || '',
                password: encryptedT.password || '',
                character: encryptedT.character || '',
                vpn: encryptedT.vpn || '',
                createdAt: t.createdAt ? new Date(t.createdAt) : new Date()
              },
              { upsert: true, new: true }
            );
          }
        }
      }
    }

    res.json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Save data error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /employees - Create or Edit employee profile
router.post('/employees', dataMutationLimiter, verifyToken, async (req, res) => {
  try {
    const empData = req.body;
    if (!empData || !empData.name) {
      return res.status(400).json({ success: false, error: 'اسم الموظف مطلوب' });
    }

    const empId = empData.id || ('emp_' + Date.now());
    const existing = await Employee.findOne({ id: String(empId) });
    const isNew = !existing;

    // Authorization checks
    if (req.user.role === 'leader') {
      const allowedIds = new Set((req.user.allowedEmployeeIds || []).map(String));
      if (req.user.employeeId) allowedIds.add(String(req.user.employeeId));

      if (!isNew && !allowedIds.has(String(empId))) {
        return res.status(403).json({ success: false, error: 'غير مصرح بتعديل بيانات هذا الموظف' });
      }
    } else if (req.user.role === 'employee') {
      if (isNew || String(empId) !== String(req.user.employeeId)) {
        return res.status(403).json({ success: false, error: 'غير مصرح لملف الموظف العادي بإضافة موظف جديد أو تعديل موظف آخر' });
      }
    }

    let cleanAvatarUrl = String(empData.avatarUrl || '').trim();
    if (cleanAvatarUrl.length > 350000) {
      cleanAvatarUrl = existing ? existing.avatarUrl : '';
    }

    let updateFields = {
      id: empId,
      name: String(empData.name).trim(),
      role: String(empData.role || 'عضو').trim(),
      defaultDeductionRate: (empData.defaultDeductionRate !== undefined && empData.defaultDeductionRate !== null) ? Math.min(100, Math.max(0, Number(empData.defaultDeductionRate))) : 10,
      paymentMethod: String(empData.paymentMethod || 'instapay').trim(),
      paymentDetails: String(empData.paymentDetails || '').trim(),
      avatarUrl: cleanAvatarUrl,
      adjustments: empData.adjustments || {}
    };

    if (req.user.role === 'employee' && existing) {
      updateFields = {
        id: existing.id,
        name: existing.name,
        role: existing.role,
        defaultDeductionRate: existing.defaultDeductionRate,
        paymentMethod: existing.paymentMethod,
        paymentDetails: existing.paymentDetails,
        avatarUrl: cleanAvatarUrl,
        adjustments: existing.adjustments || {}
      };
    }

    // Save/update Employee profile in MongoDB
    const updatedEmp = await Employee.findOneAndUpdate(
      { id: empId },
      updateFields,
      { upsert: true, new: true }
    ).lean();

    let updatedAllowedIds = req.user.allowedEmployeeIds || [];

    // If Leader created or updated an employee, ensure employee ID is associated with Leader user account in DB!
    if (req.user.role === 'leader') {
      const targetUserId = req.user._id || req.user.id;
      const updatedUser = await User.findOneAndUpdate(
        { $or: [{ _id: targetUserId }, { username: req.user.username }] },
        { $addToSet: { allowedEmployeeIds: String(empId) } },
        { new: true }
      );
      if (updatedUser) {
        updatedAllowedIds = updatedUser.allowedEmployeeIds;
        req.user.allowedEmployeeIds = updatedAllowedIds;
      }
    }

    res.json({
      success: true,
      employee: updatedEmp,
      allowedEmployeeIds: updatedAllowedIds
    });
  } catch (error) {
    console.error('Save employee error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// DELETE /employees/:id - Admin deletes employee profile and their tasks
router.delete('/employees/:id', dataMutationLimiter, verifyToken, requireAdmin, async (req, res) => {
  try {
    const empId = String(req.params.id);
    const deletedEmp = await Employee.findOneAndDelete({ id: empId });
    if (!deletedEmp) {
      return res.status(404).json({ success: false, error: 'الموظف غير موجود' });
    }

    // Delete all associated tasks in DB
    await Task.deleteMany({ employeeId: empId });

    // Remove empId from all users' allowedEmployeeIds array in DB
    await User.updateMany({}, { $pull: { allowedEmployeeIds: empId } });

    res.json({ success: true, message: 'تم حذف الموظف وكافة مهامه بنجاح' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /tasks - Create or Edit single task
router.post('/tasks', dataMutationLimiter, verifyToken, requireAdminOrLeader, async (req, res) => {
  try {
    const taskData = req.body;
    if (!taskData || !taskData.employeeId || !taskData.title) {
      return res.status(400).json({ success: false, error: 'Missing required task fields' });
    }

    if (req.user.role === 'leader') {
      const allowedIds = new Set((req.user.allowedEmployeeIds || []).map(String));
      if (req.user.employeeId) allowedIds.add(String(req.user.employeeId));
      if (!allowedIds.has(String(taskData.employeeId))) {
        return res.status(403).json({ success: false, error: 'غير مصرح بتعديل أو إضافة مهام هذا الموظف' });
      }

      if (taskData.id) {
        const existingTask = await Task.findOne({ id: String(taskData.id) });
        if (existingTask && !allowedIds.has(String(existingTask.employeeId))) {
          return res.status(403).json({ success: false, error: 'غير مصرح بتعديل مهام هذا الموظف' });
        }
      }
    }

    const taskId = taskData.id || ('task_' + Date.now());
    const encryptedT = encryptTaskFields(taskData);

    const newTask = await Task.findOneAndUpdate(
      { id: taskId },
      {
        id: taskId,
        employeeId: String(taskData.employeeId),
        type: taskData.type || 'task',
        taskNumber: taskData.taskNumber || '',
        title: taskData.title,
        gross: taskData.gross || 0,
        currency: taskData.currency || 'USD',
        deductionRate: (taskData.deductionRate !== undefined && taskData.deductionRate !== null) ? Number(taskData.deductionRate) : 10,
        delayDeduction: taskData.delayDeduction || 0,
        advance: taskData.advance || 0,
        fixedDeduction: taskData.fixedDeduction || 0,
        status: taskData.status || 'pending',
        month: taskData.month || 'january',
        exchangeRate: taskData.exchangeRate,
        eurExchangeRate: taskData.eurExchangeRate,
        email: encryptedT.email || '',
        password: encryptedT.password || '',
        character: encryptedT.character || '',
        vpn: encryptedT.vpn || '',
        createdAt: taskData.createdAt ? new Date(taskData.createdAt) : new Date()
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, task: decryptTaskFields(newTask.toObject()) });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// DELETE /tasks/:id - Delete single task
router.delete('/tasks/:id', dataMutationLimiter, verifyToken, requireAdminOrLeader, async (req, res) => {
  try {
    const taskId = String(req.params.id);
    const task = await Task.findOne({ id: taskId });
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    if (req.user.role === 'leader') {
      const allowedIds = new Set((req.user.allowedEmployeeIds || []).map(String));
      if (req.user.employeeId) allowedIds.add(String(req.user.employeeId));
      if (!allowedIds.has(String(task.employeeId))) {
        return res.status(403).json({ success: false, error: 'غير مصرح لك بحذف مهمة هذا الموظف' });
      }
    }

    await Task.findOneAndDelete({ id: taskId });
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.ensureMigratedData = ensureMigratedData;
module.exports = router;
