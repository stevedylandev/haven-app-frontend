import React, { useState, useRef, useEffect } from "react";
import { Content, ActionChoice, UserReward } from "../types";
import { MediaDisplay } from "./swipe-card/MediaDisplay";
import { BettingControls } from "./swipe-card/BettingControls";
import { ActionButtons } from "./swipe-card/ActionButtons";

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
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverSide, setHoverSide] = useState<"left" | "right" | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [betAmount, setBetAmount] = useState(0);
  const [isHolding, setIsHolding] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const incrementIntervalRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const lastIncrementTimeRef = useRef<number>();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.src =
      "data:audio/wav;base64,UklGRkQFAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YSAFAACAgICAgICAgICAgICAgICAgICAgICAgIB/f3+AgICAgICAgICAgICA"; // Short click sound
    audio.volume = 0.2;
    audioRef.current = audio;
  }, []);

  React.useImperativeHandle(ref, () => ({
    setIsVideoLoaded: (value: boolean) => {
      setIsVideoLoaded(value);
    },
  }));

  const playTickSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const calculateBetIncrement = (elapsedTime: number): number => {
    const baseSpeed = 1; // Base points per second
    const acceleration = 0.5; // Additional points per second²
    const currentSpeed = baseSpeed + (acceleration * elapsedTime) / 1000;
    return Math.min(currentSpeed / 60, 0.5); // Convert to points per frame (60fps)
  };

  const startIncrementing = () => {
    if (incrementIntervalRef.current || isExpanded || disabled) return;

    setIsHolding(true);
    startTimeRef.current = Date.now();
    lastIncrementTimeRef.current = Date.now();

    const incrementTick = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - (startTimeRef.current || 0);
      const timeSinceLastIncrement =
        currentTime - (lastIncrementTimeRef.current || 0);
      const incrementAmount =
        calculateBetIncrement(elapsedTime) * timeSinceLastIncrement;

      if (betAmount < reward.points) {
        // Only increment if we've accumulated at least 1 point
        if (incrementAmount >= 1) {
          setBetAmount((prev) => Math.min(prev + 1, reward.points));
          playTickSound();
          lastIncrementTimeRef.current = currentTime;
        }
        incrementIntervalRef.current = requestAnimationFrame(incrementTick);
      }
    };

    incrementIntervalRef.current = requestAnimationFrame(incrementTick);
  };

  const stopIncrementing = () => {
    if (incrementIntervalRef.current) {
      cancelAnimationFrame(incrementIntervalRef.current);
      incrementIntervalRef.current = undefined;
    }
    setIsHolding(false);
  };

  React.useEffect(() => {
    function updateDimensions() {
      if (!cardRef.current || !videoRef.current) return;

      if (isExpanded) {
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const video = videoRef.current;
        const videoRatio = video.videoWidth / video.videoHeight;

        const maxHeight = viewportHeight * 0.9;
        const maxWidth = viewportWidth;

        let width, height;

        if (maxWidth / maxHeight > videoRatio) {
          height = maxHeight;
          width = height * videoRatio;
        } else {
          width = maxWidth;
          height = width / videoRatio;
        }

        cardRef.current.style.width = `${width}px`;
        cardRef.current.style.height = `${height}px`;
      } else {
        cardRef.current.style.width = "";
        cardRef.current.style.height = "";
      }
    }

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, [isExpanded]);

  const handleExpand = async () => {
    const video = videoRef.current;
    if (!video) return;

    setIsExpanded(!isExpanded);

    try {
      if (!isExpanded) {
        video.muted = false;
        await video.play();
      } else {
        video.muted = true;
      }
    } catch (error) {
      console.error("Failed to play video:", error);
    }
  };

  const handleBetIncrement = () => {
    setBetAmount((prev) => Math.min(prev + 1, reward.points));
  };

  const handleBetDecrement = () => {
    setBetAmount((prev) => Math.max(prev - 1, 0));
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (isExpanded || disabled) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setIsDragging(true);
    startIncrementing();
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || isExpanded || disabled) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setCurrentX(clientX - startX);
  };

  const handleTouchEnd = () => {
    if (!isDragging || isExpanded) return;
    setIsDragging(false);
    stopIncrementing();

    if (Math.abs(currentX) > 100) {
      onSwipe(currentX > 0 ? "right" : "left", betAmount);
      setBetAmount(0); // Reset bet amount after swipe
    }

    setCurrentX(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging || isExpanded) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setHoverSide(x < rect.width / 2 ? "left" : "right");
  };

  const handleMouseLeave = () => {
    setHoverSide(null);
    stopIncrementing();
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging || disabled) return;
    if (!isExpanded) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      onSwipe(x < rect.width / 2 ? "left" : "right", betAmount);
      setBetAmount(0); // Reset bet amount after swipe
    }
  };

  const transform = isDragging
    ? `translateX(${currentX}px) rotate(${currentX * 0.1}deg)`
    : hoverSide === "left"
    ? "translateX(-20px) rotate(-2deg)"
    : hoverSide === "right"
    ? "translateX(20px) rotate(2deg)"
    : "";

  const opacity = isDragging ? Math.max(0, 1 - Math.abs(currentX) / 500) : 1;

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-300 ${
        isExpanded
          ? "fixed left-0 top-4 z-50 m-0 p-0"
          : "absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-sm aspect-[9/16]"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div
        className={`absolute inset-0 bg-black border-2 ${
          isHolding ? "border-yellow-500" : "border-red-500"
        } rounded-2xl transition-all duration-200 ${
          isExpanded ? "cursor-zoom-out" : "cursor-grab"
        }`}
        style={{ transform: isExpanded ? "none" : transform, opacity }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={(e) => {
          handleTouchMove(e);
          handleMouseMove(e);
        }}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <MediaDisplay
          content={content}
          isExpanded={isExpanded}
          isVideoLoaded={isVideoLoaded}
          onExpand={handleExpand}
          videoRef={videoRef}
          onVideoLoad={() => setIsVideoLoaded(true)}
        />

        {/* Betting indicator overlay */}
        {isHolding && (
          <div className="absolute inset-0 bg-yellow-500 bg-opacity-10 animate-pulse pointer-events-none">
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-4 py-2 rounded-full">
              <span className="text-yellow-500 font-bold text-2xl">
                {Math.floor(betAmount)}
              </span>
            </div>
          </div>
        )}
      </div>

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
            setBetAmount(0);
          }
        }}
        onRightClick={() => {
          if (!disabled) {
            onSwipe("right", betAmount);
            setBetAmount(0);
          }
        }}
        disabled={disabled}
      />

      {/* Floating particles animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-50 animate-float"></div>
        <div className="absolute w-3 h-3 bg-red-500 rounded-full opacity-60 animate-float delay-1000"></div>
        <div className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-50 animate-float delay-2000"></div>
      </div>
    </div>
  );
});

SwipeCard.displayName = "SwipeCard";
