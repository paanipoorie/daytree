import HabitList from "../components/HabitList";

// This is a React functional component
function Daily() {

  // Temporary habit data (later this will come from state/database)
  const habits = [
    { id: 1, name: "Drink water", time: "morning" },
    { id: 2, name: "Stretch", time: "morning" },
    { id: 3, name: "Study React", time: "afternoon" },
    { id: 4, name: "Workout", time: "evening" },
    { id: 5, name: "Read book", time: "night" }
  ];

  return (
    <div>

      <h1>Track your daily habits</h1>

      {/* We pass the habit data into HabitList */}
      <HabitList habits={habits} time="morning" title="Morning" />
      <HabitList habits={habits} time="afternoon" title="Afternoon" />
      <HabitList habits={habits} time="evening" title="Evening" />
      <HabitList habits={habits} time="night" title="Night" />

    </div>
  );
}
export default Daily;