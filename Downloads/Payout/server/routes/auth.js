const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const OtpToken = require('../models/OtpToken');
const Employee = require('../models/Employee');
const Task = require('../models/Task');
const AppData = require('../models/AppData');
const { verifyToken, requireAdmin, invalidateUserCache } = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');
const { sendApprovalEmail, sendRejectionEmail, sendSuspensionEmail, sendReactivationEmail, sendOtpEmail } = require('../utils/mailer');

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, employeeId: user.employeeId, allowedEmployeeIds: user.allowedEmployeeIds || [], tenantId: user.tenantId || 'default_tenant' },
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
    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ success: false, error: 'برجاء إدخال بيانات صحيحة' });
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

    // Check account registration approval status
    if (user.status === 'pending') {
      return res.status(403).json({ success: false, error: 'حسابك قيد المراجعة حالياً. يرجى الانتظار لحين موافقة الإدارة.' });
    }
    if (user.status === 'rejected') {
      const errMsg = user.banReason || 'تم حظر حسابك أو تعليقه من قبل الإدارة.';
      return res.status(403).json({ success: false, error: errMsg });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        employeeId: user.employeeId,
        allowedEmployeeIds: user.allowedEmployeeIds || [],
        tenantId: user.tenantId || 'default_tenant'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /send-register-otp - Validates registration data and dispatches a 6-digit OTP to Gmail
router.post('/send-register-otp', authLimiter, async (req, res) => {
  try {
    const { username, password, email, birthDate, termsAccepted } = req.body;
    if (!username || !password || !email || !birthDate) {
      return res.status(400).json({ success: false, error: 'جميع الحقول مطلوبة (اسم المستخدم، كلمة المرور، البريد الإلكتروني، تاريخ الميلاد)' });
    }
    if (typeof username !== 'string' || typeof password !== 'string' || typeof email !== 'string' || typeof birthDate !== 'string') {
      return res.status(400).json({ success: false, error: 'برجاء إدخال بيانات صحيحة' });
    }

    if (!termsAccepted) {
      return res.status(400).json({ success: false, error: 'يجب الموافقة على الشروط والأحكام وتأكيد بلوغ السن القانوني (18+)' });
    }

    const cleanUsername = String(username).toLowerCase().trim();
    if (cleanUsername.length < 3) {
      return res.status(400).json({ success: false, error: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ success: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ success: false, error: 'البريد الإلكتروني غير صالح' });
    }

    const parsedBirthDate = new Date(birthDate);
    if (isNaN(parsedBirthDate.getTime())) {
      return res.status(400).json({ success: false, error: 'تاريخ الميلاد غير صالح' });
    }

    // Validate that user is at least 18 years old
    const today = new Date();
    let age = today.getFullYear() - parsedBirthDate.getFullYear();
    const monthDiff = today.getMonth() - parsedBirthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < parsedBirthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      return res.status(400).json({ success: false, error: 'يجب أن يكون عمرك 18 عاماً أو أكثر للتسجيل في النظام' });
    }

    const existingUser = await User.findOne({ username: cleanUsername });
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'اسم المستخدم مسجل بالفعل' });
    }

    const existingEmail = await User.findOne({ email: cleanEmail });
    if (existingEmail) {
      return res.status(409).json({ success: false, error: 'البريد الإلكتروني مسجل بالفعل بحساب آخر' });
    }

    // Check if an OTP was recently sent (within 60 seconds)
    const existingOtp = await OtpToken.findOne({ email: cleanEmail });
    if (existingOtp && existingOtp.lastSentAt) {
      const elapsed = Date.now() - new Date(existingOtp.lastSentAt).getTime();
      if (elapsed < 60000) {
        const waitSec = Math.ceil((60000 - elapsed) / 1000);
        return res.status(429).json({ 
          success: false, 
          error: `يرجى الانتظار ${waitSec} ثانية قبل طلب رمز جديد.` 
        });
      }
    }

    // Generate secure 6-digit random code
    const otpCode = crypto.randomInt(100000, 1000000).toString();
    const otpHash = await OtpToken.hashOtp(otpCode);
    const passwordHash = await User.hashPassword(password);

    // Save/Update temporary OTP token with 10 minutes expiry
    await OtpToken.findOneAndUpdate(
      { email: cleanEmail },
      {
        email: cleanEmail,
        otpHash,
        tempUserData: {
          username: cleanUsername,
          passwordHash,
          email: cleanEmail,
          birthDate: parsedBirthDate,
          termsAccepted: true
        },
        attempts: 0,
        lastSentAt: new Date(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
      },
      { upsert: true, new: true }
    );

    // Dispatch email in background & log OTP in server logs immediately
    console.log(`🔥 [REGISTRATION OTP] Code for ${cleanEmail} (${cleanUsername}): [ ${otpCode} ]`);
    sendOtpEmail(cleanEmail, cleanUsername, otpCode).catch(err => {
      console.error('Async sendOtpEmail error:', err);
    });

    return res.json({
      success: true,
      message: 'تم إنشاء رمز التحقق المكون من 6 أرقام بنجاح.',
      email: cleanEmail
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء إرسال رمز التحقق' });
  }
});

