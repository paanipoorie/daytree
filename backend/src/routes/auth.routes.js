const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const { signupSchema, loginSchema } = require('../validators/auth.validator');
const { protect } = require('../middleware/auth');

const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Public routes
router.post('/signup', authLimiter, validate(signupSchema), authController.signup);
router.post('/login', authLimiter, validate(loginSchema), authController.login);

// Protected routes
router.get('/me', protect, authController.me);
router.post('/logout', protect, authController.logout);

module.exports = router;
