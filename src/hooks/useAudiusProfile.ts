import { useState, useEffect } from "react";
import { useAudius } from "../context/AudiusContext";
import { getUser } from "../utils/audius";

export function useAudiusProfile() {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const { userId } = useAudius();

  useEffect(() => {
    async function fetchProfile() {
      try {
        // Ensure userId is available before proceeding
        if (userId) {
          const user = await getUser(userId);
          if (user?.profile_picture) {
            setProfilePicture(user.profile_picture["150x150"]);
          } else {
            setProfilePicture(null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch Audius profile:", error);
      }
    }

    fetchProfile();
  }, [userId]);

  return { profilePicture };
}
