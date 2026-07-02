const tallyService = require('../services/tally.service');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * Get unified tally dashboard analytics for the authenticated user
 */
exports.getTallyStats = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  try {
    const analytics = await tallyService.getTallyAnalytics(userId);
    return sendSuccess(res, 'Tally analytics retrieved successfully', analytics, 200);
  } catch (error) {
    return sendError(res, error.message || 'Failed to retrieve tally analytics', [], 500);
  }
});
