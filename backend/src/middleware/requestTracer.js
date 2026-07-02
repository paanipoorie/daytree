const crypto = require('crypto');
const env = require('../config/env');

/**
 * Request tracing and logging middleware
 */
const requestTracer = (req, res, next) => {
  // Generate unique request ID and attach to req.requestId
  req.requestId = crypto.randomUUID();

  // Set response header for client visibility and debugging
  res.setHeader('X-Request-Id', req.requestId);

  const start = Date.now();

  // Intercept response completion to log details
  res.on('finish', () => {
    // Skip logging in test environment to keep test output clean
    if (env.NODE_ENV === 'test') {
      return;
    }

    const duration = Date.now() - start;
    const method = req.method;
    const url = req.originalUrl || req.url;
    const status = res.statusCode;
    
    // Get authenticated user ID (if auth middleware ran and set req.user)
    const userId = req.user ? req.user._id.toString() : 'anonymous';
    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const logEntry = {
      requestId: req.requestId,
      timestamp: new Date().toISOString(),
      method,
      url,
      status,
      responseTimeMs: duration,
      userId,
      clientIp,
    };

    console.log(JSON.stringify(logEntry));
  });

  next();
};

module.exports = requestTracer;
