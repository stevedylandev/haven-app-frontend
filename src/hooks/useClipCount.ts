import { useState, useEffect } from "react";
import { getClipCount } from "../utils/storage";

export function useClipCount() {
  const [clipCount, setClipCount] = useState(getClipCount);

  useEffect(() => {
    // Check immediately on mount
    setClipCount(getClipCount());

    // Create an interval to check for changes
    const interval = setInterval(() => {
      const currentCount = getClipCount();
      setClipCount(currentCount);
    }, 1000); // Check every second for better responsiveness

    return () => clearInterval(interval);
  }, []);

  return clipCount;
}
