import { Trophy, TrendingUp } from "lucide-react";
import { UserReward } from "../types";

interface RewardDisplayProps {
  reward: UserReward;
}

export function RewardDisplay({ reward }: RewardDisplayProps) {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 rounded-lg p-4 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/50 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="bg-green-500/10 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-gray-100">
            <div className="text-xl font-bold">
              {reward.classificationsCount}
            </div>
            <div className="text-sm text-gray-400">Classifications</div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 rounded-lg p-4 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/50 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-500/10 p-2 rounded-lg">
            <Trophy className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-gray-100">
            <div className="text-xl font-bold">{reward.points}</div>
            <div className="text-sm text-gray-400">Total Points</div>
          </div>
        </div>
      </div>
    </div>
  );
}
