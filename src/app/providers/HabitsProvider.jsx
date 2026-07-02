import { useEffect, useState } from "react";
import { 
  fetchHabits, 
  createHabitApi, 
  deleteHabitApi,
  toggleHabitApi
} from "../../features/habits/services/habitService";
import { getDateKey } from "../../shared/utils/dateUtils";
import { HabitsContext } from "./habitsContext";

export function HabitsProvider({ children }) {
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Initial load fetches habits from backend Express API
  useEffect(() => {
    async function loadHabits() {
      try {
        const savedHabits = await fetchHabits();
        setHabits(savedHabits);
      } catch (err) {
        console.error("Failed to load habits:", err.message);
        setError("Could not load habits.");
      } finally {
        setIsLoading(false);
      }
    }

    loadHabits();
  }, []);

  async function addHabit(formData) {
    try {
      setError("");
      // Map frontend period 'time' to capitalized backend 'period'
      const period = formData.time.charAt(0).toUpperCase() + formData.time.slice(1);
      
      const newHabit = await createHabitApi(formData.name, period);
      setHabits((currentHabits) => [...currentHabits, newHabit]);
    } catch (err) {
      console.error("Failed to add habit:", err.message);
      setError("Could not create habit.");
    }
  }

  // Toggle habit completion on the backend
  async function toggleHabit(habitId) {
    const today = getDateKey();
    try {
      setError("");
      const result = await toggleHabitApi(habitId, today);
      
      setHabits((currentHabits) =>
        currentHabits.map((habit) => {
          if (habit.id !== habitId) {
            return habit;
          }

          const isCompleted = result.completed;
          const alreadyInList = habit.completedDates.includes(today);

          let updatedCompletedDates = habit.completedDates;
          if (isCompleted && !alreadyInList) {
            updatedCompletedDates = [...habit.completedDates, today];
          } else if (!isCompleted && alreadyInList) {
            updatedCompletedDates = habit.completedDates.filter((date) => date !== today);
          }

          return {
            ...habit,
            completedDates: updatedCompletedDates,
          };
        })
      );
    } catch (err) {
      console.error("Failed to toggle habit completion:", err.message);
      setError("Could not update habit completion.");
    }
  }

  async function deleteHabit(habitId) {
    try {
      setError("");
      await deleteHabitApi(habitId);
      setHabits((currentHabits) =>
        currentHabits.filter((habit) => habit.id !== habitId)
      );
    } catch (err) {
      console.error("Failed to delete habit:", err.message);
      setError("Could not delete habit.");
    }
  }

  const value = {
    habits,
    isLoading,
    error,
    addHabit,
    toggleHabit,
    deleteHabit,
  };

  return (
    <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>
  );
}
