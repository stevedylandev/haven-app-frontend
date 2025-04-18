import React, { useState, useEffect } from "react";
import { Content, ActionChoice, UserReward, Action } from "../types";
import { BettingControls } from "./swipe-card/BettingControls";
import { ActionButtons } from "./swipe-card/ActionButtons";
import { useSwipeGesture } from "../hooks/useSwipeGesture";
import { useBetting } from "../hooks/useBetting";
import { useVideoExpansion } from "../hooks/useVideoExpansion";
import { StackedCard } from "./swipe-card/StackedCard";
import { WalletBlockModal } from "./auth/WalletBlockModal";
import { useWalletPrompt } from "../hooks/useWalletPrompt";
import { useHapticFeedback } from "../hooks/useHapticFeedback";
import { getClassificationPickerOptions } from "@/utils/api";

export interface SwipeCardProps {
  content: Content;
  leftAction: ActionChoice;
  rightAction: ActionChoice;
  onSwipe: (direction: "left" | "right", betAmount: number) => void;
  reward: UserReward;
  disabled?: boolean;
  isWalletConnected: boolean;
  onConnectWallet: () => void;
  isConnectingWallet?: boolean;
  isPrefetched?: boolean;
}

export interface SwipeCardPublicMethods {
  setIsVideoLoaded: (value: boolean) => void;
}

export const SwipeCard = React.forwardRef<
  SwipeCardPublicMethods,
  SwipeCardProps
