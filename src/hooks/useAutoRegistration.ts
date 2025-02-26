import { useState, useEffect, useCallback } from "react";
import { useWalletConnection } from "./useWalletConnection";
import { getUserByWallet, registerUser } from "../utils/api";
import { UserRegistration, UserProfile } from "../types";
import { useToast } from "./useToast";

export const useAutoRegistration = () => {
  const { isConnected, publicKey, ready } = useWalletConnection();
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
      console.log("Initialize user effect running with state:", {
        ready,
        isConnected,
        publicKey,
        isLoading,
        hasUser: !!user,
      });

      if (!ready) {
        console.log("Privy not ready yet, waiting...");
        return;
      }

      if (isLoading) {
        console.log("Loading in progress, skipping initialization");
        return;
      }

      if (!publicKey) {
        console.log("No public key available, skipping initialization");
        return;
      }

      console.log("Starting user existence check for:", publicKey);
      try {
        const exists = await checkUserExists(publicKey);
        console.log("User existence check result:", exists);

        if (!exists) {
          console.log("User does not exist, showing registration dialog");
          setShowRegistrationDialog(true);
        } else {
          console.log("User exists, no registration needed");
        }
      } catch (err) {
        console.error("Failed to check user:", err);
        showError(
          "Could not verify user status. Please try refreshing the page."
        );
      }
    };

    initializeUser();
  }, [
    ready,
    isConnected,
    publicKey,
    user,
    isLoading,
    checkUserExists,
    showError,
  ]);

  return {
    isLoading,
    user,
    showRegistrationDialog,
    closeRegistrationDialog: () => setShowRegistrationDialog(false),
    handleRegistration,
  };
};
