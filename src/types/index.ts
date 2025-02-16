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
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface UserResponse {
  id: string;
  userName: string;
  email: string;
  roleType: RoleType;
  ethereumAddress: string;
}
