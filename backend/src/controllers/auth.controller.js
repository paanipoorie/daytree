const authService = require('../services/auth.service');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const { logEvent } = require('../services/audit.service');
const env = require('../config/env');

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
    let status = 500;
    if (error.message === 'Invalid email or password' || error.message === 'This account uses Google Sign-In. Please login with Google.') {
      status = 401;
    } else if (error.message === 'Please verify your email first') {
      status = 403;
    }
    return sendError(res, error.message, [], status);
  }
});

/**
 * Send OTP to user's email
 */
exports.sendOtp = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  try {
    const result = await authService.sendOtp(email);
    return sendSuccess(res, 'Verification code sent successfully', result, 200);
  } catch (error) {
    const status = error.message === 'User not found' ? 404 : error.message === 'Email is already verified' ? 400 : 500;
    return sendError(res, error.message, [], status);
  }
});

/**
 * Verify OTP code
 */
exports.verifyOtp = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    const result = await authService.verifyOtp({ email, otp });
    
    // Log audit event for successful verification
    await logEvent({
      userId: result.user.id,
      action: 'USER_EMAIL_VERIFIED',
      requestId: req.requestId,
      metadata: { email }
    });

    return sendSuccess(res, 'Email verified successfully', result, 200);
  } catch (error) {
    const status = error.message === 'User not found' ? 404 : 
      (error.message === 'Invalid verification code' || 
       error.message === 'Verification code has expired' || 
       error.message === 'Too many incorrect attempts. Please request a new verification code.') ? 400 : 500;
    return sendError(res, error.message, [], status);
  }
});

/**
 * Resend OTP code
 */
exports.resendOtp = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  try {
    const result = await authService.resendOtp(email);
    return sendSuccess(res, 'Verification code resent successfully', result, 200);
  } catch (error) {
    const status = error.message === 'User not found' ? 404 : error.message === 'Email is already verified' ? 400 : 500;
    return sendError(res, error.message, [], status);
  }
});

/**
 * Handle Google OAuth Sign-in
 */
exports.googleLogin = asyncHandler(async (req, res, next) => {
  const idToken = req.body.token || req.body.idToken;
  try {
    const result = await authService.googleLogin(idToken);
    
    // Log audit event
    await logEvent({
      userId: result.user.id,
      action: 'USER_GOOGLE_LOGIN',
      requestId: req.requestId,
      metadata: { email: result.user.email }
    });

    return sendSuccess(res, 'Google login successful', result, 200);
  } catch (error) {
    const status = error.message === 'Invalid Google token' ? 401 : 500;
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
    isVerified: user.isVerified,
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

/**
 * Get public authentication configuration (Google Client ID)
 */
exports.getConfig = asyncHandler(async (req, res, next) => {
  return sendSuccess(res, 'Authentication config retrieved successfully', {
    googleClientId: env.GOOGLE_CLIENT_ID
  }, 200);
});

