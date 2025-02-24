import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useBetHistory } from "../../hooks/useBetHistory";
import { BetHistoryEntry, BetHistoryFilter } from "../../types/betting";

const TimeRangeOptions: {
  label: string;
  value: BetHistoryFilter["timeRange"];
}[] = [
  { label: "All Time", value: "all" },
  { label: "This Month", value: "month" },
  { label: "This Week", value: "week" },
  { label: "Today", value: "day" },
];

const StatusOptions: { label: string; value: BetHistoryFilter["status"] }[] = [
  { label: "All Status", value: "all" },
  { label: "Won", value: "won" },
  { label: "Lost", value: "lost" },
  { label: "Pending", value: "pending" },
];

const BetHistoryDashboard: React.FC = () => {
  const { history, stats, loading, error, filters, applyFilters } =
    useBetHistory();

  if (error) {
    return (
      <div className="p-4 text-red-400">Error loading bet history: {error}</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700/50 p-4">
          <h3 className="text-sm font-medium text-gray-400">Total Bets</h3>
          <p className="text-2xl font-bold text-white">{stats.totalBets}</p>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700/50 p-4">
          <h3 className="text-sm font-medium text-gray-400">Win Rate</h3>
          <p className="text-2xl font-bold text-white">
            {stats.winRate.toFixed(1)}%
          </p>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700/50 p-4">
          <h3 className="text-sm font-medium text-gray-400">Points Won</h3>
          <p className="text-2xl font-bold text-green-400">
            +{stats.totalPointsWon}
          </p>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700/50 p-4">
          <h3 className="text-sm font-medium text-gray-400">Points Lost</h3>
          <p className="text-2xl font-bold text-red-400">
            -{stats.totalPointsLost}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Time Range
          </label>
          <div className="flex gap-2">
            {TimeRangeOptions.map((option) => (
              <Button
                key={option.value}
                variant={
                  filters.timeRange === option.value ? "default" : "outline"
                }
                onClick={() => applyFilters({ timeRange: option.value })}
                className={`text-sm ${
                  filters.timeRange === option.value
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Status</label>
          <div className="flex gap-2">
            {StatusOptions.map((option) => (
              <Button
                key={option.value}
                variant={
                  filters.status === option.value ? "default" : "outline"
                }
                onClick={() => applyFilters({ status: option.value })}
                className={`text-sm ${
                  filters.status === option.value
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Bet History List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading...</div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No betting history found
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((bet: BetHistoryEntry) => (
              <Card
                key={bet.id}
                className="bg-gray-800/30 border-gray-700/50 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">
                      {new Date(bet.timestamp).toLocaleString()}
                    </p>
                    <p className="font-medium text-white">
                      Bet Amount: {bet.betAmount} points
                    </p>
                    {bet.outcome !== "pending" && (
                      <p className="text-sm text-gray-300">
                        {bet.userLabel} vs Consensus: {bet.consensusLabel}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        bet.outcome === "won"
                          ? "bg-green-900/50 text-green-400"
                          : bet.outcome === "lost"
                          ? "bg-red-900/50 text-red-400"
                          : "bg-yellow-900/50 text-yellow-400"
                      }`}
                    >
                      {bet.outcome.charAt(0).toUpperCase() +
                        bet.outcome.slice(1)}
                    </span>
                    {bet.outcome === "won" && bet.pointsEarned && (
                      <p className="mt-1 text-sm font-medium text-green-400">
                        +{bet.pointsEarned} points
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BetHistoryDashboard;
