import { useMemo, useCallback } from "react";
import { useToast } from "@/hooks/useToast";
import { storeClassification, setBettingPrompted } from "../utils/storage";
import type { Content, UserReward } from "../types";
import type { SwipeCardPublicMethods } from "../components/lazy";
import { checkWalletPrompt } from "./useWalletPrompt";

interface UseOptimizedCallbacksProps {
  videoContent: Content[];
  currentContent: Content | undefined;
  reward: UserReward;
  swipeCardRef: React.RefObject<SwipeCardPublicMethods>;
  setCurrentIndex: (updater: (prev: number) => number) => void;
  setReward: (updater: (prev: UserReward) => UserReward) => void;
  setShowWallet: (value: boolean) => void;
  resetShake: () => void;
  isConnected: boolean;
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
  isConnected,
}: UseOptimizedCallbacksProps) {
  const { success, error } = useToast();

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

        // Handle prompts and check for wallet prompt
        checkWalletPrompt(isConnected);

        if (shouldPromptWallet) {
          success(
            "You've unlocked wallet features! Please connect your wallet to continue."
          );
        } else if (shouldPromptBetting) {
          setBettingPrompted();
          success(
            "You've unlocked betting features! Try placing your first bet."
          );
        } else {
          success("Classification saved!");
        }
      } catch (err) {
        error("Failed to store classification");
        console.error("Classification error:", err);
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
      success,
      error,
    ]
  );

  const handleSubmit = useCallback(() => {
    resetShake();
    setReward((prev) => ({ ...prev, classificationsCount: 0 }));
    success("Progress submitted successfully!");
  }, [resetShake, setReward, success]);

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
