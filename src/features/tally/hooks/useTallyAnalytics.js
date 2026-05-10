import { calculateStreaks } from "../utils/calculateStreaks";
import { generateHeatmapData } from "../utils/generateHeatmapData";

export function useTallyAnalytics(habits) {
  const heatmapData = generateHeatmapData(habits);
  const { currentStreak, longestStreak } = calculateStreaks(heatmapData);

  const daysWithProgress = heatmapData.filter(
    (day) => day.completionRate !== null
  );

  const dailyAverage =
    daysWithProgress.length === 0
      ? 0
      : Math.round(
          daysWithProgress.reduce(
            (total, day) => total + day.completionRate,
            0
          ) / daysWithProgress.length
        );

  return {
    heatmapData,
    dailyAverage,
    currentStreak,
    longestStreak,
  };
}
