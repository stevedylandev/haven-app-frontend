import { Buffer } from "buffer";
if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";

const DEVNET_ENDPOINT = "https://api.devnet.solana.com";
const TRANSACTION_COUNT_KEY = "wallet_transaction_count";
const MAX_TRANSACTIONS = 25;

export const useWalletConnection = () => {
  const { connected, connecting, publicKey, disconnect, sendTransaction } =
    useWallet();
  const [transactionCount, setTransactionCount] = useState(0);

  // Initialize transaction count from localStorage
  useEffect(() => {
    if (connected) {
      const storedCount = localStorage.getItem(TRANSACTION_COUNT_KEY);
      setTransactionCount(storedCount ? parseInt(storedCount) : 0);
    }
  }, [connected]);

  // Update localStorage when transaction count changes
  useEffect(() => {
    if (connected) {
      localStorage.setItem(TRANSACTION_COUNT_KEY, transactionCount.toString());

      // Auto-disconnect after MAX_TRANSACTIONS
      if (transactionCount >= MAX_TRANSACTIONS) {
        disconnect();
        localStorage.removeItem(TRANSACTION_COUNT_KEY);
        setTransactionCount(0);
        alert(
          "Wallet disconnected after 25 transactions. Please reconnect to continue."
        );
      }
    }
  }, [transactionCount, connected, disconnect]);

  const makeTestTransaction = useCallback(async () => {
    if (!publicKey || !sendTransaction) return;

    try {
      const connection = new Connection(DEVNET_ENDPOINT);

      // Create a test transaction (sending 0.001 SOL to self)
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: publicKey,
          lamports: LAMPORTS_PER_SOL / 1000, // 0.001 SOL
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);

      // Increment transaction count
      setTransactionCount((prev) => prev + 1);

      return signature;
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error;
    }
  }, [publicKey, sendTransaction]);

  return {
    isConnected: connected,
    isConnecting: connecting,
    publicKey,
    transactionCount,
    makeTestTransaction,
  };
};
