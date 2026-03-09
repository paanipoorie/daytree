function HabitItem({ habit, toggleHabit}) {

  const today = new Date().toISOString().split("T")[0];

  const completedToday = habit.completedDates.includes(today);
  return (
    <div>

      <input type="checkbox" checked={completedToday} onChange={() => toggleHabit(habit.id)} />

      <span>{habit.name}</span>

    </div>
  );
}

export default HabitItem;
