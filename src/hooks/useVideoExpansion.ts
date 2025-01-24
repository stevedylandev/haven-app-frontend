import { useState, useRef, useEffect, useCallback } from "react";

interface UseVideoExpansionConfig {
  onVideoLoad: () => void;
}

export const useVideoExpansion = ({ onVideoLoad }: UseVideoExpansionConfig) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updateDimensions() {
      if (!cardRef.current || !videoRef.current) return;

      if (isExpanded) {
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const video = videoRef.current;
        const videoRatio = video.videoWidth / video.videoHeight;

        const maxHeight = viewportHeight * 0.9;
        const maxWidth = viewportWidth;

        let width, height;

        if (maxWidth / maxHeight > videoRatio) {
          height = maxHeight;
          width = height * videoRatio;
        } else {
          width = maxWidth;
          height = width / videoRatio;
        }

        cardRef.current.style.width = `${width}px`;
        cardRef.current.style.height = `${height}px`;
      } else {
        cardRef.current.style.width = "";
        cardRef.current.style.height = "";
      }
    }

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, [isExpanded]);

  const handleExpand = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    setIsExpanded(!isExpanded);

    try {
      if (!isExpanded) {
        video.muted = false;
        await video.play();
      } else {
        video.muted = true;
      }
    } catch (error) {
      console.error("Failed to play video:", error);
    }
  }, [isExpanded]);

  const handleVideoLoad = useCallback(() => {
    setIsVideoLoaded(true);
    onVideoLoad();
  }, [onVideoLoad]);

  return {
    isExpanded,
    isVideoLoaded,
    videoRef,
    cardRef,
    handleExpand,
    handleVideoLoad,
    setIsVideoLoaded,
  };
};
