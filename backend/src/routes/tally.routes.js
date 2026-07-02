const express = require('express');
const tallyController = require('../controllers/tally.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect the tally route
router.get('/', protect, tallyController.getTallyStats);

module.exports = router;
