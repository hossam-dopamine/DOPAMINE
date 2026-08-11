const jwt = require('jsonwebtoken');
const User = require('../models/User');

const USER_CACHE = new Map();
const USER_CACHE_TTL_MS = 30000;

const getCachedUser = async (userId) => {
  const now = Date.now();
  const cached = USER_CACHE.get(String(userId));
  if (cached && (now - cached.timestamp < USER_CACHE_TTL_MS)) {
    return cached.user;
  }
  const user = await User.findById(userId).select('-passwordHash').lean();
  if (user) {
    USER_CACHE.set(String(userId), { user, timestamp: now });
  }
  return user;
};

// Invalidate a specific user's cache entry (call after status changes)
const invalidateUserCache = (userId) => {
  if (userId) {
    USER_CACHE.delete(String(userId));
  }
};

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await getCachedUser(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    if (user.status !== 'approved') {
      return res.status(403).json({ success: false, error: 'حسابك غير نشط أو تم تعليقه من قبل الإدارة' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, error: 'Admin access required' });
  }
};

const requireAdminOrLeader = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'leader')) {
    next();
  } else {
    res.status(403).json({ success: false, error: 'Admin or Leader access required' });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await getCachedUser(decoded.id);
      if (user && user.status === 'approved') {
        req.user = user;
      }
    }
  } catch (error) {
    // Ignore error for optional auth
  }
  next();
};

module.exports = {
  verifyToken,
  requireAdmin,
  requireAdminOrLeader,
  optionalAuth,
  invalidateUserCache
};
