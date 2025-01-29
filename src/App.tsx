import { useRef, useState, useMemo, useEffect, Suspense } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Menu } from "lucide-react";
import { Providers } from "./components/providers/Providers";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import {
  LazySwipeCard,
  LazyMenuDrawer,
  LazyShareButton,
  LazyAudiusControls,
  LazySubmitButton,
  type SwipeCardPublicMethods,
} from "./components/lazy";
import { useOptimizedCallbacks } from "./hooks/useOptimizedCallbacks";
import { usePerformanceMonitor } from "./utils/performance";
import { useShakeDetection } from "./hooks/useShakeDetection";
import { useVideoContent } from "./hooks/useVideoContent";

// Loading components
const LoadingSpinner = () => (
  <div
    className="flex items-center justify-center min-h-[200px]"
    role="status"
    aria-label="Loading content"
  >
    <div className="animate-pulse text-white/60">Loading...</div>
  </div>
);

const LoadingScreen = () => (
  <div
    className="min-h-screen bg-gradient-to-br from-purple-900/50 to-black flex items-center justify-center"
    role="status"
    aria-label="Loading application"
  >
    <div className="animate-pulse text-white/60">Loading application...</div>
  </div>
);

function AppContent() {
  const endPerformanceMeasure = usePerformanceMonitor("AppContent");

  const {
    content: videoContent,
    loading: isLoading,
    error: errorMessage,
  } = useVideoContent();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [reward, setReward] = useState({
    points: 0,
    level: 1,
    classificationsCount: 0,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [shouldDisableSwipe, setShouldDisableSwipe] = useState(false);

  const swipeCardRef = useRef<SwipeCardPublicMethods>(null);
  const { shaken, resetShake } = useShakeDetection();
  const { ready, authenticated, login, logout } = usePrivy();

  const currentContent = useMemo(
    () => videoContent[currentIndex],
    [videoContent, currentIndex]
  );

  const { handleSwipe, handleSubmit, remainingClassifications } =
    useOptimizedCallbacks({
      videoContent,
      currentContent,
      reward,
      swipeCardRef,
      setCurrentIndex,
      setReward,
      setShowWallet,
      resetShake,
    });

  useEffect(() => {
    if (authenticated) setShowWallet(false);
  }, [authenticated]);

  useEffect(() => {
    setShouldDisableSwipe(showWallet && authenticated);
  }, [showWallet, authenticated]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (shouldDisableSwipe) return;

      switch (e.key) {
        case "ArrowLeft":
          handleSwipe("left");
          break;
        case "ArrowRight":
          handleSwipe("right");
          break;
        case "Escape":
          setIsMenuOpen(false);
          break;
        case "m":
        case "M":
          setIsMenuOpen((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleSwipe, shouldDisableSwipe]);

  useEffect(() => {
    // Update document title with current progress
    document.title = `Haven (${remainingClassifications} clips remaining)`;
  }, [remainingClassifications]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (errorMessage) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-purple-900/50 to-black flex items-center justify-center"
        role="alert"
      >
        <div className="text-red-500 text-center max-w-md mx-auto p-4">
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p>{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Clean up performance measurement
  endPerformanceMeasure();

  return (
    <div
      className="bg-black min-h-screen bg-gradient-to-b from-pink-400/10 via-black to-purple-500/10 flex flex-col items-center justify-center"
      role="main"
    >
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          {currentContent?.id && <LazyShareButton ipfsId={currentContent.id} />}
          <LazyMenuDrawer
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            reward={reward}
          />
          <LazyAudiusControls />
          {videoContent.length > 0 && currentContent && (
            <LazySwipeCard
              ref={swipeCardRef}
              content={currentContent}
              leftAction={{
                id: "lt",
                label: currentContent.leftActionId || "",
              }}
              rightAction={{
                id: "rt",
                label: currentContent.rightActionId || "",
              }}
              onSwipe={handleSwipe}
              reward={reward}
              disabled={shouldDisableSwipe}
            />
          )}
          {reward.classificationsCount >= 25 || shaken ? (
            <LazySubmitButton
              classificationsCount={reward.classificationsCount}
              isShaken={shaken}
              onSubmit={handleSubmit}
            />
          ) : null}
        </Suspense>
      </ErrorBoundary>

      <div className="fixed bottom-4 left-4 flex gap-2">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="rounded-full h-12 w-12 flex items-center justify-center  bg-transparent"
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
          aria-controls="menu-drawer"
        >
          <Menu className="h-6 w-6 text-white" />
        </button>
      </div>

      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {showWallet
          ? "Wallet controls visible"
          : `${remainingClassifications} more clips to submit`}
      </div>

      <div
        className="fixed bottom-1 left-0 right-0 text-center text-white/60 text-sm"
        aria-hidden="true"
      >
        Swipe left or right to classify the action
      </div>

      <div className="fixed top-4 right-4 text-center text-white/60 text-sm">
        {showWallet ? (
          <div className="flex items-center gap-2">
            {authenticated ? (
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors focus:ring-2 focus:ring-white focus:outline-none"
                aria-label="Log out of account"
              >
                Log out
              </button>
            ) : (
              <button
                disabled={!ready}
                onClick={login}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors disabled:opacity-50 focus:ring-2 focus:ring-white focus:outline-none"
                aria-label="Log in to account"
              >
                Log in
              </button>
            )}
          </div>
        ) : (
          <span aria-live="polite">
            Classify {remainingClassifications} more clips to submit
          </span>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Providers>
      <AppContent />
    </Providers>
  );
}

export default App;
