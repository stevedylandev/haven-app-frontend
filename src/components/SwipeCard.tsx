import React, { useState, useEffect } from "react";
import { Content, ActionChoice, UserReward } from "../types";
import { BettingControls } from "./swipe-card/BettingControls";
import { ActionButtons } from "./swipe-card/ActionButtons";
import { useSwipeGesture } from "../hooks/useSwipeGesture";
import { useBetting } from "../hooks/useBetting";
import { useVideoExpansion } from "../hooks/useVideoExpansion";
import { StackedCard } from "./swipe-card/StackedCard";

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
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );
  const [stackCards, setStackCards] = useState<Content[]>([]);

  // Initialize stack cards
  useEffect(() => {
    setStackCards([
      { ...content, id: "stack-1" },
      { ...content, id: "stack-2" },
    ]);
  }, [content.id]); // Reset stack when main content changes

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

  const handleSwipeComplete = (direction: "left" | "right", amount: number) => {
    setSwipeDirection(direction);

    // Wait for swipe animation to complete
    setTimeout(() => {
      // Shift stack cards up
      setStackCards((prevCards) => {
        const newCards = [...prevCards];
        newCards.pop(); // Remove last card
        newCards.unshift({ ...content, id: `stack-${Date.now()}` }); // Add new card at bottom
        return newCards;
      });

      onSwipe(direction, amount);
      resetBetAmount();
      setSwipeDirection(null);
    }, 200);
  };

  const { handlers } = useSwipeGesture({
    onSwipe: handleSwipeComplete,
    isExpanded,
    disabled,
    betAmount,
    onBetReset: resetBetAmount,
  });

  const enhancedHandlers = {
    ...handlers,
    onMouseDown: (e: React.MouseEvent) => {
      if (!isExpanded && !disabled) {
        startIncrementing();
      }
      handlers.onMouseDown(e);
    },
    onMouseUp: () => {
      if (!isExpanded) {
        stopIncrementing();
      }
      handlers.onMouseUp?.();
    },
    onMouseLeave: () => {
      if (!isExpanded) {
        stopIncrementing();
      }
      handlers.onMouseLeave();
    },
    onTouchStart: (
      e: React.TouchEvent<Element> | React.MouseEvent<Element>
    ) => {
      if (!isExpanded && !disabled && "touches" in e) {
        startIncrementing();
      }
      handlers.onTouchStart?.(e);
    },
    onTouchEnd: () => {
      if (!isExpanded) {
        stopIncrementing();
      }
      handlers.onTouchEnd();
    },
    onMouseMove: (e: React.MouseEvent) => {
      if ("touches" in e) return;
      handlers.onMouseMove(e);
    },
  };

  React.useImperativeHandle(ref, () => ({
    setIsVideoLoaded: (value: boolean) => {
      setIsVideoLoaded(value);
    },
  }));

  return (
    <div
      ref={cardRef}
      className={`transition-all max-sm:h-full duration-300 touch-none ${
        isExpanded
          ? "fixed inset-0 z-[100] m-0 p-0 bg-black flex items-center justify-center h-[100dvh] w-screen"
          : "absolute left-1/2 top-0 sm:top-4 -translate-x-1/2 w-full max-w-sm aspect-[9/16]"
      } ${disabled ? "opacity-50 cursor-not-allowed select-none" : ""}`}
    >
      {/* Stack of cards */}
      {stackCards.map((stackContent, index) => (
        <StackedCard
          key={stackContent.id}
          content={stackContent}
          isExpanded={isExpanded}
          isVideoLoaded={false}
          isHolding={false}
          betAmount={0}
          index={index + 1}
          swipeDirection={null}
          isActive={false}
          onExpand={handleExpand}
          videoRef={videoRef}
          onVideoLoad={handleVideoLoad}
          reward={reward}
          handlers={enhancedHandlers}
        />
      ))}

      {/* Active card */}
      <StackedCard
        content={content}
        isExpanded={isExpanded}
        isVideoLoaded={isVideoLoaded}
        isHolding={isHolding}
        betAmount={betAmount}
        index={0}
        swipeDirection={swipeDirection}
        isActive={true}
        onExpand={handleExpand}
        videoRef={videoRef}
        onVideoLoad={handleVideoLoad}
        reward={reward}
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
            handleSwipeComplete("left", betAmount);
          }
        }}
        onRightClick={() => {
          if (!disabled) {
            handleSwipeComplete("right", betAmount);
          }
        }}
        disabled={disabled}
      />
    </div>
  );
});

SwipeCard.displayName = "SwipeCard";
