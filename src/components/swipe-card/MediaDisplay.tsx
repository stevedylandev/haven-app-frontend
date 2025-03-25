import React from "react";
import { Content } from "../../types";
import { MaximizeIcon, MinimizeIcon } from "./icons";
import { useVideoPreloader } from "../../hooks/useVideoPreloader";

interface MediaDisplayProps {
  content: Content;
  isExpanded: boolean;
  isVideoLoaded: boolean;
  onExpand: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  onVideoLoad: () => void;
  preloader: ReturnType<typeof useVideoPreloader>;
}

export const MediaDisplay: React.FC<MediaDisplayProps> = ({
  content,
  isExpanded,
  isVideoLoaded,
  onExpand,
  videoRef,
  onVideoLoad,
  preloader,
}) => {
  const preloadedUrl =
    content.type === "video" ? preloader.getPreloadedVideo(content.id) : null;
  const loadingProgress =
    content.type === "video" ? preloader.progress.get(content.id) : null;

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
          {/* Loading Indicator */}
          {(!isVideoLoaded || loadingProgress?.status === "loading") && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
              <div className="flex flex-col items-center">
                {loadingProgress?.status === "loading" ? (
                  <>
                    <div className="text-white mb-3">Loading video...</div>
                    <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white transition-all duration-300"
                        style={{ width: `${loadingProgress.progress}%` }}
                      />
                    </div>
                    <div className="text-white/70 text-sm mt-2">
                      {Math.round(loadingProgress.progress)}%
                    </div>
                  </>
                ) : (
                  <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-white animate-spin" />
                )}
              </div>
            </div>
          )}

          {/* Video Player */}
          <video
            ref={videoRef}
            src={preloadedUrl || content.url}
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
            onLoadedData={() => {
              onVideoLoad();
              console.log(
                `[MediaDisplay] Video loaded: ${content.id} ${
                  preloadedUrl ? "(Preloaded)" : "(Direct)"
                }`
              );
            }}
            onLoadStart={() => {
              console.log(`[MediaDisplay] Loading started: ${content.id}`);
            }}
            style={{ display: isVideoLoaded ? "block" : "none" }}
          />

          {/* Preload Status Indicator */}
          {!isExpanded && preloadedUrl && isVideoLoaded && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-green-500/80 text-white text-xs rounded-full z-20">
              Preloaded
            </div>
          )}
        </>
      )}
    </>
  );
};
