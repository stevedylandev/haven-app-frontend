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
    <div className="absolute inset-0 bg-yellow-500 bg-opacity-10 animate-pulse pointer-events-none">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-4 py-2 rounded-full">
        <span className="text-yellow-500 font-bold text-2xl">
          {Math.floor(betAmount)}
        </span>
      </div>
    </div>
  );
};
