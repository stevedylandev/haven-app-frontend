import { getClipCount, isWalletRequired, wasWalletPrompted } from "./storage";

export function debugWalletState() {
  const count = getClipCount();
  console.log({
    clipCount: count,
    isWalletRequired: isWalletRequired(),
    wasPrompted: wasWalletPrompted(),
    storedCount: localStorage.getItem("total_clip_count"),
    session: localStorage.getItem("session_id"),
  });
  return count;
}
