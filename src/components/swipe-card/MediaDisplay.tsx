import React from "react";
import { Content } from "../../types";
import { MaximizeIcon, MinimizeIcon } from "./icons";

interface MediaDisplayProps {
  content: Content;
  isExpanded: boolean;
  isVideoLoaded: boolean;
  onExpand: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
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
    <>
      <button
        onClick={onExpand}
        className="absolute top-4 right-4 z-50 bg-gradient-to-br from-red-500 to-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full shadow-md"
      >
        {isExpanded ? (
          <MinimizeIcon fill="currentColor" />
        ) : (
          <MaximizeIcon fill="currentColor" />
        )}
      </button>

      {content.type === "image" ? (
        <img
          src={content.url}
          alt="Content to classify"
          className="w-full h-full object-contain rounded-2xl"
          draggable={false}
        />
      ) : (
        <>
          {!isVideoLoaded && (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center animate-pulse rounded-2xl">
              {/* Loading spinner or placeholder */}
            </div>
          )}
          <video
            ref={videoRef}
            src={content.url}
            className="w-full h-full object-contain rounded-2xl"
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={onVideoLoad}
            style={{ display: isVideoLoaded ? "block" : "none" }}
          />
        </>
      )}
    </>
  );
};
