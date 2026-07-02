const express = require('express');
const habitController = require('../controllers/habit.controller');
const validate = require('../middleware/validate');
const { 
  createHabitSchema, 
  updateHabitSchema, 
  deleteHabitSchema,
  toggleHabitCompletionSchema 
} = require('../validators/habit.validator');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply protect middleware to all habit routes
router.use(protect);

router.get('/', habitController.getHabits);
router.post('/', validate(createHabitSchema), habitController.createHabit);
router.patch('/:id', validate(updateHabitSchema), habitController.updateHabit);
router.delete('/:id', validate(deleteHabitSchema), habitController.deleteHabit);

// Completion toggling route
router.post(
  '/:id/toggle',
  validate(toggleHabitCompletionSchema),
  habitController.toggleHabitCompletion
);

module.exports = router;
