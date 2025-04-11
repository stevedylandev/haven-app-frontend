import { useState, useRef, useEffect, useCallback } from "react";
import { UserReward } from "../types";

interface UseBettingConfig {
  reward: UserReward;
  isExpanded: boolean;
  disabled?: boolean;
}

export const useBetting = ({
  reward,
  isExpanded,
  disabled,
}: UseBettingConfig) => {
  const [betAmount, setBetAmount] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [displayBetAmount, setDisplayBetAmount] = useState(0); // Separate visual state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const incrementIntervalRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const lastIncrementTimeRef = useRef<number>();
  const accumulatedIncrement = useRef<number>(0);
  const lastTickTime = useRef<number>(0);

  // Prevent multiple rapid calls
  const isProcessingRef = useRef(false);

  // Initialize audio element only once
  useEffect(() => {
    const audio = new Audio();
    audio.src =
      "data:audio/wav;base64,UklGRkQFAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YSAFAACAgICAgICAgICAgICAgICAgICAgICAgIB/f3+AgICAgICAgICAgICA"; // Short click sound
    audio.volume = 0.8;
    audioRef.current = audio;

    return () => {
      // Cleanup
      if (incrementIntervalRef.current) {
        cancelAnimationFrame(incrementIntervalRef.current);
      }
    };
  }, []);

  // Sync display with actual bet amount using requestAnimationFrame for smooth transitions
  useEffect(() => {
    setDisplayBetAmount(betAmount);
  }, [betAmount]);

  const playTickSound = useCallback(() => {
    if (audioRef.current) {
      // Don't play too frequently
      const now = performance.now();
      if (now - lastTickTime.current > 50) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
        lastTickTime.current = now;
      }
    }
  }, []);

  // Optimized calculation with memoization
  const calculateBetIncrement = useCallback((elapsedTime: number): number => {
    const baseSpeed = 1; // Base points per second
    const acceleration = 0.5; // Additional points per second²
    const currentSpeed = baseSpeed + (acceleration * elapsedTime) / 1000;
    return Math.min(currentSpeed / 60, 0.5); // Convert to points per frame (60fps)
  }, []);

  const startIncrementing = useCallback(() => {
    // Prevent multiple calls and respect constraints
    if (
      incrementIntervalRef.current ||
      isExpanded ||
      disabled ||
      isProcessingRef.current
    )
      return;

    isProcessingRef.current = true;
    setIsHolding(true);
    startTimeRef.current = performance.now();
    lastIncrementTimeRef.current = performance.now();
    accumulatedIncrement.current = 0;

    const incrementTick = () => {
      const currentTime = performance.now();
      const elapsedTime = currentTime - (startTimeRef.current || 0);
      const timeSinceLastIncrement =
        currentTime - (lastIncrementTimeRef.current || 0);

      // Accumulate the increment amount instead of updating state immediately
      accumulatedIncrement.current +=
        calculateBetIncrement(elapsedTime) * timeSinceLastIncrement;

      if (betAmount < reward.points) {
        // Only update state when we've accumulated at least 1 point
        if (accumulatedIncrement.current >= 1) {
          const incrementBy = Math.floor(accumulatedIncrement.current);
          setBetAmount((prev) => Math.min(prev + incrementBy, reward.points));
          playTickSound();
          accumulatedIncrement.current -= incrementBy;
          lastIncrementTimeRef.current = currentTime;
        }

        incrementIntervalRef.current = requestAnimationFrame(incrementTick);
      }
    };

    incrementIntervalRef.current = requestAnimationFrame(incrementTick);

    // Reset the processing flag after a short delay
    setTimeout(() => {
      isProcessingRef.current = false;
    }, 100);
  }, [
    isExpanded,
    disabled,
    betAmount,
    reward.points,
    calculateBetIncrement,
    playTickSound,
  ]);

  const stopIncrementing = useCallback(() => {
    if (incrementIntervalRef.current) {
      cancelAnimationFrame(incrementIntervalRef.current);
      incrementIntervalRef.current = undefined;
    }
    setIsHolding(false);
    isProcessingRef.current = false;
  }, []);

  const handleBetIncrement = useCallback(() => {
    if (disabled || isExpanded) return;
    setBetAmount((prev) => Math.min(prev + 1, reward.points));
  }, [reward.points, disabled, isExpanded]);

  const handleBetDecrement = useCallback(() => {
    if (disabled || isExpanded) return;
    setBetAmount((prev) => Math.max(prev - 1, 0));
  }, [disabled, isExpanded]);

  const resetBetAmount = useCallback(() => {
    setBetAmount(0);
    setDisplayBetAmount(0);
  }, []);

  return {
    betAmount: displayBetAmount, // Return the display amount for smoother UI
    isHolding,
    startIncrementing,
    stopIncrementing,
    handleBetIncrement,
    handleBetDecrement,
    resetBetAmount,
  };
};
