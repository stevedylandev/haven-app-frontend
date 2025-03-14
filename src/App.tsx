import { useRef, useState, useMemo, useEffect, Suspense } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { WalletPromptModal } from "./components/auth/WalletPromptModal";
import { Menu, History, RefreshCw } from "lucide-react";
import UserInfoDialog from "./components/auth/UserInfoDialog";
import { useAutoRegistration } from "./hooks/useAutoRegistration";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Providers } from "./components/providers/Providers";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { BetHistoryDialog } from "./components/betting";
import {
  LazySwipeCard,
  LazyMenuDrawer,
  LazyShareButton,
  LazyAudiusControls,
  LazySubmitButton,
  LazyDMCA,
  LazyBettingTutorial,
  type SwipeCardPublicMethods,
} from "./components/lazy";
import { VerifyClips } from "./pages/VerifyClips";
import RegisterPage from "./pages/Register";
import BettingHistory from "./pages/BettingHistory";
import PointsOverview from "./pages/PointsOverview";
import { useOptimizedCallbacks } from "./hooks/useOptimizedCallbacks";
import { usePerformanceMonitor } from "./utils/performance";
import { useShakeDetection } from "./hooks/useShakeDetection";
import { useRandomVideoClip } from "./hooks/useRandomVideoClip";

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

// Random clip fetching button component
const RandomClipButton = () => {
  const { videoClips, loading, error, fetchClips } = useRandomVideoClip();

  useEffect(() => {
    if (error) {
      console.error("Failed to fetch random clips:", error);
    }
  }, [error]);

  useEffect(() => {
    if (videoClips.length > 0) {
      console.log("Random clips fetched:", videoClips);
    }
  }, [videoClips]);

  return (
    <button
      onClick={fetchClips}
      disabled={loading}
      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 backdrop-blur-sm border border-white/20 rounded transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:outline-none flex items-center gap-2"
      aria-label="Fetch random clip"
    >
      <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
      <span>{loading ? "Loading..." : "Random Clip"}</span>
    </button>
  );
};

