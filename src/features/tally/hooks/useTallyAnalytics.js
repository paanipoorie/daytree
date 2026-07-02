import { useState, useEffect } from "react";
import { apiClient } from "../../../shared/utils/apiClient";

/**
 * Hook to fetch tally and heatmap analytics from backend API
 * @returns {Object} Heatmap data, streaks, daily average, loading state, and error message
 */
export function useTallyAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
  }, []);

  return {
    heatmapData: analytics?.heatmapData || [],
    dailyAverage: analytics?.dailyAverage || 0,
    currentStreak: analytics?.currentStreak || 0,
    longestStreak: analytics?.longestStreak || 0,
    isLoading,
    error,
  };
}
