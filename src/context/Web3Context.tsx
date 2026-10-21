"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Network, NETWORKS_LIST, getNetworkById } from "@/data/networks";
import { RecentGmEvent, WalletState } from "@/types";
import { RECENT_GMS_FEED } from "@/data/mockData";

interface Web3ContextType {
  wallet: WalletState;
  connectWallet: (name?: string) => Promise<void>;
  disconnectWallet: () => void;
  selectedNetwork: Network;
  setSelectedNetwork: (network: Network) => void;
  streak: number;
  totalGmsSent: number;
  sendGm: (message?: string, referralCode?: string) => Promise<{ success: boolean; txHash: string }>;
  isSendingGm: boolean;
  recentGms: RecentGmEvent[];
  lastGmTx: { hash: string; network: string; timestamp: Date } | null;
  cooldownSeconds: number;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: 8453,
    balance: "0.45",
  });

  const [selectedNetwork, setSelectedNetwork] = useState<Network>(
    getNetworkById(8453) || NETWORKS_LIST[0]
  );

  const [streak, setStreak] = useState<number>(14);
  const [totalGmsSent, setTotalGmsSent] = useState<number>(38);
  const [isSendingGm, setIsSendingGm] = useState<boolean>(false);
  const [recentGms, setRecentGms] = useState<RecentGmEvent[]>(RECENT_GMS_FEED);
  const [lastGmTx, setLastGmTx] = useState<{ hash: string; network: string; timestamp: Date } | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);

  // Check saved wallet in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ocgm_connected_wallet");
    if (saved) {
      queueMicrotask(() => {
        setWallet({
          address: saved,
          isConnected: true,
          chainId: 8453,
          balance: "0.852",
        });
      });
    }
  }, []);

  const connectWallet = async (name: string = "Browser Wallet") => {
    // Generate realistic demo address
    const mockAddr = "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const formatted = `${mockAddr.slice(0, 6)}...${mockAddr.slice(-4)}`;
    setWallet({
      address: formatted,
      isConnected: true,
      chainId: selectedNetwork.id,
      balance: "1.240",
    });
    localStorage.setItem("ocgm_connected_wallet", formatted);
  };

  const disconnectWallet = () => {
    setWallet({
      address: null,
      isConnected: false,
      chainId: selectedNetwork.id,
      balance: "0",
    });
    localStorage.removeItem("ocgm_connected_wallet");
  };

  const sendGm = async (message: string = "GM Web3!", referralCode?: string) => {
    setIsSendingGm(true);
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const randomHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const shortHash = `${randomHash.slice(0, 10)}...${randomHash.slice(-6)}`;

    setStreak((prev) => prev + 1);
    setTotalGmsSent((prev) => prev + 1);
    setCooldownSeconds(86400); // 24 hours cooldown

    const newGmEvent: RecentGmEvent = {
      id: "gm-" + Date.now(),
      networkId: selectedNetwork.id,
      networkName: selectedNetwork.name,
      networkIcon: selectedNetwork.icon,
      address: wallet.address || "0xYou...GM",
      txHash: shortHash,
      timeAgo: "Just now",
      streak: streak + 1,
    };

    setRecentGms((prev) => [newGmEvent, ...prev.slice(0, 9)]);
    setLastGmTx({
      hash: shortHash,
      network: selectedNetwork.name,
      timestamp: new Date(),
    });

    setIsSendingGm(false);
    return { success: true, txHash: shortHash };
  };

  return (
    <Web3Context.Provider
      value={{
        wallet,
        connectWallet,
        disconnectWallet,
        selectedNetwork,
        setSelectedNetwork,
        streak,
        totalGmsSent,
        sendGm,
        isSendingGm,
        recentGms,
        lastGmTx,
        cooldownSeconds,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}