function AppContent() {
  const endPerformanceMeasure = usePerformanceMonitor("AppContent");

  const {
    videoClips,
    loading: isLoading,
    error: errorMessage,
    fetchClips,
  } = useRandomVideoClip();

  // Fetch initial clips
  useEffect(() => {
    fetchClips();
  }, [fetchClips]);

  console.log("Video content:", videoClips);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [reward, setReward] = useState({
    points: 0,
    level: 1,
    classificationsCount: 0,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [shouldDisableSwipe, setShouldDisableSwipe] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showBetHistory, setShowBetHistory] = useState(false);

  const swipeCardRef = useRef<SwipeCardPublicMethods>(null);
  const { shaken, resetShake } = useShakeDetection();
  const { ready, authenticated, login, logout } = usePrivy();
  const {
    user,
    isLoading: isRegistering,
    showRegistrationDialog,
    closeRegistrationDialog,
    handleRegistration,
  } = useAutoRegistration();

  const currentContent = useMemo(
    () => videoClips[currentIndex],
    [videoClips, currentIndex]
  );

  console.log(currentContent, "currentContent");

  const { handleSwipe, handleSubmit, remainingClassifications } =
    useOptimizedCallbacks({
      videoContent: videoClips,
      currentContent,
      reward,
      swipeCardRef,
      setCurrentIndex,
      setReward,
      setShowWallet,
      resetShake,
      isConnected: authenticated,
    });

  useEffect(() => {
    if (authenticated) setShowWallet(false);
  }, [authenticated]);

  useEffect(() => {
    setShouldDisableSwipe(showWallet && authenticated);
  }, [showWallet, authenticated]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
          setShowBetHistory(false);
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
      className="bg-black min-h-screen max-sm:h-[100dvh] overflow-hidden bg-gradient-to-b from-pink-400/10 via-black to-purple-500/10 flex flex-col items-center justify-center"
      role="main"
    >
      {showRegistrationDialog && (
        <UserInfoDialog
          isOpen={showRegistrationDialog}
          onClose={closeRegistrationDialog}
          onSubmit={handleRegistration}
          ethereumAddress={user?.ethereumAddress || ""}
        />
      )}
      {isRegistering && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="text-white">Setting up your account...</div>
        </div>
      )}
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          {currentContent?.id && <LazyShareButton ipfsId={currentContent.id} />}
          <LazyMenuDrawer
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            reward={reward}
            showWallet={showWallet}
            authenticated={authenticated}
            ready={ready}
            onLogin={login}
            onLogout={logout}
            remainingClassifications={remainingClassifications}
            user={user}
          />
          <LazyAudiusControls />
          {videoClips.length > 0 && currentContent && (
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
          {/* <div className="border border-red-500 absolute left-[50%] top-[50%]">
            <video
              id="current-video"
              autoPlay
              muted
              controls
              playsInline
              src={currentContent?.url}
            />
          </div> */}
          {reward.classificationsCount >= 50 || shaken ? (
            <LazySubmitButton
              classificationsCount={reward.classificationsCount}
              isShaken={shaken}
              onSubmit={handleSubmit}
            />
          ) : null}
          <LazyBettingTutorial />
        </Suspense>
      </ErrorBoundary>

      <button
        onClick={() => setIsMenuOpen(true)}
        className={`fixed ${
          isMobile
            ? "top-4 right-4 px-3 py-2 rounded-lg"
            : "bottom-4 left-4 px-4 py-2.5 rounded-full"
        } flex items-center gap-2 bg-white/10 hover:bg-white/20 active:bg-white/25 backdrop-blur-sm border border-white/20 transition-all duration-200 group z-50`}
        aria-label="Open menu"
        aria-expanded={isMenuOpen}
        aria-controls="menu-drawer"
      >
        <Menu
          className={`h-5 w-5 text-white ${
            !isMobile && "group-hover:scale-110 transition-transform"
          }`}
        />
        <span className="text-sm text-white font-medium">Menu</span>
      </button>

      <div className="fixed top-4 left-4 text-center text-white/60 text-sm max-sm:hidden">
        <RandomClipButton />
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
        className="fixed max-sm:hidden bottom-1 left-0 right-0 text-center text-white/60 text-sm"
        aria-hidden="true"
      >
        <div>Swipe right or right to classify the action</div>
      </div>

      <div className="fixed bottom-4 right-4 flex gap-4 text-xs text-white/40 max-sm:hidden">
        <Link to="/dmca" className="hover:text-white/60 transition-colors">
          DMCA Policy
        </Link>
      </div>

      <div className="fixed top-4 right-4 text-center text-white/60 text-sm max-sm:hidden">
        {authenticated && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBetHistory(true)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 active:bg-white/25 backdrop-blur-sm border border-white/20 rounded transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              aria-label="View betting history"
            >
              <div className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span>Betting History</span>
              </div>
            </button>
            {showWallet && (
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors focus:ring-2 focus:ring-white focus:outline-none"
                aria-label="Log out of account"
              >
                Log out
              </button>
            )}
          </div>
        )}

        {!authenticated && showWallet && (
          <button
            disabled={!ready}
            onClick={login}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors disabled:opacity-50 focus:ring-2 focus:ring-white focus:outline-none"
            aria-label="Log in to account"
          >
            Log in
          </button>
        )}

        {!showWallet && (
          <span aria-live="polite" className="hidden sm:inline">
            Classify {remainingClassifications} more clips to submit
          </span>
        )}
      </div>

      <BetHistoryDialog
        isOpen={showBetHistory}
        onClose={() => setShowBetHistory(false)}
      />
      <WalletPromptModal />
    </div>
  );
}

function App() {
  const { authenticated } = usePrivy();

  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route
            path="/dmca"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <LazyDMCA />
              </Suspense>
            }
          />
          <Route
            path="/verify"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <VerifyClips />
              </Suspense>
            }
          />
          <Route
            path="/register"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <RegisterPage />
              </Suspense>
            }
          />
          <Route
            path="/betting-history"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <BettingHistory authenticated={authenticated} />
              </Suspense>
            }
          />
          <Route
            path="/points"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <PointsOverview />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}

export default App;
