import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
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
  // onIncrement,
  onDecrement,
}) => {
  const [isHolding] = useState(false);
  const [displayedBet, setDisplayedBet] = useState(betAmount);

  // Prevent redundant updates and rerenders
  const prevBetAmount = useRef(betAmount);
  const touchStartRef = useRef<number>(0);
  const isButtonPressedRef = useRef(false);
  const animationFrameRef = useRef<number>();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.src =
      "data:audio/wav;base64,UklGRkQFAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YSAFAACAgICAgICAgICAgICAgICAgICAgICAgIB/f3+AgICAgICAgICAgICA"; // Short click sound
    audio.volume = 0.2;
    audioRef.current = audio;

    return () => {
      // Clean up any resources
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Sync displayed bet with actual bet using requestAnimationFrame for smoother transitions
  useEffect(() => {
    if (prevBetAmount.current !== betAmount) {
      setDisplayedBet(betAmount);
      prevBetAmount.current = betAmount;
    }
  }, [betAmount]);

  // Memoize percentage calculation to prevent unnecessary recalculations
  const progressPercentage = useMemo(() => {
    return (betAmount / reward.points) * 100;
  }, [betAmount, reward.points]);

  const startTouchTime = useCallback(() => {
    // Track touch/click start time to prevent accidental triggers
    touchStartRef.current = Date.now();
    isButtonPressedRef.current = true;
  }, []);

  const endTouchTime = useCallback(() => {
    isButtonPressedRef.current = false;
  }, []);

  // Use passive touch events when possible for better mobile performance
  const touchProps = useMemo(
    () => ({
      onMouseDown: startTouchTime,
      onMouseUp: endTouchTime,
      onMouseLeave: endTouchTime,
      onTouchStart: startTouchTime,
      onTouchEnd: endTouchTime,
    }),
    [startTouchTime, endTouchTime]
  );

  return (
    <div className="absolute bottom-20 left-0 right-0 px-4 will-change-transform">
      <div className="flex justify-center items-center space-x-6">
        {/* Decrease Bet Button */}
        <button
          onClick={onDecrement}
          className="relative bg-gradient-to-br from-red-500/5 via-transparent to-red-500/5 backdrop-blur-sm border border-white/10 text-white font-bold p-2 rounded-full focus:outline-none shadow-lg transition-transform duration-200 hover:bg-red-500/40 hover:scale-105 active:scale-95"
          title="Decrement Bet"
        >
          <Minus className="w-6 h-6" />
          <span className="absolute inset-0 rounded-full pointer-events-none opacity-0 hover:opacity-10 bg-white" />
        </button>

        {/* Bet Amount Display - Optimized with hardware acceleration */}
        <div className="relative will-change-contents">
          <span className="text-white font-medium text-5xl drop-shadow-glow">
            {Math.floor(displayedBet)}
          </span>
          <div className="absolute -inset-4 bg-yellow-500/20 blur-xl -z-10" />
        </div>

        {/* Increase Bet Button */}
        <button
          {...touchProps}
          className={`relative bg-transparent from-yellow-500/5 via-transparent to-yellow-500/5 backdrop-blur-sm border border-white/10 text-white font-bold p-2 rounded-full focus:outline-none shadow-lg transition-transform duration-200 hover:bg-yellow-500/40 ${
            isHolding
              ? "scale-110 shadow-xl ring-2 ring-yellow-500/50"
              : "hover:scale-105 active:scale-95"
          }`}
          title="Hold to increase bet"
        >
          <PlusIcon className="w-6 h-6" />
          <span className="absolute inset-0 rounded-full pointer-events-none opacity-0 hover:opacity-10 bg-white" />
          <span className="absolute inset-0 bg-white transform scale-0 rounded-full pointer-events-none" />
        </button>
      </div>

      {/* Bet Amount Range Indicator - Optimized with hardware acceleration */}
      <div className="mt-4 rounded-full h-3 relative overflow-hidden border border-white/10 will-change-contents">
        <div
          className="bg-gradient-to-r from-red-500/80 via-yellow-500/80 to-yellow-500/80 rounded-full h-full transform-gpu"
          style={{
            width: `${progressPercentage}%`,
            transition: isHolding
              ? "width 100ms linear"
              : "width 300ms ease-out",
          }}
        />
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
