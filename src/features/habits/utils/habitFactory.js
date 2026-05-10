import { getDateKey } from "../../../shared/utils/dateUtils";

// Builds a new habit object in one place.
// Later, when MongoDB creates ids, this factory can be replaced by API data.
export function createHabit({ name, time }) {
  return {
    id: crypto.randomUUID(),
    name,
    time,
    createdAt: getDateKey(),
    completedDates: [],
  };
}

// Older localStorage habits may not have createdAt because the project evolved.
// Normalizing lets old data keep working after the architecture migration.
export function normalizeHabit(habit) {
  return {
    ...habit,
    createdAt: habit.createdAt || getDateKey(),
    completedDates: Array.isArray(habit.completedDates)
      ? habit.completedDates
      : [],
  };
}
