import { useEffect } from "react";
import { useRandomVideoClip } from "../hooks/useRandomVideoClip";
import { useVideoPreloader } from "../hooks/useVideoPreloader";
import { Content } from "../types";

interface RandomVideoClipDisplayProps {
  onActionSelect: (clipId: string, selectedAction: string) => void;
}

export function RandomVideoClipDisplay({
  onActionSelect,
}: RandomVideoClipDisplayProps) {
  const { videoClips, loading, error, fetchClips } = useRandomVideoClip();
  const preloader = useVideoPreloader({
    maxCacheSize: 5,
    preloadCount: 2,
  });

  // Start preloading videos when they're available
  useEffect(() => {
    if (videoClips.length > 0) {
      console.log(
        "[VideoDisplay] Adding videos to preload queue:",
        videoClips.length
      );
      preloader.addToPreloadQueue(videoClips);

      // Force preload the first video if not already cached
      if (videoClips[0] && !preloader.getPreloadedVideo(videoClips[0].id)) {
        console.log("[VideoDisplay] Force preloading first video");
        preloader.forcePreload(videoClips[0]);
      }
    }
  }, [videoClips, preloader]);

  // Fetch more clips when cache is low
  useEffect(() => {
    if (preloader.cacheSize < 2 && !loading) {
      console.log("[VideoDisplay] Cache running low, fetching more clips");
      fetchClips();
    }
  }, [preloader.cacheSize, loading, fetchClips]);

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

  const renderVideo = (content: Content) => {
    const preloadedUrl = preloader.getPreloadedVideo(content.id);
    const loadingProgress = preloader.progress.get(content.id);

    return (
      <div
        key={content.id}
        className="relative rounded-lg overflow-hidden shadow-lg bg-white"
      >
        {/* Loading Progress Overlay */}
        {loadingProgress && loadingProgress.status === "loading" && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="text-white text-center">
              <div className="mb-2">Loading video...</div>
              <div className="w-48 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${loadingProgress.progress}%` }}
                />
              </div>
              <div className="mt-1">
                {Math.round(loadingProgress.progress)}%
              </div>
            </div>
          </div>
        )}

        <video
          src={preloadedUrl || content.url}
          className="w-full aspect-video object-cover"
          controls
          playsInline
          onLoadStart={() => {
            console.log(`[VideoDisplay] Starting to load video: ${content.id}`);
          }}
          onCanPlay={() => {
            console.log(`[VideoDisplay] Video ready to play: ${content.id}`);
          }}
        />

        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Points: {content.pointsValue}</span>
            {preloadedUrl ? (
              <span className="text-xs text-green-600">Preloaded</span>
            ) : (
              <span className="text-xs text-yellow-600">Direct Stream</span>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between gap-2">
              <button
                onClick={() =>
                  onActionSelect(content.id, content.leftActionId || "")
                }
                className="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                {content.leftActionId}
              </button>
              <button
                onClick={() =>
                  onActionSelect(content.id, content.rightActionId || "")
                }
                className="flex-1 px-4 py-2 bg-secondary text-white rounded hover:bg-secondary/90"
              >
                {content.rightActionId}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return <div className="grid gap-6 p-4">{videoClips.map(renderVideo)}</div>;
}
