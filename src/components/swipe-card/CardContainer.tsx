import { Content } from "../../types";
import { MediaDisplay } from "./MediaDisplay";
import { BettingIndicator } from "./BettingIndicator";
import { FloatingParticles } from "./FloatingParticles";
import { Card } from "@/components/ui/card";

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
    <Card
      className={`absolute inset-0 border-none rounded-xl backdrop-blur-md bg-black/30 ${
        isHolding ? "ring-2 ring-yellow-500/70" : "ring-1 ring-white/10"
      } transition-all duration-300 ease-out ${
        isExpanded ? "cursor-zoom-out" : "cursor-grab"
      } overflow-hidden shadow-xl before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/80 before:via-transparent before:to-black/30 before:z-10`}
      style={{
        transform: isExpanded ? "none" : transform,
        opacity,
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
      }}
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
    </Card>
  );
};
