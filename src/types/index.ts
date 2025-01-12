export interface Content {
  id: string;
  url: string;
  type: 'image' | 'video';
  pointsValue?: number;
  leftActionId?: string;
  rightActionId?: string;
}

export interface VideoClip {
  ipfs_cid: string;
  points_value: number;
  left_action: string;
  right_action: string;
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