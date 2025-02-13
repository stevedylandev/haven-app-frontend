import { useState } from "react";
import { useSpring } from "@react-spring/web";
import { useHapticFeedback } from "./useHapticFeedback";

interface SwipeGestureProps {
  onSwipe: (direction: "left" | "right", betAmount: number) => void;
  isExpanded: boolean;
  disabled?: boolean;
  betAmount: number;
  onBetReset: () => void;
}

type GestureHandlers = {
  onTouchStart: (e: React.TouchEvent | React.MouseEvent) => void;
  onTouchMove: (e: React.TouchEvent | React.MouseEvent) => void;
  onTouchEnd: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
};

export const useSwipeGesture = ({
  onSwipe,
  isExpanded,
  disabled,
  betAmount,
  onBetReset,
}: SwipeGestureProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const haptic = useHapticFeedback();

  // Spring animation for the card
  const [{ x }, api] = useSpring(() => ({
    x: 0,
    config: {
      tension: 300,
      friction: 20,
      mass: 0.5,
    },
  }));

  // Threshold for swipe action (percentage of screen width)
  const SWIPE_THRESHOLD = 0.4;

  // Touch handling
  let startX = 0;
  let currentX = 0;
  let isSwiping = false;

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (isExpanded || disabled) return;

    setIsDragging(true);
    startX = "touches" in e ? e.touches[0].clientX : e.clientX;
    haptic.lightTap();
    isSwiping = false;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || isExpanded || disabled) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    currentX = clientX - startX;
    isSwiping = true;

    // Apply resistance as the card is dragged further
    const resistance = Math.abs(currentX) > 100 ? 0.5 : 1;
    const dampedX = currentX * resistance;

    // Animate the card position
    api.start({ x: dampedX });

    // Optional: Add subtle haptic feedback during drag
    if (Math.abs(currentX) % 50 === 0) {
      haptic.lightTap();
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || isExpanded || disabled) return;

    setIsDragging(false);
    const screenWidth = window.innerWidth;
    const swipePercentage = Math.abs(currentX) / screenWidth;

    if (swipePercentage > SWIPE_THRESHOLD) {
      // Determine swipe direction
      const direction = currentX > 0 ? "right" : "left";

      // Animate card off screen
      api.start({
        x: direction === "right" ? screenWidth : -screenWidth,
        config: { tension: 200, friction: 25 },
        onRest: () => {
          haptic.success();
          onSwipe(direction, betAmount);
          onBetReset();
          // Reset position after swipe
          api.start({ x: 0 });
        },
      });
    } else {
      // Return card to center if threshold not met
      api.start({
        x: 0,
        config: { tension: 250, friction: 20 },
        onRest: () => {
          if (swipePercentage > 0.1) {
            haptic.error();
          }
        },
      });
    }
  };

  const handleClick = () => {
    // Only trigger click if we haven't been swiping
    if (!isSwiping && !isExpanded && !disabled) {
      haptic.lightTap();
    }
  };

  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleTouchStart,
      onMouseMove: handleTouchMove,
      onMouseUp: handleTouchEnd,
      onMouseLeave: handleTouchEnd,
      onClick: handleClick,
    } as GestureHandlers,
    // Expose spring style for animations
    style: {
      x,
    },
    isDragging,
  };
};
