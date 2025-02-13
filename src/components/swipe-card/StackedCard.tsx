import React from "react";
import { animated, useSpring } from "@react-spring/web";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Content, UserReward } from "../../types";
import { Card } from "@/components/ui/card";
import { MediaDisplay } from "./MediaDisplay";
import { BettingIndicator } from "./BettingIndicator";
import { FloatingParticles } from "./FloatingParticles";
import { InfoOverlay } from "./InfoOverlay";

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
}) => {
  // Motion values for interactive animations
  const x = useMotionValue(0);
  const scale = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8]);
  const dragOpacity = useTransform(
    x,
    [-300, -200, 0, 200, 300],
    [0.3, 0.7, 1, 0.7, 0.3]
  );
  // Spring animations
  const springStyle = useSpring({
    transform: `
      translateY(${isActive ? 0 : index * 20}px)
      scale(${isActive ? 1 : 0.95 - index * 0.05})
      translateX(${
        swipeDirection === "left" ? -500 : swipeDirection === "right" ? 500 : 0
      }px)
    `,
    opacity: isActive
      ? swipeDirection
        ? 0 // Fade out when swiping
        : 1 // Full opacity when not swiping
      : Math.max(0.6 - index * 0.2, 0), // Stacked cards opacity
    immediate: isExpanded,
    config: {
      tension: 500,
      friction: 30,
      // Slower animation for opacity to create smooth fade
      opacity: { tension: 200, friction: 20 },
    },
  });

  return (
    <animated.div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        willChange: "transform",
        ...springStyle,
      }}
    >
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          x: isActive ? x : 0,
          scale: isActive ? scale : 1,
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
          {...(isActive ? handlers : {})}
        >
          <MediaDisplay
            content={content}
            isExpanded={isExpanded}
            isVideoLoaded={isVideoLoaded}
            onExpand={onExpand}
            videoRef={videoRef}
            onVideoLoad={onVideoLoad}
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
      </motion.div>
    </animated.div>
  );
};
