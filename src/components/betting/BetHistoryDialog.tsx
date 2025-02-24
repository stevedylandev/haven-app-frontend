import React from "react";
import { X } from "lucide-react";
import BetHistoryDashboard from "./BetHistoryDashboard";

interface BetHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const BetHistoryDialog: React.FC<BetHistoryDialogProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-b from-gray-900/95 via-gray-900/95 to-black/95 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Betting History</h2>
            <button
              onClick={onClose}
              className="relative rounded-full p-2 hover:bg-gray-700/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <BetHistoryDashboard />
        </div>
      </div>
    </div>
  );
};

export default BetHistoryDialog;
