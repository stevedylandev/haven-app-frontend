export const useHapticFeedback = () => {
  const vibrate = (pattern: number | number[]) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  };

  return {
    // Light tap feedback for UI interactions
    lightTap: () => vibrate(10),

    // Medium feedback for important actions (e.g., successful swipes)
    mediumTap: () => vibrate(20),

    // Heavy feedback for significant events (e.g., rewards)
    heavyTap: () => vibrate([30, 50, 30]),

    // Success pattern
    success: () => vibrate([10, 50, 20]),

    // Error pattern
    error: () => vibrate([50, 100, 50, 100]),

    // Custom pattern
    custom: (pattern: number | number[]) => vibrate(pattern),
  };
};
