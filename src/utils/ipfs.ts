import { Content, VideoClip } from "../types";

const IPFS_GATEWAY = "https://premium.w3ipfs.storage/ipfs";
const VIDEO_LIST_CID =
  "bafkreickynka3fs6hrffvsjx67gw377273cv72rxxwh6xe4yi57kmrymgq";

interface VideoListResponse {
  video_clips: VideoClip[];
}

export async function fetchVideoList(): Promise<Content[]> {
  try {
    const response = await fetch(`${IPFS_GATEWAY}/${VIDEO_LIST_CID}`);
    const data: VideoListResponse = await response.json();

    console.log("Fetched video list:", data);
    return data.video_clips.map((clip) => ({
      id: clip.ipfs_cid,
      url: `${IPFS_GATEWAY}/${clip.ipfs_cid}`,
      type: "video",
      pointsValue: clip.points_value,
      leftActionId: clip.clip_action,
      rightActionId: clip.random_action,
    }));
  } catch (error) {
    console.error("Failed to fetch video list:", error);
    throw new Error("Failed to fetch video list");
  }
}
