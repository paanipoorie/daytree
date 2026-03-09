function HabitItem({ habit }) {

  return (
    <div>

      <input type="checkbox" />
      
      <span>{habit.name}</span>

    </div>
  );
}

export default HabitItem;