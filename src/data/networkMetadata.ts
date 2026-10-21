import { Network } from "./networks";

export interface NetworkUIMetadata {
  color: string;
  ringBorderColor: string;
  ringBorderColorSubtle: string;
  ringGlow: string;
  ringGlowSubtle: string;
  badge: "Hot" | "New" | null;
  bridgeUrl: string;
  isTestnet: boolean;
}

const HEX_COLOR_MAP: Record<number, string> = {
  8453: "#2a58f4",     // Base
  1868: "#63aecb",     // Soneium
  4663: "#00C805",     // Robinhood Chain
  5042: "#18181b",     // ARC Mainnet
  4153: "#18181b",     // RISE
  2288: "#c25c93",     // Moca Chain
  57073: "#7b2cfe",    // Ink
  4217: "#18181b",     // Tempo Mainnet
  130: "#f726c9",      // UniChain
  4326: "#18181b",     // MegaETH
  98866: "#f93c04",    // Plume Mainnet
  9745: "#8a9794",     // Plasma
  42161: "#577c9b",    // Arbitrum
  59144: "#63dafa",    // Linea
  1: "#18181b",        // Ethereum
  42220: "#cfd243",    // Celo
  999: "#539384",      // HyperEVM
  10: "#fc0c2c",       // Optimism
  56: "#ebc654",       // BNB Chain
  137: "#8f33d3",      // Polygon
  747474: "#1b7bcd",   // Katana
  232: "#948c88",      // Lens
  80094: "#814625",    // Berachain
  143: "#4f46e5",      // Monad Mainnet
  480: "#18181b",      // World
  324: "#18181b",      // zkSync
  7777777: "#2563eb",  // Zora
  34443: "#eab308",    // Mode
  5031: "#3b82f6",     // Somnia
  4114: "#f7931a",     // Citrea Mainnet
  1329: "#971616",     // Sei Network
  43114: "#fb3b4b",    // Avalanche
  169: "#0099ff",      // Manta Pacific
  534352: "#e5a855",   // Scroll
  5000: "#18181b",     // Mantle
  146: "#0052ff",      // Sonic
  2818: "#00e599",     // Morph
  204: "#ebc654",      // opBNB
  7560: "#00c805",     // Cyber
  42170: "#e84142",    // Arbitrum Nova
  1625: "#ae5b2d",     // Gravity
  988: "#18181b",      // Stable
  60808: "#ff5c00",    // BOB
  2020: "#1273ea",     // Ronin
  33139: "#0753f4",    // ApeChain
  48900: "#22c55e",    // Zircuit
  14: "#ea3b5b",       // Flare
  167000: "#e81899",   // Taiko
  43111: "#ff6b00",    // Hemi
  254: "#0ea5e9",      // Swan Chain
  81224: "#18181b",    // Codex Mainnet
  // Testnets
  6281971: "#c2a633",  // DogeOS Testnet
  450815: "#18181b",   // Maroo Testnet
  19480: "#7a5cff",    // QMS Testnet
  21894: "#bfbeae",    // DAC Inception Testnet
  1913: "#18181b",     // SimpleChain Testnet
  5042002: "#18181b",  // Arc Testnet
  4441: "#18181b",     // LitVM Testnet
  91342: "#18181b",    // Giwa Sepolia
  11155931: "#18181b", // RISE Testnet
  1336: "#5b57af",     // Kii Chain
  267: "#3b82f6",      // Neura Testnet
  42101: "#d946ef",    // Push Testnet
  10778: "#18181b",    // X1 EcoChain Testnet
  984: "#18181b",      // IOPN Testnet
  11155111: "#627eea", // Sepolia
  84532: "#2a58f4",    // Base Sepolia
};

const HOT_CHAINS = new Set([8453, 1868, 57073, 1, 42161, 10, 137]);
const NEW_CHAINS = new Set([4663, 5042, 4153, 2288, 4217, 4326, 98866, 999]);

function hexToRgba(hex: string, alpha: number): string {
  if (hex === "#18181b" || hex === "#000000" || hex === "black") {
    return `rgba(100, 116, 139, ${alpha})`;
  }
  let c = hex.replace("#", "");
  if (c.length === 3) {
    c = c.split("").map((ch) => ch + ch).join("");
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return `rgba(100, 116, 139, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getNetworkUI(network: Network): NetworkUIMetadata {
  const isTestnet =
    network.name.toLowerCase().includes("testnet") ||
    network.name.toLowerCase().includes("sepolia") ||
    network.id === 1336;

  const color = HEX_COLOR_MAP[network.id] || (network.color && network.color !== "black" ? network.color : "#18181b");

  const badge = HOT_CHAINS.has(network.id)
    ? "Hot"
    : NEW_CHAINS.has(network.id)
    ? "New"
    : null;

  const defaultBridge = `/bridge/${network.name.toLowerCase().replace(/\s+/g, "-")}-bridge`;
  const bridgeUrl = network.bridge || defaultBridge;

  return {
    color,
    ringBorderColor: hexToRgba(color, 0.314),
    ringBorderColorSubtle: hexToRgba(color, 0.208),
    ringGlow: hexToRgba(color, 0.157),
    ringGlowSubtle: hexToRgba(color, 0.086),
    badge,
    bridgeUrl,
    isTestnet,
  };
}
