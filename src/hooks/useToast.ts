import { useEffect, useState, useCallback, ReactNode } from "react";
import {
  toast as shadowToast,
  useToast as useShadowToast,
} from "@/hooks/use-toast";

const MOBILE_BREAKPOINT = 768;

export const useToast = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { toast: baseToast, dismiss } = useShadowToast();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const showToast = useCallback(
    (message: ReactNode) => {
      if (isMobile) return;
      return baseToast({
        description: message,
      });
    },
    [isMobile, baseToast]
  );

  const success = useCallback(
    (message: ReactNode) => {
      if (isMobile) return;
      return baseToast({
        description: message,
      });
    },
    [isMobile, baseToast]
  );

  const error = useCallback(
    (message: ReactNode) => {
      if (isMobile) return;
      return baseToast({
        description: message,
        variant: "destructive",
      });
    },
    [isMobile, baseToast]
  );

  return {
    toast: showToast,
    success,
    error,
    dismiss,
  };
};

// Export the raw toast function for direct usage
export const toast = shadowToast;
