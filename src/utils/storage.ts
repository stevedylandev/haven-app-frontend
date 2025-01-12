import { Classification, ClassificationStorage } from '../types';

const STORAGE_KEY = 'classification_data';

export function getStoredClassifications(): ClassificationStorage {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { classifications: [], lastSubmitted: null };
  }
  return JSON.parse(stored);
}

export function storeClassification(contentId: string, selectedActionId: string): void {
  const storage = getStoredClassifications();
  storage.classifications.push({
    contentId,
    selectedActionId,
    timestamp: Date.now(),
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
}

export function clearClassifications(): void {
  const storage = getStoredClassifications();
  storage.classifications = [];
  storage.lastSubmitted = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
}