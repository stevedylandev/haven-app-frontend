import { useState, useCallback, useEffect, useRef } from "react";
import { Content } from "../types";

interface PreloadOptions {
  maxCacheSize: number;
  preloadCount: number;
  lowBandwidthThreshold: number;
}

interface CacheEntry {
  content: Content;
  blob: string;
  timestamp: number;
}

interface PreloadProgress {
  contentId: string;
  progress: number;
  status: "pending" | "loading" | "completed" | "error";
  speed?: number; // Speed in bytes per second
}

const DEFAULT_OPTIONS: PreloadOptions = {
  maxCacheSize: 5,
  preloadCount: 2,
  lowBandwidthThreshold: 1_000_000, // 1 Mbps
};

export function useVideoPreloader(options: Partial<PreloadOptions> = {}) {
  const [cache, setCache] = useState<Map<string, CacheEntry>>(new Map());
  const [preloadQueue, setPreloadQueue] = useState<Content[]>([]);
  const [isPreloading, setIsPreloading] = useState(false);
  const [connectionSpeed, setConnectionSpeed] = useState<number | null>(null);
  const [progress, setProgress] = useState<Map<string, PreloadProgress>>(
    new Map()
  );
  const abortControllerRef = useRef<AbortController | null>(null);

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  // Update progress for a specific content
  const updateProgress = useCallback(
    (contentId: string, update: Partial<PreloadProgress>) => {
      setProgress((prev) => {
        const newProgress = new Map(prev);
        const current = newProgress.get(contentId) || {
          contentId,
          progress: 0,
          status: "pending" as const,
        };
        newProgress.set(contentId, { ...current, ...update });
        return newProgress;
      });
    },
    []
  );

  // Preload a single video with force option and progress tracking
  const preloadVideo = useCallback(
    async (content: Content, force = false): Promise<void> => {
      if (!force && cache.has(content.id)) {
        console.log(`[Preloader] ${content.id} already in cache, skipping`);
        return;
      }
      if (!content.url) {
        console.warn(`[Preloader] ${content.id} has no URL, skipping`);
        return;
      }

      try {
        console.log(`[Preloader] Starting preload for ${content.id}`);
        updateProgress(content.id, { status: "loading", progress: 0 });

        abortControllerRef.current = new AbortController();
        const startTime = Date.now();
        const response = await fetch(content.url, {
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const contentLength = parseInt(
          response.headers.get("content-length") || "0"
        );
        const chunks: Uint8Array[] = [];
        let receivedLength = 0;

        if (!reader) {
          throw new Error("Failed to get response reader");
        }

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          chunks.push(value);
          receivedLength += value.length;

          // Calculate progress and speed
          const progressPercent = (receivedLength / contentLength) * 100;
          const timeElapsed = (Date.now() - startTime) / 1000; // seconds
          const speed = receivedLength / timeElapsed; // bytes per second

          updateProgress(content.id, {
            progress: progressPercent,
            speed: speed,
          });

          // Update connection speed based on current download
          setConnectionSpeed(speed);

          console.log(
            `[Preloader] ${content.id} progress: ${progressPercent.toFixed(
              1
            )}% ` + `(${(speed / 1_000_000).toFixed(2)} MB/s)`
          );
        }

        const blob = new Blob(chunks);
        const blobUrl = URL.createObjectURL(blob);

        setCache((prevCache) => {
          const newCache = new Map(prevCache);
          newCache.set(content.id, {
            content,
            blob: blobUrl,
            timestamp: Date.now(),
          });

          // Remove oldest entries if cache is too large
          if (newCache.size > mergedOptions.maxCacheSize) {
            const oldestEntry = Array.from(newCache.entries()).sort(
              ([, a], [, b]) => a.timestamp - b.timestamp
            )[0];
            if (oldestEntry) {
              console.log(
                `[Preloader] Removing oldest cache entry: ${oldestEntry[0]}`
              );
              URL.revokeObjectURL(oldestEntry[1].blob);
              newCache.delete(oldestEntry[0]);
            }
          }

          return newCache;
        });

        updateProgress(content.id, {
          status: "completed",
          progress: 100,
        });
        console.log(`[Preloader] Successfully preloaded ${content.id}`);
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error(`[Preloader] Failed to preload ${content.id}:`, error);
          updateProgress(content.id, { status: "error", progress: 0 });
        }
      }
    },
    [cache, mergedOptions.maxCacheSize, updateProgress]
  );

  // Process preload queue with force option
  const processQueue = useCallback(
    async (force = true) => {
      if (isPreloading || preloadQueue.length === 0) return;

      setIsPreloading(true);
      console.log("[Preloader] Processing queue, items:", preloadQueue.length);

      const content = preloadQueue[0];
      try {
        await preloadVideo(content, force);
        setPreloadQueue((queue) => queue.slice(1));
      } finally {
        setIsPreloading(false);
      }
    },
    [isPreloading, preloadQueue, preloadVideo]
  );

  // Add videos to preload queue
  const addToPreloadQueue = useCallback(
    (contents: Content[]) => {
      console.log("[Preloader] Adding to queue:", contents.length, "items");
      setPreloadQueue((queue) => {
        const newQueue = [...queue];
        for (const content of contents) {
          if (
            !cache.has(content.id) &&
            !newQueue.some((q) => q.id === content.id)
          ) {
            newQueue.push(content);
          }
        }
        return newQueue.slice(0, mergedOptions.preloadCount);
      });
    },
    [cache, mergedOptions.preloadCount]
  );

  // Force preload specific content
  const forcePreload = useCallback(
    (content: Content) => {
      console.log("[Preloader] Force preloading:", content.id);
      return preloadVideo(content, true);
    },
    [preloadVideo]
  );

  // Get a preloaded video
  const getPreloadedVideo = useCallback(
    (id: string): string | null => {
      const entry = cache.get(id);
      return entry ? entry.blob : null;
    },
    [cache]
  );

  // Clear preload queue
  const clearPreloadQueue = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    console.log("[Preloader] Clearing preload queue");
    setPreloadQueue([]);
  }, []);

  // Process queue when it changes
  useEffect(() => {
    processQueue(true);
  }, [processQueue, preloadQueue]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cache.forEach((entry) => {
        URL.revokeObjectURL(entry.blob);
      });
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [cache]);

  return {
    addToPreloadQueue,
    getPreloadedVideo,
    clearPreloadQueue,
    forcePreload,
    isPreloading,
    cacheSize: cache.size,
    queueSize: preloadQueue.length,
    connectionSpeed,
    progress,
  };
}
