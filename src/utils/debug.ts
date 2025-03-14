import { getClipCount } from "./storage";

export function debugClipCount() {
  const count = getClipCount();
  console.log(`Current clip count: ${count}`);
  console.log(`Local storage value:`, localStorage.getItem("total_clip_count"));
  return count;
}
