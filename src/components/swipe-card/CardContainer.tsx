import React from "react";
import { Content } from "../../types";
import { MediaDisplay } from "./MediaDisplay";
import { BettingIndicator } from "./BettingIndicator";
import { FloatingParticles } from "./FloatingParticles";

interface CardContainerProps {
  content: Content;
  isExpanded: boolean;
  isVideoLoaded: boolean;
  isHolding: boolean;
  betAmount: number;
  transform: string;
  opacity: number;
  onExpand: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  onVideoLoad: () => void;
  handlers: {
    onTouchStart: (e: React.TouchEvent | React.MouseEvent) => void;
    onTouchMove: (e: React.TouchEvent | React.MouseEvent) => void;
    onTouchEnd: () => void;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: () => void;
    onMouseLeave: () => void;
    onClick: (e: React.MouseEvent) => void;
  };
}

export const CardContainer: React.FC<CardContainerProps> = ({
  content,
  isExpanded,
  isVideoLoaded,
  isHolding,
  betAmount,
  transform,
  opacity,
  onExpand,
  videoRef,
  onVideoLoad,
  handlers,
}) => {
  return (
    <div
      className={`absolute inset-0 bg-black border-2 ${
        isHolding ? "border-yellow-500" : "border-red-500"
      } rounded-2xl transition-all duration-200 ${
        isExpanded ? "cursor-zoom-out" : "cursor-grab"
      }`}
      style={{ transform: isExpanded ? "none" : transform, opacity }}
      {...handlers}
    >
      <MediaDisplay
        content={content}
        isExpanded={isExpanded}
        isVideoLoaded={isVideoLoaded}
        onExpand={onExpand}
        videoRef={videoRef}
        onVideoLoad={onVideoLoad}
      />

      <BettingIndicator betAmount={betAmount} isHolding={isHolding} />
      <FloatingParticles />
    </div>
  );
};
