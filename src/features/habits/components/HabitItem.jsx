import { getDateKey } from "../../../shared/utils/dateUtils";

function HabitItem({ habit, onToggleHabit, onDeleteHabit }) {
  const today = getDateKey();
  const completedToday = habit.completedDates.includes(today);

  return (
    <div className="habit-item">
      <input
        type="checkbox"
        checked={completedToday}
        onChange={() => onToggleHabit(habit.id)}
      />

      <span>{habit.name}</span>

      <button
        className="delete-button"
        type="button"
        onClick={() => onDeleteHabit(habit.id)}
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
