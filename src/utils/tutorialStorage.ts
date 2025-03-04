import { TutorialProgress, PracticeBet } from "../types/tutorial";

const TUTORIAL_PROGRESS_KEY = "betting_tutorial_progress";
const PRACTICE_BETS_KEY = "practice_bets";

export const getStoredTutorialProgress = (): TutorialProgress | null => {
  const stored = localStorage.getItem(TUTORIAL_PROGRESS_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const setTutorialProgress = (progress: TutorialProgress): void => {
  localStorage.setItem(
    TUTORIAL_PROGRESS_KEY,
    JSON.stringify({
      ...progress,
      lastUpdated: new Date().toISOString(),
    })
  );
};

export const getStoredPracticeBets = (): PracticeBet[] => {
  const stored = localStorage.getItem(PRACTICE_BETS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addPracticeBet = (bet: PracticeBet): void => {
  const bets = getStoredPracticeBets();
  localStorage.setItem(PRACTICE_BETS_KEY, JSON.stringify([...bets, bet]));
};

export const clearTutorialProgress = (): void => {
  localStorage.removeItem(TUTORIAL_PROGRESS_KEY);
  localStorage.removeItem(PRACTICE_BETS_KEY);
};

export const initializeTutorialProgress = (): TutorialProgress => {
  const progress: TutorialProgress = {
    currentStep: 1,
    completedSteps: [],
    walletConnected: false,
    practiceBetsCompleted: 0,
    tutorialCompleted: false,
    lastUpdated: new Date().toISOString(),
  };

  setTutorialProgress(progress);
  return progress;
};
