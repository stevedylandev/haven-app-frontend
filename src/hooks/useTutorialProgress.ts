import { useState, useEffect, useCallback } from "react";
import { useWalletConnection } from "./useWalletConnection";
import { useClipCount } from "./useClipCount";
import {
  TutorialProgress,
  TutorialStepKey,
  TUTORIAL_STEPS,
} from "../types/tutorial";
import {
  getStoredTutorialProgress,
  setTutorialProgress,
  initializeTutorialProgress,
} from "../utils/tutorialStorage";
import { debounce } from "../utils/helpers";

const REQUIRED_CLIP_COUNT = 50;

export const useTutorialProgress = () => {
  const [progress, setProgress] = useState<TutorialProgress | null>(null);
  const { isConnected } = useWalletConnection();
  const clipCount = useClipCount();

  // Initialize or load progress
  useEffect(() => {
    const storedProgress = getStoredTutorialProgress();
    if (!storedProgress && clipCount >= REQUIRED_CLIP_COUNT) {
      setProgress(initializeTutorialProgress());
    } else if (storedProgress) {
      setProgress(storedProgress);
    }
  }, [clipCount]);

  // Update wallet connection status
  useEffect(() => {
    if (progress && isConnected !== progress.walletConnected) {
      const updatedProgress = {
        ...progress,
        walletConnected: isConnected,
        completedSteps: isConnected
          ? [
              ...new Set([
                ...progress.completedSteps,
                TUTORIAL_STEPS.walletConnection.id,
              ]),
            ]
          : progress.completedSteps,
      };
      setProgress(updatedProgress);
      setTutorialProgress(updatedProgress);
    }
  }, [isConnected, progress]);

  const markStepComplete = useCallback(
    (stepKey: TutorialStepKey) => {
      if (!progress) return;

      const step = TUTORIAL_STEPS[stepKey];
      const updatedProgress = {
        ...progress,
        completedSteps: [...new Set([...progress.completedSteps, step.id])],
        currentStep:
          progress.currentStep < step.id + 1
            ? step.id + 1
            : progress.currentStep,
      };

      setProgress(updatedProgress);
      setTutorialProgress(updatedProgress);
    },
    [progress]
  );

  const markPracticeBetComplete = useCallback(() => {
    if (!progress) return;

    const updatedProgress = {
      ...progress,
      practiceBetsCompleted: progress.practiceBetsCompleted + 1,
    };

    setProgress(updatedProgress);
    setTutorialProgress(updatedProgress);
  }, [progress]);

  const completeTutorial = useCallback(() => {
    if (!progress) return;

    const updatedProgress = {
      ...progress,
      tutorialCompleted: true,
      completedSteps: Object.values(TUTORIAL_STEPS).map((step) => step.id),
    };

    setProgress(updatedProgress);
    setTutorialProgress(updatedProgress);
  }, [progress]);

  // Sync progress with server
  const syncWithServer = useCallback(
    async (data: TutorialProgress): Promise<void> => {
      try {
        // TODO: When API is available, uncomment this
        // await fetch('/api/tutorial/progress', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data)
        // });
        console.log("Tutorial progress synced:", data);
      } catch (error) {
        console.error("Failed to sync tutorial progress:", error);
      }
    },
    []
  );

  // Create a debounced version of the sync function
  const debouncedSync = useCallback(
    debounce((data: TutorialProgress) => {
      void syncWithServer(data);
    }, 1000),
    [syncWithServer]
  );

  // Sync progress with server when it changes
  useEffect(() => {
    if (progress) {
      debouncedSync(progress);
    }
  }, [progress, debouncedSync]);

  return {
    progress,
    shouldShowTutorial:
      clipCount >= REQUIRED_CLIP_COUNT && !progress?.tutorialCompleted,
    isWalletConnected: progress?.walletConnected,
    currentStep: progress?.currentStep || 1,
    completedSteps: progress?.completedSteps || [],
    practiceBetsCompleted: progress?.practiceBetsCompleted || 0,
    markStepComplete,
    markPracticeBetComplete,
    completeTutorial,
  };
};
