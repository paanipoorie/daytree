import HabitItem from "./HabitItem";

function HabitList({ habits, time, title,toggleHabit }) {
  const filteredHabits = habits.filter(
    (habit) => habit.time === time
  );

  return (
    <div>
      <h2>{title}</h2>
      {filteredHabits.map((habit) => (
        <HabitItem key={habit.id} habit={habit} toggleHabit={toggleHabit}/>
      ))}
    </div>
  );
}

export default HabitList;
