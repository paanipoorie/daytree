/**
 * Centralized API Response Helper
 */

/**
 * Send a success response
 * @param {Object} res - Express response object
 * @param {String} message - Custom message
 * @param {Object|Array} data - Data payload
 * @param {Number} statusCode - HTTP status code
 */
const sendSuccess = (res, message = 'Success', data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @param {Array} errors - Detailed errors list
 * @param {Number} statusCode - HTTP status code
 */
const sendError = (res, message = 'Error', errors = [], statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    requestId: res.req ? res.req.requestId : undefined,
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
