const Habit = require('../models/Habit');
const HabitCompletion = require('../models/HabitCompletion');

// Date Utility Helpers (aligned with frontend implementation)
const getDateKey = (date = new Date()) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split('T')[0];
};

const addDays = (date, amount) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
};

const getRecentDateKeys = (dayCount = 91) => {
  const today = new Date();
  return Array.from({ length: dayCount }, (_, index) => {
    const offset = index - (dayCount - 1);
    return getDateKey(addDays(today, offset));
  });
};

const TIME_PERIODS_END_MINUTES = {
  morning: 12 * 60,          // 12:00 PM
  afternoon: 17 * 60,        // 5:00 PM
  evening: 20 * 60 + 30,     // 8:30 PM
  night: 24 * 60,            // 12:00 AM
};

/**
 * Pure function to map completion rate to heatmap level
 */
const getHeatmapLevel = (completionRate) => {
  if (completionRate === null || completionRate === 0) return 'none';
  if (completionRate < 50) return 'low';
  if (completionRate < 70) return 'medium';
  if (completionRate < 100) return 'high';
  return 'full';
};

/**
 * Pure function to generate heatmap data based on habits list and completions list
 */
const generateHeatmap = (habits, completions, dayCount = 91) => {
  const recentDates = getRecentDateKeys(dayCount);
  
  // Hash completions for constant time lookup: "habitId_dateKey" -> completed
  const completionsSet = new Set(
    completions
      .filter(c => c.completed)
      .map(c => `${c.habitId.toString()}_${c.date}`)
  );

  return recentDates.map((dateKey) => {
    // Filter habits active on this specific date key
    const activeHabits = habits.filter((habit) => {
      const createdDateKey = getDateKey(habit.createdAt);
      const isCreatedBefore = createdDateKey <= dateKey;
      
      if (!isCreatedBefore) return false;

      // If habit is archived, it only counts historically on days it was completed
      if (habit.archived) {
        return completionsSet.has(`${habit._id.toString()}_${dateKey}`);
      }

      return true;
    });

    const totalHabits = activeHabits.length;

    if (totalHabits === 0) {
      return {
        dateKey,
        totalHabits: 0,
        completedHabits: 0,
        completionRate: null,
        level: 'none',
      };
    }

    const completedHabits = activeHabits.filter((habit) =>
      completionsSet.has(`${habit._id.toString()}_${dateKey}`)
    ).length;

    const completionRate = Math.round((completedHabits / totalHabits) * 100);

    return {
      dateKey,
      totalHabits,
      completedHabits,
      completionRate,
      level: getHeatmapLevel(completionRate),
    };
  });
};

/**
 * Pure function to calculate current and longest streaks of 100% completion days
 */
const calculateStreaks = (heatmapData) => {
  let longestStreak = 0;
  let runningStreak = 0;

  heatmapData.forEach((day) => {
    if (day.completionRate === 100) {
      runningStreak += 1;
      longestStreak = Math.max(longestStreak, runningStreak);
    } else {
      runningStreak = 0;
    }
  });

  let currentStreak = 0;
  for (let index = heatmapData.length - 1; index >= 0; index -= 1) {
    if (heatmapData[index].completionRate !== 100) {
      break;
    }
    currentStreak += 1;
  }

  return {
    currentStreak,
    longestStreak,
  };
};

/**
 * Pure function to calculate daily completion percentage average
 */
const calculateDailyAverage = (heatmapData) => {
  const daysWithProgress = heatmapData.filter(
    (day) => day.completionRate !== null
  );

  if (daysWithProgress.length === 0) return 0;

  const sum = daysWithProgress.reduce((total, day) => total + day.completionRate, 0);
  return Math.round(sum / daysWithProgress.length);
};

/**
 * Pure function to compute the dashboard summary metrics
 */
const generateDashboardSummary = (habits, completions) => {
  const today = getDateKey();
  
  // Filter active (non-archived) habits today
  const activeHabitsToday = habits.filter(h => !h.archived);
  
  // Completed habits today
  const completedTodaySet = new Set(
    completions
      .filter(c => c.completed && c.date === today)
      .map(c => c.habitId.toString())
  );
  
  const totalHabits = activeHabitsToday.length;
  const completedToday = activeHabitsToday.filter(h => completedTodaySet.has(h._id.toString())).length;
  
  // Backlog counts today
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const backlogCount = activeHabitsToday.filter(habit => {
    const isCompletedToday = completedTodaySet.has(habit._id.toString());
    const periodKey = habit.period.toLowerCase();
    const endMinutes = TIME_PERIODS_END_MINUTES[periodKey] || 24 * 60;
    
    return currentMinutes >= endMinutes && !isCompletedToday;
  }).length;

  return {
    totalHabits,
    completedToday,
    backlogCount,
  };
};

/**
 * Aggregates all analytics data for a user in a cache-ready way
 */
const getTallyAnalytics = async (userId) => {
  // Fetch ALL habits (including archived) and ALL completions for the user using lean queries for performance
  const habits = await Habit.find({ userId }).lean();
  const completions = await HabitCompletion.find({ userId }).lean();

  // Pure functions execute calculations
  const heatmap = generateHeatmap(habits, completions);
  const { currentStreak, longestStreak } = calculateStreaks(heatmap);
  const dailyAverage = calculateDailyAverage(heatmap);
  const summary = generateDashboardSummary(habits, completions);

  // Compute completion rate today (or average of active habits)
  const completionPercentage = summary.totalHabits === 0 
    ? 0 
    : Math.round((summary.completedToday / summary.totalHabits) * 100);

  return {
    dailyAverage,
    totalHabits: summary.totalHabits,
    completedToday: summary.completedToday,
    backlogCount: summary.backlogCount,
    currentStreak,
    longestStreak,
    heatmapData: heatmap,
    heatmap,
    completionPercentage,
    summary,
  };
};

module.exports = {
  generateHeatmap,
  calculateStreaks,
  calculateDailyAverage,
  generateDashboardSummary,
  getTallyAnalytics,
};
