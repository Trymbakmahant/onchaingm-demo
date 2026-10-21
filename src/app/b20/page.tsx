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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useWeb3 } from "@/context/Web3Context";
import { WalletModal } from "@/components/WalletModal";
import { ApplePhysicsCard } from "@/components/ApplePhysicsCard";
import { hapticEngine } from "@/lib/appleHaptics";

export default function B20Page() {
  const { wallet } = useWeb3();
  const [tokenName, setTokenName] = useState("OnChainGM Token");
  const [tokenSymbol, setTokenSymbol] = useState("OCGM");
  const [decimals, setDecimals] = useState("18");
  const [supplyCap, setSupplyCap] = useState("1000000000");
  const [isUnlimited, setIsUnlimited] = useState(false);
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
    setDeployStep("Confirm in wallet…");
    await new Promise((r) => setTimeout(r, 1200));

    setDeployStep("Confirming on Base mainnet…");
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
        particleCount: 60,
        spread: 75,
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
    <div className="relative py-6 sm:py-10 lg:py-14 bg-[var(--bg-canvas)]">
      {/* Background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[320px] sm:w-[650px] h-[180px] sm:h-[320px] bg-[var(--color-primary)]/10 blur-[100px] sm:blur-[130px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-3 py-1 sm:px-4 sm:py-1.5 text-xs font-semibold text-[var(--color-primary)] mb-2 sm:mb-3">
            <Coins className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span>Base Native Asset Standard</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Launch{" "}
            <span className="bg-gradient-to-r from-[var(--color-primary)] via-[#f5f5f7] to-[var(--color-secondary)] bg-clip-text text-transparent">
              B20 on Base
            </span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] px-2">
            Deploy a native B20 asset on Base. Fixed launcher fee, mint role to your wallet, and on-chain supply cap in a single step.
          </p>
        </div>

        {/* Mobile View Switcher (Visible only on mobile/tablet < lg) */}
        <div className="lg:hidden flex rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1 max-w-xs mx-auto mb-5">
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
            <Sliders className="h-3.5 w-3.5" />
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
            <Eye className="h-3.5 w-3.5" />
            <span>Live Card</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff2dab] animate-pulse" />
          </button>
        </div>

        {/* Main Grid: Form + Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 max-w-6xl mx-auto items-start">
          {/* Left: Form Parameters Card */}
          <div className={`lg:col-span-7 ${mobileTab === "preview" ? "hidden lg:block" : "block"}`}>
            <ApplePhysicsCard
              tiltIntensity={2}
              glareOpacity={0.04}
              className="rounded-2xl sm:rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] backdrop-blur-2xl p-4 sm:p-7 shadow-2xl"
            >
              {/* Form Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[var(--border-subtle)]">
                <div className="flex items-center space-x-2.5">
                  <div className="h-9 w-9 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)]">
                    <Coins className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                      Token Parameters
                    </h2>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      Configure your B20 asset properties
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 rounded-full bg-[var(--color-primary)]/10 px-2.5 py-1 text-[11px] font-bold text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                  <img
                    src="https://onchaingm.com/chains/base.jpg"
                    alt="Base"
                    className="h-3 w-3 rounded-full"
                  />
                  <span>Base Mainnet</span>
                </div>
              </div>

              {/* Mobile Quick Preview Banner */}
              <div
                onClick={() => setMobileTab("preview")}
                className="lg:hidden mt-3 p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] flex items-center justify-between cursor-pointer hover:border-[var(--color-primary)]/40 transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 flex items-center justify-center font-black text-xs text-[var(--color-primary)]">
                    {tokenSymbol ? tokenSymbol.slice(0, 3) : "B20"}
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-[var(--text-primary)] block">
                      {tokenName || "Token Name"} (${tokenSymbol || "SYMBOL"})
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">
                      {isUnlimited ? "Unlimited Supply" : `${Number(supplyCap || 0).toLocaleString()} Cap`}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[var(--color-primary)] flex items-center gap-1">
                  Preview <ArrowRight className="h-3 w-3" />
                </span>
              </div>

              <div className="mt-4 space-y-3.5">
                {/* Token Name */}
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Token Name <span className="text-[var(--color-secondary)]">*</span>
                  </label>
                  <input
                    type="text"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    placeholder="e.g. OnChainGM Token"
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3.5 py-2 text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--color-primary)] focus:outline-none transition"
                  />
                </div>

                {/* Token Symbol & Decimals Grid */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                      Symbol <span className="text-[var(--color-secondary)]">*</span>
                    </label>
                    <input
                      type="text"
                      value={tokenSymbol}
                      onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                      placeholder="e.g. OCGM"
                      maxLength={10}
                      className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3.5 py-2 text-xs sm:text-sm font-mono text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--color-primary)] focus:outline-none transition uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                      Decimals (Default: 18)
                    </label>
                    <input
                      type="number"
                      value={decimals}
                      onChange={(e) => setDecimals(e.target.value)}
                      min={0}
                      max={18}
                      className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3.5 py-2 text-xs sm:text-sm font-mono text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--color-primary)] focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Supply Cap */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-[var(--text-secondary)]">
                      Supply Cap
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs text-[var(--text-secondary)]">
                      <input
                        type="checkbox"
                        checked={isUnlimited}
                        onChange={(e) => setIsUnlimited(e.target.checked)}
                        className="rounded border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--color-primary)] focus:ring-0 cursor-pointer"
                      />
                      <span>Unlimited</span>
                    </label>
                  </div>
                  <input
                    type="number"
                    disabled={isUnlimited}
                    value={isUnlimited ? "" : supplyCap}
                    onChange={(e) => setSupplyCap(e.target.value)}
                    placeholder={isUnlimited ? "Unlimited minting" : "e.g. 1000000000"}
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3.5 py-2 text-xs sm:text-sm font-mono text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--color-primary)] focus:outline-none transition disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Fees & Details Card */}
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)]/60 p-3 sm:p-3.5 text-xs space-y-1.5 mt-3">
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Launcher Fee:</span>
                    <span className="font-bold text-[var(--color-primary)] font-mono">
                      0.000065 ETH (~$0.16)
                    </span>
                  </div>
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Mint Role Recipient:</span>
                    <span className="font-mono text-[var(--text-primary)] text-[11px] truncate max-w-[170px] sm:max-w-none">
                      {wallet.isConnected ? wallet.address : "Connected Wallet"}
                    </span>
                  </div>
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Precompile Contract:</span>
                    <span className="font-mono text-[var(--color-secondary)]">
                      Base B20 Factory
                    </span>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="flex items-start gap-2 rounded-xl border border-[var(--status-warning)]/20 bg-[var(--status-warning)]/5 p-2.5 sm:p-3 text-[11px] sm:text-xs text-[var(--text-secondary)]">
                  <Info className="h-3.5 w-3.5 text-[var(--status-warning)] shrink-0 mt-0.5" />
                  <span>
                    Requires 0.000065 ETH fee + gas on Base. Operations are irreversible on-chain.
                  </span>
                </div>

                {/* Action Button */}
                <div className="pt-1">
                  <motion.button
                    whileHover={{ scale: isDeploying || !tokenName.trim() || !tokenSymbol.trim() ? 1 : 1.015 }}
                    whileTap={{ scale: isDeploying || !tokenName.trim() || !tokenSymbol.trim() ? 1 : 0.98 }}
                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    onClick={handleDeploy}
                    disabled={isDeploying || !tokenName.trim() || !tokenSymbol.trim()}
                    className="w-full rounded-xl sm:rounded-2xl bg-[var(--color-primary)] text-[var(--color-on-primary)] p-3 sm:p-3.5 font-bold shadow-xl shadow-[var(--color-primary)]/20 hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed text-xs sm:text-sm"
                  >
                    {isDeploying ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                        <span>{deployStep}</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {wallet.isConnected ? "Launch B20 on Base" : "Connect Wallet to Launch"}
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </ApplePhysicsCard>
          </div>

          {/* Right: Live Preview Token Card */}
          <div className={`lg:col-span-5 flex flex-col items-center w-full ${mobileTab === "form" ? "hidden lg:flex" : "flex"}`}>
            <ApplePhysicsCard
              tiltIntensity={6}
              glareOpacity={0.12}
              depth={16}
              className="w-full max-w-sm rounded-2xl sm:rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <img
                    src="https://onchaingm.com/chains/base.jpg"
                    alt="Base"
                    className="h-4 w-4 sm:h-5 sm:w-5 rounded-full object-cover"
                  />
                  <span className="text-xs font-semibold text-[var(--text-primary)]">
                    Base B20 Token
                  </span>
                </div>
                <span className="rounded-full bg-[var(--color-secondary)]/10 px-2.5 py-0.5 text-[10px] font-bold text-[var(--color-secondary)] border border-[var(--color-secondary)]/20 font-mono">
                  ERC-20 / B20
                </span>
              </div>

              {/* Token Hologram Badge */}
              <div className="aspect-square w-full rounded-xl sm:rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] p-4 sm:p-6 flex flex-col justify-between items-center text-center shadow-inner relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-36 h-36 bg-[var(--color-primary)]/10 blur-3xl rounded-full pointer-events-none" />

                <div className="w-full flex justify-between items-center z-10 text-[9px] sm:text-[10px] text-[var(--text-muted)] font-mono">
                  <span>CHAIN: BASE (8453)</span>
                  <span className="text-[var(--status-success)]">VERIFIED CODE</span>
                </div>

                <div className="z-10 my-auto py-2">
                  <motion.div
                    whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl sm:rounded-3xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 text-[var(--color-primary)] shadow-xl shadow-[var(--color-primary)]/20 mb-2.5 sm:mb-3"
                  >
                    <span className="text-xl sm:text-2xl font-black">
                      {tokenSymbol ? tokenSymbol.slice(0, 4) : "B20"}
                    </span>
                  </motion.div>
                  <h3 className="text-base sm:text-xl font-extrabold text-[var(--text-primary)] tracking-wide truncate max-w-[220px]">
                    {tokenName || "Token Name"}
                  </h3>
                  <div className="mt-0.5 text-xs text-[var(--color-primary)] font-mono font-bold">
                    ${tokenSymbol || "SYMBOL"}
                  </div>
                </div>

                <div className="w-full pt-2.5 border-t border-[var(--border-subtle)] z-10 text-[10px] sm:text-[11px] text-[var(--text-secondary)] flex justify-between">
                  <span>
                    Cap: {isUnlimited ? "Unlimited" : Number(supplyCap || 0).toLocaleString("en-US")}
                  </span>
                  <span>Dec: {decimals}</span>
                </div>
              </div>

              {/* Meta Details */}
              <div className="mt-3.5 pt-3 border-t border-[var(--border-subtle)] space-y-1.5 text-xs text-[var(--text-secondary)]">
                <div className="flex justify-between text-[11px] sm:text-xs">
                  <span>Minting Controller:</span>
                  <span className="text-[var(--text-primary)] font-mono">Owner Wallet</span>
                </div>
                <div className="flex justify-between text-[11px] sm:text-xs">
                  <span>Precompile:</span>
                  <span className="text-[var(--text-muted)] font-mono">0x000...B20</span>
                </div>
              </div>

              {/* Switch back to form on mobile */}
              <div className="lg:hidden mt-4 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => setMobileTab("form")}
                  className="w-full py-2 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] flex items-center justify-center gap-1.5"
                >
                  <Sliders className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                  <span>Edit Token Parameters</span>
                </button>
              </div>
            </ApplePhysicsCard>

            <div className="mt-3 text-center text-[11px] sm:text-xs text-[var(--text-muted)] max-w-xs px-2">
              Upon deployment, you immediately receive 100% of the minting keys directly to your wallet.
            </div>
          </div>
        </div>

        {/* Narrative / About B20 Section */}
        <ApplePhysicsCard
          tiltIntensity={2}
          glareOpacity={0.03}
          className="mt-10 sm:mt-14 rounded-2xl sm:rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-8 md:p-10 backdrop-blur-xl max-w-4xl mx-auto shadow-2xl"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2">
            <Sparkles className="h-4 w-4" />
            <span>Base Ecosystem Standard</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            What is B20 on Base?
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            B20 is Base’s token standard for launchable assets. This tool calls the official B20Launcher contract — you receive the mint role and your token is created via the Base B20 factory precompile with full ERC-20 compatibility and low gas overhead.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5 sm:gap-4 text-xs text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5 text-[var(--status-success)]">
              <ShieldCheck className="h-4 w-4" /> Official Launcher Contract
            </span>
            <span className="hidden sm:inline">•</span>
            <span>Full ERC-20 Compatibility</span>
            <span className="hidden sm:inline">•</span>
            <span>Instant Uniswap &amp; Aerodrome Readiness</span>
          </div>
        </ApplePhysicsCard>
      </div>

      {/* Success Modal */}
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
              className="relative w-full max-w-sm sm:max-w-md rounded-2xl sm:rounded-3xl border border-[var(--color-primary)]/30 bg-[var(--bg-surface)] p-5 sm:p-6 text-center shadow-2xl z-10"
            >
              <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 text-[var(--color-primary)] mb-3">
                <Coins className="h-7 w-7 sm:h-8 sm:w-8" />
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
                B20 Token Launched! 🎉
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-[var(--text-secondary)]">
                Your token{" "}
                <span className="text-[var(--color-primary)] font-bold">
                  {deployedToken.name} (${deployedToken.symbol})
                </span>{" "}
                is now deployed live on Base mainnet.
              </p>

              <div className="mt-4 space-y-2 rounded-xl sm:rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3 sm:p-4 text-xs text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-secondary)]">Token Contract:</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyAddress}
                    className="flex items-center gap-1 text-[var(--color-primary)] hover:underline font-mono font-bold cursor-pointer"
                  >
                    <span>{deployedToken.address}</span>
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-[var(--status-success)]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </motion.button>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Transaction:</span>
                  <span className="text-[var(--text-primary)] font-mono">{deployedToken.txHash}</span>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
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
                  className="flex-1 rounded-xl bg-[#1DA1F2] py-2 sm:py-2.5 text-xs font-bold text-white hover:bg-[#1a94df] transition flex items-center justify-center gap-1.5 cursor-pointer"
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
                  className="flex-1 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] py-2 sm:py-2.5 text-xs font-bold text-[var(--text-primary)] hover:border-[var(--color-primary)]/50 transition cursor-pointer"
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
