const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, employeeId: user.employeeId, allowedEmployeeIds: user.allowedEmployeeIds || [] },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// POST /login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'اسم المستخدم وكلمة المرور مطلوبان' });
    }

    const cleanUsername = String(username).toLowerCase().trim();

    let user = await User.findOne({ username: cleanUsername });

    if (!user) {
      return res.status(401).json({ success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        employeeId: user.employeeId,
        allowedEmployeeIds: user.allowedEmployeeIds || []
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

// POST /change-password
router.post('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Incorrect current password' });
    }
    
    user.passwordHash = await User.hashPassword(newPassword);
    await user.save();
    
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /create-employee-account
router.post('/create-employee-account', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { username, password, employeeId, role, allowedEmployeeIds } = req.body;
    
    if (!username || !password || !employeeId) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Username already exists' });
    }
    
    const existingEmployeeUser = await User.findOne({ employeeId });
    if (existingEmployeeUser) {
      return res.status(409).json({ success: false, error: 'Account already exists for this employee' });
    }
    
    const userRole = (role === 'leader') ? 'leader' : 'employee';
    const allowedIds = Array.isArray(allowedEmployeeIds) ? allowedEmployeeIds.map(String) : [];

    const passwordHash = await User.hashPassword(password);
    const user = new User({
      username,
      passwordHash,
      role: userRole,
      employeeId,
      allowedEmployeeIds: allowedIds
    });
    
    await user.save();
    res.status(201).json({ success: true, message: 'Employee account created successfully' });
  } catch (error) {
    console.error('Create employee account error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /me
router.get('/me', verifyToken, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      username: req.user.username,
      role: req.user.role,
      employeeId: req.user.employeeId,
      allowedEmployeeIds: req.user.allowedEmployeeIds || []
    }
  });
});

// DELETE /delete-account/:username
router.delete('/delete-account/:username', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { username } = req.params;
    
    if (username.toLowerCase() === req.user.username.toLowerCase()) {
      return res.status(400).json({ success: false, error: 'Cannot delete own account' });
    }
    
    const cleanTargetUser = String(username).toLowerCase().trim();
    if (cleanTargetUser === req.user.username.toLowerCase().trim()) {
      return res.status(400).json({ success: false, error: 'Cannot delete own account' });
    }
    
    const result = await User.findOneAndDelete({ username: cleanTargetUser });
    if (!result) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /employee-accounts
router.get('/employee-accounts', verifyToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: 'employee' }).select('-passwordHash');
    res.json({ success: true, accounts: users });
  } catch (error) {
    console.error('Get employee accounts error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
