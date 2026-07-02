const Habit = require('../models/Habit');
const HabitCompletion = require('../models/HabitCompletion');

/**
 * Map habit model + completions list to the format expected by the frontend
 */
const mapToFrontendHabit = (habit, completedDates = []) => {
  return {
    id: habit._id.toString(),
    name: habit.title,
    time: habit.period.toLowerCase(), // frontend uses lowercase ids: 'morning', 'afternoon', etc.
    archived: habit.archived,
    createdAt: habit.createdAt,
    completedDates,
  };
};

/**
 * Fetch all habits and their completed dates for a user (excluding soft-deleted/archived ones)
 */
const getHabits = async (userId) => {
  const habits = await Habit.find({ userId, archived: { $ne: true } });
  
  // Fetch all true completions for this user
  const completions = await HabitCompletion.find({ userId, completed: true });
  
  // Group completion dates by habitId
  const completionsMap = completions.reduce((acc, comp) => {
    const key = comp.habitId.toString();
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(comp.date);
    return acc;
  }, {});

  return habits.map(habit => {
    const dates = completionsMap[habit._id.toString()] || [];
    return mapToFrontendHabit(habit, dates);
  });
};

/**
 * Create a new habit
 */
const createHabit = async (userId, { title, period }) => {
  const habit = await Habit.create({
    userId,
    title,
    period,
  });

  return mapToFrontendHabit(habit, []);
};

/**
 * Update an existing habit
 */
const updateHabit = async (userId, habitId, updateFields) => {
  // Map incoming period to capitalized format if sent from frontend
  const fields = { ...updateFields };
  if (fields.period) {
    // e.g. "morning" -> "Morning"
    fields.period = fields.period.charAt(0).toUpperCase() + fields.period.slice(1);
  }
  if (fields.name) {
    fields.title = fields.name;
    delete fields.name;
  }
  if (fields.time) {
    fields.period = fields.time.charAt(0).toUpperCase() + fields.time.slice(1);
    delete fields.time;
  }

  const habit = await Habit.findOneAndUpdate(
    { _id: habitId, userId },
    { $set: fields },
    { new: true, runValidators: true }
  );

  if (!habit) {
    throw new Error('Habit not found');
  }

  // Fetch completions to include in mapped response
  const completions = await HabitCompletion.find({ habitId, completed: true });
  const completedDates = completions.map(c => c.date);

  return mapToFrontendHabit(habit, completedDates);
};

/**
 * Delete a habit (Soft Delete: archives the habit and keeps completions for analytics)
 */
const deleteHabit = async (userId, habitId) => {
  const habit = await Habit.findOneAndUpdate(
    { _id: habitId, userId },
    { $set: { archived: true } },
    { new: true }
  );

  if (!habit) {
    throw new Error('Habit not found');
  }

  return { id: habitId };
};

/**
 * Toggle habit completion state for a given date
 */
const toggleHabitCompletion = async (userId, habitId, date) => {
  // Verify habit exists and belongs to the user
  const habit = await Habit.findOne({ _id: habitId, userId });
  if (!habit) {
    throw new Error('Habit not found');
  }

  try {
    // Attempt to find completion record
    let completion = await HabitCompletion.findOne({ userId, habitId, date });

    if (completion) {
      // Toggle existing completion
      completion.completed = !completion.completed;
      completion.completedAt = completion.completed ? new Date() : null;
      await completion.save();
      return { habitId, date, completed: completion.completed };
    } else {
      // Create new completion (completed = true)
      completion = await HabitCompletion.create({
        userId,
        habitId,
        date,
        completed: true,
        completedAt: new Date(),
      });
      return { habitId, date, completed: true };
    }
  } catch (error) {
    // Unique index race condition check (code 11000)
    if (error.code === 11000) {
      // Retry by finding the newly created document and toggling it
      const completion = await HabitCompletion.findOne({ userId, habitId, date });
      if (completion) {
        completion.completed = !completion.completed;
        completion.completedAt = completion.completed ? new Date() : null;
        await completion.save();
        return { habitId, date, completed: completion.completed };
      }
    }
    throw error;
  }
};

module.exports = {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleHabitCompletion,
};
