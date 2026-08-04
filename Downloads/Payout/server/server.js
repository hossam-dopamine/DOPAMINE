require('dotenv').config();
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

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// SPA Fallback
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ success: false, error: 'Something broke!' });
});

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
