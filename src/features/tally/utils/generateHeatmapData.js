import { getRecentDateKeys } from "../../../shared/utils/dateUtils";
import {
  calculateCompletionRate,
  getHeatmapLevel,
} from "./completionUtils";

export function generateHeatmapData(habits, dayCount = 91) {
  return getRecentDateKeys(dayCount).map((dateKey) => {
    const completion = calculateCompletionRate(habits, dateKey);

    return {
      ...completion,
      level: getHeatmapLevel(completion.completionRate),
    };
  });
}
