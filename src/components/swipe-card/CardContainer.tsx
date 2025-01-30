import { Content, UserReward } from "../../types";
import { MediaDisplay } from "./MediaDisplay";
import { BettingIndicator } from "./BettingIndicator";
import { FloatingParticles } from "./FloatingParticles";
import { InfoOverlay } from "./InfoOverlay";
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
  reward: UserReward;
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
  reward,
  handlers,
}) => {
  return (
    <Card
      className={`absolute inset-0 border-none sm:rounded-xl backdrop-blur-[6px] bg-black/40 ${
        isHolding ? "ring-2 ring-yellow-500/70" : "ring-1 ring-white/10"
      } will-change-transform ${
        isExpanded
          ? "cursor-zoom-out"
          : "touch-none cursor-grab active:cursor-grabbing"
      } overflow-hidden shadow-lg before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/80 before:via-transparent before:to-black/30 before:z-10
      active:shadow-inner active:brightness-90 active:scale-[0.98] transition-[shadow,brightness,scale] duration-200`}
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

      <InfoOverlay content={content} isExpanded={isExpanded} reward={reward} />
      <BettingIndicator betAmount={betAmount} isHolding={isHolding} />
      <FloatingParticles />
    </Card>
  );
};
