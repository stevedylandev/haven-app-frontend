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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const incrementIntervalRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const lastIncrementTimeRef = useRef<number>();

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.src =
      "data:audio/wav;base64,UklGRkQFAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YSAFAACAgICAgICAgICAgICAgICAgICAgICAgIB/f3+AgICAgICAgICAgICA"; // Short click sound
    audio.volume = 1;
    audioRef.current = audio;
  }, []);

  const playTickSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  const calculateBetIncrement = useCallback((elapsedTime: number): number => {
    const baseSpeed = 1; // Base points per second
    const acceleration = 0.5; // Additional points per second²
    const currentSpeed = baseSpeed + (acceleration * elapsedTime) / 1000;
    return Math.min(currentSpeed / 60, 0.5); // Convert to points per frame (60fps)
  }, []);

  const startIncrementing = useCallback(() => {
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
  }, []);

  const handleBetIncrement = useCallback(() => {
    setBetAmount((prev) => Math.min(prev + 1, reward.points));
  }, [reward.points]);

  const handleBetDecrement = useCallback(() => {
    setBetAmount((prev) => Math.max(prev - 1, 0));
  }, []);

  const resetBetAmount = useCallback(() => {
    setBetAmount(0);
  }, []);

  return {
    betAmount,
    isHolding,
    startIncrementing,
    stopIncrementing,
    handleBetIncrement,
    handleBetDecrement,
    resetBetAmount,
  };
};
