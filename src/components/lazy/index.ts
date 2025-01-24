import {
  lazy,
  ComponentType,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react";
import type { SwipeCardProps, SwipeCardPublicMethods } from "../SwipeCard";
import type { UserReward } from "../../types";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reward: UserReward;
}

interface ShareButtonProps {
  ipfsId: string;
}

interface SubmitButtonProps {
  classificationsCount: number;
  isShaken: boolean;
  onSubmit: () => void;
}

// Helper function for regular components
function createLazyComponent<T extends object>(
  importFn: () => Promise<{ [key: string]: ComponentType<T> }>,
  exportName: string
) {
  return lazy(async () => {
    const module = await importFn();
    return {
      default: module[exportName] as ComponentType<T>,
    };
  });
}

// Special helper for forwarded ref components
function createLazyRefComponent<T extends object, R>(
  importFn: () => Promise<{
    [key: string]: ForwardRefExoticComponent<T & RefAttributes<R>>;
  }>,
  exportName: string
) {
  return lazy(async () => {
    const module = await importFn();
    return {
      default: module[exportName] as ForwardRefExoticComponent<
        T & RefAttributes<R>
      >,
    };
  });
}

// Use specialized helper for SwipeCard due to forwardRef
export const LazySwipeCard = createLazyRefComponent<
  SwipeCardProps,
  SwipeCardPublicMethods
>(() => import("../SwipeCard"), "SwipeCard");

// Use regular helper for other components
export const LazyMenuDrawer = createLazyComponent<MenuDrawerProps>(
  () => import("../MenuDrawer"),
  "MenuDrawer"
);

export const LazyShareButton = createLazyComponent<ShareButtonProps>(
  () => import("../ShareButton"),
  "ShareButton"
);

// For components with no props, use empty object type
export const LazyAudiusControls = createLazyComponent<Record<never, never>>(
  () => import("../AudiusControls"),
  "AudiusControls"
);

export const LazySubmitButton = createLazyComponent<SubmitButtonProps>(
  () => import("../SubmitButton"),
  "SubmitButton"
);

// Re-export types for use in App.tsx
export type {
  SwipeCardProps,
  SwipeCardPublicMethods,
  MenuDrawerProps,
  ShareButtonProps,
  SubmitButtonProps,
};
