import React from "react";
import { Content, ActionChoice, UserReward } from "../types";
import { CardContainer } from "./swipe-card/CardContainer";
import { BettingControls } from "./swipe-card/BettingControls";
import { ActionButtons } from "./swipe-card/ActionButtons";
import { useSwipeGesture } from "../hooks/useSwipeGesture";
import { useBetting } from "../hooks/useBetting";
import { useVideoExpansion } from "../hooks/useVideoExpansion";

export interface SwipeCardProps {
  content: Content;
  leftAction: ActionChoice;
  rightAction: ActionChoice;
  onSwipe: (direction: "left" | "right", betAmount: number) => void;
  reward: UserReward;
  disabled?: boolean;
}

export interface SwipeCardPublicMethods {
  setIsVideoLoaded: (value: boolean) => void;
}

export const SwipeCard = React.forwardRef<
  SwipeCardPublicMethods,
  SwipeCardProps
>(({ content, leftAction, rightAction, onSwipe, reward, disabled }, ref) => {
  const {
    isExpanded,
    isVideoLoaded,
    videoRef,
    cardRef,
    handleExpand,
    handleVideoLoad,
    setIsVideoLoaded,
  } = useVideoExpansion({
    onVideoLoad: () => void 0,
  });

  const {
    betAmount,
    isHolding,
    startIncrementing,
    stopIncrementing,
    handleBetIncrement,
    handleBetDecrement,
    resetBetAmount,
  } = useBetting({
    reward,
    isExpanded,
    disabled,
  });

  const { transform, opacity, handlers } = useSwipeGesture({
    onSwipe,
    isExpanded,
    disabled,
    betAmount,
    onBetReset: resetBetAmount,
  });

  React.useImperativeHandle(ref, () => ({
    setIsVideoLoaded: (value: boolean) => {
      setIsVideoLoaded(value);
    },
  }));

  const enhancedHandlers = {
    ...handlers,
    onMouseDown: (e: React.TouchEvent | React.MouseEvent) => {
      handlers.onMouseDown(e);
      startIncrementing();
    },
    onMouseLeave: () => {
      handlers.onMouseLeave();
      stopIncrementing();
    },
    onTouchEnd: () => {
      handlers.onTouchEnd();
      stopIncrementing();
    },
    onMouseMove: (e: React.MouseEvent) => {
      if ("touches" in e) return;
      handlers.onMouseMove(e);
    },
  };

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-300 ${
        isExpanded
          ? "fixed left-0 top-4 z-50 m-0 p-0"
          : "absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-sm aspect-[9/16]"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <CardContainer
        content={content}
        isExpanded={isExpanded}
        isVideoLoaded={isVideoLoaded}
        isHolding={isHolding}
        betAmount={betAmount}
        transform={transform}
        opacity={opacity}
        onExpand={handleExpand}
        videoRef={videoRef}
        onVideoLoad={handleVideoLoad}
        handlers={enhancedHandlers}
      />

      <BettingControls
        betAmount={betAmount}
        reward={reward}
        onIncrement={handleBetIncrement}
        onDecrement={handleBetDecrement}
      />

      <ActionButtons
        leftAction={leftAction}
        rightAction={rightAction}
        onLeftClick={() => {
          if (!disabled) {
            onSwipe("left", betAmount);
            resetBetAmount();
          }
        }}
        onRightClick={() => {
          if (!disabled) {
            onSwipe("right", betAmount);
            resetBetAmount();
          }
        }}
        disabled={disabled}
      />
    </div>
  );
});

SwipeCard.displayName = "SwipeCard";
