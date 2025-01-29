import React from "react";
import { Content } from "../../types";
// import { MaximizeIcon, MinimizeIcon } from "./icons";

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
  // isExpanded,
  isVideoLoaded,
  // onExpand,
  videoRef,
  onVideoLoad,
}) => {
  return (
    <>
      {/* <button
        onClick={onExpand}
        className="absolute top-4 right-4 z-50 backdrop-blur-md bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full shadow-lg transition-all duration-300 ease-out ring-1 ring-white/20 hover:ring-white/40 hover:scale-110"
      >
        {isExpanded ? (
          <MinimizeIcon fill="currentColor" className="w-5 h-5" />
        ) : (
          <MaximizeIcon fill="currentColor" className="w-5 h-5" />
        )}
      </button> */}

      {content.type === "image" ? (
        <img
          src={content.url}
          alt="Content to classify"
          className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-105"
          draggable={false}
        />
      ) : (
        <>
          {!isVideoLoaded && (
            <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-white animate-spin" />
            </div>
          )}
          <video
            ref={videoRef}
            src={content.url}
            className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-105"
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
