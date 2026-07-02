const mongoose = require('mongoose');

const habitCompletionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Habit',
      required: true,
    },
    date: {
      type: String, // format: "YYYY-MM-DD"
      required: true,
    },
    completed: {
      type: Boolean,
      required: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure uniqueness per user, habit and date
habitCompletionSchema.index({ userId: 1, habitId: 1, date: 1 }, { unique: true });

const HabitCompletion = mongoose.model('HabitCompletion', habitCompletionSchema);
module.exports = HabitCompletion;
