import { useEffect, useState } from "react";
import {
  getClipCount,
  wasWalletPrompted,
  isWalletRequired,
} from "../utils/storage";

interface WalletPromptState {
  showSoftPrompt: boolean; // Show warning at 25 clips
  showHardPrompt: boolean; // Show blocking modal at 50 clips
  isRequired: boolean; // Wallet is required (50+ clips)
  clipCount: number; // Current clip count
  blockNavigation: boolean; // Block navigation when required
}

type WalletPromptListener = (state: WalletPromptState) => void;
const listeners: WalletPromptListener[] = [];
let lastCheckTime = 0;

// Singleton to track wallet prompt state
let walletPromptState: WalletPromptState = {
  showSoftPrompt: false,
  showHardPrompt: false,
  isRequired: false,
  clipCount: 0,
  blockNavigation: false,
};

export function checkWalletPrompt(isConnected: boolean) {
  const now = Date.now();
  // Throttle checks to once per second
  if (now - lastCheckTime < 1000) return;

  lastCheckTime = now;
  const count = getClipCount();
  const required = isWalletRequired();

  const newState: WalletPromptState = {
    showSoftPrompt:
      !isConnected && count >= 25 && count < 50 && !wasWalletPrompted(),
    showHardPrompt: !isConnected && count >= 50,
    isRequired: required,
    clipCount: count,
    blockNavigation: required && !isConnected,
  };

  if (JSON.stringify(newState) !== JSON.stringify(walletPromptState)) {
    walletPromptState = newState;
    listeners.forEach((listener) => listener(walletPromptState));
  }
}

export function useWalletPrompt(isConnected: boolean): WalletPromptState {
  const [state, setState] = useState<WalletPromptState>({
    showSoftPrompt: false,
    showHardPrompt: false,
    isRequired: false,
    clipCount: 0,
    blockNavigation: false,
  });

  useEffect(() => {
    const listener = (newState: WalletPromptState) => {
      setState(newState);
    };

    listeners.push(listener);
    // Check immediately
    checkWalletPrompt(isConnected);

    // Check periodically
    const interval = setInterval(() => {
      checkWalletPrompt(isConnected);
    }, 1000);

    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
      clearInterval(interval);
    };
  }, [isConnected]);

  return state;
}
