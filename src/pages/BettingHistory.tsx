import { Navigate } from "react-router-dom";
import { BetHistoryDashboard } from "../components/betting";

interface BettingHistoryProps {
  authenticated: boolean;
}

const BettingHistory: React.FC<BettingHistoryProps> = ({ authenticated }) => {
  // Redirect to home if not authenticated
  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Betting History</h1>
        <BetHistoryDashboard />
      </div>
    </div>
  );
};

export default BettingHistory;
