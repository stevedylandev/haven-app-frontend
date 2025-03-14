import { sample } from "./helpers";

interface AudiusFavorite {
  favorite_item_id: string;
}

interface AudiusTrack {
  artwork: {
    "150x150": string;
    "480x480": string;
    "1000x1000": string;
  };
}

let cachedHost: string | null = null;

export async function getAudiusHost(): Promise<string | null> {
  if (cachedHost) return cachedHost;

  try {
    const hosts = await fetch("/audius")
      .then((r) => r.json())
      .then((j) => j.data);

    cachedHost = sample(hosts) ?? null;
    return cachedHost;
  } catch (error) {
    console.error("Failed to fetch Audius hosts:", error);
    return null;
  }
}

export async function searchUser(query: string): Promise<string | null> {
  const host = await getAudiusHost();
  if (!host) return null;
  const response = await fetch(
    `${host}/v1/users/search?query=${query}&app_name=ActionFi`
  );
  const data = await response.json();
  return data.data[0]?.id || null;
}

export async function getUser(userId: string) {
  const host = await getAudiusHost();
  const response = await fetch(`${host}/v1/users/${userId}?app_name=ActionFi`);
  const data = await response.json();
  return data.data;
}

export async function getUserFavorites(
  userId: string
): Promise<AudiusFavorite[]> {
  const host = await getAudiusHost();
  const response = await fetch(
    `${host}/v1/users/${userId}/favorites?app_name=ActionFi`
  );
  const data = await response.json();
  return data.data || [];
}

export async function getTrack(trackId: string): Promise<AudiusTrack | null> {
  const host = await getAudiusHost();
  const response = await fetch(
    `${host}/v1/tracks/${trackId}?app_name=ActionFi`
  );
  const data = await response.json();
  return data.data || null;
}
