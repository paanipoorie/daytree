const habitService = require('../services/habit.service');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const { logEvent } = require('../services/audit.service');

/**
 * Get all habits for the authenticated user
 */
exports.getHabits = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  try {
    const habits = await habitService.getHabits(userId);
    return sendSuccess(res, 'Habits retrieved successfully', { habits }, 200);
  } catch (error) {
    return sendError(res, error.message || 'Failed to retrieve habits', [], 500);
  }
});

/**
 * Create a new habit
 */
exports.createHabit = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { title, period } = req.body;
  
  try {
    const habit = await habitService.createHabit(userId, { title, period });

    // Log audit event
    await logEvent({
      userId: userId.toString(),
      action: 'HABIT_CREATE',
      requestId: req.requestId,
      metadata: { habitId: habit.id, title: habit.name, period: habit.time }
    });

    return sendSuccess(res, 'Habit created successfully', { habit }, 201);
  } catch (error) {
    return sendError(res, error.message || 'Failed to create habit', [], 500);
  }
});

/**
 * Update an existing habit
 */
exports.updateHabit = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const habitId = req.params.id;
  
  try {
    const habit = await habitService.updateHabit(userId, habitId, req.body);

    // Log audit event
    await logEvent({
      userId: userId.toString(),
      action: 'HABIT_UPDATE',
      requestId: req.requestId,
      metadata: { habitId: habit.id, updateFields: req.body }
    });

    return sendSuccess(res, 'Habit updated successfully', { habit }, 200);
  } catch (error) {
    const status = error.message === 'Habit not found' ? 404 : 500;
    return sendError(res, error.message, [], status);
  }
});

/**
 * Delete an existing habit
 */
exports.deleteHabit = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const habitId = req.params.id;

  try {
    await habitService.deleteHabit(userId, habitId);

    // Log audit event
    await logEvent({
      userId: userId.toString(),
      action: 'HABIT_DELETE',
      requestId: req.requestId,
      metadata: { habitId }
    });

    return sendSuccess(res, 'Habit deleted successfully', { id: habitId }, 200);
  } catch (error) {
    const status = error.message === 'Habit not found' ? 404 : 500;
    return sendError(res, error.message, [], status);
  }
});

/**
 * Toggle habit completion state for a date
 */
exports.toggleHabitCompletion = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const habitId = req.params.id;
  
  // Default to today's date key if not provided
  const date = req.body.date || new Date().toISOString().split('T')[0];

  try {
    const result = await habitService.toggleHabitCompletion(userId, habitId, date);

    // Log audit event
    await logEvent({
      userId: userId.toString(),
      action: 'HABIT_TOGGLE',
      requestId: req.requestId,
      metadata: { habitId, date, completed: result.completed }
    });

    return sendSuccess(res, 'Habit completion toggled successfully', result, 200);
  } catch (error) {
    const status = error.message === 'Habit not found' ? 404 : 500;
    return sendError(res, error.message, [], status);
  }
});
