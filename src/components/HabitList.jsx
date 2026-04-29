import HabitItem from "./HabitItem";

function HabitList({ habits, time, title, toggleHabit, deleteHabit }) {
  const filteredHabits = habits.filter((habit) => habit.time === time);

  return (
    <section className="habit-column">
      <h2>{title}</h2>

      {filteredHabits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          toggleHabit={toggleHabit}
          deleteHabit={deleteHabit}
        />
      ))}
    </section>
  );
}

export default HabitList;