>(
  (
    {
      content,
      leftAction,
      rightAction,
      onSwipe,
      reward,
      disabled,
      isWalletConnected,
      onConnectWallet,
      isConnectingWallet = false,
      isPrefetched = false,
    },
    ref
  ) => {
    const walletState = useWalletPrompt(isWalletConnected);
    const [swipeDirection, setSwipeDirection] = useState<
      "left" | "right" | null
    >(null);
    const [stackCards, setStackCards] = useState<Content[]>([]);
    const haptic = useHapticFeedback();

    // Combine disabled state with wallet block
    const isDisabled = disabled || walletState.blockNavigation;

    // Initialize stack cards
    useEffect(() => {
      const newStackCards = [
        { ...content, id: "stack-1" },
        { ...content, id: "stack-2" },
      ];
      setStackCards(newStackCards);
    }, [content]); // Fixed dependency array

    const [alternativeClassifications, setAlternativeClassifications] =
      useState<Action[] | null>(null);

    console.log("Alternative Classifications:", alternativeClassifications);

    useEffect(() => {
      const fetchAlternativeClassifications = async () => {
        try {
          const response = await getClassificationPickerOptions();
          console.log("Response:", response);
          if (response?.data) {
            setAlternativeClassifications(response.data);
            console.log("Fetched classifications:", response.data);
          }
        } catch (error) {
          console.error("Error fetching alternative classifications:", error);
        }
      };

      fetchAlternativeClassifications();
    }, []);
    const {
      isExpanded,
      isVideoLoaded,
      videoRef,
      cardRef,
      handleExpand,
      handleVideoLoad,
      setIsVideoLoaded,
    } = useVideoExpansion({
      onVideoLoad: () => void 0,
    });

    const {
      betAmount,
      isHolding,
      startIncrementing,
      stopIncrementing,
      handleBetIncrement,
      handleBetDecrement,
      resetBetAmount,
    } = useBetting({
      reward,
      isExpanded,
      disabled: isDisabled,
    });

    const handleSwipeComplete = (
      direction: "left" | "right",
      amount: number
    ) => {
      // Block swipe if wallet is required
      if (walletState.blockNavigation) {
        return;
      }

      setSwipeDirection(direction);

      // Wait for swipe animation to complete
      setTimeout(() => {
        // Shift stack cards up
        setStackCards((prevCards) => {
          const newCards = [...prevCards];
          newCards.pop(); // Remove last card
          const newCard = { ...content, id: `stack-${Date.now()}` };
          newCards.unshift(newCard); // Add new card at bottom
          return newCards;
        });

        onSwipe(direction, amount);
        resetBetAmount();
        setSwipeDirection(null);
      }, 200);
    };

    // Handler for alternative classification selection
    const handleClassificationSelect = (
      position: "left" | "right",
      classification: string
    ) => {
      haptic.success();

      // Create a direction from the position
      const direction = position;

      // Log the selected classification (you can integrate this with your backend later)
      console.log(
        `Selected classification: ${classification} for ${direction} swipe`
      );

      setSwipeDirection(direction);

      // Wait for swipe animation to complete
      setTimeout(() => {
        // Shift stack cards up
        setStackCards((prevCards) => {
          const newCards = [...prevCards];
          newCards.pop(); // Remove last card
          const newCard = { ...content, id: `stack-${Date.now()}` };
          newCards.unshift(newCard); // Add new card at bottom
          return newCards;
        });

        // Use the same handler but with the custom classification information
        // In a real implementation, you would modify the onSwipe call to include the classification
        onSwipe(direction, betAmount);
        resetBetAmount();
        setSwipeDirection(null);
      }, 200);
    };

    const { handlers } = useSwipeGesture({
      onSwipe: handleSwipeComplete,
      isExpanded,
      disabled: isDisabled,
      betAmount,
      onBetReset: resetBetAmount,
    });

    const enhancedHandlers = {
      ...handlers,
      onMouseDown: (e: React.MouseEvent) => {
        if (!isExpanded && !isDisabled) {
          // Prevent triggering multiple times in quick succession
          e.preventDefault();
          startIncrementing();
        }
        handlers.onMouseDown(e);
      },
      onMouseUp: () => {
        if (!isExpanded) {
          stopIncrementing();
        }
        handlers.onMouseUp?.();
      },
      onMouseLeave: () => {
        if (!isExpanded) {
          stopIncrementing();
        }
        handlers.onMouseLeave();
      },
      onTouchStart: (
        e: React.TouchEvent<Element> | React.MouseEvent<Element>
      ) => {
        if (!isExpanded && !isDisabled && "touches" in e) {
          // Add passive handling for better mobile performance
          startIncrementing();
        }
        handlers.onTouchStart?.(e);
      },
      onTouchEnd: () => {
        if (!isExpanded) {
          stopIncrementing();
        }
        handlers.onTouchEnd();
      },
      onTouchCancel: () => {
        if (!isExpanded) {
          stopIncrementing();
        }
      },
      onMouseMove: (e: React.MouseEvent) => {
        if ("touches" in e) return;
        handlers.onMouseMove(e);
      },
    };

    React.useImperativeHandle(ref, () => ({
      setIsVideoLoaded: (value: boolean) => {
        setIsVideoLoaded(value);
      },
    }));

    return (
      <div
        ref={cardRef}
        className={`transition-all max-sm:h-full duration-300 touch-none ${
          isExpanded
            ? "fixed inset-0 z-[100] m-0 p-0 bg-black flex items-center justify-center h-[100dvh] w-screen"
            : "absolute left-1/2 top-0 sm:top-4 -translate-x-1/2 w-full max-w-sm aspect-[9/16]"
        } ${isDisabled ? "opacity-50 cursor-not-allowed select-none" : ""}`}
      >
        {walletState.showHardPrompt && (
          <WalletBlockModal
            onConnectWallet={onConnectWallet}
            isConnecting={isConnectingWallet}
            isConnected={isWalletConnected}
          />
        )}
        {/* Stack of cards */}
        {stackCards.map((stackContent, index) => (
          <StackedCard
            key={stackContent.id}
            content={stackContent}
            isExpanded={isExpanded}
            isVideoLoaded={false}
            isHolding={false}
            betAmount={0}
            index={index + 1}
            swipeDirection={null}
            isActive={false}
            onExpand={handleExpand}
            videoRef={videoRef}
            onVideoLoad={handleVideoLoad}
            reward={reward}
            handlers={enhancedHandlers}
            isPrefetched={false}
          />
        ))}

        {/* Active card */}
        <StackedCard
          content={content}
          isExpanded={isExpanded}
          isVideoLoaded={isVideoLoaded}
          isHolding={isHolding}
          betAmount={betAmount}
          index={0}
          swipeDirection={swipeDirection}
          isActive={true}
          onExpand={handleExpand}
          videoRef={videoRef}
          onVideoLoad={handleVideoLoad}
          reward={reward}
          handlers={enhancedHandlers}
          isPrefetched={isPrefetched}
        />

        <BettingControls
          betAmount={betAmount}
          reward={reward}
          onIncrement={() => !isDisabled && handleBetIncrement()}
          onDecrement={() => !isDisabled && handleBetDecrement()}
        />

        <ActionButtons
          leftAction={leftAction}
          rightAction={rightAction}
          onLeftClick={() => {
            if (!isDisabled) {
              handleSwipeComplete("left", betAmount);
            }
          }}
          onRightClick={() => {
            if (!isDisabled) {
              handleSwipeComplete("right", betAmount);
            }
          }}
          onClassificationSelect={
            !isDisabled ? handleClassificationSelect : undefined
          }
          alternativeClassifications={alternativeClassifications || []}
          disabled={isDisabled}
        />
      </div>
    );
  }
);

SwipeCard.displayName = "SwipeCard";
