import HabitItem from "./HabitItem";

const EMPTY_MESSAGES = {
  morning: "No morning habits yet.",
  afternoon: "No afternoon habits yet.",
  evening: "No evening habits yet.",
  night: "No night habits yet.",
};

function HabitList({ habits, time, title, onToggleHabit, onDeleteHabit }) {
  const filteredHabits = habits.filter((habit) => habit.time === time);

  return (
    <section className="habit-column">
      <h2>{title}</h2>

      {filteredHabits.length === 0 && (
        <p className="empty-message period-empty">
          {EMPTY_MESSAGES[time] || "No habits yet."}
        </p>
      )}

      {filteredHabits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          onToggleHabit={onToggleHabit}
          onDeleteHabit={onDeleteHabit}
        />
      ))}
    </section>
  );
}

export default HabitList;
