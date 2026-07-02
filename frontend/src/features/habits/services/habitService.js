import { apiClient } from "../../../shared/utils/apiClient";

/**
 * Fetch all habits and their completions from the backend
 * @returns {Promise<Array>} List of habits mapped to frontend structure
 */
export async function fetchHabits() {
  const response = await apiClient("/api/v1/habits", {
    method: "GET",
  });
  return response.data.habits;
}

/**
 * Create a new habit on the backend
 * @param {String} title - Habit title
 * @param {String} period - Habit time period (e.g. 'Morning', 'Afternoon')
 * @returns {Promise<Object>} The newly created habit
 */
export async function createHabitApi(title, period) {
  const response = await apiClient("/api/v1/habits", {
    method: "POST",
    body: { title, period },
  });
  return response.data.habit;
}

/**
 * Update an existing habit on the backend
 * @param {String} habitId - Habit ID
 * @param {Object} updateFields - Fields to update
 * @returns {Promise<Object>} The updated habit
 */
export async function updateHabitApi(habitId, updateFields) {
  const response = await apiClient(`/api/v1/habits/${habitId}`, {
    method: "PATCH",
    body: updateFields,
  });
  return response.data.habit;
}

/**
 * Delete a habit on the backend
 * @param {String} habitId - Habit ID
 * @returns {Promise<Object>} The deletion confirmation details
 */
export async function deleteHabitApi(habitId) {
  const response = await apiClient(`/api/v1/habits/${habitId}`, {
    method: "DELETE",
  });
  return response.data;
}

/**
 * Toggle a habit's completion status on the backend
 * @param {String} habitId - Habit ID
 * @param {String} date - Date key ("YYYY-MM-DD")
 * @returns {Promise<Object>} The toggled completion status details
 */
export async function toggleHabitApi(habitId, date) {
  const response = await apiClient(`/api/v1/habits/${habitId}/toggle`, {
    method: "POST",
    body: { date },
  });
  return response.data;
}
