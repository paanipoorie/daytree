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

  return (
    <main className="tally-shell">
      <ProfileOverview user={user} />

      {error && <p className="form-error" style={{ textAlign: "center", margin: "1rem" }}>{error}</p>}

      {isLoading ? (
        <p className="empty-message" style={{ textAlign: "center", margin: "2rem" }}>Loading consistency analytics...</p>
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
