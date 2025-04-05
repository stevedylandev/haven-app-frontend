import { useRef, useCallback, useEffect } from "react";
import { useHapticFeedback } from "./useHapticFeedback";

interface LongPressOptions {
  onClick?: () => void;
  onLongPress: () => void;
  delay?: number;
  shouldPreventDefault?: boolean;
  disabled?: boolean;
}

export function useLongPress({
  onClick,
  onLongPress,
  delay = 500,
  shouldPreventDefault = true,
  disabled = false,
}: LongPressOptions) {
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const target = useRef<EventTarget>();
  const haptic = useHapticFeedback();

  const start = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (disabled) return;

      if (shouldPreventDefault && event.target) {
        event.preventDefault();
      }

      target.current = event.target;
      timeout.current = setTimeout(() => {
        haptic.mediumTap();
        onLongPress();
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault, disabled, haptic]
  );

  const clear = useCallback(
    (
      event: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent,
      shouldTriggerClick = true
    ) => {
      if (disabled) return;

      // Clear timeout if it exists
      if (timeout.current) {
        clearTimeout(timeout.current);
      }

      // Only trigger click if we haven't triggered long press
      if (shouldTriggerClick && onClick && event.target === target.current) {
        onClick();
      }
    },
    [onClick, disabled]
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  return {
    onMouseDown: (e: React.MouseEvent) => start(e),
    onTouchStart: (e: React.TouchEvent) => start(e),
    onMouseUp: (e: React.MouseEvent) => clear(e),
    onMouseLeave: (e: React.MouseEvent) => clear(e, false),
    onTouchEnd: (e: React.TouchEvent) => clear(e),
  };
}
