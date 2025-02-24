import { useState, useCallback, useEffect } from "react";
import {
  BetHistoryEntry,
  BetHistoryFilter,
  BetHistoryStats,
} from "../types/betting";

export const useBetHistory = () => {
  const [history, setHistory] = useState<BetHistoryEntry[]>([]);
  const [stats, setStats] = useState<BetHistoryStats>({
    totalBets: 0,
    wonBets: 0,
    totalPointsWon: 0,
    totalPointsLost: 0,
    winRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BetHistoryFilter>({
    status: "all",
    timeRange: "all",
  });

  // Fetch bet history data
  const fetchBetHistory = useCallback(
    async (currentFilters: BetHistoryFilter) => {
      try {
        setLoading(true);
        // TODO: Implement API call to fetch bet history
        // This will be replaced with actual API integration
        const mockData: BetHistoryEntry[] = [];

        // Apply filters
        const filteredData = mockData.filter((bet) => {
          if (currentFilters.status && currentFilters.status !== "all") {
            if (bet.outcome !== currentFilters.status) return false;
          }
          // Add time range filtering logic here when implementing
          return true;
        });

        setHistory(filteredData);

        // Calculate stats
        const calculatedStats: BetHistoryStats = {
          totalBets: filteredData.length,
          wonBets: filteredData.filter((bet) => bet.outcome === "won").length,
          totalPointsWon: filteredData.reduce(
            (acc, bet) =>
              bet.outcome === "won" ? acc + (bet.pointsEarned || 0) : acc,
            0
          ),
          totalPointsLost: filteredData.reduce(
            (acc, bet) => (bet.outcome === "lost" ? acc + bet.betAmount : acc),
            0
          ),
          winRate:
            filteredData.length > 0
              ? (filteredData.filter((bet) => bet.outcome === "won").length /
                  filteredData.length) *
                100
              : 0,
        };
        setStats(calculatedStats);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch bet history"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Apply filters
  const applyFilters = useCallback((newFilters: Partial<BetHistoryFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Fetch data when filters change
  useEffect(() => {
    fetchBetHistory(filters);
  }, [filters, fetchBetHistory]);

  return {
    history,
    stats,
    loading,
    error,
    filters,
    applyFilters,
    refreshHistory: () => fetchBetHistory(filters),
  };
};
