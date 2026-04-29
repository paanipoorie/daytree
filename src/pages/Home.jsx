import { useEffect, useState } from "react";
import HabitForm from "../components/HabitForm";
import HabitList from "../components/HabitList";
import BacklogList from "../components/BacklogList";
import {
  formatReadableDate,
  formatReadableTime,
  getTodayKey,
  isHabitBacklogged,
} from "../utils/dates";

const STORAGE_KEY = "daytree_habits";

function Home() {
  const [now, setNow] = useState(new Date());

  const [habits, setHabits] = useState(() => {
    const storedHabits = localStorage.getItem(STORAGE_KEY);

    return storedHabits
      ? JSON.parse(storedHabits)
      : [
          { id: 1, name: "Drink water", time: "morning", completedDates: [] },
          { id: 2, name: "Yoga", time: "morning", completedDates: [] },
          { id: 3, name: "Study React", time: "afternoon", completedDates: [] },
          { id: 4, name: "Basketball", time: "evening", completedDates: [] },
          { id: 5, name: "Read book", time: "night", completedDates: [] },
        ];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  function addHabit(formData) {
    const newHabit = {
      id: Date.now(),
      name: formData.name,
      time: formData.time,
      completedDates: [],
    };

    setHabits((prevHabits) => [...prevHabits, newHabit]);
  }

  function toggleHabit(habitId) {
    const today = getTodayKey();

    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id !== habitId) return habit;

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
    setHabits((prevHabits) =>
      prevHabits.filter((habit) => habit.id !== habitId)
    );
  }

  const backlogs = habits.filter((habit) => isHabitBacklogged(habit));

  return (
    <main className="home-shell">
      <aside className="control-panel">
        <HabitForm onAddHabit={addHabit} />

        <section className="date-panel">
          <p className="today-date">{formatReadableDate(now)}</p>
          <p className="current-time">{formatReadableTime(now)}</p>
        </section>

        <BacklogList habits={backlogs} />
      </aside>

      <section className="habit-board">
        <HabitList habits={habits} time="morning" title="Morning" toggleHabit={toggleHabit} deleteHabit={deleteHabit} />
        <HabitList habits={habits} time="afternoon" title="Afternoon" toggleHabit={toggleHabit} deleteHabit={deleteHabit} />
        <HabitList habits={habits} time="evening" title="Evening" toggleHabit={toggleHabit} deleteHabit={deleteHabit} />
        <HabitList habits={habits} time="night" title="Night" toggleHabit={toggleHabit} deleteHabit={deleteHabit} />
      </section>
    </main>
  );
}

export default Home;
