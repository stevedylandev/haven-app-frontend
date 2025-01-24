import React from "react";
import { RewardDisplay } from "./RewardDisplay";
import { UserReward } from "../types";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reward: UserReward;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  reward,
}) => {
  const menuClasses = `fixed top-0 left-0 h-full w-72 bg-gray-800 text-white shadow-md transform transition-transform duration-300 ease-in-out z-[9999] ${
    isOpen ? "translate-x-0" : "-translate-x-full"
  }`;

  const backdropClasses = `fixed top-0 left-0 h-full w-full bg-black/50 z-[9998] transition-opacity duration-300 ease-in-out ${
    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
  }`;

  return (
    <>
      {isOpen && <div className={backdropClasses} onClick={onClose} />}
      <div className={menuClasses}>
        <div className="p-4 relative">
          <button onClick={onClose} className="absolute top-2 right-2">
            <svg
              className="h-6 w-6 fill-current text-white"
              viewBox="0 0 24 24"
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
          <RewardDisplay reward={reward} />
        </div>
      </div>
    </>
  );
};
