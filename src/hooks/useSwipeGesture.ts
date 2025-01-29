import { useState, useCallback, useRef } from "react";

interface SwipeGestureConfig {
  onSwipe: (direction: "left" | "right", betAmount: number) => void;
  isExpanded: boolean;
  disabled?: boolean;
  betAmount: number;
  onBetReset: () => void;
}

export const useSwipeGesture = ({
  onSwipe,
  isExpanded,
  disabled,
  betAmount,
  onBetReset,
}: SwipeGestureConfig) => {
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverSide, setHoverSide] = useState<"left" | "right" | null>(null);

  const startTime = useRef(0);
  const isVerticalScroll = useRef(false);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (isExpanded || disabled) return;

      if ("touches" in e) {
        const touch = e.touches[0];
        setStartX(touch.clientX);
        setStartY(touch.clientY);
        startTime.current = Date.now();
        isVerticalScroll.current = false;
        const target = e.currentTarget as HTMLElement;
        target.style.transition = "none";
      } else {
        setStartX(e.clientX);
      }

      setIsDragging(true);
    },
    [isExpanded, disabled]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!isDragging || isExpanded || disabled) return;

      if ("touches" in e) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;

        // Determine scroll direction on initial movement
        if (Math.abs(deltaX) < 10 && Math.abs(deltaY) > 10) {
          isVerticalScroll.current = true;
          setIsDragging(false);
          return;
        }

        if (!isVerticalScroll.current) {
          e.preventDefault(); // Prevent vertical scrolling during swipe
          setCurrentX(deltaX);
        }
      } else {
        setCurrentX(e.clientX - startX);
      }
    },
    [isDragging, isExpanded, disabled, startX, startY]
  );

  const handleTouchEnd = useCallback(
    (e?: React.TouchEvent | React.MouseEvent) => {
      if (!isDragging || isExpanded) return;
      setIsDragging(false);

      const swipeTime = Date.now() - startTime.current;
      const velocity = Math.abs(currentX) / swipeTime;
      const screenWidth = window.innerWidth;
      const swipeThreshold = Math.min(screenWidth * 0.25, 100); // 25% of screen width or 100px

      if (Math.abs(currentX) > swipeThreshold || velocity > 0.5) {
        onSwipe(currentX > 0 ? "right" : "left", betAmount);
        onBetReset();
      }

      setCurrentX(0);
      if (e?.currentTarget) {
        const target = e.currentTarget as HTMLElement;
        target.style.transition = "transform 0.2s ease-out";
      }
    },
    [isDragging, isExpanded, currentX, onSwipe, betAmount, onBetReset]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging || isExpanded) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setHoverSide(x < rect.width / 2 ? "left" : "right");
    },
    [isDragging, isExpanded]
  );

  const handleMouseLeave = useCallback(() => {
    setHoverSide(null);
  }, []);

  // Click handler removed to prevent swipes on desktop clicks
  const handleClick = useCallback(() => {
    // Do nothing - clicks should not trigger swipes
  }, []);

  const transform = isDragging
    ? `translateX(${currentX}px) rotate(${currentX * 0.1}deg)`
    : hoverSide === "left"
    ? "translateX(-20px) rotate(-2deg)"
    : hoverSide === "right"
    ? "translateX(20px) rotate(2deg)"
    : "";

  const opacity = isDragging ? Math.max(0, 1 - Math.abs(currentX) / 500) : 1;

  return {
    transform,
    opacity,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleTouchStart,
      onMouseMove: (e: React.MouseEvent) => {
        handleTouchMove(e);
        handleMouseMove(e);
      },
      onMouseUp: handleTouchEnd,
      onMouseLeave: handleMouseLeave,
      onClick: handleClick,
    },
  };
};
