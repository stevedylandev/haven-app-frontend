import React from "react";
import { ActionChoice } from "../../types";
import { LeftArrowIcon, RightArrowIcon } from "./icons";

interface ActionButtonsProps {
  leftAction: ActionChoice;
  rightAction: ActionChoice;
  onLeftClick: () => void;
  onRightClick: () => void;
  disabled?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  leftAction,
  rightAction,
  onLeftClick,
  onRightClick,
  disabled,
}) => {
  return (
    <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-between items-center">
      {/* Left Action Button */}
      <button
        onClick={onLeftClick}
        className={`relative bg-gradient-to-br from-red-700 to-red-500 hover:from-red-500 hover:to-red-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none shadow-md overflow-hidden transition-transform active:scale-95 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={disabled}
      >
        <LeftArrowIcon
          fill="currentColor"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6"
        />
        <span className="ml-3">{leftAction.label}</span>
        <span className="absolute top-0 left-0 w-full h-full rounded-full pointer-events-none opacity-0 hover:opacity-10 bg-white"></span>
        <span
          className="absolute top-0 left-0 w-full h-full bg-white transform scale-0 rounded-full pointer-events-none duration-500 ease-out"
          style={{ animation: "pulse-glow 1s ease-out infinite" }}
        ></span>
      </button>

      {/* Right Action Button */}
      <button
        onClick={onRightClick}
        className={`relative bg-gradient-to-br from-yellow-500 to-yellow-700 hover:from-yellow-700 hover:to-yellow-500 text-red-900 font-bold py-3 px-6 rounded-full focus:outline-none shadow-md overflow-hidden transition-transform active:scale-95 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={disabled}
      >
        <span className="mr-3">{rightAction.label}</span>
        <RightArrowIcon
          fill="currentColor"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6"
        />
        <span className="absolute top-0 left-0 w-full h-full rounded-full pointer-events-none opacity-0 hover:opacity-10 bg-white"></span>
        <span
          className="absolute top-0 left-0 w-full h-full bg-white transform scale-0 rounded-full pointer-events-none duration-500 ease-out"
          style={{ animation: "pulse-glow 1s ease-out infinite" }}
        ></span>
      </button>
    </div>
  );
};
