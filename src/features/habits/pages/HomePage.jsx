import BacklogList from "../components/BacklogList";
import HabitForm from "../components/HabitForm";
import HabitList from "../components/HabitList";
import { useHabits } from "../../../app/providers/habitsContext";
import { TIME_PERIODS } from "../../../shared/constants/timePeriods";
import {
  formatReadableDate,
  formatReadableTime,
} from "../../../shared/utils/dateUtils";
import { useClock } from "../hooks/useClock";
import { isHabitBacklogged } from "../utils/backlogUtils";

function HomePage() {
  const now = useClock();
  const {
    habits,
    isLoading,
    error,
    addHabit,
    toggleHabit,
    deleteHabit,
  } = useHabits();

  const backlogs = habits.filter((habit) => isHabitBacklogged(habit, now));

  return (
    <main className="home-shell">
      <aside className="control-panel">
        <HabitForm onAddHabit={addHabit} />

        <section className="date-panel">
          <p className="today-date">{formatReadableDate(now)}</p>
          <p className="current-time">{formatReadableTime(now)}</p>
        </section>

        {error && <p className="form-error">{error}</p>}

        <BacklogList habits={backlogs} />
      </aside>

      <section className="habit-board">
        {isLoading && <p className="empty-message">Loading habits...</p>}

        {!isLoading &&
          TIME_PERIODS.map((period) => (
            <HabitList
              key={period.id}
              habits={habits}
              time={period.id}
              title={period.label}
              onToggleHabit={toggleHabit}
              onDeleteHabit={deleteHabit}
            />
          ))}
      </section>
    </main>
  );
}

export default HomePage;
