const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const { sendError } = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = verifyToken(token);

      // Get user from the token and attach to req
      const user = await User.findById(decoded.id).select('-passwordHash');
      if (!user) {
        return sendError(res, 'Not authorized, user not found', [], 401);
      }

      if (!user.isVerified) {
        return sendError(res, 'Please verify your email address first', [], 403);
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      return sendError(res, 'Not authorized, token failed', [{ message: error.message }], 401);
    }
  }

  if (!token) {
    return sendError(res, 'Not authorized, no token', [], 401);
  }
};

module.exports = {
  protect,
};
