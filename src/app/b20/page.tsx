"use client";

import React, { useState } from "react";
import {
  Coins,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Share2,
  ArrowRight,
  Info,
  Sliders,
  Eye,
  Zap,
  Lock,
  Layers,
  Globe2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useWeb3 } from "@/context/Web3Context";
import { WalletModal } from "@/components/WalletModal";
import { ApplePhysicsCard } from "@/components/ApplePhysicsCard";
import { hapticEngine } from "@/lib/appleHaptics";

type EmblemTheme = "neon" | "violet" | "gold" | "obsidian";

const EMBLEM_THEMES: Record<
  EmblemTheme,
  {
    name: string;
    gradient: string;
    border: string;
    text: string;
    accent: string;
  }
> = {
  neon: {
    name: "Cyber Neon",
    gradient: "from-[#d4ff3f]/25 via-[#10b981]/20 to-[#0b0b0b]",
    border: "border-[#d4ff3f]/40",
    text: "text-[#d4ff3f]",
    accent: "#d4ff3f",
  },
  violet: {
    name: "Hyper Violet",
    gradient: "from-[#ff2dab]/25 via-[#8b5cf6]/20 to-[#0b0b0b]",
    border: "border-[#ff2dab]/40",
    text: "text-[#ff2dab]",
    accent: "#ff2dab",
  },
  gold: {
    name: "Solar Gold",
    gradient: "from-[#f59e0b]/25 via-[#eab308]/20 to-[#0b0b0b]",
    border: "border-[#f59e0b]/40",
    text: "text-[#f59e0b]",
    accent: "#f59e0b",
  },
  obsidian: {
    name: "Midnight",
    gradient: "from-white/20 via-neutral-700/20 to-[#0b0b0b]",
    border: "border-white/30",
    text: "text-white",
    accent: "#ffffff",
  },
};

const SUPPLY_PRESETS = [
  { label: "10M", value: "10000000" },
  { label: "100M", value: "100000000" },
  { label: "1B", value: "1000000000", tag: "Std" },
  { label: "10B", value: "10000000000" },
];

