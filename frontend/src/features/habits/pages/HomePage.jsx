import { useEffect, useState } from "react";
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
import { useAuth } from "../../../app/providers/authContext";

function HomePage() {
  const now = useClock();
  const { user } = useAuth();
  const {
    habits,
    isLoading,
    error,
    addHabit,
    toggleHabit,
    deleteHabit,
  } = useHabits();

  const [showWelcome, setShowWelcome] = useState(false);

  // Show welcome banner for first-time users (per user)
  useEffect(() => {
    if (!isLoading && habits.length === 0 && user) {
      const dismissed = localStorage.getItem(`daytree-welcome-${user.id}`);
      if (!dismissed) {
        // Use setTimeout to avoid synchronous setState in effect
        setTimeout(() => setShowWelcome(true), 0);
      }
    }
  }, [isLoading, habits.length, user]);

  const backlogs = habits.filter((habit) => isHabitBacklogged(habit, now));

  const dismissWelcome = () => {
    if (user) {
      localStorage.setItem(`daytree-welcome-${user.id}`, "true");
    }
    setShowWelcome(false);
  };

  const handleAddHabit = async (formData) => {
    await addHabit(formData);
    if (showWelcome) {
      dismissWelcome();
    }
  };

  const handleToggleHabit = async (habitId) => {
    await toggleHabit(habitId);
  };

  const handleDeleteHabit = async (habitId) => {
    await deleteHabit(habitId);
  };

  return (
    <main className="home-shell">
      <aside className="control-panel">
        <HabitForm onAddHabit={handleAddHabit} />

        <section className="date-panel">
          <p className="today-date">{formatReadableDate(now)}</p>
          <p className="current-time">{formatReadableTime(now)}</p>
        </section>

        {error && <p className="form-error">{error}</p>}

        <BacklogList habits={backlogs} />
      </aside>

      <section className="habit-board">
        {isLoading && <p className="empty-message">Loading habits...</p>}

        {!isLoading && showWelcome && (
          <div className="welcome-banner" style={{ gridColumn: "1 / -1" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 8px", fontSize: "20px", fontWeight: "900" }}>Welcome to DayTree 👋</h3>
                <p style={{ margin: "0 0 16px", color: "#666", lineHeight: "1.5" }}>
                  You haven't created any habits yet. Start by adding your first habit 
                  using the panel on the left — give it a name and choose a time of day.
                </p>
                <p style={{ margin: "0", color: "#666", fontSize: "14px", lineHeight: "1.5" }}>
                  Your day is divided into Morning, Afternoon, Evening, and Night. 
                  Complete habits during their time window to build your consistency graph.
                </p>
              </div>
              <button 
                onClick={dismissWelcome}
                style={{
                  border: "2px solid #000",
                  background: "transparent",
                  color: "#000",
                  padding: "6px 12px",
                  fontFamily: "Arial, sans-serif",
                  fontSize: "12px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  flexShrink: 0,
                  alignSelf: "flex-start"
                }}
              >
                Got it
              </button>
            </div>
          </div>
        )}

        {!isLoading &&
          TIME_PERIODS.map((period) => (
            <HabitList
              key={period.id}
              habits={habits}
              time={period.id}
              title={period.label}
              onToggleHabit={handleToggleHabit}
              onDeleteHabit={handleDeleteHabit}
            />
          ))}

        {!isLoading && habits.length === 0 && !showWelcome && (
          <div className="empty-state" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "48px 24px" }}>
            <h2 style={{ margin: "0 0 12px", fontSize: "24px", fontWeight: "900" }}>Your day starts here.</h2>
            <p style={{ margin: "0 0 24px", color: "#666", fontSize: "16px", lineHeight: "1.5" }}>
              You haven't created any habits yet.
            </p>
            <p style={{ margin: "0 0 24px", color: "#666", fontSize: "14px" }}>
              Create your first habit using the panel on the left.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default HomePage;
