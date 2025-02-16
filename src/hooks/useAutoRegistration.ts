import { useState, useEffect, useCallback } from "react";
import { useWalletConnection } from "./useWalletConnection";
import { getUserByWallet, registerUser } from "../utils/api";
import { UserRegistration, UserProfile } from "../types";
import { useToast } from "./useToast";

export const useAutoRegistration = () => {
  const { isConnected, publicKey } = useWalletConnection();
  const { error: showError } = useToast();
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkUserExists = useCallback(
    async (address: string) => {
      try {
        const response = await getUserByWallet(address);
        if (response.data) {
          setUser(response.data);
          return true;
        }
        return false;
      } catch {
        showError("Failed to fetch user details");
        return false;
      }
    },
    [showError]
  );

  const handleRegistration = async (
    userData: Omit<UserRegistration, "ethereumAddress" | "roleType">
  ) => {
    if (!publicKey) {
      showError("No wallet connected");
      return;
    }

    setIsLoading(true);
    try {
      const registrationData: UserRegistration = {
        ...userData,
        ethereumAddress: publicKey,
        roleType: "AI_LABLER",
      };

      const response = await registerUser(registrationData);
      if (response.data) {
        setUser(response.data);
        setShowRegistrationDialog(false);
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      if (isConnected && publicKey && !user && !isLoading) {
        const exists = await checkUserExists(publicKey);
        if (!exists) {
          setShowRegistrationDialog(true);
        }
      }
    };

    initializeUser();
  }, [isConnected, publicKey, user, isLoading, checkUserExists]);

  return {
    isLoading,
    user,
    showRegistrationDialog,
    closeRegistrationDialog: () => setShowRegistrationDialog(false),
    handleRegistration,
  };
};
