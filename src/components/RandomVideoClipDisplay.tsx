import { useEffect } from "react";
import { useRandomVideoClip } from "../hooks/useRandomVideoClip";
import { RandomVideoClipResponse } from "../types";

const IPFS_GATEWAY = "https://premium.w3ipfs.storage/ipfs";

interface RandomVideoClipDisplayProps {
  onActionSelect: (clipId: string, selectedAction: string) => void;
}

export function RandomVideoClipDisplay({
  onActionSelect,
}: RandomVideoClipDisplayProps) {
  const { videoClips, loading, error, fetchClips } = useRandomVideoClip();

  useEffect(() => {
    fetchClips();
  }, [fetchClips]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {error}
        <button
          onClick={fetchClips}
          className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!videoClips.length) {
    return <div className="text-center p-4">No clips available</div>;
  }

  const renderVideo = (clip: RandomVideoClipResponse) => (
    <div
      key={clip.ipfs_cid}
      className="relative rounded-lg overflow-hidden shadow-lg bg-white"
    >
      <video
        src={`${IPFS_GATEWAY}/${clip.ipfs_cid}`}
        className="w-full aspect-video object-cover"
        controls
        playsInline
      />
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Points: {clip.points_value}</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between gap-2">
            <button
              onClick={() => onActionSelect(clip.ipfs_cid, clip.clip_action)}
              className="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              {clip.clip_action}
            </button>
            <button
              onClick={() => onActionSelect(clip.ipfs_cid, clip.random_action)}
              className="flex-1 px-4 py-2 bg-secondary text-white rounded hover:bg-secondary/90"
            >
              {clip.random_action}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return <div className="grid gap-6 p-4">{videoClips.map(renderVideo)}</div>;
}
