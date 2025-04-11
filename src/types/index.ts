export interface Content {
  id: string;
  url: string;
  type: "image" | "video";
  pointsValue?: number;
  leftActionId?: string;
  rightActionId?: string;
}

export interface VideoClip {
  ipfs_cid: string;
  points_value: number;
  clip_action: string;
  random_action: string;
}

export interface RandomVideoClipResponse {
  ipfs_cid: string;
  points_value: number;
  clip_action: string;
  random_action: string;
}

export interface ActionChoice {
  id: string;
  label: string;
}

export interface UserReward {
  points: number;
  level: number;
  classificationsCount: number;
}

export interface Classification {
  contentId: string;
  selectedActionId: string;
  timestamp: number;
}

export interface ClassificationStorage {
  classifications: Classification[];
  lastSubmitted: number | null;
}

export type RoleType = "HUMAN_LABELER" | "AI_LABLER" | "ADMIN";

export interface UserRegistration {
  userName: string;
  email: string;
  password: string;
  roleType: RoleType;
  ethereumAddress: string;
}

export interface UserProfile extends UserRegistration {
  id: string;
  createdAt: string;
  points: number;
  classificationsCount: number;
}

export interface ApiResponse<T> {
  HttpCode: number;
  message: string;
  data: T;
}

export interface ProfileUpdateRequest {
  userName?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  ethereumAddress?: string;
}

export interface PointsTransaction {
  id: string;
  amount: number;
  source: "LABELING" | "BETTING" | "BONUS" | "PENALTY";
  timestamp: string;
  description: string;
}

export interface PointsHistory {
  totalPoints: number;
  transactions: PointsTransaction[];
}

export interface Contribution {
  id: string;
  type: "LABEL" | "VERIFICATION";
  clipId: string;
  action: string;
  pointsEarned: number;
  timestamp: string;
  consensusMatch?: boolean;
}

export interface ContributionHistory {
  totalContributions: number;
  contributions: Contribution[];
  accuracy: number;
  achievements: {
    totalLabels: number;
    correctConsensus: number;
    winningStreak: number;
  };
}

export interface UserProfile {
  id: string;
  userName: string;
  email: string;
  roleType: RoleType;
  ethereumAddress: string;
  points: number;
  totalContributions: number;
  createdAt: string;
}

export interface Action {
  action_id: number;
  action_name: string;
  description: string | null;
  created_at: string; // ISO date string
}

export interface PickerActionsResponse {
  HttpCode: number;
  message: string;
  data: Action[];
}
