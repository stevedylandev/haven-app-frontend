import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { TutorialStepKey, TUTORIAL_STEPS } from "../../../types/tutorial";
import { useTutorialProgress } from "../../../hooks/useTutorialProgress";
import { useWalletConnection } from "../../../hooks/useWalletConnection";
import { PracticeBetting } from "./PracticeBetting";

export function BettingTutorial() {
  const {
    shouldShowTutorial,
    currentStep,
    completedSteps,
    markStepComplete,
    completeTutorial,
    markPracticeBetComplete,
  } = useTutorialProgress();
  const { isConnected, login } = useWalletConnection();
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isConnected && currentStep === TUTORIAL_STEPS.walletConnection.id) {
      markStepComplete("walletConnection");
    }
  }, [isConnected, currentStep, markStepComplete]);

  const handleNext = (stepKey: TutorialStepKey) => {
    markStepComplete(stepKey);
  };

  const handleComplete = () => {
    completeTutorial();
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
    }, 200);
  };

  const handlePracticeBetComplete = () => {
    markPracticeBetComplete();
    handleNext("practiceInterface");
  };

  const renderStepContent = (stepKey: TutorialStepKey) => {
    const step = TUTORIAL_STEPS[stepKey];

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
        <p className="text-sm text-gray-500">{step.content}</p>
        {step.animationKey && stepKey !== "practiceInterface" && (
          <div className="my-4 h-32 w-full bg-gray-100 rounded-lg flex items-center justify-center">
            {/* TODO: Add animations */}
            <span className="text-gray-400">
              Animation placeholder: {step.animationKey}
            </span>
          </div>
        )}
        {stepKey === "walletConnection" && !isConnected && (
          <button
            onClick={login}
            className="mt-4 w-full inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Connect Wallet
          </button>
        )}
        {stepKey === "practiceInterface" && (
          <div className="mt-4">
            <PracticeBetting onComplete={handlePracticeBetComplete} />
          </div>
        )}
        <div className="mt-6 flex justify-end">
          {stepKey !== "practiceInterface" &&
            step.id < Object.keys(TUTORIAL_STEPS).length && (
              <button
                onClick={() => handleNext(stepKey)}
                disabled={stepKey === "walletConnection" && !isConnected}
                className="inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-300"
              >
                Next
              </button>
            )}
          {step.id === Object.keys(TUTORIAL_STEPS).length && (
            <button
              onClick={handleComplete}
              className="inline-flex justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
            >
              Complete Tutorial
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog
      open={shouldShowTutorial && !isClosing}
      onClose={() => {}}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-lg font-medium text-gray-900">
                Betting Tutorial
              </Dialog.Title>
              <div className="text-sm text-gray-500">
                Step {currentStep} of {Object.keys(TUTORIAL_STEPS).length}
              </div>
            </div>
            <div className="mt-2 h-1 w-full bg-gray-200 rounded">
              <div
                className="h-full bg-blue-600 rounded transition-all duration-300"
                style={{
                  width: `${
                    (completedSteps.length /
                      Object.keys(TUTORIAL_STEPS).length) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>

          {Object.entries(TUTORIAL_STEPS).map(
            ([key, step]) =>
              currentStep === step.id && (
                <div key={key}>{renderStepContent(key as TutorialStepKey)}</div>
              )
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
