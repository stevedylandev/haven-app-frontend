import React from "react";
import { animated, useSpring, to, SpringValue } from "@react-spring/web";
import { Content, UserReward } from "../../types";
import { Card } from "@/components/ui/card";
import { MediaDisplay } from "./MediaDisplay";
import { BettingIndicator } from "./BettingIndicator";
import { FloatingParticles } from "./FloatingParticles";
import { InfoOverlay } from "./InfoOverlay";

interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent | React.MouseEvent) => void;
  onTouchMove: (e: React.TouchEvent | React.MouseEvent) => void;
  onTouchEnd: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
  onClick: (e: React.MouseEvent) => void;
  style?: {
    x: SpringValue<number>;
  };
}

interface StackedCardProps {
  content: Content;
  isExpanded: boolean;
  isVideoLoaded: boolean;
  isHolding: boolean;
  betAmount: number;
  index: number;
  swipeDirection: "left" | "right" | null;
  isActive: boolean;
  onExpand: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  onVideoLoad: () => void;
  reward: UserReward;
  handlers: SwipeHandlers;
  isPrefetched?: boolean;
}

export const StackedCard: React.FC<StackedCardProps> = ({
  content,
  isExpanded,
  isVideoLoaded,
  isHolding,
  betAmount,
  index,
  swipeDirection,
  isActive,
  onExpand,
  videoRef,
  onVideoLoad,
  reward,
  handlers,
  isPrefetched = false,
}) => {
  // Main spring animation for card positioning and stacking
  const springStyle = useSpring({
    x: isActive ? handlers.style?.x || 0 : 0,
    y: isActive ? 0 : index * 20,
    scale: isActive ? 1 : 0.95 - index * 0.05,
    translateX:
      swipeDirection === "left" ? -500 : swipeDirection === "right" ? 500 : 0,
    opacity: isActive
      ? swipeDirection
        ? 0
        : 1
      : Math.max(0.6 - index * 0.2, 0),
    immediate: isExpanded,
    config: {
      tension: 500,
      friction: 30,
    },
  });

  // Calculate derived values for drag interactions
  const dragScale = to([springStyle.x], (x) => {
    const progress = Math.abs(x) / 200;
    return 1 - progress * 0.2;
  });

  const dragOpacity = to([springStyle.x], (x) => {
    const progress = Math.abs(x) / 300;
    return 1 - progress * 0.7;
  });

  const activeHandlers = isActive
    ? {
        onTouchStart: handlers.onTouchStart,
        onTouchMove: handlers.onTouchMove,
        onTouchEnd: handlers.onTouchEnd,
        onMouseDown: handlers.onMouseDown,
        onMouseMove: handlers.onMouseMove,
        onMouseUp: handlers.onMouseUp,
        onMouseLeave: handlers.onMouseLeave,
        onClick: handlers.onClick,
      }
    : {};

  return (
    <animated.div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        willChange: "transform",
        transform: to(
          [
            springStyle.x,
            springStyle.y,
            springStyle.scale,
            springStyle.translateX,
          ],
          (x, y, s, tx) => `translate3d(${x + tx}px, ${y}px, 0) scale(${s})`
        ),
        opacity: springStyle.opacity,
      }}
    >
      <animated.div
        style={{
          width: "100%",
          height: "100%",
          transform: to([dragScale], (s) => `scale(${isActive ? s : 1})`),
          opacity: isActive ? dragOpacity : 1,
        }}
      >
        <Card
          className={`relative w-full h-full border-none sm:rounded-xl backdrop-blur-[6px] bg-black/40 ${
            isHolding ? "ring-2 ring-yellow-500/70" : "ring-1 ring-white/10"
          } will-change-transform ${
            isExpanded
              ? "cursor-zoom-out"
              : "touch-none cursor-grab active:cursor-grabbing"
          } overflow-hidden shadow-lg before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/80 before:via-transparent before:to-black/30 before:z-10
          active:shadow-inner active:brightness-90 active:scale-[0.98] transition-[shadow,brightness,scale] duration-200`}
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
          }}
          {...activeHandlers}
        >
          <MediaDisplay
            content={content}
            isExpanded={isExpanded}
            isVideoLoaded={isVideoLoaded}
            onExpand={onExpand}
            videoRef={videoRef}
            onVideoLoad={onVideoLoad}
            isPrefetched={isPrefetched}
          />

          <InfoOverlay
            content={content}
            isExpanded={isExpanded}
            reward={reward}
          />
          {isActive && (
            <BettingIndicator betAmount={betAmount} isHolding={isHolding} />
          )}
          <FloatingParticles />
        </Card>
      </animated.div>
    </animated.div>
  );
};
