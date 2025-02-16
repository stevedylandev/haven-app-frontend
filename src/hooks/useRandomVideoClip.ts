import { useState, useCallback } from "react";
import { RandomVideoClipResponse } from "../types";
import { fetchRandomVideoClip } from "../utils/api";

export function useRandomVideoClip() {
  const [videoClips, setVideoClips] = useState<RandomVideoClipResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClips = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const clips = await fetchRandomVideoClip();
      setVideoClips(clips);
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
