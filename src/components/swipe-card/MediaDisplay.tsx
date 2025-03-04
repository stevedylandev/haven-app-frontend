import React from "react";
import type { Content } from "../../types";

interface MediaDisplayProps {
  content: Content;
  isExpanded: boolean;
  isVideoLoaded: boolean;
  onExpand: () => void;
  videoRef?: React.RefObject<HTMLVideoElement>;
  onVideoLoad: () => void;
}

export const MediaDisplay: React.FC<MediaDisplayProps> = ({
  content,
  isExpanded,
  isVideoLoaded,
  onExpand,
  videoRef,
  onVideoLoad,
}) => {
  return (
    <div className="relative w-full h-full">
      {content.type === "video" && content.url && videoRef && (
        <video
          ref={videoRef}
          src={content.url}
          className="w-full h-full object-cover"
          onLoadedData={onVideoLoad}
          playsInline
          loop
          muted
        />
      )}
      {content.type === "image" && content.url && (
        <img
          src={content.url}
          alt="Content"
          className="w-full h-full object-cover"
        />
      )}
      {!isVideoLoaded && content.type === "video" && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white/30"></div>
        </div>
      )}
      <button
        onClick={onExpand}
        className="absolute inset-0 z-20 focus:outline-none"
        aria-label={isExpanded ? "Minimize content" : "Expand content"}
      />
    </div>
  );
};
