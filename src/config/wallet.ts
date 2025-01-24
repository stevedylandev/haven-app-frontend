import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { BackpackWalletAdapter } from "@solana/wallet-adapter-backpack";
import { clusterApiUrl } from "@solana/web3.js";

export const network = WalletAdapterNetwork.Devnet;
export const endpoint = clusterApiUrl(network);
export const wallets = [
  new PhantomWalletAdapter(),
  new BackpackWalletAdapter(),
];
