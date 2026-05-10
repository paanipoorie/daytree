// A successful streak day means 100% of active habits were completed.
// This keeps streaks strict and easy to understand.
export function calculateStreaks(heatmapData) {
  let currentStreak = 0;
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
}
