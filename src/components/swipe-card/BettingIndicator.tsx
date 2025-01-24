import React from "react";

interface BettingIndicatorProps {
  betAmount: number;
  isHolding: boolean;
}

export const BettingIndicator: React.FC<BettingIndicatorProps> = ({
  betAmount,
  isHolding,
}) => {
  if (!isHolding) return null;

  return (
    <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent animate-pulse pointer-events-none">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 backdrop-blur-md bg-white/10 px-6 py-3 rounded-full shadow-lg ring-1 ring-white/20">
        <div className="relative">
          <span className="text-white font-bold text-2xl drop-shadow-glow animate-float">
            {Math.floor(betAmount)}
          </span>
          <div className="absolute -inset-1 bg-yellow-500/30 blur-md -z-10" />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 via-transparent to-transparent" />
    </div>
  );
};
