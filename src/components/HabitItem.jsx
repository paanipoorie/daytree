import { getTodayKey } from "../utils/dates";

function HabitItem({ habit, toggleHabit, deleteHabit }) {
  const today = getTodayKey();
  const completedToday = habit.completedDates.includes(today);

  return (
    <div className="habit-item">
      <input
        type="checkbox"
        checked={completedToday}
        onChange={() => toggleHabit(habit.id)}
      />

      <span>{habit.name}</span>

      <button
        className="delete-button"
        type="button"
        onClick={() => deleteHabit(habit.id)}
        aria-label={`Delete ${habit.name}`}
        title={`Delete ${habit.name}`}
      >
        <span className="trash-icon" aria-hidden="true">
          <span />
        </span>
      </button>
    </div>
  );
}

export default HabitItem;
