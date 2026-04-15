import { useState } from "react";
import HabitList from "../components/HabitList";

function Daily() {
  const [habits, sethabits] = useState([

    { id: 1, name: "Drink water", time: "morning", completedDates: [] },
    { id: 2, name: "Yoga", time: "morning", completedDates: [] },
    { id: 3, name: "Study React", time: "afternoon", completedDates: [] },
    { id: 4, name: "Basketball", time: "evening", completedDates: [] },
    { id: 5, name: "Read book", time: "night", completedDates: [] }
  ]);

  function toggleHabit(habitId) {
    const today = new Date().toISOString().split("T")[0];
    const updatedHabits = habits.map((habit) => {
      if (habit.id === habitId) {
        const alreadyCompleted = habit.completedDates.includes(today);

        return {
          ...habit,
          completedDates: alreadyCompleted ? habit.completedDates.filter(date => date !== today) :
            [...habit.completedDates, today]
        };

      }
      return habit;
    });
    //State Update
    sethabits(updatedHabits);
  }

  function addHabit(formData){
    const newHabit = {
      id: Date.now(),
      name: formData.name,
      time: formData.time,

      completedDates:[],
    };

    sethabits((prevHabits)=>[...prevHabits,newHabit]);
  }

  return (
    <div>
      <h1>Track your daily habits</h1>
      <HabitList habits={habits} time="morning" title="Morning" toggleHabit={toggleHabit} />
      <HabitList habits={habits} time="afternoon" title="Afternoon" toggleHabit={toggleHabit} />
      <HabitList habits={habits} time="evening" title="Evening" toggleHabit={toggleHabit} />
      <HabitList habits={habits} time="night" title="Night" toggleHabit={toggleHabit} />
    </div>
  );
}
export default Daily;
