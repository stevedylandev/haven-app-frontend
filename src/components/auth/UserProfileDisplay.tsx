import { UserProfile } from "../../types";
import { truncateAddress } from "../../utils/helpers";

interface UserProfileDisplayProps {
  user: UserProfile;
}

const UserProfileDisplay = ({ user }: UserProfileDisplayProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-white">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{user.userName}</h3>
          <span className="px-2 py-1 text-xs bg-blue-500/20 rounded-full">
            {user.roleType}
          </span>
        </div>

        <div className="text-sm text-white/70">
          <p>{user.email}</p>
          <p className="font-mono">{truncateAddress(user.ethereumAddress)}</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/5 rounded p-2">
            <div className="text-2xl font-bold">{user.points}</div>
            <div className="text-xs text-white/60">Points</div>
          </div>
          <div className="bg-white/5 rounded p-2">
            <div className="text-2xl font-bold">
              {user.classificationsCount}
            </div>
            <div className="text-xs text-white/60">Verifications</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileDisplay;
