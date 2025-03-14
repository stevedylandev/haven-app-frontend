import { useEffect, useState } from "react";
import {
  getClipCount,
  addClipCountListener,
  removeClipCountListener,
} from "../utils/storage";

/**
 * Hook to track the user's total clip count
 * @returns current clip count
 */
export function useClipCount(): number {
  const [count, setCount] = useState(getClipCount());

  useEffect(() => {
    const listener = (newCount: number) => {
      setCount(newCount);
    };

    addClipCountListener(listener);

    return () => {
      removeClipCountListener(listener);
    };
  }, []);

  return count;
}
