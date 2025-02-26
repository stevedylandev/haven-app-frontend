import { usePrivy } from "@privy-io/react-auth";

export const useWalletConnection = () => {
  const { login, logout, authenticated, ready, user } = usePrivy();

  return {
    isConnected: ready && authenticated,
    isConnecting: !ready,
    publicKey: user?.wallet?.address || null,
    ready,
    login,
    logout,
  };
};
