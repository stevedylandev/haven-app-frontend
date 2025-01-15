import React, { useState } from "react";
import { Content, ActionChoice, UserReward } from "../types";
import { Coins } from "lucide-react";

export interface SwipeCardProps {
  content: Content;
  leftAction: ActionChoice;
  rightAction: ActionChoice;
  onSwipe: (direction: "left" | "right", betAmount: number) => void;
  reward: UserReward;
  disabled?: boolean;
}

export const SwipeCard = React.forwardRef<
  SwipeCardPublicMethods,
  SwipeCardProps
>(({ content, leftAction, rightAction, onSwipe, reward, disabled }, ref) => {
  const [startX, setStartX] = React.useState(0);
  const [currentX, setCurrentX] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [hoverSide, setHoverSide] = React.useState<"left" | "right" | null>(
    null
  );
  const [isExpanded, setIsExpanded] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = React.useState(false);
  const [betAmount, setBetAmount] = useState(0);

  React.useImperativeHandle(ref, () => ({
    setIsVideoLoaded: (value: boolean) => {
      setIsVideoLoaded(value);
    },
  }));

  React.useEffect(() => {
    function updateDimensions() {
      if (!cardRef.current || !videoRef.current) return;

      if (isExpanded) {
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const video = videoRef.current;
        const videoRatio = video.videoWidth / video.videoHeight;

        const maxHeight = viewportHeight * 0.9;
        const maxWidth = viewportWidth;

        let width, height;

        if (maxWidth / maxHeight > videoRatio) {
          height = maxHeight;
          width = height * videoRatio;
        } else {
          width = maxWidth;
          height = width / videoRatio;
        }

        cardRef.current.style.width = `${width}px`;
        cardRef.current.style.height = `${height}px`;
      } else {
        cardRef.current.style.width = "";
        cardRef.current.style.height = "";
      }
    }

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, [isExpanded]);

  const handleExpand = async () => {
    const video = videoRef.current;
    if (!video) return;

    setIsExpanded(!isExpanded);

    try {
      if (!isExpanded) {
        video.muted = false;
        await video.play();
      } else {
        video.muted = true;
      }
    } catch (error) {
      console.error("Failed to play video:", error);
    }
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (isExpanded || disabled) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || isExpanded || disabled) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setCurrentX(clientX - startX);
  };

  const handleTouchEnd = () => {
    if (!isDragging || isExpanded) return;
    setIsDragging(false);

    if (Math.abs(currentX) > 100) {
      onSwipe(currentX > 0 ? "right" : "left", betAmount);
    }

    setCurrentX(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging || isExpanded) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setHoverSide(x < rect.width / 2 ? "left" : "right");
  };

  const handleMouseLeave = () => {
    setHoverSide(null);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging || disabled) return;
    if (!isExpanded) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      onSwipe(x < rect.width / 2 ? "left" : "right", betAmount);
    }
  };

  const transform = isDragging
    ? `translateX(${currentX}px) rotate(${currentX * 0.1}deg)`
    : hoverSide === "left"
    ? "translateX(-20px) rotate(-2deg)"
    : hoverSide === "right"
    ? "translateX(20px) rotate(2deg)"
    : "";

  const opacity = isDragging ? Math.max(0, 1 - Math.abs(currentX) / 500) : 1;

  const incrementBet = () => {
    if (betAmount < reward.points) {
      setBetAmount((prev) => prev + 1);
    }
  };

  const decrementBet = () => {
    if (betAmount > 0) {
      setBetAmount((prev) => prev - 1);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-300 ${
        isExpanded
          ? "fixed left-0 top-4 z-50 m-0 p-0"
          : "absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-sm aspect-[9/16]"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <button
        onClick={handleExpand}
        className="absolute top-4 right-4 z-50 bg-gradient-to-br from-red-500 to-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full shadow-md"
      >
        {isExpanded ? (
          <MinimizeIcon fill="currentColor" />
        ) : (
          <MaximizeIcon fill="currentColor" />
        )}
      </button>

      <div
        className={`absolute inset-0 bg-black border-2 border-red-500 rounded-2xl transition-all duration-200 ${
          isExpanded ? "cursor-zoom-out" : "cursor-grab"
        }`}
        style={{ transform: isExpanded ? "none" : transform, opacity }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={(e) => {
          handleTouchMove(e);
          handleMouseMove(e);
        }}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {content.type === "image" ? (
          <img
            src={content.url}
            alt="Content to classify"
            className="w-full h-full object-contain rounded-2xl"
            draggable={false}
          />
        ) : (
          <>
            {!isVideoLoaded && (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center animate-pulse rounded-2xl">
                {/* Loading spinner or placeholder */}
              </div>
            )}
            <video
              ref={videoRef}
              src={content.url}
              className="w-full h-full object-contain rounded-2xl"
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={() => setIsVideoLoaded(true)}
              style={{ display: isVideoLoaded ? "block" : "none" }}
            />
          </>
        )}
      </div>

      {/* Betting Amount Section */}
      <div className="absolute bottom-20 left-0 right-0 px-4">
        <div className="flex justify-center items-center space-x-4">
          {/* Decrease Bet Button */}
          <button
            onClick={decrementBet}
            className="relative bg-gradient-to-br from-red-700 to-red-500 hover:from-red-500 hover:to-red-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none shadow-md transition-transform active:scale-95"
            title="Decrement Bet"
          >
            <Coins className="w-6 h-6" />
            <span className="absolute top-0 left-0 w-full h-full rounded-full pointer-events-none opacity-0 hover:opacity-20 bg-white"></span>
          </button>

          {/* Bet Amount Display */}
          <span className="text-yellow-500 font-bold text-6xl shadow-md">
            {betAmount}
          </span>

          {/* Increase Bet Button */}
          <button
            onClick={incrementBet}
            className="relative bg-gradient-to-br from-yellow-500 to-yellow-700 hover:from-yellow-700 hover:to-yellow-500 text-red-900 font-bold py-2 px-4 rounded-full focus:outline-none shadow-md transition-transform active:scale-95"
            title="Increment Bet"
          >
            <StackOfChipsIcon className="w-6 h-6" />
            <span className="absolute top-0 left-0 w-full h-full rounded-full pointer-events-none opacity-0 hover:opacity-20 bg-white"></span>
          </button>
        </div>
        {/* Bet Amount Range Indicator (Progress Bar) */}
        <div className="mt-2 bg-gray-700 rounded-full h-2 relative">
          <div
            className="bg-gradient-to-r from-red-500 to-yellow-500 rounded-full h-2"
            style={{ width: `${(betAmount / reward.points) * 100}%` }}
          />
          <span className="absolute left-0 top-full mt-1 text-white text-sm">
            0
          </span>
          <span className="absolute right-0 top-full mt-1 text-white text-sm">
            {reward.points}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-between items-center">
        {/* Left Action Button */}
        <button
          onClick={() => !disabled && onSwipe("left", betAmount)}
          className={`relative bg-gradient-to-br from-red-700 to-red-500 hover:from-red-500 hover:to-red-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none shadow-md overflow-hidden transition-transform active:scale-95 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={disabled}
        >
          <LeftArrowIcon
            fill="currentColor"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6"
          />
          <span className="ml-3">{leftAction.label}</span>
          <span className="absolute top-0 left-0 w-full h-full rounded-full pointer-events-none opacity-0 hover:opacity-10 bg-white"></span>
          <span
            className="absolute top-0 left-0 w-full h-full bg-white transform scale-0 rounded-full pointer-events-none duration-500 ease-out"
            style={{ animation: "pulse-glow 1s ease-out infinite" }}
          ></span>
        </button>

        {/* Right Action Button */}
        <button
          onClick={() => !disabled && onSwipe("right", betAmount)}
          className={`relative bg-gradient-to-br from-yellow-500 to-yellow-700 hover:from-yellow-700 hover:to-yellow-500 text-red-900 font-bold py-3 px-6 rounded-full focus:outline-none shadow-md overflow-hidden transition-transform active:scale-95 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={disabled}
        >
          <span className="mr-3">{rightAction.label}</span>
          <RightArrowIcon
            fill="currentColor"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6"
          />
          <span className="absolute top-0 left-0 w-full h-full rounded-full pointer-events-none opacity-0 hover:opacity-10 bg-white"></span>
          <span
            className="absolute top-0 left-0 w-full h-full bg-white transform scale-0 rounded-full pointer-events-none duration-500 ease-out"
            style={{ animation: "pulse-glow 1s ease-out infinite" }}
          ></span>
        </button>
      </div>

      {/* Floating particles animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-50 animate-float"></div>
        <div className="absolute w-3 h-3 bg-red-500 rounded-full opacity-60 animate-float delay-1000"></div>
        <div className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-50 animate-float delay-2000"></div>
      </div>
    </div>
  );
});

SwipeCard.displayName = "SwipeCard";

export interface SwipeCardPublicMethods {
  setIsVideoLoaded: (value: boolean) => void;
}

// Icon components
const MaximizeIcon = ({ fill }: { fill: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
  >
    <path fill="none" stroke={fill} strokeWidth="2" d="M3 3h18v18H3z" />
    <path
      stroke={fill}
      strokeWidth="2"
      d="M7 7l-4 4m16-4l-4 4m4 8l-4-4m-16 4l4-4"
    />
  </svg>
);

const MinimizeIcon = ({ fill }: { fill: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
  >
    <path fill="none" stroke={fill} strokeWidth="2" d="M3 3h18v18H3z" />
    <path stroke={fill} strokeWidth="2" d="M5 12h14" />
  </svg>
);

const StackOfChipsIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M2 5.25a3.25 3.25 0 013.25-3.25H18.5A3.25 3.25 0 0121.75 5.25v13.5a3.25 3.25 0 01-3.25 3.25H5.25A3.25 3.25 0 012 18.75V5.25zM5.25 3a1.75 1.75 0 00-1.75 1.75v13.5c0 .966.784 1.75 1.75 1.75H18.5a1.75 1.75 0 001.75-1.75V5.25A1.75 1.75 0 0018.5 3H5.25z" />
    <path d="M4 7a2 2 0 012-2h12a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V7zm2-1a1 1 0 00-1 1v11a1 1 0 001 1h12a1 1 0 001-1V7a1 1 0 00-1-1H6z" />
  </svg>
);

const LeftArrowIcon = ({
  fill,
  className,
}: {
  fill: string;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={fill}
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-4.28 9.22a.75.75 0 000 1.06l3 3a.75.75 0 101.06-1.06l-1.72-1.72h5.69a.75.75 0 000-1.5h-5.69l1.72-1.72a.75.75 0 00-1.06-1.06l-3 3z"
      clipRule="evenodd"
    />
  </svg>
);

const RightArrowIcon = ({
  fill,
  className,
}: {
  fill: string;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={fill}
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12 6.615 2.25 12 2.25zm2.78 9.22a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06-1.06l-1.72-1.72H8.25a.75.75 0 000-1.5h5.69l-1.72-1.72a.75.75 0 101.06-1.06l3 3z"
      clipRule="evenodd"
    />
  </svg>
);
