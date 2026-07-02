/**
 * Reusable middleware to wrap async controller functions and catch errors
 * @param {Function} fn - Async express handler
 * @returns {Function} Express middleware handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
