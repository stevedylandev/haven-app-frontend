import { useState } from "react";
import { UserProfile } from "../../types";
import { truncateAddress } from "../../utils/helpers";
import EditProfileDialog from "./EditProfileDialog";

interface UserProfileDisplayProps {
  user: UserProfile;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
}

const UserProfileDisplay = ({
  user,
  onProfileUpdate,
}: UserProfileDisplayProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-white">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{user.userName}</h3>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              user.roleType === "HUMAN_LABELER"
                ? "bg-emerald-500/30 text-emerald-200"
                : "bg-blue-500/20 text-blue-200"
            }`}
          >
            {user.roleType === "HUMAN_LABELER" ? "Human Labeler" : "AI Labeler"}
          </span>
        </div>

        <div className="text-sm text-white/70 space-y-1">
          <p>{user.email}</p>
          <p className="font-mono">{truncateAddress(user.ethereumAddress)}</p>
          <p className="text-xs text-white/50">
            Joined {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/5 rounded p-2">
            <div className="text-2xl font-bold">{user.points}</div>
            <div className="text-xs text-white/60">Points</div>
          </div>
          <div className="bg-white/5 rounded p-2">
            <div className="text-2xl font-bold">{user.totalContributions}</div>
            <div className="text-xs text-white/60">Contributions</div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsEditDialogOpen(true)}
            className="text-sm text-blue-400 hover:text-blue-300 focus:outline-none"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <EditProfileDialog
        user={user}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onUpdate={onProfileUpdate}
      />
    </div>
  );
};

export default UserProfileDisplay;
