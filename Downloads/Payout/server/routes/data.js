const express = require('express');
const AppData = require('../models/AppData');
const User = require('../models/User');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const { encryptTaskFields, decryptTaskFields } = require('../utils/encryption');

const router = express.Router();

const fs = require('fs');
const path = require('path');

const getAppData = async () => {
  let data = await AppData.findOne();
  if (!data || !Array.isArray(data.employees) || data.employees.length === 0) {
    const dataPath = path.join(__dirname, '..', '..', 'data.json');
    let initialEmployees = [];
    let initialRate = 50;

    if (fs.existsSync(dataPath)) {
      try {
        const raw = fs.readFileSync(dataPath, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.employees)) {
          initialEmployees = parsed.employees.map(emp => ({
            ...emp,
            tasks: (emp.tasks || []).map(task => encryptTaskFields(task))
          }));
          initialRate = parsed.exchangeRate || 50;
        }
      } catch (e) {
        console.error('Error reading data.json:', e);
      }
    }

    if (!data) {
      data = new AppData({ employees: initialEmployees, exchangeRate: initialRate });
    } else if (initialEmployees.length > 0) {
      data.employees = initialEmployees;
      data.exchangeRate = initialRate;
    }
    await data.save();
  }
  return data;
};

// GET /data
router.get('/', verifyToken, async (req, res) => {
  try {
    const appData = await getAppData();
    
    if (req.user.role === 'admin') {
      // Admin sees everything, decrypt sensitive fields
      const decryptedEmployees = appData.employees.map(emp => ({
        ...emp,
        tasks: (emp.tasks || []).map(task => decryptTaskFields(task))
      }));
      
      return res.json({
        success: true,
        data: {
          employees: decryptedEmployees,
          exchangeRate: appData.exchangeRate
        }
      });
    } else {
      // Employee sees only their own data (decrypted)
      const employeeData = appData.employees.find(emp => emp.id === req.user.employeeId);
      
      if (!employeeData) {
        return res.json({ success: true, data: { employees: [], exchangeRate: appData.exchangeRate } });
      }
      
      const decryptedTasks = (employeeData.tasks || []).map(task => decryptTaskFields(task));
      
      return res.json({
        success: true,
        data: {
          employees: [{ ...employeeData, tasks: decryptedTasks }],
          exchangeRate: appData.exchangeRate
        }
      });
    }
  } catch (error) {
    console.error('Get data error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /data
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { employees, exchangeRate } = req.body;
    
    if (!Array.isArray(employees)) {
      return res.status(400).json({ success: false, error: 'employees must be an array' });
    }
    
    const encryptedEmployees = employees.map(emp => ({
      ...emp,
      tasks: (emp.tasks || []).map(task => encryptTaskFields(task))
    }));
    
    const appData = await getAppData();
    appData.employees = encryptedEmployees;
    
    if (exchangeRate !== undefined) {
      appData.exchangeRate = exchangeRate;
    }
    
    appData.lastUpdatedBy = req.user.username;
    appData.lastUpdatedAt = new Date();
    
    await appData.save();
    
    res.json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Save data error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /employees
router.get('/employees', verifyToken, requireAdmin, async (req, res) => {
  try {
    const appData = await getAppData();
    const employeesList = appData.employees.map(emp => ({
      id: emp.id,
      name: emp.name,
      role: emp.role
    }));
    
    res.json({ success: true, employees: employeesList });
  } catch (error) {
    console.error('Get employees list error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
