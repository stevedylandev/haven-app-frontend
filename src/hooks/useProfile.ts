import { useState } from "react";
import { ApiResponse, UserProfile, ProfileUpdateRequest } from "../types";
import { API_BASE_URL } from "../utils/api";

const BASE_URL = `${API_BASE_URL}/user`;

export const useProfile = (userId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (): Promise<UserProfile | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/${userId}/profile`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        mode: "cors",
      });
      const data: ApiResponse<UserProfile> = await response.json();

      if (data.HttpCode !== 200) {
        throw new Error(data.message);
      }

      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (
    updates: ProfileUpdateRequest
  ): Promise<UserProfile | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/${userId}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        body: JSON.stringify(updates),
      });

      const data: ApiResponse<UserProfile> = await response.json();

      if (data.HttpCode !== 200) {
        throw new Error(data.message);
      }

      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    fetchProfile,
    updateProfile,
  };
};
