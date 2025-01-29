import { Content, UserReward } from "../../types";

interface InfoOverlayProps {
  content: Content;
  isExpanded: boolean;
  reward: UserReward;
}

export const InfoOverlay: React.FC<InfoOverlayProps> = ({ reward }) => {
  return (
    <div className="absolute top-4 left-4 z-20 space-y-2">
      <div className="flex flex-col gap-2">
        <div className="flex  items-center gap-2">
          {/* <div className="px-3 py-1 rounded-full">
            <span className="text-lg font-medium text-purple-50">
              Level {reward.level}
            </span>
          </div> */}
          <div className="px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-500/30">
            <span className="text-sm font-medium text-blue-200">
              {reward.points} points
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
