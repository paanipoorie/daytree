import { normalizeHabit } from "../utils/habitFactory";

const STORAGE_KEY = "daytree_habits";

// This service hides persistence from React components.
// Today it uses localStorage; later the same functions can call Express APIs.
export async function fetchHabits() {
  const storedHabits = localStorage.getItem(STORAGE_KEY);

  if (!storedHabits) {
    return [];
  }

  return JSON.parse(storedHabits).map(normalizeHabit);
}

export async function saveHabits(habits) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  return habits;
}
