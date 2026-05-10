import { useAuth } from "../../../app/providers/authContext";
import { useHabits } from "../../../app/providers/habitsContext";
import AnalyticsSummary from "../components/AnalyticsSummary";
import HeatmapGrid from "../components/HeatmapGrid";
import ProfileOverview from "../components/ProfileOverview";
import { useTallyAnalytics } from "../hooks/useTallyAnalytics";

function TallyPage() {
  const { user } = useAuth();
  const { habits } = useHabits();
  const analytics = useTallyAnalytics(habits);

  return (
    <main className="tally-shell">
      <ProfileOverview user={user} />

      <HeatmapGrid days={analytics.heatmapData} />

      <AnalyticsSummary
        dailyAverage={analytics.dailyAverage}
        longestStreak={analytics.longestStreak}
        currentStreak={analytics.currentStreak}
      />
    </main>
  );
}

export default TallyPage;
