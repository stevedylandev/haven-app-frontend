import { useState, useCallback, useEffect, useRef } from "react";
import { Content, RandomVideoClipResponse } from "../types";
import { fetchRandomVideoClip } from "../utils/api";

// Number of videos to prefetch
const PREFETCH_COUNT = 3;

export function usePrefetchedVideoContent() {
  const [videoClips, setVideoClips] = useState<Content[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep track of which videos are prefetched
  const prefetchedVideos = useRef<Set<string>>(new Set());
  const videoElementCache = useRef<Record<string, HTMLVideoElement>>({});

  // Map API response to content object
  const mapToContent = (clip: RandomVideoClipResponse): Content => ({
    id: clip.ipfs_cid,
    url: `https://premium.w3ipfs.storage/ipfs/${clip.ipfs_cid}`,
    type: "video",
    pointsValue: clip.points_value,
    leftActionId: clip.clip_action,
    rightActionId: clip.random_action,
  });

  // Fetch initial batch of clips
  const fetchClips = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const clips = await fetchRandomVideoClip();
      const contentClips = clips.map(mapToContent);
      setVideoClips(contentClips);
      setCurrentIndex(0);

      // Start prefetching the first few videos
      contentClips.slice(0, PREFETCH_COUNT).forEach((clip) => {
        prefetchVideo(clip);
      });
    } catch {
      setError("Failed to fetch video clips");
      setVideoClips([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Prefetch a single video by creating a video element and preloading it
  const prefetchVideo = useCallback((content: Content) => {
    if (content.type !== "video" || prefetchedVideos.current.has(content.id)) {
      return;
    }

    console.log(`[Prefetch] Started prefetching: ${content.id}`);

    const videoElement = document.createElement("video");
    videoElement.preload = "auto";
    videoElement.muted = true;
    videoElement.playsInline = true;
    videoElement.src = content.url;

    // Store reference to this video element
    videoElementCache.current[content.id] = videoElement;

    // Mark this video as being prefetched
    prefetchedVideos.current.add(content.id);

    // Start loading the video data
    videoElement.load();

    // Optional: You can also listen for the 'loadeddata' event
    videoElement.addEventListener("loadeddata", () => {
      console.log(`[Prefetch] Successfully prefetched: ${content.id}`);
    });

    videoElement.addEventListener("error", () => {
      console.error(`[Prefetch] Failed to prefetch: ${content.id}`);
      // Remove from prefetched set in case we want to retry later
      prefetchedVideos.current.delete(content.id);
      delete videoElementCache.current[content.id];
    });
  }, []);

  // Move to the next video and trigger prefetching of upcoming videos
  const advanceToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % videoClips.length;

      // Prefetch the next videos after the one we're moving to
      for (let i = 1; i <= PREFETCH_COUNT; i++) {
        const prefetchIndex = (newIndex + i) % videoClips.length;
        if (prefetchIndex < videoClips.length) {
          prefetchVideo(videoClips[prefetchIndex]);
        }
      }

      return newIndex;
    });
  }, [videoClips, prefetchVideo]);

  // Initialize prefetching on component mount
  useEffect(() => {
    if (videoClips.length > 0) {
      // Prefetch next videos from current position
      for (let i = 0; i < PREFETCH_COUNT; i++) {
        const prefetchIndex = (currentIndex + i) % videoClips.length;
        if (prefetchIndex < videoClips.length) {
          prefetchVideo(videoClips[prefetchIndex]);
        }
      }
    }
  }, [videoClips, currentIndex, prefetchVideo]);

  // Cleanup video elements when component unmounts
  useEffect(() => {
    return () => {
      Object.values(videoElementCache.current).forEach((videoElement) => {
        videoElement.src = "";
        videoElement.load();
      });
      videoElementCache.current = {};
      prefetchedVideos.current.clear();
    };
  }, []);

  // Get current video content
  const currentContent =
    videoClips.length > 0 ? videoClips[currentIndex] : undefined;

  // Check if current video is prefetched
  const isCurrentVideoPrefetched = currentContent
    ? prefetchedVideos.current.has(currentContent.id)
    : false;

  return {
    videoClips,
    currentContent,
    loading,
    error,
    fetchClips,
    advanceToNext,
    isCurrentVideoPrefetched,
  };
}
