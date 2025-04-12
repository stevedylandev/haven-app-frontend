import { useState, useCallback } from "react";
import { RandomVideoClipResponse, Content } from "../types";
import { fetchRandomVideoClip } from "../utils/api";

export function useRandomVideoClip() {
  const [videoClips, setVideoClips] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapToContent = (clip: RandomVideoClipResponse): Content => ({
    id: clip.ipfs_cid,
    url: `https://premium.w3ipfs.storage/ipfs/${clip.ipfs_cid}`,
    type: "video",
    pointsValue: clip.points_value,
    leftActionId: clip.clip_action_id,
    leftActionName: clip.clip_action,
    rightActionId: clip.random_action_id,
    rightActionName: clip.random_action,
  });

  const fetchClips = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const clips = await fetchRandomVideoClip();
      const contentClips = clips.map(mapToContent);
      setVideoClips(contentClips);
    } catch {
      setError("Failed to fetch random video clips");
      setVideoClips([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    videoClips,
    loading,
    error,
    fetchClips,
  };
}
