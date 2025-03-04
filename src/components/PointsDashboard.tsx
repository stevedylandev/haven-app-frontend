import { usePointsDashboard } from "../hooks/usePointsDashboard";
import { PointsTransaction, Contribution } from "../types";

interface PointsDashboardProps {
  userId: string;
}

const PointsDashboard = ({ userId }: PointsDashboardProps) => {
  const { pointsHistory, contributionHistory, isLoading, error } =
    usePointsDashboard(userId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-white/70">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 text-red-200 p-4 rounded-lg">
        Error loading dashboard data. Please try again later.
      </div>
    );
  }

  if (!pointsHistory || !contributionHistory) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            Total Points
          </h3>
          <p className="text-3xl font-bold text-emerald-400">
            {pointsHistory.totalPoints}
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            Contributions
          </h3>
          <p className="text-3xl font-bold text-blue-400">
            {contributionHistory.totalContributions}
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Accuracy</h3>
          <p className="text-3xl font-bold text-purple-400">
            {Math.round(contributionHistory.accuracy * 100)}%
          </p>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {contributionHistory.achievements.totalLabels}
            </div>
            <div className="text-sm text-white/70">Total Labels</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {contributionHistory.achievements.correctConsensus}
            </div>
            <div className="text-sm text-white/70">Correct Consensus</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {contributionHistory.achievements.winningStreak}
            </div>
            <div className="text-sm text-white/70">Current Streak</div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {pointsHistory.transactions
            .slice(0, 5)
            .map((transaction: PointsTransaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded"
              >
                <div>
                  <p className="text-white font-medium">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-white/60">
                    {new Date(transaction.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div
                  className={`text-lg font-semibold ${
                    transaction.amount > 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {transaction.amount > 0 ? "+" : ""}
                  {transaction.amount}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Recent Contributions */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Recent Contributions
        </h3>
        <div className="space-y-4">
          {contributionHistory.contributions
            .slice(0, 5)
            .map((contribution: Contribution) => (
              <div
                key={contribution.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded"
              >
                <div>
                  <p className="text-white font-medium">
                    {contribution.type === "LABEL" ? "Labeled" : "Verified"}:{" "}
                    {contribution.action}
                  </p>
                  <p className="text-sm text-white/60">
                    {new Date(contribution.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      contribution.consensusMatch
                        ? "bg-emerald-500/20 text-emerald-200"
                        : contribution.consensusMatch === false
                        ? "bg-red-500/20 text-red-200"
                        : "bg-yellow-500/20 text-yellow-200"
                    }`}
                  >
                    {contribution.consensusMatch
                      ? "Correct"
                      : contribution.consensusMatch === false
                      ? "Incorrect"
                      : "Pending"}
                  </span>
                  <span className="text-emerald-400 font-medium">
                    +{contribution.pointsEarned}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PointsDashboard;
