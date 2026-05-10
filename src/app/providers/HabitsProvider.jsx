import { useEffect, useState } from "react";
import { fetchHabits, saveHabits } from "../../features/habits/services/habitService";
import { createHabit } from "../../features/habits/utils/habitFactory";
import { getDateKey } from "../../shared/utils/dateUtils";
import { HabitsContext } from "./habitsContext";

export function HabitsProvider({ children }) {
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Initial load is isolated here so pages do not know about localStorage.
  useEffect(() => {
    async function loadHabits() {
      try {
        const savedHabits = await fetchHabits();
        setHabits(savedHabits);
      } catch {
        setError("Could not load habits.");
      } finally {
        setIsLoading(false);
      }
    }

    loadHabits();
  }, []);

  // Whenever habit state changes, persist it through the service layer.
  useEffect(() => {
    if (isLoading) {
      return;
    }

    saveHabits(habits).catch(() => {
      setError("Could not save habits.");
    });
  }, [habits, isLoading]);

  function addHabit(formData) {
    setHabits((currentHabits) => [...currentHabits, createHabit(formData)]);
  }

  function toggleHabit(habitId) {
    const today = getDateKey();

    setHabits((currentHabits) =>
      currentHabits.map((habit) => {
        if (habit.id !== habitId) {
          return habit;
        }

        const completedToday = habit.completedDates.includes(today);

        return {
          ...habit,
          completedDates: completedToday
            ? habit.completedDates.filter((date) => date !== today)
            : [...habit.completedDates, today],
        };
      })
    );
  }

  function deleteHabit(habitId) {
    setHabits((currentHabits) =>
      currentHabits.filter((habit) => habit.id !== habitId)
    );
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
