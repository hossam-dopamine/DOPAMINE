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

  // CORS Configuration — robust matching for same-origin, proxies, and custom domains
  app.use(cors((req, callback) => {
    const host = req.headers.host;
    const origin = req.headers.origin;

    let isAllowed = false;
    if (!origin) {
      isAllowed = true;
    } else {
      try {
        const originHost = new URL(origin).host;
        if (originHost === host || (process.env.APP_URL && origin.startsWith(process.env.APP_URL.replace(/\/+$/, '')))) {
          isAllowed = true;
        } else if (process.env.NODE_ENV !== 'production' || origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('onrender.com')) {
          isAllowed = true;
        }
      } catch (e) {
        isAllowed = false;
      }
    }

    callback(null, {
      origin: isAllowed,
      credentials: true
    });
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
