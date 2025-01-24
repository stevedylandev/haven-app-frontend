import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { ReactNode } from "react";
import { ErrorBoundary } from "../common/ErrorBoundary";
import { ToastProvider } from "./ToastProvider";
import { AudiusProvider } from "../../context/AudiusContext";
import { endpoint, wallets } from "../../config/wallet";

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ErrorBoundary>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <AudiusProvider>
              <ToastProvider />
              {children}
            </AudiusProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ErrorBoundary>
  );
};
