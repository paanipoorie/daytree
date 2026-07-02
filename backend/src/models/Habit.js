const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    period: {
      type: String,
      enum: ['Morning', 'Afternoon', 'Evening', 'Night'],
      required: true,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Habit = mongoose.model('Habit', habitSchema);
module.exports = Habit;
