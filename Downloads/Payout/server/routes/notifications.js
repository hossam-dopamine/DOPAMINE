const express = require('express');
const Notification = require('../models/Notification');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const { dataMutationLimiter } = require('../middleware/security');

const router = express.Router();

// GET /api/notifications - Get notifications for current user with unread count
router.get('/', verifyToken, async (req, res) => {
  try {
    const tenantId = req.user.tenantId || 'default_tenant';
    const filter = { tenantId };

    if (req.user.role === 'employee') {
      if (!req.user.employeeId) {
        return res.json({ success: true, notifications: [], unreadCount: 0 });
      }
      filter.recipientEmployeeId = String(req.user.employeeId);
    } else if (req.user.role === 'leader') {
      const allowedIds = new Set((req.user.allowedEmployeeIds || []).map(String));
      if (req.user.employeeId) allowedIds.add(String(req.user.employeeId));
      filter.recipientEmployeeId = { $in: Array.from(allowedIds) };
    }
    // Admin sees all notifications for the tenant

    const [notifications, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).limit(50).lean(),
      Notification.countDocuments({ ...filter, read: false })
    ]);

    res.json({
      success: true,
      notifications,
      unreadCount
    });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PATCH /api/notifications/:id/read - Mark single notification as read
router.patch('/:id/read', verifyToken, async (req, res) => {
  try {
    const tenantId = req.user.tenantId || 'default_tenant';
    const notifId = String(req.params.id);

    const filter = { id: notifId, tenantId };
    if (req.user.role === 'employee' && req.user.employeeId) {
      filter.recipientEmployeeId = String(req.user.employeeId);
    }

    const updated = await Notification.findOneAndUpdate(
      filter,
      { $set: { read: true } },
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ success: false, error: 'الإشعار غير موجود' });
    }

    res.json({ success: true, notification: updated });
  } catch (err) {
    console.error('Error marking notification read:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/notifications/read-all - Mark all notifications as read
router.post('/read-all', verifyToken, async (req, res) => {
  try {
    const tenantId = req.user.tenantId || 'default_tenant';
    const filter = { tenantId, read: false };

    if (req.user.role === 'employee') {
      if (!req.user.employeeId) {
        return res.json({ success: true, count: 0 });
      }
      filter.recipientEmployeeId = String(req.user.employeeId);
    } else if (req.user.role === 'leader') {
      const allowedIds = new Set((req.user.allowedEmployeeIds || []).map(String));
      if (req.user.employeeId) allowedIds.add(String(req.user.employeeId));
      filter.recipientEmployeeId = { $in: Array.from(allowedIds) };
    }

    const result = await Notification.updateMany(filter, { $set: { read: true } });

    res.json({
      success: true,
      modifiedCount: result.modifiedCount || 0
    });
  } catch (err) {
    console.error('Error marking all notifications read:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// DELETE /api/notifications/:id - Delete single notification
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const tenantId = req.user.tenantId || 'default_tenant';
    const notifId = String(req.params.id);

    const filter = { id: notifId, tenantId };
    if (req.user.role === 'employee' && req.user.employeeId) {
      filter.recipientEmployeeId = String(req.user.employeeId);
    }

    const deleted = await Notification.findOneAndDelete(filter);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'الإشعار غير موجود' });
    }

    res.json({ success: true, message: 'تم حذف الإشعار' });
  } catch (err) {
    console.error('Error deleting notification:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
