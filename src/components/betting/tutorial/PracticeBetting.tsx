import { useState, useCallback } from "react";
import type { PracticeBet } from "../../../types/tutorial";

interface PracticeBettingProps {
  onComplete: () => void;
}

const DEMO_CLIP = {
  id: "demo-clip-1",
  title: "Practice Clip",
  labels: ["dancing", "singing", "talking"],
  defaultPoints: 100,
};

export function PracticeBetting({ onComplete }: PracticeBettingProps) {
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [betAmount, setBetAmount] = useState<number>(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);

  const handlePlaceBet = useCallback(async () => {
    if (!selectedLabel || betAmount <= 0) return;

    setIsProcessing(true);

    const bet: PracticeBet = {
      clipId: DEMO_CLIP.id,
      prediction: selectedLabel,
      amount: betAmount,
      timestamp: new Date().toISOString(),
    };

    // Simulate bet processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For practice, randomly determine if the bet was correct
    const isCorrect = Math.random() > 0.5;
    const outcome = isCorrect ? "correct" : "incorrect";

    setResult(outcome);
    bet.outcome = outcome;

    // Store practice bet in local storage
    const storedBets = localStorage.getItem("practice_bets");
    const bets = storedBets ? JSON.parse(storedBets) : [];
    localStorage.setItem("practice_bets", JSON.stringify([...bets, bet]));

    setIsProcessing(false);

    // Complete after showing result
    setTimeout(() => {
      onComplete();
    }, 2000);
  }, [selectedLabel, betAmount, onComplete]);

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-gray-50 p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Practice Clip
        </h4>
        <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
          <span className="text-gray-500">Demo Video Clip</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Label
          </label>
          <div className="flex gap-2">
            {DEMO_CLIP.labels.map((label) => (
              <button
                key={label}
                onClick={() => setSelectedLabel(label)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedLabel === label
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bet Amount
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="10"
              max={DEMO_CLIP.defaultPoints}
              step="10"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-600 min-w-[4rem]">
              {betAmount} pts
            </span>
          </div>
        </div>

        <button
          onClick={handlePlaceBet}
          disabled={!selectedLabel || isProcessing}
          className="w-full inline-flex justify-center items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              Processing...
              <span className="animate-spin">⚪</span>
            </span>
          ) : (
            "Place Bet"
          )}
        </button>

        {result && (
          <div
            className={`p-4 rounded-md ${
              result === "correct"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {result === "correct"
              ? "🎉 Congratulations! Your prediction was correct!"
              : "Nice try! Keep practicing to improve your predictions."}
          </div>
        )}
      </div>
    </div>
  );
}
