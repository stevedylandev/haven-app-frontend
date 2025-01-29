import { usePrivy } from "@privy-io/react-auth";

export const useWalletConnection = () => {
  const { login, logout, authenticated, ready, user } = usePrivy();

  return {
    isConnected: authenticated,
    isConnecting: !ready,
    publicKey: user?.wallet?.address,
    login,
    logout,
    // Removed makeTestTransaction as it was specific to Solana
  };
};
