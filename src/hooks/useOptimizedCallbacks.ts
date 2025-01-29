import { useMemo, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  storeClassification,
  setWalletPrompted,
  setBettingPrompted,
} from "../utils/storage";
import type { Content, UserReward } from "../types";
import type { SwipeCardPublicMethods } from "../components/lazy";

interface UseOptimizedCallbacksProps {
  videoContent: Content[];
  currentContent: Content | undefined;
  reward: UserReward;
  swipeCardRef: React.RefObject<SwipeCardPublicMethods>;
  setCurrentIndex: (updater: (prev: number) => number) => void;
  setReward: (updater: (prev: UserReward) => UserReward) => void;
  setShowWallet: (value: boolean) => void;
  resetShake: () => void;
}

export function useOptimizedCallbacks({
  videoContent,
  currentContent,
  reward,
  swipeCardRef,
  setCurrentIndex,
  setReward,
  setShowWallet,
  resetShake,
}: UseOptimizedCallbacksProps) {
  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (!videoContent.length || !currentContent) return;

      if (swipeCardRef.current) {
        swipeCardRef.current.setIsVideoLoaded(false);
      }

      const selectedActionId =
        direction === "left"
          ? currentContent.leftActionId
          : currentContent.rightActionId;

      if (!selectedActionId) return;

      try {
        // Store classification and check if we should prompt
        const { shouldPromptWallet, shouldPromptBetting } = storeClassification(
          currentContent.id,
          selectedActionId
        );

        setReward((prev) => ({
          points: prev.points + (currentContent.pointsValue || 0),
          level: Math.floor(prev.points / 100) + 1,
          classificationsCount: prev.classificationsCount + 1,
        }));

        setCurrentIndex((prev) => (prev + 1) % videoContent.length);

        // Handle prompts
        if (shouldPromptWallet) {
          setShowWallet(true);
          setWalletPrompted();
          toast.success(
            "You've unlocked wallet features! Please connect your wallet to continue.",
            {
              duration: 3000,
              position: "bottom-center",
            }
          );
        } else if (shouldPromptBetting) {
          setBettingPrompted();
          toast.success(
            "You've unlocked betting features! Try placing your first bet.",
            {
              duration: 3000,
              position: "bottom-center",
            }
          );
        } else {
          toast.success("Classification saved!", {
            duration: 600,
            position: "bottom-right",
          });
        }
      } catch (error) {
        toast.error("Failed to store classification");
        console.error("Classification error:", error);
      }
    },
    [
      videoContent,
      currentContent,
      reward.classificationsCount,
      swipeCardRef,
      setReward,
      setCurrentIndex,
      setShowWallet,
    ]
  );

  const handleSubmit = useCallback(() => {
    resetShake();
    setReward((prev) => ({ ...prev, classificationsCount: 0 }));
    toast.success("Progress submitted successfully!");
  }, [resetShake, setReward]);

  // Memoized reward level calculation
  const rewardLevel = useMemo(() => {
    return Math.floor(reward.points / 100) + 1;
  }, [reward.points]);

  // Memoized remaining classifications calculation
  const remainingClassifications = useMemo(() => {
    return 50 - reward.classificationsCount;
  }, [reward.classificationsCount]);

  return {
    handleSwipe,
    handleSubmit,
    rewardLevel,
    remainingClassifications,
  };
}
