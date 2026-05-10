import { getTimePeriod } from "../../../shared/constants/timePeriods";
import {
  getCurrentMinutes,
  getDateKey,
} from "../../../shared/utils/dateUtils";

// A habit is backlogged when its scheduled time window has passed today
// and the user has not completed it today.
export function isHabitBacklogged(habit, now = new Date()) {
  const period = getTimePeriod(habit.time);

  if (!period) {
    return false;
  }

  const today = getDateKey(now);
  const completedToday = habit.completedDates.includes(today);
  const currentMinutes = getCurrentMinutes(now);

  return currentMinutes >= period.endMinutes && !completedToday;
}
