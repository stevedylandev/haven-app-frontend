import React from 'react';
import { Trophy, TrendingUp } from 'lucide-react';
import { UserReward } from '../types';

interface RewardDisplayProps {
  reward: UserReward;
}

export function RewardDisplay({ reward }: RewardDisplayProps) {
  return (
    <div className="fixed top-12 right-4 flex gap-2 bg-gradient-to-br from-purple-900/50 to-black p-8 rounded-xl border border-purple-800/50">
      <div className="rounded-full px-4 py-2 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-green-400" />
        <div className="text-white">
          <span className="font-bold">{reward.classificationsCount}</span>
          <span className="text-sm ml-1">classified</span>
        </div>
      </div>

      <div className="rounded-full px-4 py-2 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <div className="text-white">
          <span className="font-bold">{reward.points}</span>
          <span className="text-sm ml-1">pts</span>
        </div>
      </div>
    </div>
  );
}