// POST /verify-register-otp - Validates 6-digit OTP and creates the pending admin account
router.post('/verify-register-otp', authLimiter, async (req, res) => {
  try {
    const { email, otpCode } = req.body;
    if (!email || !otpCode) {
      return res.status(400).json({ success: false, error: 'البريد الإلكتروني ورمز التحقق مطلوبان' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const cleanOtp = String(otpCode).trim();

    if (!/^\d{6}$/.test(cleanOtp)) {
      return res.status(400).json({ success: false, error: 'رمز التحقق يجب أن يتكون من 6 أرقام' });
    }

    const otpRecord = await OtpToken.findOne({ email: cleanEmail });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ success: false, error: 'انتهت صلاحية رمز التحقق، يرجى طلب رمز جديد.' });
    }

    if (otpRecord.attempts >= 5) {
      await OtpToken.deleteOne({ _id: otpRecord._id });
      return res.status(429).json({ success: false, error: 'تم تجاوز الحد الأقصى للمحاولات الخاطئة. يرجى طلب رمز جديد.' });
    }

    const isMatch = await otpRecord.compareOtp(cleanOtp);
    if (!isMatch) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      const remaining = 5 - otpRecord.attempts;
      return res.status(400).json({ 
        success: false, 
        error: `رمز التحقق غير صحيح. المتبقي: ${remaining} ${remaining === 1 ? 'محاولة' : 'محاولات'}.` 
      });
    }

    // Check if username was taken in the meantime
    const existingUser = await User.findOne({ username: otpRecord.tempUserData.username });
    if (existingUser) {
      await OtpToken.deleteOne({ _id: otpRecord._id });
      return res.status(409).json({ success: false, error: 'اسم المستخدم مسجل بالفعل' });
    }

    // Create the new User
    const user = new User({
      username: otpRecord.tempUserData.username,
      passwordHash: otpRecord.tempUserData.passwordHash,
      role: 'admin',
      email: otpRecord.tempUserData.email,
      birthDate: otpRecord.tempUserData.birthDate,
      termsAccepted: true,
      termsAcceptedAt: new Date(),
      status: 'pending'
    });
    user.tenantId = String(user._id);

    await user.save();
    await OtpToken.deleteOne({ _id: otpRecord._id });

    res.status(201).json({
      success: true,
      message: 'تم تأكيد البريد الإلكتروني وإرسال طلب التسجيل بنجاح. برجاء الانتظار لحين مراجعة طلبك من قبل الإدارة وتفعيل حسابك.'
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء التحقق من الرمز' });
  }
});

// POST /resend-register-otp - Resends a new OTP with a 60-second cooldown
router.post('/resend-register-otp', authLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'البريد الإلكتروني مطلوب' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const otpRecord = await OtpToken.findOne({ email: cleanEmail });

    if (!otpRecord) {
      return res.status(404).json({ success: false, error: 'لا يوجد طلب تسجيل نشط لهذا البريد. يرجى إعادة إدخال بياناتك.' });
    }

    // Cooldown check: 60 seconds
    const elapsed = Date.now() - new Date(otpRecord.lastSentAt).getTime();
    if (elapsed < 60000) {
      const waitSec = Math.ceil((60000 - elapsed) / 1000);
      return res.status(429).json({ success: false, error: `يرجى الانتظار ${waitSec} ثانية قبل إعادة إرسال الرمز.` });
    }

    const newOtp = crypto.randomInt(100000, 1000000).toString();
    otpRecord.otpHash = await OtpToken.hashOtp(newOtp);
    otpRecord.attempts = 0;
    otpRecord.lastSentAt = new Date();
    otpRecord.expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await otpRecord.save();
    console.log(`🔥 [RESEND REGISTRATION OTP] Code for ${cleanEmail} (${otpRecord.tempUserData.username}): [ ${newOtp} ]`);
    sendOtpEmail(cleanEmail, otpRecord.tempUserData.username, newOtp).catch(err => {
      console.error('Async resendOtpEmail error:', err);
    });

    return res.json({
      success: true,
      message: 'تمت إعادة إرسال رمز التحقق إلى بريدك الإلكتروني بنجاح.'
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء إعادة إرسال رمز التحقق' });
  }
});

// POST /register - Direct fallback registration
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { username, password, email, birthDate, termsAccepted } = req.body;
    if (!username || !password || !email || !birthDate) {
      return res.status(400).json({ success: false, error: 'جميع الحقول مطلوبة (اسم المستخدم، كلمة المرور، البريد الإلكتروني، تاريخ الميلاد)' });
    }
    if (typeof username !== 'string' || typeof password !== 'string' || typeof email !== 'string' || typeof birthDate !== 'string') {
      return res.status(400).json({ success: false, error: 'برجاء إدخال بيانات صحيحة' });
    }

    if (!termsAccepted) {
      return res.status(400).json({ success: false, error: 'يجب الموافقة على الشروط والأحكام وتأكيد بلوغ السن القانوني (18+)' });
    }

    const cleanUsername = String(username).toLowerCase().trim();
    if (cleanUsername.length < 3) {
      return res.status(400).json({ success: false, error: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ success: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ success: false, error: 'البريد الإلكتروني غير صالح' });
    }

    const parsedBirthDate = new Date(birthDate);
    if (isNaN(parsedBirthDate.getTime())) {
      return res.status(400).json({ success: false, error: 'تاريخ الميلاد غير صالح' });
    }

    // Validate that user is at least 18 years old
    const today = new Date();
    let age = today.getFullYear() - parsedBirthDate.getFullYear();
    const monthDiff = today.getMonth() - parsedBirthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < parsedBirthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      return res.status(400).json({ success: false, error: 'يجب أن يكون عمرك 18 عاماً أو أكثر للتسجيل في النظام' });
    }

    const existingUser = await User.findOne({ username: cleanUsername });
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'اسم المستخدم مسجل بالفعل' });
    }

    const passwordHash = await User.hashPassword(password);
    const user = new User({
      username: cleanUsername,
      passwordHash,
      role: 'admin',
      email: cleanEmail,
      birthDate: parsedBirthDate,
      termsAccepted: true,
      termsAcceptedAt: new Date(),
      status: 'pending'
    });
    // Set tenantId to the newly generated user ID to guarantee absolute uniqueness and isolation
    user.tenantId = String(user._id);

    await user.save();

    res.status(201).json({
      success: true,
      message: 'تم إرسال طلب التسجيل بنجاح. برجاء الانتظار لحين مراجعة طلبك من قبل الإدارة وتفعيل حسابك.'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /change-password
router.post('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'كلمة المرور الحالية والجديدة مطلوبتان' });
    }
    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
      return res.status(400).json({ success: false, error: 'برجاء إدخال بيانات صحيحة' });
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ success: false, error: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' });
    }

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
    const { username, password, email, employeeId, role, allowedEmployeeIds } = req.body;
    
    if (!username || !password || !employeeId) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    if (typeof username !== 'string' || typeof password !== 'string' || typeof employeeId !== 'string') {
      return res.status(400).json({ success: false, error: 'Invalid field types' });
    }
    if (role && typeof role !== 'string') {
      return res.status(400).json({ success: false, error: 'Invalid role type' });
    }
    
    const cleanUsername = String(username).toLowerCase().trim();
    const cleanEmail = email ? String(email).toLowerCase().trim() : '';
    const tenantId = req.user.tenantId || 'default_tenant';
    
    const existingUser = await User.findOne({ username: cleanUsername });
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Username already exists' });
    }
    
    const existingEmployeeUser = await User.findOne({ employeeId, tenantId });
    if (existingEmployeeUser) {
      return res.status(409).json({ success: false, error: 'Account already exists for this employee' });
    }
    
    const userRole = (role === 'leader') ? 'leader' : 'employee';
    const allowedIds = Array.isArray(allowedEmployeeIds) ? allowedEmployeeIds.map(String) : [];

    const passwordHash = await User.hashPassword(password);
    const user = new User({
      username: cleanUsername,
      email: cleanEmail,
      passwordHash,
      role: userRole,
      employeeId,
      allowedEmployeeIds: allowedIds,
      tenantId
    });
    
    await user.save();
    res.status(201).json({ success: true, message: 'Employee account created successfully', user });
  } catch (error) {
    console.error('Create employee account error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PUT /update-employee-account - Admin updates employee account email
router.put('/update-employee-account', authLimiter, verifyToken, requireAdmin, async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username) {
      return res.status(400).json({ success: false, error: 'اسم المستخدم مطلوب' });
    }
    const cleanUsername = String(username).toLowerCase().trim();
    const cleanEmail = email !== undefined ? String(email).toLowerCase().trim() : '';
    const tenantId = req.user.tenantId || 'default_tenant';

    const updatedUser = await User.findOneAndUpdate(
      { username: cleanUsername, tenantId },
      { $set: { email: cleanEmail } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'الحساب غير موجود' });
    }
    res.json({ success: true, message: 'تم تحديث البريد الإلكتروني بنجاح', user: updatedUser });
  } catch (error) {
    console.error('Update employee account error:', error);
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
    
    const tenantId = req.user.tenantId || 'default_tenant';
    const result = await User.findOneAndDelete({ username: cleanTargetUser, tenantId });
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
    const tenantId = req.user.tenantId || 'default_tenant';
    const users = await User.find({ role: { $in: ['employee', 'leader'] }, tenantId }).select('-passwordHash').lean();
    res.json({ success: true, accounts: users });
  } catch (error) {
    console.error('Get employee accounts error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PUT /update-allowed-employees - Admin updates allowed employees for a Leader account
router.put('/update-allowed-employees', authLimiter, verifyToken, requireAdmin, async (req, res) => {
  try {
    const { username, allowedEmployeeIds } = req.body;
    if (!username) {
      return res.status(400).json({ success: false, error: 'اسم المستخدم مطلوب' });
    }
    if (typeof username !== 'string') {
      return res.status(400).json({ success: false, error: 'اسم المستخدم يجب أن يكون نصاً' });
    }
    if (allowedEmployeeIds && !Array.isArray(allowedEmployeeIds)) {
      return res.status(400).json({ success: false, error: 'قائمة الموظفين المسموحين يجب أن تكون مصفوفة' });
    }

    const cleanUsername = String(username).toLowerCase().trim();
    const newAllowedIds = Array.isArray(allowedEmployeeIds) ? allowedEmployeeIds.map(String) : [];
    const tenantId = req.user.tenantId || 'default_tenant';

    const updatedUser = await User.findOneAndUpdate(
      { username: cleanUsername, tenantId },
      { allowedEmployeeIds: newAllowedIds },
      { new: true }
    ).select('-passwordHash').lean();

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'الحساب غير موجود' });
    }

    res.json({
      success: true,
      message: 'تم تحديث الموظفين المسموحين للمشرف بنجاح',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update allowed employees error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /pending-requests - Get all pending registrations (Main owner only)
router.get('/pending-requests', verifyToken, requireAdmin, async (req, res) => {
  try {
    const tenantId = req.user.tenantId || 'default_tenant';
    if (tenantId !== 'default_tenant') {
      return res.status(403).json({ success: false, error: 'غير مصرح للوحات التحكم المستقلة بعرض طلبات التسجيل' });
    }

    const pendingUsers = await User.find({ status: 'pending' }).select('-passwordHash').lean();
    res.json({ success: true, requests: pendingUsers });
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /approve-request - Approve a pending user (Main owner only)
router.post('/approve-request', verifyToken, requireAdmin, async (req, res) => {
  try {
    const tenantId = req.user.tenantId || 'default_tenant';
    if (tenantId !== 'default_tenant') {
      return res.status(403).json({ success: false, error: 'غير مصرح بالعملية' });
    }

    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'معرف المستخدم مطلوب' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'المستخدم غير موجود' });
    }

    if (user.status !== 'pending') {
      return res.status(400).json({ success: false, error: 'هذا الحساب تم معالجة طلبه بالفعل' });
    }

    user.status = 'approved';
    await user.save();
    invalidateUserCache(user._id);

    // Send approval email (async, doesn't block response)
    if (user.email) {
      sendApprovalEmail(user.email, user.username).catch(err => {
        console.error('❌ Failed to send approval email:', err.message);
      });
    }

    res.json({ success: true, message: 'تم الموافقة على الحساب وتفعيله بنجاح' });
  } catch (error) {
    console.error('Approve request error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /reject-request - Reject a pending user (Main owner only)
router.post('/reject-request', verifyToken, requireAdmin, async (req, res) => {
  try {
    const tenantId = req.user.tenantId || 'default_tenant';
    if (tenantId !== 'default_tenant') {
      return res.status(403).json({ success: false, error: 'غير مصرح بالعملية' });
    }

    const { userId, reason } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'معرف المستخدم مطلوب' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'المستخدم غير موجود' });
    }

    if (user.status !== 'pending') {
      return res.status(400).json({ success: false, error: 'هذا الحساب تم معالجة طلبه بالفعل' });
    }

    user.status = 'rejected';
    user.banReason = reason || 'تم رفض طلب إنشاء الحساب الخاص بك.';
    await user.save();
    invalidateUserCache(user._id);

    // Send rejection email (async, doesn't block response)
    if (user.email) {
      sendRejectionEmail(user.email, user.username, reason).catch(err => {
        console.error('❌ Failed to send rejection email:', err.message);
      });
    }

    res.json({ success: true, message: 'تم رفض طلب إنشاء الحساب وإشعار المستخدم بالسبب' });
  } catch (error) {
    console.error('Reject request error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /admin-accounts - Get all registered tenant admins (Main owner only)
router.get('/admin-accounts', verifyToken, requireAdmin, async (req, res) => {
  try {
    const tenantId = req.user.tenantId || 'default_tenant';
    if (tenantId !== 'default_tenant') {
      return res.status(403).json({ success: false, error: 'غير مصرح للوحات التحكم المستقلة بعرض هذه البيانات' });
    }

    const accounts = await User.find({ role: 'admin', tenantId: { $ne: 'default_tenant' } }).select('-passwordHash').lean();
    res.json({ success: true, accounts });
  } catch (error) {
    console.error('Get admin accounts error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /suspend-admin-account - Suspend/Ban an admin account (Main owner only)
router.post('/suspend-admin-account', verifyToken, requireAdmin, async (req, res) => {
  try {
    const tenantId = req.user.tenantId || 'default_tenant';
    if (tenantId !== 'default_tenant') {
      return res.status(403).json({ success: false, error: 'غير مصرح بالعملية' });
    }

    const { userId, reason } = req.body;
    if (!userId || !reason) {
      return res.status(400).json({ success: false, error: 'معرف المستخدم وسبب الحظر مطلوبان' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'المستخدم غير موجود' });
    }

    if (user.tenantId === 'default_tenant') {
      return res.status(400).json({ success: false, error: 'لا يمكن حظر الحساب الرئيسي للمنصة' });
    }

    user.status = 'rejected';
    user.banReason = reason.trim();
    await user.save();
    invalidateUserCache(user._id);

    // Send dedicated suspension email (async)
    if (user.email) {
      sendSuspensionEmail(user.email, user.username, reason.trim()).catch(err => {
        console.error('❌ Failed to send suspension email:', err.message);
      });
    }

    res.json({ success: true, message: 'تم تعليق وحظر الحساب بنجاح وإشعار المستخدم بالسبب' });
  } catch (error) {
    console.error('Suspend admin account error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /activate-admin-account - Re-activate a suspended/pending admin account (Main owner only)
router.post('/activate-admin-account', verifyToken, requireAdmin, async (req, res) => {
  try {
    const tenantId = req.user.tenantId || 'default_tenant';
    if (tenantId !== 'default_tenant') {
      return res.status(403).json({ success: false, error: 'غير مصرح بالعملية' });
    }

    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'معرف المستخدم مطلوب' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'المستخدم غير موجود' });
    }

    if (user.tenantId === 'default_tenant') {
      return res.status(400).json({ success: false, error: 'لا يمكن تعديل حالة الحساب الرئيسي للمنصة' });
    }

    user.status = 'approved';
    user.banReason = '';
    await user.save();
    invalidateUserCache(user._id);

    // Send dedicated reactivation email (async)
    if (user.email) {
      sendReactivationEmail(user.email, user.username).catch(err => {
        console.error('❌ Failed to send activation email:', err.message);
      });
    }

    res.json({ success: true, message: 'تم إعادة تنشيط الحساب بنجاح وتصفير حالة الحظر' });
  } catch (error) {
    console.error('Activate admin account error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// DELETE /delete-admin-account/:userId - Permanently delete admin user and all associated tenant data (Main owner only)
router.delete('/delete-admin-account/:userId', verifyToken, requireAdmin, async (req, res) => {
  try {
    const tenantId = req.user.tenantId || 'default_tenant';
    if (tenantId !== 'default_tenant') {
      return res.status(403).json({ success: false, error: 'غير مصرح بالعملية' });
    }

    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'معرف المستخدم مطلوب' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'المستخدم غير موجود' });
    }

    const targetTenantId = user.tenantId;
    if (!targetTenantId || targetTenantId === 'default_tenant' || String(targetTenantId).trim() === '') {
      return res.status(400).json({ success: false, error: 'لا يمكن حذف الحساب الرئيسي للمنصة أو حساب مستأجر غير صالح' });
    }

    console.log(`🗑️ Starting cascade deletion for tenant: ${targetTenantId}`);

    // Cascade Delete everything related to this tenant
    const deletedEmployees = await Employee.deleteMany({ tenantId: targetTenantId });
    const deletedTasks = await Task.deleteMany({ tenantId: targetTenantId });
    const deletedUserAccounts = await User.deleteMany({ tenantId: targetTenantId });
    const deletedAppData = await AppData.deleteMany({ tenantId: targetTenantId });

    // Also delete the admin user itself
    await User.findByIdAndDelete(userId);

    console.log(`Cascade delete stats for tenant ${targetTenantId}:`, {
      employees: deletedEmployees.deletedCount,
      tasks: deletedTasks.deletedCount,
      userAccounts: deletedUserAccounts.deletedCount,
      appData: deletedAppData.deletedCount
    });

    res.json({ success: true, message: 'تم حذف الحساب بالكامل وحذف كافة البيانات والملفات التابعة له بنجاح' });
  } catch (error) {
    console.error('Delete admin account error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
