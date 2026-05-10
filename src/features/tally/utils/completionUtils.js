// A habit counts toward a day only after it exists.
// This prevents old dates from punishing habits created later.
export function wasHabitActiveOnDate(habit, dateKey) {
  return !habit.createdAt || habit.createdAt <= dateKey;
}

export function calculateCompletionRate(habits, dateKey) {
  const activeHabits = habits.filter((habit) =>
    wasHabitActiveOnDate(habit, dateKey)
  );

  const totalHabits = activeHabits.length;

  if (totalHabits === 0) {
    return {
      dateKey,
      totalHabits: 0,
      completedHabits: 0,
      completionRate: null,
    };
  }

  const completedHabits = activeHabits.filter((habit) =>
    habit.completedDates.includes(dateKey)
  ).length;

  return {
    dateKey,
    totalHabits,
    completedHabits,
    completionRate: Math.round((completedHabits / totalHabits) * 100),
  };
}

export function getHeatmapLevel(completionRate) {
  if (completionRate === null || completionRate === 0) return "none";
  if (completionRate < 50) return "low";
  if (completionRate < 70) return "medium";
  if (completionRate < 100) return "high";
  return "full";
}
