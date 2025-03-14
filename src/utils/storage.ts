import { ClassificationStorage } from "../types";

const STORAGE_KEY = "classification_data";
const CLIP_COUNT_KEY = "total_clip_count";
const WALLET_PROMPTED_KEY = "wallet_prompted";
const BETTING_PROMPTED_KEY = "betting_prompted";
const WALLET_REQUIRED_KEY = "wallet_required";
const SESSION_ID_KEY = "session_id";

function generateSessionId(): string {
  return Date.now().toString();
}

function checkAndInitSession(): void {
  // Always generate a new session ID and reset clip count on page load
  localStorage.setItem(SESSION_ID_KEY, generateSessionId());
  localStorage.setItem(CLIP_COUNT_KEY, "0");
  localStorage.removeItem(WALLET_PROMPTED_KEY);
  localStorage.removeItem(BETTING_PROMPTED_KEY);
}

// Initialize session on module load
checkAndInitSession();

export function getStoredClassifications(): ClassificationStorage {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { classifications: [], lastSubmitted: null };
  }
  return JSON.parse(stored);
}

export function getClipCount(): number {
  return parseInt(localStorage.getItem(CLIP_COUNT_KEY) || "0", 10);
}

export function isWalletRequired(): boolean {
  return getClipCount() >= 50;
}

export function setWalletRequired(): void {
  localStorage.setItem(WALLET_REQUIRED_KEY, "true");
}

export function wasWalletPrompted(): boolean {
  return localStorage.getItem(WALLET_PROMPTED_KEY) === "true";
}

export function wasBettingPrompted(): boolean {
  return localStorage.getItem(BETTING_PROMPTED_KEY) === "true";
}

export function setWalletPrompted(): void {
  localStorage.setItem(WALLET_PROMPTED_KEY, "true");
}

export function setBettingPrompted(): void {
  localStorage.setItem(BETTING_PROMPTED_KEY, "true");
}

export function storeClassification(
  contentId: string,
  selectedActionId: string
): {
  shouldPromptWallet: boolean;
  shouldPromptBetting: boolean;
  isWalletRequired: boolean;
  clipCount: number;
} {
  const storage = getStoredClassifications();
  storage.classifications.push({
    contentId,
    selectedActionId,
    timestamp: Date.now(),
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));

  // Get current count before incrementing
  const currentCount = getClipCount();
  console.debug("Current clip count before increment:", currentCount);

  // Increment clip count
  const newCount = currentCount + 1;
  localStorage.setItem(CLIP_COUNT_KEY, newCount.toString());
  console.debug("New clip count after increment:", newCount);

  // Check for prompts and requirements
  const shouldPromptWallet = newCount >= 25 && !wasWalletPrompted();
  const shouldPromptBetting = newCount >= 50 && !wasBettingPrompted();
  const isWalletRequired = newCount >= 50;

  if (isWalletRequired) {
    setWalletRequired();
  }

  return {
    shouldPromptWallet,
    shouldPromptBetting,
    isWalletRequired,
    clipCount: newCount,
  };
}

type ClipCountListener = (count: number) => void;
const clipCountListeners: ClipCountListener[] = [];

export function addClipCountListener(listener: ClipCountListener): void {
  clipCountListeners.push(listener);
}

export function removeClipCountListener(listener: ClipCountListener): void {
  const index = clipCountListeners.indexOf(listener);
  if (index > -1) {
    clipCountListeners.splice(index, 1);
  }
}

function notifyClipCountListeners(count: number): void {
  clipCountListeners.forEach((listener) => listener(count));
}

export function clearClassifications(): void {
  const storage = getStoredClassifications();
  storage.classifications = [];
  storage.lastSubmitted = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));

  // Reset clip count and wallet prompt on successful submission
  localStorage.setItem(CLIP_COUNT_KEY, "0");
  localStorage.removeItem(WALLET_PROMPTED_KEY); // Reset wallet prompt flag
  localStorage.removeItem(BETTING_PROMPTED_KEY); // Reset betting prompt flag too for consistency
  notifyClipCountListeners(0);
}

export function resetWalletPrompt(): void {
  localStorage.removeItem(WALLET_PROMPTED_KEY);
}
