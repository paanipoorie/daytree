const express = require('express');
const multer = require('multer');
const userController = require('../controllers/user.controller');
const validate = require('../middleware/validate');
const { profileUpdateSchema } = require('../validators/user.validator');
const { protect } = require('../middleware/auth');

const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Configure Multer for memory storage (file buffer in memory)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only accept image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Profile setup route (protected)
// Note: Multer middleware must run BEFORE Zod validation middleware so req.body is parsed.
router.post(
  '/setup-profile',
  protect,
  authLimiter,
  upload.single('profilePicture'),
  validate(profileUpdateSchema),
  userController.setupProfile
);

module.exports = router;
