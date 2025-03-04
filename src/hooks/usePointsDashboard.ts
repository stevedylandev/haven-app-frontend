import { useState, useEffect } from "react";
import { PointsHistory, ContributionHistory } from "../types";
import { getPointsHistory, getContributionHistory } from "../utils/api";

interface UsePointsDashboardResult {
  pointsHistory: PointsHistory | null;
  contributionHistory: ContributionHistory | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function usePointsDashboard(userId: string): UsePointsDashboardResult {
  const [pointsHistory, setPointsHistory] = useState<PointsHistory | null>(
    null
  );
  const [contributionHistory, setContributionHistory] =
    useState<ContributionHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [pointsData, contributionData] = await Promise.all([
        getPointsHistory(userId),
        getContributionHistory(userId),
      ]);

      setPointsHistory(pointsData.data);
      setContributionHistory(contributionData.data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch dashboard data")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  return {
    pointsHistory,
    contributionHistory,
    isLoading,
    error,
    refetch: fetchData,
  };
}
