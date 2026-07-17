import { useEffect, useState, useContext } from "react";
import { 
  fetchHabits, 
  createHabitApi, 
  deleteHabitApi,
  toggleHabitApi
} from "../../features/habits/services/habitService";
import { getDateKey } from "../../shared/utils/dateUtils";
import { HabitsContext } from "./habitsContext";
import { useAuth } from "./authContext";
import { ToastContext } from "./ToastContext";

export function HabitsProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const { success, error: showError } = useContext(ToastContext);
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Load habits when authenticated, otherwise clear them
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setHabits([]);
      setIsLoading(false);
      setError("");
      return;
    }

    async function loadHabits() {
      setIsLoading(true);
      setError("");
      try {
        const savedHabits = await fetchHabits();
        setHabits(savedHabits);
      } catch (err) {
        console.error("Failed to load habits:", err.message);
        setError("Could not load habits.");
        showError("Could not load habits. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadHabits();
  }, [isAuthenticated, user, showError]);

  async function addHabit(formData) {
    try {
      setError("");
      // Map frontend period 'time' to capitalized backend 'period'
      const period = formData.time.charAt(0).toUpperCase() + formData.time.slice(1);
      
      const newHabit = await createHabitApi(formData.name, period);
      setHabits((currentHabits) => [...currentHabits, newHabit]);
      success("Habit created!");
    } catch (err) {
      console.error("Failed to add habit:", err.message);
      const message = "Could not create habit.";
      setError(message);
      showError(message);
      throw err;
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
      
      if (result.completed) {
        success("Habit completed!");
      } else {
        success("Habit marked incomplete.");
      }
    } catch (err) {
      console.error("Failed to toggle habit completion:", err.message);
      const message = "Could not update habit completion.";
      setError(message);
      showError(message);
    }
  }

  async function deleteHabit(habitId) {
    try {
      setError("");
      await deleteHabitApi(habitId);
      setHabits((currentHabits) =>
        currentHabits.filter((habit) => habit.id !== habitId)
      );
      success("Habit deleted.");
    } catch (err) {
      console.error("Failed to delete habit:", err.message);
      const message = "Could not delete habit.";
      setError(message);
      showError(message);
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
