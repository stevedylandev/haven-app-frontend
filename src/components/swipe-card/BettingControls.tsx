import React, { useState, useRef, useEffect } from "react";
import { Coins } from "lucide-react";
import { UserReward } from "../../types";
import { StackOfChipsIcon } from "./icons";

interface BettingControlsProps {
  betAmount: number;
  reward: UserReward;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const BettingControls: React.FC<BettingControlsProps> = ({
  betAmount,
  reward,
  onIncrement,
  onDecrement,
}) => {
  const [isHolding, setIsHolding] = useState(false);
  const [displayedBet, setDisplayedBet] = useState(betAmount);
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

  // Sync displayed bet with actual bet smoothly
  useEffect(() => {
    setDisplayedBet(betAmount);
  }, [betAmount]);

  const playTickSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const calculateBetIncrement = (elapsedTime: number): number => {
    // Accelerate betting speed over time
    const baseSpeed = 1; // Base points per second
    const acceleration = 0.5; // Additional points per second²
    const currentSpeed = baseSpeed + (acceleration * elapsedTime) / 1000;
    return Math.min(currentSpeed / 60, 0.5); // Convert to points per frame (60fps)
  };

  const startIncrementing = () => {
    if (incrementIntervalRef.current) return;

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
          onIncrement();
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

  return (
    <div className="absolute bottom-20 left-0 right-0 px-4">
      <div className="flex justify-center items-center space-x-4">
        {/* Decrease Bet Button */}
        <button
          onClick={onDecrement}
          className="relative bg-gradient-to-br from-red-700 to-red-500 hover:from-red-500 hover:to-red-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none shadow-md transition-transform active:scale-95"
          title="Decrement Bet"
        >
          <Coins className="w-6 h-6" />
          <span className="absolute top-0 left-0 w-full h-full rounded-full pointer-events-none opacity-0 hover:opacity-20 bg-white"></span>
        </button>

        {/* Bet Amount Display */}
        <span className="text-yellow-500 font-bold text-6xl shadow-md">
          {Math.floor(displayedBet)}
        </span>

        {/* Increase Bet Button */}
        <button
          onMouseDown={startIncrementing}
          onMouseUp={stopIncrementing}
          onMouseLeave={stopIncrementing}
          onTouchStart={startIncrementing}
          onTouchEnd={stopIncrementing}
          className={`relative bg-gradient-to-br from-yellow-500 to-yellow-700 hover:from-yellow-700 hover:to-yellow-500 text-red-900 font-bold py-2 px-4 rounded-full focus:outline-none shadow-md transition-all duration-150 ${
            isHolding ? "scale-110 shadow-lg" : "active:scale-95"
          }`}
          title="Hold to increase bet"
        >
          <StackOfChipsIcon
            className={`w-6 h-6 ${isHolding ? "animate-pulse" : ""}`}
          />
          <span className="absolute top-0 left-0 w-full h-full rounded-full pointer-events-none opacity-0 hover:opacity-20 bg-white"></span>
        </button>
      </div>

      {/* Bet Amount Range Indicator (Progress Bar) */}
      <div className="mt-2 bg-gray-700 rounded-full h-2 relative overflow-hidden">
        <div
          className={`bg-gradient-to-r from-red-500 to-yellow-500 rounded-full h-2 transition-all duration-150 ${
            isHolding ? "animate-pulse" : ""
          }`}
          style={{ width: `${(betAmount / reward.points) * 100}%` }}
        />
        <span className="absolute left-0 top-full mt-1 text-white text-sm">
          0
        </span>
        <span className="absolute right-0 top-full mt-1 text-white text-xs">
          max: {reward.points}
        </span>
      </div>
    </div>
  );
};
