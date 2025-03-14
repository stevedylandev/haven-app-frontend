import { lazy } from "react";

// Export types
export interface SwipeCardPublicMethods {
  setIsVideoLoaded: (isLoaded: boolean) => void;
}

// Lazy loaded components
export const LazySwipeCard = lazy(() =>
  import("../SwipeCard").then((module) => ({
    default: module.SwipeCard,
  }))
);

export const LazyMenuDrawer = lazy(() =>
  import("../MenuDrawer").then((module) => ({
    default: module.MenuDrawer,
  }))
);

export const LazyShareButton = lazy(() =>
  import("../ShareButton").then((module) => ({
    default: module.ShareButton,
  }))
);

export const LazyAudiusControls = lazy(() =>
  import("../AudiusControls").then((module) => ({
    default: module.AudiusControls,
  }))
);

export const LazySubmitButton = lazy(() =>
  import("../SubmitButton").then((module) => ({
    default: module.SubmitButton,
  }))
);

export const LazyDMCA = lazy(() => import("../DMCA"));

export const LazyBettingTutorial = lazy(() =>
  import("../betting/tutorial/BettingTutorial").then((module) => ({
    default: module.BettingTutorial,
  }))
);

export const PointsDashboard = lazy(() => import("../PointsDashboard"));