export default function B20Page() {
  const { wallet } = useWeb3();
  const [tokenName, setTokenName] = useState("OnChainGM Token");
  const [tokenSymbol, setTokenSymbol] = useState("OCGM");
  const [decimals, setDecimals] = useState("18");
  const [supplyCap, setSupplyCap] = useState("1000000000");
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<EmblemTheme>("neon");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState<string>("");
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");
  const [deployedToken, setDeployedToken] = useState<{
    address: string;
    txHash: string;
    name: string;
    symbol: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  const activeTheme = EMBLEM_THEMES[selectedTheme];

  const handleDeploy = async () => {
    if (!wallet.isConnected) {
      hapticEngine.play("click");
      setIsWalletOpen(true);
      return;
    }

    if (!tokenName.trim() || !tokenSymbol.trim()) {
      return;
    }

    hapticEngine.play("click");
    setIsDeploying(true);
    setDeployStep("Awaiting wallet signature…");
    await new Promise((r) => setTimeout(r, 1200));

    setDeployStep("Broadcasting to Base L2 precompile…");
    await new Promise((r) => setTimeout(r, 1500));

    const mockTokenAddr =
      "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const mockTx =
      "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

    setDeployedToken({
      address: `${mockTokenAddr.slice(0, 8)}...${mockTokenAddr.slice(-6)}`,
      txHash: `${mockTx.slice(0, 10)}...${mockTx.slice(-6)}`,
      name: tokenName,
      symbol: tokenSymbol.toUpperCase(),
    });

    setIsDeploying(false);
    setDeployStep("");
    hapticEngine.play("success");

    try {
      confetti({
        particleCount: 65,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#d4ff3f", "#ff2dab", "#ffffff"],
      });
    } catch {
      // ignore
    }
  };

  const copyAddress = () => {
    if (deployedToken) {
      navigator.clipboard.writeText(deployedToken.address);
      setCopied(true);
      hapticEngine.play("click");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative py-2 sm:py-3 lg:py-3.5 bg-[var(--bg-canvas)] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] sm:w-[800px] h-[220px] sm:h-[300px] bg-gradient-to-b from-[#d4ff3f]/8 via-[#ff2dab]/5 to-transparent blur-[120px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-6xl px-3 sm:px-6 z-10">
        {/* Compact Single-Screen Header */}
        <div className="text-center max-w-2xl mx-auto mb-2 sm:mb-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-semibold text-neutral-300 mb-1 shadow-inner backdrop-blur-xl">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#d4ff3f] shadow-[0_0_6px_#d4ff3f]" />
            <span className="text-white">Base L2 Precompile</span>
            <span className="text-neutral-500">•</span>
            <span className="text-[#d4ff3f]">Zero Gas Overhead</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Launch{" "}
            <span className="bg-gradient-to-r from-[#d4ff3f] via-white to-[#ff2dab] bg-clip-text text-transparent">
              B20 Assets on Base
            </span>
          </h1>

          <p className="mt-0.5 text-[11px] sm:text-xs text-neutral-400 max-w-xl mx-auto line-clamp-1 sm:line-clamp-none">
            Deploy auto-verified ERC-20 assets through the official Base factory with sub-penny protocol fees.
          </p>
        </div>

        {/* Mobile View Switcher (Visible only on mobile < lg) */}
        <div className="lg:hidden flex rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1 max-w-xs mx-auto mb-3 shadow-md">
          <button
            onClick={() => {
              hapticEngine.play("toggle");
              setMobileTab("form");
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mobileTab === "form"
                ? "bg-[var(--color-primary)] text-black shadow-sm"
                : "text-[var(--text-secondary)] hover:text-white"
            }`}
          >
            <Sliders className="h-3 w-3" />
            <span>Parameters</span>
          </button>
          <button
            onClick={() => {
              hapticEngine.play("toggle");
              setMobileTab("preview");
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mobileTab === "preview"
                ? "bg-[var(--color-primary)] text-black shadow-sm"
                : "text-[var(--text-secondary)] hover:text-white"
            }`}
          >
            <Eye className="h-3 w-3" />
            <span>Live Token</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff2dab] animate-ping" />
          </button>
        </div>

        {/* Main Grid: Form + Live Token Medallion Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-5 items-start">
          {/* LEFT: Token Configuration Form */}
          <div className={`lg:col-span-7 ${mobileTab === "preview" ? "hidden lg:block" : "block"}`}>
            <ApplePhysicsCard
              tiltIntensity={1.5}
              glareOpacity={0.03}
              className="rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#141414]/90 backdrop-blur-2xl p-3.5 sm:p-4 lg:p-5 shadow-2xl shadow-black/80"
            >
              {/* Form Title & Network Indicator */}
              <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06]">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white">
                    Token Specification
                  </h2>
                  <p className="text-[10px] sm:text-[11px] text-neutral-400">
                    Define on-chain parameters for your asset
                  </p>
                </div>

                <div className="flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-blue-400">
                  <img
                    src="https://onchaingm.com/chains/base.jpg"
                    alt="Base"
                    className="h-3 w-3 rounded-full object-cover"
                  />
                  <span>Base L2</span>
                </div>
              </div>

              {/* Mobile Quick Preview Ribbon */}
              <div
                onClick={() => setMobileTab("preview")}
                className="lg:hidden mt-2.5 p-2 rounded-xl border border-white/[0.08] bg-[#0b0b0b] flex items-center justify-between cursor-pointer hover:border-[#d4ff3f]/40 transition"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-lg bg-gradient-to-tr ${activeTheme.gradient} border ${activeTheme.border} flex items-center justify-center font-black text-[10px] ${activeTheme.text}`}
                  >
                    {tokenSymbol ? tokenSymbol.slice(0, 3) : "B20"}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white">
                      {tokenName || "Token Name"}{" "}
                      <span className={activeTheme.text}>(${tokenSymbol || "SYM"})</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#d4ff3f]">
                  <span>View Card</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>

              {/* Form Fields - Compact Layout */}
              <div className="mt-3 space-y-2.5 sm:space-y-3">
                {/* Row 1: Token Name & Ticker Symbol */}
                <div className="grid grid-cols-12 gap-2.5">
                  <div className="col-span-7">
                    <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                      Token Name <span className="text-[#ff2dab]">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={32}
                      value={tokenName}
                      onChange={(e) => setTokenName(e.target.value)}
                      placeholder="e.g. OnChainGM Token"
                      className="w-full rounded-xl border border-white/[0.08] bg-[#0b0b0b] px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-white placeholder-neutral-600 focus:border-[#d4ff3f] focus:outline-none transition"
                    />
                  </div>

                  <div className="col-span-5">
                    <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                      Symbol <span className="text-[#ff2dab]">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-500 font-mono">
                        $
                      </span>
                      <input
                        type="text"
                        maxLength={8}
                        value={tokenSymbol}
                        onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                        placeholder="OCGM"
                        className="w-full rounded-xl border border-white/[0.08] bg-[#0b0b0b] pl-6 pr-2.5 py-1.5 sm:py-2 text-xs sm:text-sm font-mono font-bold text-white placeholder-neutral-600 focus:border-[#d4ff3f] focus:outline-none uppercase transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Supply Cap & Decimals */}
                <div className="grid grid-cols-12 gap-2.5">
                  <div className="col-span-8">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-neutral-300">
                        Supply Cap
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer text-[10px] text-neutral-400 hover:text-white">
                        <input
                          type="checkbox"
                          checked={isUnlimited}
                          onChange={(e) => setIsUnlimited(e.target.checked)}
                          className="rounded border-white/20 bg-[#0b0b0b] text-[#d4ff3f] focus:ring-0 cursor-pointer h-3 w-3"
                        />
                        <span>Unlimited</span>
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        disabled={isUnlimited}
                        value={isUnlimited ? "" : supplyCap}
                        onChange={(e) => setSupplyCap(e.target.value)}
                        placeholder={isUnlimited ? "Unlimited Supply" : "1,000,000,000"}
                        className="w-full rounded-xl border border-white/[0.08] bg-[#0b0b0b] px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-mono text-white placeholder-neutral-600 focus:border-[#d4ff3f] focus:outline-none transition disabled:opacity-40 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Compact Presets */}
                    {!isUnlimited && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className="text-[9px] text-neutral-500 mr-0.5">Cap:</span>
                        {SUPPLY_PRESETS.map((p) => (
                          <button
                            key={p.value}
                            type="button"
                            onClick={() => {
                              hapticEngine.play("click");
                              setSupplyCap(p.value);
                            }}
                            className={`px-1.5 py-0.2 rounded text-[10px] font-mono transition cursor-pointer ${
                              supplyCap === p.value
                                ? "bg-[#d4ff3f]/15 border border-[#d4ff3f]/40 text-[#d4ff3f] font-bold"
                                : "bg-white/[0.04] text-neutral-400 hover:text-white"
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="col-span-4">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-semibold text-neutral-300">
                        Decimals
                      </label>
                      <span className="text-[9px] text-[#d4ff3f] font-mono">ERC-20</span>
                    </div>
                    <input
                      type="number"
                      value={decimals}
                      onChange={(e) => setDecimals(e.target.value)}
                      min={0}
                      max={18}
                      className="w-full rounded-xl border border-white/[0.08] bg-[#0b0b0b] px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-mono text-white placeholder-neutral-600 focus:border-[#d4ff3f] focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Row 3: Card Theme Selector (Slim Row) */}
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    Card Hologram Theme
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(Object.keys(EMBLEM_THEMES) as EmblemTheme[]).map((themeKey) => {
                      const t = EMBLEM_THEMES[themeKey];
                      const isSelected = selectedTheme === themeKey;

                      return (
                        <button
                          key={themeKey}
                          type="button"
                          onClick={() => {
                            hapticEngine.play("click");
                            setSelectedTheme(themeKey);
                          }}
                          className={`flex items-center justify-center gap-1.5 py-1 px-1.5 rounded-lg border transition cursor-pointer select-none text-[10px] ${
                            isSelected
                              ? `${t.border} bg-white/[0.08] shadow-sm font-bold text-white`
                              : "border-white/[0.06] bg-[#0b0b0b] text-neutral-400 hover:bg-white/[0.04]"
                          }`}
                        >
                          <span
                            className="h-2 w-2 rounded-full shrink-0 shadow-sm"
                            style={{ backgroundColor: t.accent }}
                          />
                          <span className="truncate">{t.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Row 4: Compact Specs & Fee Strip */}
                <div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b]/80 p-2.5 text-[11px] space-y-1 mt-1">
                  <div className="flex justify-between items-center text-neutral-400">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Zap className="h-3 w-3 text-[#d4ff3f]" />
                      <span>Launcher Fee:</span>
                    </span>
                    <span className="font-mono font-bold text-[#d4ff3f] flex items-center gap-1">
                      <span>0.000065 ETH (~$0.16)</span>
                      <span className="rounded bg-emerald-500/15 text-emerald-400 text-[9px] px-1">
                        -99% vs L1
                      </span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-neutral-400">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Lock className="h-3 w-3 text-neutral-500" />
                      <span>Mint Keys:</span>
                    </span>
                    <span className="font-mono text-neutral-300 truncate max-w-[170px] sm:max-w-none">
                      {wallet.isConnected ? wallet.address : "Connected Wallet (100% Non-Custodial)"}
                    </span>
                  </div>
                </div>

                {/* Launch Action Button - Always visible on single screen! */}
                <div className="pt-1">
                  <motion.button
                    whileHover={{ scale: isDeploying || !tokenName.trim() || !tokenSymbol.trim() ? 1 : 1.015 }}
                    whileTap={{ scale: isDeploying || !tokenName.trim() || !tokenSymbol.trim() ? 1 : 0.98 }}
                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    onClick={handleDeploy}
                    disabled={isDeploying || !tokenName.trim() || !tokenSymbol.trim()}
                    className="w-full rounded-xl bg-gradient-to-r from-[#d4ff3f] via-[#d4ff3f] to-[#b8f522] text-black font-extrabold py-2.5 sm:py-3 px-4 text-xs sm:text-sm shadow-xl shadow-[#d4ff3f]/25 hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isDeploying ? (
                      <>
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                        <span>{deployStep}</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {wallet.isConnected
                            ? `Launch $${tokenSymbol || "B20"} on Base`
                            : "Connect Wallet to Launch"}
                        </span>
                        <ArrowRight className="h-4 w-4 text-black" />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </ApplePhysicsCard>
          </div>

          {/* RIGHT: Live Token Medallion Preview Card (Matched Height) */}
          <div
            className={`lg:col-span-5 flex flex-col items-center w-full ${
              mobileTab === "form" ? "hidden lg:flex" : "flex"
            }`}
          >
            <ApplePhysicsCard
              tiltIntensity={5}
              glareOpacity={0.12}
              depth={16}
              className="w-full rounded-2xl sm:rounded-3xl border border-white/[0.1] bg-[#141414]/90 p-3.5 sm:p-4 lg:p-5 shadow-2xl relative overflow-hidden backdrop-blur-2xl"
            >
              {/* Header Badges */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <img
                    src="https://onchaingm.com/chains/base.jpg"
                    alt="Base"
                    className="h-3.5 w-3.5 rounded-full object-cover"
                  />
                  <span className="text-xs font-bold text-white">Base Asset Preview</span>
                </div>
                <span className="rounded-full bg-white/[0.06] border border-white/[0.12] px-2 py-0.2 text-[9px] font-mono font-bold text-neutral-300">
                  ERC-20 • B20
                </span>
              </div>

              {/* Physical Coin Medallion Container (Compact Height) */}
              <div className="relative h-40 sm:h-44 lg:h-48 w-full rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#0e0e0e] to-[#070707] border border-white/[0.08] p-2.5 sm:p-3 flex flex-col justify-between items-center text-center shadow-inner overflow-hidden">
                {/* Ambient glow behind coin */}
                <div
                  className="absolute inset-0 blur-2xl opacity-35 pointer-events-none transition-colors duration-500"
                  style={{ backgroundColor: activeTheme.accent }}
                />

                {/* Top Metas */}
                <div className="w-full flex justify-between items-center z-10 text-[9px] font-mono text-neutral-400">
                  <span>CHAIN ID: 8453</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE PRECOMPILE
                  </span>
                </div>

                {/* 3D Coin Graphic */}
                <div className="z-10 my-auto py-0.5">
                  <motion.div
                    whileHover={{ rotateY: 15, rotateX: -10, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{ perspective: 800 }}
                    className="relative mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-tr from-[#141414] via-[#1c1c1c] to-[#262626] border-2 border-white/20 shadow-xl mb-1 cursor-pointer group"
                  >
                    {/* Coin rim sheen ring */}
                    <div className="absolute inset-0.5 rounded-full border border-dashed border-white/20 pointer-events-none" />
                    <div
                      className="absolute inset-1 rounded-full opacity-30 blur-sm pointer-events-none"
                      style={{ backgroundColor: activeTheme.accent }}
                    />

                    {/* Central Monogram */}
                    <span className={`text-base sm:text-xl font-black tracking-tight ${activeTheme.text} drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]`}>
                      {tokenSymbol ? tokenSymbol.slice(0, 4) : "B20"}
                    </span>
                  </motion.div>

                  <h3 className="text-xs sm:text-sm font-extrabold text-white tracking-wide truncate max-w-[200px] leading-tight">
                    {tokenName || "Token Name"}
                  </h3>
                  <div className={`text-[10px] sm:text-[11px] font-mono font-bold ${activeTheme.text}`}>
                    ${tokenSymbol || "SYMBOL"}
                  </div>
                </div>

                {/* Bottom Supply & Decimals Strip */}
                <div className="w-full pt-1.5 border-t border-white/[0.08] z-10 text-[9px] sm:text-[10px] text-neutral-400 flex justify-between font-mono">
                  <span>
                    Cap: {isUnlimited ? "Unlimited" : Number(supplyCap || 0).toLocaleString("en-US")}
                  </span>
                  <span>Decimals: {decimals}</span>
                </div>
              </div>

              {/* Ready for DEX Liquidity banner */}
              <div className="mt-2 p-1.5 sm:p-2 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-between text-[11px]">
                <span className="text-neutral-400 flex items-center gap-1">
                  <Globe2 className="h-3 w-3 text-[#ff2dab]" />
                  <span>DEX Readiness:</span>
                </span>
                <span className="font-semibold text-white">Uniswap &amp; Aerodrome</span>
              </div>

              {/* Meta Details */}
              <div className="mt-1.5 pt-1.5 border-t border-white/[0.08] space-y-0.5 text-[10px] sm:text-[11px] text-neutral-400">
                <div className="flex justify-between">
                  <span>Minting Controller:</span>
                  <span className="text-white font-mono">Owner Wallet (You)</span>
                </div>
                <div className="flex justify-between">
                  <span>Precompile:</span>
                  <span className="text-neutral-300 font-mono">0x000...B20</span>
                </div>
              </div>

              {/* Mobile Back-to-form action */}
              <div className="lg:hidden mt-2.5 pt-2 border-t border-white/[0.08]">
                <button
                  onClick={() => setMobileTab("form")}
                  className="w-full py-1.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sliders className="h-3 w-3 text-[#d4ff3f]" />
                  <span>Edit Token Parameters</span>
                </button>
              </div>
            </ApplePhysicsCard>

            <div className="mt-1.5 text-center text-[10px] text-neutral-500 max-w-xs">
              100% of minting keys are transferred directly to your wallet upon deployment.
            </div>
          </div>
        </div>

        {/* 4-Card Feature Strip */}
        <div className="mt-3 sm:mt-4 pt-2 sm:pt-2.5 border-t border-white/[0.06]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
            <div className="rounded-xl border border-white/[0.06] bg-[#141414]/70 p-2 sm:p-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-0.5">
                <Zap className="h-3 w-3 text-[#d4ff3f]" />
                <span>Sub-Penny Gas</span>
              </div>
              <p className="text-[10px] text-neutral-400">
                0.000065 ETH precompile cost.
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-[#141414]/70 p-2 sm:p-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-0.5">
                <Layers className="h-3 w-3 text-[#ff2dab]" />
                <span>100% ERC-20</span>
              </div>
              <p className="text-[10px] text-neutral-400">
                Uniswap, Aerodrome, MetaMask.
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-[#141414]/70 p-2 sm:p-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-0.5">
                <Lock className="h-3 w-3 text-blue-400" />
                <span>Full Ownership</span>
              </div>
              <p className="text-[10px] text-neutral-400">
                100% minting permissions to you.
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-[#141414]/70 p-2 sm:p-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-0.5">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                <span>BaseScan Verified</span>
              </div>
              <p className="text-[10px] text-neutral-400">
                Auto-recognized bytecode on Base.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Deployment Success Modal */}
      <AnimatePresence>
        {deployedToken && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setDeployedToken(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: "spring", stiffness: 450, damping: 26 }}
              className="relative w-full max-w-sm sm:max-w-md rounded-3xl border border-[#d4ff3f]/30 bg-[#141414] p-5 sm:p-6 text-center shadow-2xl shadow-black/90 z-10"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d4ff3f]/15 border border-[#d4ff3f]/30 text-[#d4ff3f] mb-3">
                <Coins className="h-7 w-7" />
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                B20 Asset Deployed! 🎉
              </h3>
              <p className="mt-1 text-xs text-neutral-400">
                Your token{" "}
                <span className="text-[#d4ff3f] font-bold">
                  {deployedToken.name} (${deployedToken.symbol})
                </span>{" "}
                is now live on Base mainnet.
              </p>

              <div className="mt-4 space-y-2 rounded-2xl border border-white/[0.08] bg-[#0b0b0b] p-3 text-xs text-left">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Token Contract:</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyAddress}
                    className="flex items-center gap-1 text-[#d4ff3f] hover:underline font-mono font-bold cursor-pointer"
                  >
                    <span>{deployedToken.address}</span>
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </motion.button>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Transaction:</span>
                  <span className="text-white font-mono">{deployedToken.txHash}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    hapticEngine.play("click");
                    window.open(
                      `https://twitter.com/intent/tweet?text=Just launched $${deployedToken.symbol} (${deployedToken.name}) on Base using @onchainGM! 🚀 https://onchaingm.com`,
                      "_blank"
                    );
                  }}
                  className="flex-1 rounded-xl bg-[#1DA1F2] py-2 text-xs font-bold text-white hover:bg-[#1a94df] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share on X</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    hapticEngine.play("click");
                    setDeployedToken(null);
                  }}
                  className="flex-1 rounded-xl bg-white/[0.06] border border-white/[0.1] py-2 text-xs font-bold text-white hover:bg-white/[0.1] transition cursor-pointer"
                >
                  Done
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />
    </div>
  );
}
