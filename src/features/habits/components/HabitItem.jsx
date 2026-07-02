import { useState } from "react";
import { getDateKey } from "../../../shared/utils/dateUtils";

function HabitItem({ habit, onToggleHabit, onDeleteHabit }) {
  const today = getDateKey();
  const completedToday = habit.completedDates.includes(today);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleToggle() {
    if (isToggling || isDeleting) return;
    setIsToggling(true);
    try {
      await onToggleHabit(habit.id);
    } finally {
      setIsToggling(false);
    }
  }

  async function handleDelete() {
    if (isToggling || isDeleting) return;
    setIsDeleting(true);
    try {
      await onDeleteHabit(habit.id);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className={`habit-item ${isDeleting ? "deleting" : ""}`}>
      <input
        type="checkbox"
        checked={completedToday}
        disabled={isToggling || isDeleting}
        onChange={handleToggle}
        aria-label={`Toggle completion for ${habit.name}`}
      />

      <span style={{ textDecoration: completedToday ? "line-through" : "none", opacity: isDeleting ? 0.5 : 1 }}>
        {habit.name}
      </span>

      <button
        className="delete-button"
        type="button"
        disabled={isToggling || isDeleting}
        onClick={handleDelete}
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
