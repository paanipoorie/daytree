import { useAuth } from "../../../app/providers/authContext";
import AnalyticsSummary from "../components/AnalyticsSummary";
import HeatmapGrid from "../components/HeatmapGrid";
import ProfileOverview from "../components/ProfileOverview";
import { useTallyAnalytics } from "../hooks/useTallyAnalytics";

function TallyPage() {
  const { user } = useAuth();
  const { 
    heatmapData, 
    dailyAverage, 
    longestStreak, 
    currentStreak, 
    isLoading, 
    error 
  } = useTallyAnalytics();

  const hasActivity = heatmapData && heatmapData.some(day => day.completionRate !== null);

  return (
    <main className="tally-shell">
      <ProfileOverview user={user} />

      {error && <p className="form-error" style={{ textAlign: "center", margin: "1rem" }}>{error}</p>}

      {isLoading ? (
        <p className="empty-message" style={{ textAlign: "center", margin: "2rem" }}>Loading consistency analytics...</p>
      ) : !hasActivity ? (
        <div className="tally-empty-state" style={{ textAlign: "center", padding: "48px 24px" }}>
          <h2 style={{ margin: "0 0 12px", fontSize: "24px", fontWeight: "900" }}>No activity yet.</h2>
          <p style={{ margin: "0 0 24px", color: "#666", fontSize: "16px", lineHeight: "1.5" }}>
            Complete your first habit to start building your consistency graph.
          </p>
          <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
            Your heatmap, streaks, and daily average will appear here once you begin.
          </p>
        </div>
      ) : (
        <>
          <HeatmapGrid days={heatmapData} />

          <AnalyticsSummary
            dailyAverage={dailyAverage}
            longestStreak={longestStreak}
            currentStreak={currentStreak}
          />
        </>
      )}
    </main>
  );
}

export default TallyPage;
