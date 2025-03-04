import { usePrivy } from "@privy-io/react-auth";
import { Navigate } from "react-router-dom";
import { PointsDashboard } from "../components/lazy";
import { useAutoRegistration } from "../hooks/useAutoRegistration";

const PointsOverview = () => {
  const { authenticated } = usePrivy();
  const { user } = useAutoRegistration();

  if (!authenticated) {
    return <Navigate to="/" />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900/50 to-black flex items-center justify-center">
        <div className="animate-pulse text-white/60">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/50 to-black p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
          Points Dashboard
        </h1>
        <div className="p-4 sm:p-6 bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg">
          <PointsDashboard userId={user.id} />
        </div>
      </div>
    </div>
  );
};

export default PointsOverview;
