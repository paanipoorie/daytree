import { useState, useEffect } from "react";
import { apiClient } from "../../../shared/utils/apiClient";
import { useAuth } from "../../../app/providers/authContext";
import { useHabits } from "../../../app/providers/habitsContext";
import { getDateKey } from "../../../shared/utils/dateUtils";

/**
 * Hook to fetch tally and heatmap analytics from backend API
 * @returns {Object} Heatmap data, streaks, daily average, loading state, and error message
 */
export function useTallyAnalytics() {
  const { isAuthenticated, user } = useAuth();
  const { habits } = useHabits();
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [todayKey, setTodayKey] = useState(getDateKey());

  // Listen for midnight rollover
  useEffect(() => {
    const timer = setInterval(() => {
      const currentToday = getDateKey();
      if (currentToday !== todayKey) {
        setTodayKey(currentToday);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(timer);
  }, [todayKey]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setAnalytics(null);
      setIsLoading(false);
      setError("");
      return;
    }

    async function loadAnalytics() {
      setIsLoading(true);
      setError("");
      try {
        const response = await apiClient("/api/v1/tally", {
          method: "GET",
        });
        setAnalytics(response.data);
      } catch (err) {
        console.error("Failed to load tally analytics:", err.message);
        setError("Could not retrieve your consistency analytics. Please check back later.");
      } finally {
        setIsLoading(false);
      }
    }

    loadAnalytics();
  }, [isAuthenticated, user, habits, todayKey]);

  return {
    heatmapData: analytics?.heatmapData || [],
    dailyAverage: analytics?.dailyAverage || 0,
    currentStreak: analytics?.currentStreak || 0,
    longestStreak: analytics?.longestStreak || 0,
    isLoading,
    error,
  };
}

