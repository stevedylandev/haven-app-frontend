import { toast, ToastOptions } from "react-hot-toast";
import { useEffect, useState, useCallback } from "react";

const MOBILE_BREAKPOINT = 768;

export const useToast = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const showToast = useCallback(
    (message: string, options?: ToastOptions) => {
      if (isMobile) return; // Don't show toast on mobile
      return toast(message, options);
    },
    [isMobile]
  );

  const success = useCallback(
    (message: string, options?: ToastOptions) => {
      if (isMobile) return; // Don't show toast on mobile
      return toast.success(message, options);
    },
    [isMobile]
  );

  const error = useCallback(
    (message: string, options?: ToastOptions) => {
      if (isMobile) return; // Don't show toast on mobile
      return toast.error(message, options);
    },
    [isMobile]
  );

  return {
    toast: showToast,
    success,
    error,
  };
};
