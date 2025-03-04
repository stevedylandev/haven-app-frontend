import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useWalletConnection } from "../../hooks/useWalletConnection";
import { setWalletPrompted } from "../../utils/storage";
import { useClipCount } from "../../hooks/useClipCount";
import { useWalletPrompt } from "../../hooks/useWalletPrompt";

export function WalletPromptModal() {
  const { login, isConnected } = useWalletConnection();
  const clipCount = useClipCount();
  const shouldShowPrompt = useWalletPrompt(isConnected);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    // Add a small delay to allow the closing animation
    setTimeout(() => {
      if (!isConnected) {
        setWalletPrompted(); // Mark as prompted if user dismisses
      }
      setIsClosing(false);
    }, 200);
  };

  const handleConnect = async () => {
    setIsClosing(true);
    await login();
    setWalletPrompted();
    setIsClosing(false);
  };

  const handleSkip = () => {
    setIsClosing(true);
    setTimeout(() => {
      setWalletPrompted();
      setIsClosing(false);
    }, 200);
  };

  return (
    <Dialog
      open={shouldShowPrompt && !isClosing}
      onClose={handleClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-xl">
          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
            Connect Your Wallet
          </Dialog.Title>

          <div className="mt-4">
            <div className="mb-4">
              <div className="text-sm text-gray-500">
                You've viewed {clipCount}/25 clips! 🎉
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Connect your wallet to:
                <ul className="mt-2 list-disc pl-5">
                  <li>Earn rewards for your contributions</li>
                  <li>Access exclusive features</li>
                  <li>Participate in community governance</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                className="inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={handleConnect}
              >
                Connect Wallet
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                onClick={handleSkip}
              >
                Skip for Now
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
