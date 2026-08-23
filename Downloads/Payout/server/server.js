require('dotenv').config();
const dns = require('dns');
if (dns.setDefaultResultOrder) {
  try { dns.setDefaultResultOrder('ipv4first'); } catch (e) {}
}
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const { applySecurityMiddleware } = require('./middleware/security');
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust reverse proxy (Render.com)
app.set('trust proxy', 1);

// Connect to MongoDB and run initial data migration if needed
connectDB().then(() => {
  if (dataRoutes.ensureMigratedData) {
    dataRoutes.ensureMigratedData();
  }
}).catch(err => console.error('DB connect error:', err));

// Apply security and standard middlewares
applySecurityMiddleware(app);

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

// Static files directory (server/public)
const publicDir = path.join(__dirname, 'public');

// Static files with optimized HTTP caching (Never cache HTML)
app.use(express.static(publicDir, {
  maxAge: 0,
  etag: false,
  setHeaders: (res, filePath) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

// SPA Fallback
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ success: false, error: 'Something broke!' });
});

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = app;
