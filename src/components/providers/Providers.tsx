import { ReactNode } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { ErrorBoundary } from "../common/ErrorBoundary";
import { ToastProvider } from "./ToastProvider";
import { AudiusProvider } from "../../context/AudiusContext";

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ErrorBoundary>
      <PrivyProvider
        appId={"cm6b71m7h006r6afi6tsaxsht"}
        config={{
          loginMethods: ["email", "wallet"],
          appearance: {
            theme: "dark",
            accentColor: "#676FFF",
          },
        }}
      >
        <AudiusProvider>
          <ToastProvider />
          {children}
        </AudiusProvider>
      </PrivyProvider>
    </ErrorBoundary>
  );
};
