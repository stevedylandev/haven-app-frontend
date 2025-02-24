export interface BetHistoryEntry {
  id: string;
  timestamp: string;
  clipId: string;
  betAmount: number;
  outcome: "won" | "lost" | "pending";
  pointsEarned?: number;
  consensusLabel?: string;
  userLabel?: string;
}

export interface BetHistoryFilter {
  status?: "all" | "won" | "lost" | "pending";
  timeRange?: "day" | "week" | "month" | "all";
}

export interface BetHistoryStats {
  totalBets: number;
  wonBets: number;
  totalPointsWon: number;
  totalPointsLost: number;
  winRate: number;
}
