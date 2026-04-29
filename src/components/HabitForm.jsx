import { useState } from "react";

function HabitForm({ onAddHabit }) {
  const [name, setName] = useState("");
  const [time, setTime] = useState("morning");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const cleanedName = name.trim();

    if (!cleanedName) {
      setError("Habit name is required.");
      return;
    }

    onAddHabit({
      name: cleanedName,
      time,
    });

    setError("");
    setName("");
    setTime("morning");
  }

  return (
    <form className="habit-form" onSubmit={handleSubmit}>
      <h2>Add New Habit</h2>

      <input
        type="text"
        placeholder="Enter Habit Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <select value={time} onChange={(event) => setTime(event.target.value)}>
        <option value="morning">Morning</option>
        <option value="afternoon">Afternoon</option>
        <option value="evening">Evening</option>
        <option value="night">Night</option>
      </select>

      <button type="submit">Add</button>

      {error && <p className="form-error">{error}</p>}
    </form>
  );
}

export default HabitForm;
