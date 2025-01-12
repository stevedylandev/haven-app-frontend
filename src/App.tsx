import React, { useRef, useState } from 'react';
import { AudiusProvider } from './context/AudiusContext';
import { SwipeCard, SwipeCardPublicMethods } from './components/SwipeCard';
import { RewardDisplay } from './components/RewardDisplay';
import { SubmitButton } from './components/SubmitButton';
import { ShareButton } from './components/ShareButton';
import { AudiusControls } from './components/AudiusControls';
import { UserReward } from './types';
import { storeClassification } from './utils/storage';
import { useShakeDetection } from './hooks/useShakeDetection';
import { useVideoContent } from './hooks/useVideoContent';

function App() {
  const { content: videoContent, loading: isLoading, error: errorMessage } = useVideoContent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reward, setReward] = useState<UserReward>({
    points: 0,
    level: 1,
    classificationsCount: 0
  });
  const [lastSubmissionCount, setLastSubmissionCount] = useState(0);
  const swipeCardRef = useRef<SwipeCardPublicMethods | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { shaken, resetShake } = useShakeDetection();

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!videoContent.length) return;

    if (swipeCardRef.current) {
      swipeCardRef.current.setIsVideoLoaded(false);
    }

    const currentContent = videoContent[currentIndex];
    const selectedActionId = direction === 'left' ? currentContent.leftActionId : currentContent.rightActionId;

    if (!selectedActionId) return;

    storeClassification(currentContent.id, selectedActionId);

    setReward(prev => ({
      points: prev.points + (currentContent.pointsValue || 0),
      level: Math.floor(prev.points / 100) + 1,
      classificationsCount: prev.classificationsCount + 1
    }));

    setCurrentIndex((prev) => (prev + 1) % videoContent.length);
  };

  const handleSubmit = () => {
    setLastSubmissionCount(reward.classificationsCount);
    resetShake();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900/50 to-black flex items-center justify-center animate-pulse">
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900/50 to-black flex items-center justify-center">
        <div className="text-red-500">{errorMessage}</div>
      </div>
    );
  }

  const showSubmitButton = shaken || (reward.classificationsCount - lastSubmissionCount >= 50);
  const currentContent = videoContent[currentIndex];

  const menuClasses = `fixed top-0 left-0 h-full w-72 bg-gray-800 text-white shadow-md transform transition-transform duration-300 ease-in-out z-[9999] ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`;

  return (
    <AudiusProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-900/50 to-black flex flex-col items-center justify-center">
        <ShareButton />

        {/* Menu Drawer */}
        <div className={menuClasses}>
          <div className="p-4 relative">
            <button onClick={toggleMenu} className="absolute top-2 right-2">
              <svg className="h-6 w-6 fill-current text-white" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
            <RewardDisplay reward={reward} />
          </div>
        </div>

        <AudiusControls />

        {videoContent.length > 0 && currentContent && (
          <SwipeCard
            ref={swipeCardRef}
            content={currentContent}
            leftAction={{ id: 'lt' , label: currentContent.leftActionId || '' }}
            rightAction={{ id: 'rt' , label: currentContent.rightActionId || '' }}
            onSwipe={handleSwipe}
            reward={reward}
          />
        )}

        {showSubmitButton && (
          <SubmitButton
            classificationsCount={reward.classificationsCount}
            isShaken={shaken}
            onSubmit={handleSubmit}
          />
        )}

        <div className="fixed bottom-4 left-4 flex gap-2">
          <button
            onClick={toggleMenu}
            className="rounded-full h-12 w-12 bg-gradient-to-br from-blue-700 to-blue-500 hover:shadow-md"
            aria-label="Open menu"
          >
            <div className="absolute top-1/4 left-1/4 w-1/5 h-1/5 bg-white rounded-sm"></div>
            <div className="absolute top-1/4 right-1/4 w-1/5 h-1/5 bg-white rounded-sm"></div>
            <div className="absolute bottom-1/4 left-1/4 w-1/5 h-1/5 bg-white rounded-sm"></div>
            <div className="absolute bottom-1/4 right-1/4 w-1/5 h-1/5 bg-white rounded-sm"></div>
          </button>
        </div>
        <div className="fixed bottom-4 left-0 right-0 text-center text-white/60 text-sm">
          Swipe left or right to classify the action
        </div>
      </div>
    </AudiusProvider>
  );
}

export default App;