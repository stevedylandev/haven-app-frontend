import { ClassificationStorage } from "../types";

const STORAGE_KEY = "classification_data";
const CLIP_COUNT_KEY = "total_clip_count";
const WALLET_PROMPTED_KEY = "wallet_prompted";
const BETTING_PROMPTED_KEY = "betting_prompted";

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
): { shouldPromptWallet: boolean; shouldPromptBetting: boolean } {
  const storage = getStoredClassifications();
  storage.classifications.push({
    contentId,
    selectedActionId,
    timestamp: Date.now(),
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));

  // Increment clip count
  const newCount = getClipCount() + 1;
  localStorage.setItem(CLIP_COUNT_KEY, newCount.toString());

  // Check if we should prompt
  const shouldPromptWallet = newCount >= 25 && !wasWalletPrompted();
  const shouldPromptBetting = newCount >= 50 && !wasBettingPrompted();

  return { shouldPromptWallet, shouldPromptBetting };
}

export function clearClassifications(): void {
  const storage = getStoredClassifications();
  storage.classifications = [];
  storage.lastSubmitted = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
}

export function resetWalletPrompt(): void {
  localStorage.removeItem(WALLET_PROMPTED_KEY);
  localStorage.setItem(CLIP_COUNT_KEY, "0");
}
