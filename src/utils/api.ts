import {
  ApiResponse,
  RandomVideoClipResponse,
  UserRegistration,
  UserProfile,
} from "../types";

const API_BASE_URL = "http://103.179.45.246/api"; //cicd

export async function fetchRandomVideoClip(): Promise<
  RandomVideoClipResponse[]
> {
  const response = await fetch(`${API_BASE_URL}/video-clip-action`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    mode: "cors",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch random video clip");
  }

  return response.json();
}

export async function getUserByWallet(
  walletAddress: string
): Promise<ApiResponse<UserProfile | null>> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/get`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({ walletAddress }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch user");
    }

    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch user"
    );
  }
}

export async function registerUser(
  userData: UserRegistration
): Promise<ApiResponse<UserProfile>> {
  const response = await fetch(`${API_BASE_URL}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    mode: "cors",
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Registration failed");
  }

  return data;
}
