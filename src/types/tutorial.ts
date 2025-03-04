export interface TutorialStep {
  id: number;
  title: string;
  content: string;
  animationKey?: string;
  required?: boolean;
}

export interface TutorialProgress {
  currentStep: number;
  completedSteps: number[];
  walletConnected: boolean;
  practiceBetsCompleted: number;
  tutorialCompleted: boolean;
  lastUpdated: string;
}

export interface PracticeBet {
  clipId: string;
  prediction: string;
  amount: number;
  outcome?: "correct" | "incorrect";
  timestamp: string;
}

export type TutorialStepKey =
  | "welcome"
  | "walletConnection"
  | "bettingExplanation"
  | "practiceInterface"
  | "completion";

export const TUTORIAL_STEPS: Record<TutorialStepKey, TutorialStep> = {
  welcome: {
    id: 1,
    title: "Welcome to Betting",
    content:
      "Congratulations on completing 50 clips! You've unlocked the betting feature. Let's learn how it works.",
    required: true,
  },
  walletConnection: {
    id: 2,
    title: "Connect Your Wallet",
    content:
      "To participate in betting, you'll need to connect your Solana wallet. This ensures secure transactions and tracks your earnings.",
    required: true,
  },
  bettingExplanation: {
    id: 3,
    title: "How Betting Works",
    content:
      "When watching clips, you can bet points on your classification. If your label matches the consensus, you win! The more accurate you are, the more points you earn.",
    animationKey: "betting-flow",
    required: true,
  },
  practiceInterface: {
    id: 4,
    title: "Practice Betting",
    content:
      "Let's try a practice bet with no risk. This will help you understand how the interface works.",
    animationKey: "practice-bet",
    required: true,
  },
  completion: {
    id: 5,
    title: "Ready to Start",
    content:
      "Great job! You're now ready to start betting on clip classifications. Remember to bet responsibly and good luck!",
    required: true,
  },
};
