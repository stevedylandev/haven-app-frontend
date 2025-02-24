import { useState } from "react";
import { createPortal } from "react-dom";
import { useProfile } from "../../hooks/useProfile";
import { UserProfile } from "../../types";
import { useToast } from "../../hooks/useToast";

interface EditProfileDialogProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedProfile: UserProfile) => void;
}

export const EditProfileDialog = ({
  user,
  isOpen,
  onClose,
  onUpdate,
}: EditProfileDialogProps) => {
  const { toast } = useToast();
  const { updateProfile, isLoading } = useProfile(user.id);
  const [userName, setUserName] = useState(user.userName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateProfile({ userName });
    if (result) {
      toast("Profile updated successfully");
      onUpdate(result);
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-white/20 rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold text-white mb-4">
          Change Username
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-white/70 block mb-1">Username</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-white/5 text-white border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-white/70 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default EditProfileDialog;
