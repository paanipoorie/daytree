const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const { signupSchema, loginSchema, sendOtpSchema, verifyOtpSchema, resendOtpSchema, googleLoginSchema } = require('../validators/auth.validator');
const { protect } = require('../middleware/auth');

const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Public routes
router.post('/signup', authLimiter, validate(signupSchema), authController.signup);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/send-otp', authLimiter, validate(sendOtpSchema), authController.sendOtp);
router.post('/verify-otp', authLimiter, validate(verifyOtpSchema), authController.verifyOtp);
router.post('/resend-otp', authLimiter, validate(resendOtpSchema), authController.resendOtp);
router.post('/google', authLimiter, validate(googleLoginSchema), authController.googleLogin);
router.get('/config', authController.getConfig);

// Protected routes
router.get('/me', protect, authController.me);
router.post('/logout', protect, authController.logout);

module.exports = router;
