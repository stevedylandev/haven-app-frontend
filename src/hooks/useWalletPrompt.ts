import { useEffect, useState } from "react";
import { getClipCount, wasWalletPrompted } from "../utils/storage";

type WalletPromptListener = () => void;
const listeners: WalletPromptListener[] = [];
let lastCheckTime = 0;

// Singleton to track if we should show the prompt
let shouldShowPrompt = false;

export function checkWalletPrompt(isConnected: boolean) {
  const now = Date.now();
  // Throttle checks to once per second
  if (now - lastCheckTime < 1000) return;

  lastCheckTime = now;
  const count = getClipCount();
  const shouldPrompt = !isConnected && count >= 25 && !wasWalletPrompted();

  if (shouldPrompt !== shouldShowPrompt) {
    shouldShowPrompt = shouldPrompt;
    listeners.forEach((listener) => listener());
  }
}

export function useWalletPrompt(isConnected: boolean) {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const listener = () => {
      setShouldShow(shouldShowPrompt);
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

  return shouldShow;
}
