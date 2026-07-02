const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Generate a JWT token for a user
 * @param {Object} payload - Data to encode in the token
 * @returns {String} JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

/**
 * Verify a JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
};
