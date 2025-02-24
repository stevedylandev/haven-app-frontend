import { RewardDisplay } from "./RewardDisplay";
import { UserReward, UserProfile } from "../types";
import { X, LogOut, LogIn, MessageSquare, Send } from "lucide-react";
import { Link } from "react-router-dom";
import UserProfileDisplay from "./auth/UserProfileDisplay";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { useEffect, useState } from "react";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reward: UserReward;
  showWallet: boolean;
  authenticated: boolean;
  ready: boolean;
  onLogin: () => void;
  onLogout: () => void;
  remainingClassifications: number;
  user: UserProfile | null;
}

const MenuContent = ({
  onClose,
  reward,
  showWallet,
  authenticated,
  ready,
  onLogin,
  onLogout,
  remainingClassifications,
  isMobile,
  user,
}: MenuDrawerProps & { isMobile: boolean }) => {
  const Title = isMobile ? DrawerTitle : SheetTitle;
  const Close = isMobile ? DrawerClose : SheetClose;
  const Header = isMobile ? DrawerHeader : SheetHeader;

  return (
    <>
      <Header className="pb-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <Title className="text-xl font-bold text-white">Menu</Title>
          <Close className="relative rounded-full p-2 hover:bg-gray-700/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900">
            <X className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
            <span className="sr-only">Close</span>
          </Close>
        </div>
      </Header>

      <div className="mt-6 space-y-6 overflow-y-auto">
        {authenticated && user && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Profile</h3>
            <UserProfileDisplay user={user} />
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Your Progress</h3>
          <RewardDisplay reward={reward} />
          <p className="text-sm text-white/60">
            {remainingClassifications} more clips to submit
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Account</h3>
          {showWallet && (
            <div className="flex flex-col gap-2">
              {authenticated ? (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors focus:ring-2 focus:ring-white focus:outline-none"
                  aria-label="Log out of account"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </button>
              ) : (
                <button
                  disabled={!ready}
                  onClick={onLogin}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors disabled:opacity-50 focus:ring-2 focus:ring-white focus:outline-none"
                  aria-label="Log in to account"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Log in</span>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Community</h3>
          <a
            href="https://discord.gg/haven"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            onClick={onClose}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Join Discord</span>
          </a>
          <a
            href="https://t.me/haven"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            onClick={onClose}
          >
            <Send className="h-4 w-4" />
            <span>Join Telegram</span>
          </a>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Legal</h3>
          <Link
            to="/dmca"
            onClick={onClose}
            className="block text-white/60 hover:text-white transition-colors"
          >
            DMCA Policy
          </Link>
        </div>
      </div>
    </>
  );
};

export const MenuDrawer: React.FC<MenuDrawerProps> = (props) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <Drawer open={props.isOpen} onOpenChange={props.onClose}>
        <DrawerContent className="bg-gradient-to-b from-gray-900/95 via-gray-900/95 to-black/95 backdrop-blur text-white border-t border-t-gray-700/50 p-6 max-h-[85vh]">
          <MenuContent {...props} isMobile={true} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={props.isOpen} onOpenChange={props.onClose}>
      <SheetContent
        side="left"
        className="w-80 bg-gradient-to-b from-gray-900/20 bg-transparent to-gray-800/10 backdrop-blur text-white border-r border-r-gray-700/50 p-6 shadow-2xl"
      >
        <MenuContent {...props} isMobile={false} />
      </SheetContent>
    </Sheet>
  );
};
