import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
const solanaConnectors = toSolanaWalletConnectors();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrivyProvider
      appId="cm6b71m7h006r6afi6tsaxsht"
      config={{
        externalWallets: {
          solana: { connectors: solanaConnectors },
        },
        solanaClusters: [
          // {
          //   name: "mainnet-beta",
          //   rpcUrl: "https://api.mainnet-beta.solana.com",
          // },
          { name: "devnet", rpcUrl: "https://api.devnet.solana.com" },
          // { name: "testnet", rpcUrl: "https://api.testnet.solana.com" },
        ],

        // Display email and wallet as login methods
        loginMethods: ["email", "wallet"],
        // Customize Privy's appearance in your app
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          // logo: "https://your-logo-url",
          walletChainType: "solana-only",
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <App />
    </PrivyProvider>
  </StrictMode>
);
