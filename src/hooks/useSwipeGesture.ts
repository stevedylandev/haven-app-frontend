import { useState, useCallback } from "react";

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
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverSide, setHoverSide] = useState<"left" | "right" | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (isExpanded || disabled) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      setStartX(clientX);
      setIsDragging(true);
    },
    [isExpanded, disabled]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!isDragging || isExpanded || disabled) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      setCurrentX(clientX - startX);
    },
    [isDragging, isExpanded, disabled, startX]
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDragging || isExpanded) return;
    setIsDragging(false);

    if (Math.abs(currentX) > 100) {
      onSwipe(currentX > 0 ? "right" : "left", betAmount);
      onBetReset();
    }

    setCurrentX(0);
  }, [isDragging, isExpanded, currentX, onSwipe, betAmount, onBetReset]);

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

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging || disabled) return;
      if (!isExpanded) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        onSwipe(x < rect.width / 2 ? "left" : "right", betAmount);
        onBetReset();
      }
    },
    [isDragging, disabled, isExpanded, onSwipe, betAmount, onBetReset]
  );

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
