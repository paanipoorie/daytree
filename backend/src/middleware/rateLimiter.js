const rateLimit = require('express-rate-limit');
const env = require('../config/env');
const { sendError } = require('../utils/apiResponse');

// General application rate limiter
const generalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  message: {
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: () => env.NODE_ENV === 'test', // Skip rate limiting during integration tests
  handler: (req, res, next, options) => {
    return sendError(res, options.message.message, [], 429);
  },
});

// Stricter rate limiter for authentication and file uploads
const authLimiter = rateLimit({
  windowMs: env.AUTH_RATE_LIMIT_WINDOW_MS,
  max: env.AUTH_RATE_LIMIT_MAX,
  message: {
    message: 'Too many login or registration attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.NODE_ENV === 'test',
  handler: (req, res, next, options) => {
    return sendError(res, options.message.message, [], 429);
  },
});

module.exports = {
  generalLimiter,
  authLimiter,
};
