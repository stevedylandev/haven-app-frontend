import { RandomVideoClipDisplay } from "../components/RandomVideoClipDisplay";
import { Link } from "react-router-dom";

export function VerifyClips() {
  const handleActionSelect = (clipId: string, selectedAction: string) => {
    // TODO: Implement action verification submission
    console.log("Verified clip:", clipId, "with action:", selectedAction);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/50 to-black p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Verify Video Clips</h1>
          <Link
            to="/"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
          >
            Back to Home
          </Link>
        </div>
        <RandomVideoClipDisplay onActionSelect={handleActionSelect} />
      </div>
    </div>
  );
}
