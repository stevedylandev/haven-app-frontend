import React, { useState, useRef, useEffect } from "react";
import { Minus, PlusIcon } from "lucide-react";
import { UserReward } from "../../types";

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
    <div className="absolute bottom-20 left-0 right-0 px-4 ">
      <div className="flex justify-center items-center space-x-6">
        {/* Decrease Bet Button */}
        <button
          onClick={onDecrement}
          className="relative bg-gradient-to-br from-red-500/5 via-transparent to-red-500/5 backdrop-blur-sm border border-white/10 text-white font-bold p-2 rounded-full focus:outline-none shadow-lg transition-all duration-300 hover:bg-red-500/40 hover:scale-105 active:scale-95"
          title="Decrement Bet"
        >
          <Minus className="w-6 h-6" />
          <span className="absolute inset-0 rounded-full pointer-events-none opacity-0 hover:opacity-10 bg-white" />
          <span
            className="absolute inset-0 bg-white transform scale-0 rounded-full pointer-events-none duration-500 ease-out"
            style={{ animation: "pulse-glow 1s ease-out infinite" }}
          />
        </button>

        {/* Bet Amount Display */}
        <div className="relative">
          <span className="text-white font-medium text-5xl drop-shadow-glow">
            {Math.floor(displayedBet)}
          </span>
          <div className="absolute -inset-4 bg-yellow-500/20 blur-xl -z-10" />
        </div>

        {/* Increase Bet Button */}
        <button
          onMouseDown={startIncrementing}
          onMouseUp={stopIncrementing}
          onMouseLeave={stopIncrementing}
          onTouchStart={startIncrementing}
          onTouchEnd={stopIncrementing}
          className={`relative bg-transparent from-yellow-500/5 via-transparent to-yellow-500/5 backdrop-blur-sm border border-white/10 text-white font-bold p-2 rounded-full focus:outline-none shadow-lg transition-all duration-300 hover:bg-yellow-500/40 ${
            isHolding
              ? "scale-110 shadow-xl ring-2 ring-yellow-500/50"
              : "hover:scale-105 active:scale-95"
          }`}
          title="Hold to increase bet"
        >
          <PlusIcon className="w-6 h-6" />
          <span className="absolute inset-0 rounded-full pointer-events-none opacity-0 hover:opacity-10 bg-white" />
          <span
            className="absolute inset-0 bg-white transform scale-0 rounded-full pointer-events-none duration-500 ease-out"
            style={{ animation: "pulse-glow 1s ease-out infinite" }}
          />
        </button>
      </div>

      {/* Bet Amount Range Indicator (Progress Bar) */}
      <div className="mt-4  rounded-full h-3 relative overflow-hidden border border-white/10">
        <div
          className={`bg-gradient-to-r from-red-500/80 via-yellow-500/80 to-yellow-500/80 rounded-full h-full transition-all duration-150 ${
            isHolding ? "animate-pulse" : ""
          }`}
          style={{ width: `${(betAmount / reward.points) * 100}%` }}
        />
        {/* <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" /> */}
        <div className="flex justify-between px-2 mt-2">
          <span className="text-white/70 text-xs font-medium">0</span>
          <span className="text-white/70 text-xs font-medium">
            max: {reward.points}
          </span>
        </div>
      </div>
    </div>
  );
};
