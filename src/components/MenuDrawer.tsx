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
        className="w-72 bg-gray-800 text-white border-r-gray-700"
      >
        <SheetHeader>
          <SheetTitle className="text-white">Your Rewards</SheetTitle>
          <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetHeader>
        <div className="mt-4">
          <RewardDisplay reward={reward} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
