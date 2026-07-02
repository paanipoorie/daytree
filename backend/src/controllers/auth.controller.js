const authService = require('../services/auth.service');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const { logEvent } = require('../services/audit.service');

/**
 * Handle user signup
 */
exports.signup = asyncHandler(async (req, res, next) => {
  const { email, password, username } = req.body;
  try {
    const result = await authService.signup({ email, password, username });
    
    // Log audit event
    await logEvent({
      userId: result.user.id,
      action: 'USER_SIGNUP',
      requestId: req.requestId,
      metadata: { email, username }
    });

    return sendSuccess(res, 'User registered successfully', result, 201);
  } catch (error) {
    const status = error.message === 'Email is already registered' ? 409 : 500;
    return sendError(res, error.message, [], status);
  }
});

/**
 * Handle user login
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await authService.login({ email, password });
    
    // Log audit event
    await logEvent({
      userId: result.user.id,
      action: 'USER_LOGIN',
      requestId: req.requestId,
      metadata: { email }
    });

    return sendSuccess(res, 'Logged in successfully', result, 200);
  } catch (error) {
    const status = error.message === 'Invalid email or password' ? 401 : 500;
    return sendError(res, error.message, [], status);
  }
});

/**
 * Get current authenticated user details
 */
exports.me = asyncHandler(async (req, res, next) => {
  const user = req.user;
  
  const userResponse = {
    id: user._id,
    email: user.email,
    username: user.username,
    profilePicture: user.profilePicture,
    isOnboarded: user.isOnboarded,
    createdAt: user.createdAt,
  };

  return sendSuccess(res, 'User details retrieved successfully', { user: userResponse }, 200);
});

/**
 * Handle user logout
 */
exports.logout = asyncHandler(async (req, res, next) => {
  const userId = req.user ? req.user._id : 'anonymous';
  
  // Log audit event
  await logEvent({
    userId,
    action: 'USER_LOGOUT',
    requestId: req.requestId
  });

  return sendSuccess(res, 'Logged out successfully', {}, 200);
});
