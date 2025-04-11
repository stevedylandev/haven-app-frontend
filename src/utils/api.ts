import {
  ApiResponse,
  RandomVideoClipResponse,
  UserRegistration,
  UserProfile,
  PointsHistory,
  ContributionHistory,
  Action,
} from "../types";

console.log("Initializing API with base URL");
// export const API_BASE_URL = "http://localhost:3000/api";
// export const API_BASE_URL = "http://103.179.45.246/api";
export const API_BASE_URL = "https://kong-42d942b313uskmmab.kongcloud.dev/api";
console.log("API_BASE_URL:", API_BASE_URL);

// Verify API is reachable
fetch(`${API_BASE_URL}/health-check`, {
  method: "GET",
  mode: "cors",
})
  .then((response) =>
    console.log("API health check response:", response.status)
  )
  .catch((error) => console.error("API health check failed:", error));

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
  console.log("Attempting to fetch user for wallet:", walletAddress);

  // Maximum number of retries
  const MAX_RETRIES = 3;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      console.log(`Attempt ${attempt + 1} to fetch user...`);

      const response = await fetch(`${API_BASE_URL}/user/get`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        mode: "cors",
        body: JSON.stringify({ walletAddress }),
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch user");
      }

      return data;
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);

      // If this is our last attempt, throw the error
      if (attempt === MAX_RETRIES - 1) {
        throw new Error(
          error instanceof Error ? error.message : "Failed to fetch user"
        );
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
      attempt++;
    }
  }

  throw new Error("Max retries exceeded");
}

export async function getPointsHistory(
  userId: string
): Promise<ApiResponse<PointsHistory>> {
  const response = await fetch(
    `${API_BASE_URL}/user/${userId}/points-history`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      mode: "cors",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch points history");
  }

  return data;
}

export async function getContributionHistory(
  userId: string
): Promise<ApiResponse<ContributionHistory>> {
  const response = await fetch(
    `${API_BASE_URL}/user/${userId}/contribution-history`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      mode: "cors",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch contribution history");
  }

  return data;
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

export async function getClassificationPickerOptions(): Promise<
  ApiResponse<Action[]>
> {
  try {
    const response = await fetch(`${API_BASE_URL}/actions/random?limit=10`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      mode: "cors",
    });
    const data = await response.json();

    if (data.HttpCode !== 200) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    console.error("Error fetching classification picker options:", error);
    throw new Error("Failed to fetch classification picker options");
  }
}
