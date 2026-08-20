require('dotenv').config();
const dns = require('dns');
if (dns.setDefaultResultOrder) {
  try { dns.setDefaultResultOrder('ipv4first'); } catch (e) {}
}
const express = require('express');
const path = require('path');
const fs = require('fs');
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

// Determine static files directory (server/public or root)
const publicDir = fs.existsSync(path.join(__dirname, 'public', 'index.html'))
  ? path.join(__dirname, 'public')
  : path.join(__dirname, '..');

// Static files with optimized HTTP caching
app.use(express.static(publicDir, {
  maxAge: '1d',
  etag: true
}));

// SPA Fallback
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
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
