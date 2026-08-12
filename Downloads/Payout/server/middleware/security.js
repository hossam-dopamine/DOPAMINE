const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const express = require('express');
const compression = require('compression');

const applySecurityMiddleware = (app) => {
  // Helmet Content Security Policy
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'", "https://open.er-api.com", "https://api.exchangerate-api.com", "https://v6.exchangerate-api.com"]
      }
    }
  }));

  // CORS Configuration — restrict to known origins
  const allowedOrigins = process.env.APP_URL
    ? [process.env.APP_URL.replace(/\/+$/, '')]
    : [];
  app.use(cors({
    origin: (origin, callback) => {
      // Allow same-origin requests (no origin header)
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // If not same-origin and not in allowed list, reject
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  }));

  // Compression
  app.use(compression());

  // Body parser with safe payload limits
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true, limit: '5mb' }));

  // General Rate Limiting
  const generalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => process.env.NODE_ENV !== 'production',
    message: { success: false, error: 'Too many requests, please try again later.' }
  });
  app.use(generalLimiter);
};

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV !== 'production',
  message: { success: false, error: 'Too many authentication attempts, please try again later.' }
});

const dataMutationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV !== 'production',
  message: { success: false, error: 'Too many data modification requests, please try again later.' }
});

module.exports = {
  applySecurityMiddleware,
  authLimiter,
  dataMutationLimiter
};
