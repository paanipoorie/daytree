import HabitItem from "./HabitItem";

function HabitList({ habits, time, title, onToggleHabit, onDeleteHabit }) {
  const filteredHabits = habits.filter((habit) => habit.time === time);

  return (
    <section className="habit-column">
      <h2>{title}</h2>

      {filteredHabits.length === 0 && (
        <p className="empty-message">No habits yet.</p>
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
