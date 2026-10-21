import { Network } from "@/data/networks";

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number;
  balance: string;
}

export interface BadgeItem {
  id: string;
  name: string;
  description: string;
  networkId: number;
  networkName: string;
  isMainnet: boolean;
  imageUrl: string;
  status: "available" | "mint_now" | "coming_soon" | "minted";
  fee: string;
  contractAddress: string;
  totalMinted?: number;
}

export interface LeaderboardUser {
  rank: number;
  address: string;
  ens?: string;
  avatar?: string;
  totalGms: number;
  streakDays: number;
  chainsCount: number;
  lastGmTime: string;
  badgesCount: number;
}

export interface FaucetChain {
  id: number;
  name: string;
  currency: string;
  icon: string;
  dripAmount: string;
  cooldownHours: number;
  faucetUrl: string;
  requiresBadge: boolean;
  status: "active" | "standby";
  explorer: string;
}

export interface BridgeToken {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
  chainId: number;
  balance?: string;
}

export interface RecentGmEvent {
  id: string;
  networkId: number;
  networkName: string;
  networkIcon?: string;
  address: string;
  txHash: string;
  timeAgo: string;
  streak: number;
}
