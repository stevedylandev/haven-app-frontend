import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import {
  getStoredClassifications,
  clearClassifications,
} from "../utils/storage";
import { useWalletConnection } from "../hooks/useWalletConnection";
import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";

interface SubmitButtonProps {
  classificationsCount: number;
  isShaken: boolean;
  onSubmit: () => void;
}

export function SubmitButton({
  classificationsCount,
  isShaken,
  onSubmit,
}: SubmitButtonProps) {
  const { isConnected, logout } = useWalletConnection();
  const { login } = usePrivy();
  const [isLoading, setIsLoading] = useState(false);
  const shouldShow = classificationsCount >= 25 || isShaken;

  if (!shouldShow) return null;

  if (!isConnected) {
    return (
      <div className="fixed bottom-16 bg-black/80 backdrop-blur-sm p-4 rounded-3xl left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <p className="text-white/80 text-lg">
          Connect wallet to submit classifications
        </p>
        <Button
          onClick={login}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Connect Wallet
        </Button>
      </div>
    );
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    const storage = getStoredClassifications();

    try {
      // Log the classifications being submitted
      console.log("Submitting classifications:", storage.classifications);

      // Clear the stored classifications after successful submission
      clearClassifications();

      // Disconnect after successful submission
      await logout();
      alert(
        "Classifications submitted successfully! Please reconnect wallet for next batch."
      );
      onSubmit();
    } catch (error) {
      console.error("Failed to submit classifications:", error);
      alert("Failed to submit classifications. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2">
      <Button
        onClick={handleSubmit}
        disabled={isLoading}
        size="lg"
        className="bg-gradient-to-br from-purple-900/50 to-black border border-purple-800/50 hover:bg-black/70
                  shadow-lg transition-all transform hover:scale-105 active:scale-95 gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            <span>Submit Classifications ({classificationsCount}/25)</span>
          </>
        )}
      </Button>
    </div>
  );
}
