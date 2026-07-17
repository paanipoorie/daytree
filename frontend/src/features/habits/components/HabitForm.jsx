import { useState } from "react";
import { TIME_PERIODS } from "../../../shared/constants/timePeriods";

function HabitForm({ onAddHabit }) {
  const [name, setName] = useState("");
  const [time, setTime] = useState("morning");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const cleanedName = name.trim();

    if (!cleanedName) {
      setError("Habit name is required.");
      return;
    }

    setIsPending(true);
    setError("");
    try {
      await onAddHabit({
        name: cleanedName,
        time,
      });
      setName("");
      setTime("morning");
    } catch (err) {
      const message = err.message || "Failed to create habit.";
      setError(message);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className="habit-form" onSubmit={handleSubmit}>
      <h2>Add New Habit</h2>

      <input
        type="text"
        placeholder="Enter Habit Name"
        value={name}
        disabled={isPending}
        onChange={(event) => setName(event.target.value)}
      />

      <select 
        value={time} 
        disabled={isPending} 
        onChange={(event) => setTime(event.target.value)}
      >
        {TIME_PERIODS.map((period) => (
          <option key={period.id} value={period.id}>
            {period.label}
          </option>
        ))}
      </select>

      <button type="submit" disabled={isPending}>
        {isPending ? "Adding..." : "Add"}
      </button>

      {error && <p className="form-error">{error}</p>}
    </form>
  );
}

export default HabitForm;
