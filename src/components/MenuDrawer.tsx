import { RewardDisplay } from "./RewardDisplay";
import { UserReward } from "../types";
import { X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

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
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="left"
        className="w-80 bg-gradient-to-b from-gray-900/20 bg-transparent to-gray-800/10 backdrop-blur text-white border-r border-r-gray-700/50 p-6 shadow-2xl"
      >
        <SheetHeader className="pb-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold  text-white">
              Your Rewards
            </SheetTitle>
            <SheetClose className="relative rounded-full p-2 hover:bg-gray-700/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900">
              <X className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </div>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <RewardDisplay reward={reward} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
