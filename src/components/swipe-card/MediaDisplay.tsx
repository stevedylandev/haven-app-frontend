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
        className={`absolute z-50 bg-black/50 text-white p-2.5 rounded-full shadow-lg transition-all duration-300 ring-1 ring-white/20 active:scale-95 ${
          isExpanded
            ? "top-safe right-4 hover:bg-white/20"
            : "bottom-4 right-4 hover:bg-black/70"
        }`}
      >
        {isExpanded ? (
          <MinimizeIcon fill="currentColor" className="w-5 h-5" />
        ) : (
          <MaximizeIcon fill="currentColor" className="w-5 h-5" />
        )}
      </button>

      {content.type === "image" ? (
        <img
          src={content.url}
          alt="Content to classify"
          className={`w-full h-full transition-transform duration-300 ease-out ${
            isExpanded ? "object-contain" : "object-cover hover:scale-105"
          }`}
          draggable={false}
        />
      ) : (
        <>
          {!isVideoLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-white animate-spin" />
            </div>
          )}
          <video
            ref={videoRef}
            src={content.url}
            className={`absolute inset-0 w-full h-full transition-transform duration-300 ease-out ${
              isExpanded
                ? "object-contain max-h-screen"
                : "object-cover hover:scale-105"
            }`}
            autoPlay
            loop
            muted
            playsInline
            controls={isExpanded}
            controlsList="nodownload noremoteplayback"
            onLoadedData={onVideoLoad}
            style={{ display: isVideoLoaded ? "block" : "none" }}
          />
        </>
      )}
    </>
  );
};
