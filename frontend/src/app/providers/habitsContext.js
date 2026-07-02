import { createContext, useContext } from "react";

export const HabitsContext = createContext(null);

export function useHabits() {
  const context = useContext(HabitsContext);

  if (!context) {
    throw new Error("useHabits must be used inside HabitsProvider.");
  }

  return context;
}
