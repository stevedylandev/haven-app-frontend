import React from "react";
import { useWalletPrompt } from "../../hooks/useWalletPrompt";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface WalletBlockModalProps {
  onConnectWallet: () => void;
  isConnecting: boolean;
  isConnected: boolean;
}

export function WalletBlockModal({
  onConnectWallet,
  isConnecting,
  isConnected,
}: WalletBlockModalProps) {
  const walletState = useWalletPrompt(isConnected);
  const progressPercent = Math.min((walletState.clipCount / 50) * 100, 100);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="max-w-md w-full p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center">
          Wallet Connection Required
        </h2>

        <div className="space-y-2">
          <p className="text-center">
            You've labeled {walletState.clipCount} clips! To continue using the
            app, you need to connect your wallet.
          </p>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
            <div
              className="bg-primary h-4 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-sm text-center text-gray-500">
            {walletState.clipCount}/50 clips viewed
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500 text-center">
            Connecting your wallet enables:
          </p>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
            <li>Secure storage of your points</li>
            <li>Participation in betting rounds</li>
            <li>Earning rewards for accurate labels</li>
            <li>Access to premium features</li>
          </ul>
        </div>

        <Button
          onClick={onConnectWallet}
          disabled={isConnecting}
          className="w-full"
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>

        <p className="text-xs text-center text-gray-500">
          You'll need a Solana wallet to continue. We recommend using Phantom
          Wallet.
        </p>
      </Card>
    </div>
  );
}
