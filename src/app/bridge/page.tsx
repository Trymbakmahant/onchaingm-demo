"use client";

import React, { useState } from "react";
import {
  Layers,
  ArrowDownUp,
  ArrowRight,
  Settings2,
  Zap,
  Clock,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { NETWORKS_LIST, Network } from "@/data/networks";
import { useWeb3 } from "@/context/Web3Context";
import { WalletModal } from "@/components/WalletModal";
import { NetworkSelectorModal } from "@/components/NetworkSelectorModal";
import { TokenSelectorModal, BRIDGE_TOKENS, BridgeToken } from "@/components/TokenSelectorModal";
import { ApplePhysicsCard } from "@/components/ApplePhysicsCard";
import { hapticEngine } from "@/lib/appleHaptics";

export default function BridgePage() {
  const { wallet } = useWeb3();
  const [sourceChain, setSourceChain] = useState<Network>(
    NETWORKS_LIST.find((n) => n.id === 42161) || NETWORKS_LIST[0] // Arbitrum default
  );
  const [destChain, setDestChain] = useState<Network>(
    NETWORKS_LIST.find((n) => n.id === 8453) || NETWORKS_LIST[1] // Base default
  );

  const [sourceToken, setSourceToken] = useState<BridgeToken>(BRIDGE_TOKENS[0]); // ETH
  const [destToken, setDestToken] = useState<BridgeToken>(BRIDGE_TOKENS[0]); // ETH

  const [amount, setAmount] = useState("0.45");
  const [slippage, setSlippage] = useState("0.5");
  const [showSettings, setShowSettings] = useState(false);
  const [isBridging, setIsBridging] = useState(false);
  const [bridgeStep, setBridgeStep] = useState<number>(0);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [bridgeComplete, setBridgeComplete] = useState(false);
  const [swapRotation, setSwapRotation] = useState(0);

  // Selector Modals State
  const [networkModalTarget, setNetworkModalTarget] = useState<"source" | "dest" | null>(null);
  const [tokenModalTarget, setTokenModalTarget] = useState<"source" | "dest" | null>(null);

  const swapChains = () => {
    hapticEngine.play("cardPop");
    setSwapRotation((prev) => prev + 180);

    const tempChain = sourceChain;
    setSourceChain(destChain);
    setDestChain(tempChain);

    const tempToken = sourceToken;
    setSourceToken(destToken);
    setDestToken(tempToken);
  };

  const numericAmount = parseFloat(amount) || 0;
  // Calculate exchange rate based on USD prices
  const tokenRate = sourceToken.priceUsd / (destToken.priceUsd || 1);
  const estimatedReceive = (numericAmount * tokenRate * 0.9985).toFixed(
    destToken.decimals <= 8 ? 4 : 4
  );

  const handleBridge = async () => {
    if (!wallet.isConnected) {
      hapticEngine.play("click");
      setIsWalletOpen(true);
      return;
    }

    hapticEngine.play("click");
    setIsBridging(true);
    setBridgeComplete(false);

    // Step 1: Token Approval
    setBridgeStep(1);
    await new Promise((r) => setTimeout(r, 1100));

    // Step 2: Source Deposit
    setBridgeStep(2);
    await new Promise((r) => setTimeout(r, 1300));

    // Step 3: Cross-Chain Relayer
    setBridgeStep(3);
    await new Promise((r) => setTimeout(r, 1400));

    // Step 4: Destination Execution
    setBridgeStep(4);
    await new Promise((r) => setTimeout(r, 800));

    setIsBridging(false);
    setBridgeComplete(true);
    hapticEngine.play("success");

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#d4ff3f", "#ff2dab", "#ffffff"],
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative py-6 sm:py-10 lg:py-14 bg-[var(--bg-canvas)]">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[320px] sm:w-[600px] h-[180px] sm:h-[300px] bg-[#d4ff3f]/6 blur-[100px] sm:blur-[130px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-3 py-1 sm:px-4 sm:py-1.5 text-xs font-semibold text-[var(--color-primary)] mb-2 sm:mb-3">
            <Layers className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span>Cross-Chain Liquidity</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Bridge &amp;{" "}
            <span className="bg-gradient-to-r from-[#d4ff3f] via-[#d4ff3f] to-[#ff2dab] bg-clip-text text-transparent">
              Swap Tokens
            </span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] px-2">
            Powered by Li.Fi and Relay. Instant transfers across 125+ chains with optimal route aggregation and lowest fees.
          </p>
        </div>

        {/* Bridge Card Container */}
        <ApplePhysicsCard
          tiltIntensity={3}
          glareOpacity={0.06}
          className="max-w-xl mx-auto rounded-2xl sm:rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] backdrop-blur-2xl p-4 sm:p-7 shadow-2xl relative"
        >
          {/* Card Header & Slippage */}
          <div className="flex items-center justify-between pb-3.5 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                Transfer Assets
              </span>
              <span className="rounded-full bg-[#d4ff3f]/10 px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-[var(--color-primary)] border border-[#d4ff3f]/25">
                Aggregator
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                hapticEngine.play("click");
                setShowSettings(!showSettings);
              }}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition"
              title="Settings"
            >
              <Settings2 className="h-4 w-4" />
            </motion.button>
          </div>

          {/* Slippage Dropdown */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="overflow-hidden mt-3"
              >
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3 text-xs">
                  <div className="text-[var(--text-secondary)] mb-2 font-medium">
                    Slippage Tolerance
                  </div>
                  <div className="flex gap-2">
                    {["0.1", "0.5", "1.0"].map((s) => (
                      <motion.button
                        key={s}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          hapticEngine.play("click");
                          setSlippage(s);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          slippage === s
                            ? "bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm shadow-[#d4ff3f]/30"
                            : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)]"
                        }`}
                      >
                        {s}%
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* BOX 1: FROM NETWORK & TOKEN */}
          <div className="mt-4 sm:mt-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3.5 sm:p-4 transition-colors hover:border-[var(--color-primary)]/30">
            <div className="flex justify-between items-center text-xs text-[var(--text-secondary)] mb-2">
              <span className="font-semibold text-[var(--text-primary)]">From Network</span>
              <span className="text-[11px] text-[var(--text-muted)]">
                Balance: {wallet.isConnected ? `${sourceToken.balance} ${sourceToken.symbol}` : "--"}
              </span>
            </div>

            {/* Selector Row: 1. Network Pill | 2. Token Pill | 3. Amount Input */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                {/* 1. Network Selector Pill */}
                <button
                  type="button"
                  onClick={() => {
                    hapticEngine.play("click");
                    setNetworkModalTarget("source");
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:border-[var(--color-primary)]/40 px-2.5 py-1.5 sm:py-2 text-xs font-bold text-[var(--text-primary)] transition cursor-pointer shadow-sm"
                  title="Select Source Network"
                >
                  {sourceChain.icon ? (
                    <img
                      src={sourceChain.icon}
                      alt={sourceChain.name}
                      className="h-4 w-4 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <span className="h-4 w-4 rounded-full bg-[var(--border-subtle)] shrink-0" />
                  )}
                  <span className="truncate max-w-[90px] sm:max-w-[120px]">{sourceChain.name}</span>
                  <ChevronDown className="h-3 w-3 text-[var(--text-muted)] shrink-0" />
                </button>

                {/* 2. Token Selector Pill */}
                <button
                  type="button"
                  onClick={() => {
                    hapticEngine.play("click");
                    setTokenModalTarget("source");
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:border-[var(--color-primary)]/40 px-2.5 py-1.5 sm:py-2 text-xs font-bold text-[var(--color-primary)] transition cursor-pointer shadow-sm"
                  title="Select Token"
                >
                  <img
                    src={sourceToken.icon}
                    alt={sourceToken.symbol}
                    className="h-4 w-4 rounded-full object-cover shrink-0"
                  />
                  <span>{sourceToken.symbol}</span>
                  <ChevronDown className="h-3 w-3 text-[var(--text-muted)] shrink-0" />
                </button>
              </div>

              {/* Amount Input */}
              <div className="flex items-center justify-end flex-1">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full sm:w-40 text-left sm:text-right text-lg sm:text-xl font-bold bg-transparent text-[var(--text-primary)] focus:outline-none placeholder-[var(--text-muted)]"
                />
              </div>
            </div>

            {/* Quick Amount Chips & USD Price */}
            <div className="mt-3 flex justify-between items-center text-[10px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
              <span>≈ ${(numericAmount * sourceToken.priceUsd).toFixed(2)} USD</span>
              <div className="flex gap-1.5">
                {["25%", "50%", "Max"].map((chip) => (
                  <motion.button
                    key={chip}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      hapticEngine.play("click");
                      if (chip === "Max") {
                        setAmount(sourceToken.balance.replace(/,/g, ""));
                      } else if (chip === "50%") {
                        const half = (parseFloat(sourceToken.balance.replace(/,/g, "")) / 2).toFixed(4);
                        setAmount(half);
                      } else {
                        const quarter = (parseFloat(sourceToken.balance.replace(/,/g, "")) / 4).toFixed(4);
                        setAmount(quarter);
                      }
                    }}
                    className="px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition cursor-pointer"
                  >
                    {chip}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Switch Button with 3D Momentum Physics */}
          <div className="relative my-2 flex justify-center z-10">
            <motion.button
              onClick={swapChains}
              animate={{ rotate: swapRotation }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 450, damping: 22 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--color-primary)] hover:border-[var(--color-primary)] transition shadow-lg cursor-pointer"
              title="Flip route direction"
            >
              <ArrowDownUp className="h-4 w-4" />
            </motion.button>
          </div>

          {/* BOX 2: TO NETWORK & TOKEN */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3.5 sm:p-4 transition-colors hover:border-[var(--color-primary)]/30">
            <div className="flex justify-between items-center text-xs text-[var(--text-secondary)] mb-2">
              <span className="font-semibold text-[var(--text-primary)]">To Network</span>
              <span className="text-[var(--color-primary)] font-medium text-[11px]">
                Estimated Receive
              </span>
            </div>

            {/* Selector Row: 1. Network Pill | 2. Token Pill | 3. Estimated Receive Output */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                {/* 1. Network Selector Pill */}
                <button
                  type="button"
                  onClick={() => {
                    hapticEngine.play("click");
                    setNetworkModalTarget("dest");
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:border-[var(--color-primary)]/40 px-2.5 py-1.5 sm:py-2 text-xs font-bold text-[var(--text-primary)] transition cursor-pointer shadow-sm"
                  title="Select Destination Network"
                >
                  {destChain.icon ? (
                    <img
                      src={destChain.icon}
                      alt={destChain.name}
                      className="h-4 w-4 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <span className="h-4 w-4 rounded-full bg-[var(--border-subtle)] shrink-0" />
                  )}
                  <span className="truncate max-w-[90px] sm:max-w-[120px]">{destChain.name}</span>
                  <ChevronDown className="h-3 w-3 text-[var(--text-muted)] shrink-0" />
                </button>

                {/* 2. Token Selector Pill */}
                <button
                  type="button"
                  onClick={() => {
                    hapticEngine.play("click");
                    setTokenModalTarget("dest");
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:border-[var(--color-primary)]/40 px-2.5 py-1.5 sm:py-2 text-xs font-bold text-[var(--color-primary)] transition cursor-pointer shadow-sm"
                  title="Select Token"
                >
                  <img
                    src={destToken.icon}
                    alt={destToken.symbol}
                    className="h-4 w-4 rounded-full object-cover shrink-0"
                  />
                  <span>{destToken.symbol}</span>
                  <ChevronDown className="h-3 w-3 text-[var(--text-muted)] shrink-0" />
                </button>
              </div>

              {/* Output Display */}
              <div className="text-left sm:text-right text-lg sm:text-xl font-bold text-[var(--color-primary)]">
                {estimatedReceive} {destToken.symbol}
              </div>
            </div>

            <div className="mt-3 text-[10px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)] flex flex-col xs:flex-row justify-between gap-1">
              <span>≈ ${(parseFloat(estimatedReceive) * destToken.priceUsd).toFixed(2)} USD</span>
              <div className="flex items-center gap-1.5">
                <span>
                  1 {sourceToken.symbol} ≈ {tokenRate.toFixed(4)} {destToken.symbol}
                </span>
                <span>•</span>
                <span className="text-[var(--status-success)] font-medium">Lowest slippage</span>
              </div>
            </div>
          </div>

          {/* Route Optimization Summary */}
          <div className="mt-4 sm:mt-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3.5 sm:p-4 text-xs space-y-2">
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                Selected Route
              </span>
              <span className="font-semibold text-[var(--text-primary)]">
                Relay Protocol (Direct L2-to-L2)
              </span>
            </div>
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                Estimated Time
              </span>
              <span className="text-[var(--status-success)] font-mono font-medium">~35 seconds</span>
            </div>
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>Network Fee</span>
              <span className="text-[var(--text-primary)] font-mono">$0.42 USD</span>
            </div>
          </div>

          {/* Action Button with Apple Physics Spring */}
          <div className="mt-5">
            <motion.button
              whileHover={{ scale: isBridging ? 1 : 1.015 }}
              whileTap={{ scale: isBridging ? 1 : 0.98 }}
              transition={{ type: "spring", stiffness: 450, damping: 24 }}
              onClick={handleBridge}
              disabled={isBridging}
              className="w-full rounded-2xl bg-[var(--color-primary)] p-3.5 sm:p-4 font-bold text-[var(--color-on-primary)] shadow-xl shadow-[#d4ff3f]/25 hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed text-xs sm:text-sm"
            >
              {isBridging ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  <span>Processing Cross-Chain Bridge...</span>
                </>
              ) : (
                <>
                  <span>
                    {wallet.isConnected
                      ? `Bridge ${sourceToken.symbol} to ${destChain.name}`
                      : "Connect Wallet to Bridge"}
                  </span>
                  <ArrowRight className="h-4 w-4 text-black" />
                </>
              )}
            </motion.button>
          </div>

          {/* Step Progress Tracker when bridging */}
          <AnimatePresence>
            {isBridging && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -8 }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className="overflow-hidden mt-4"
              >
                <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-3.5 sm:p-4 text-xs space-y-2">
                  <div className="font-bold text-cyan-300 mb-1 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>Bridge Execution:</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] sm:text-xs">
                    <div
                      className={`flex items-center gap-2 transition-colors duration-300 ${
                        bridgeStep >= 1 ? "text-cyan-400" : "text-neutral-500"
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      <span>Step 1: Approving {sourceChain.name} token contract</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 transition-colors duration-300 ${
                        bridgeStep >= 2 ? "text-cyan-400" : "text-neutral-500"
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      <span>Step 2: Depositing funds into Relay pool</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 transition-colors duration-300 ${
                        bridgeStep >= 3 ? "text-cyan-400" : "text-neutral-500"
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      <span>Step 3: Relayer consensus &amp; cryptographic verification</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 transition-colors duration-300 ${
                        bridgeStep >= 4 ? "text-cyan-400" : "text-neutral-500"
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      <span>Step 4: Releasing funds on {destChain.name}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success banner */}
          <AnimatePresence>
            {bridgeComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="mt-4 rounded-xl border border-[var(--status-success)]/30 bg-[var(--status-success)]/10 p-3.5 text-xs text-[var(--text-primary)] flex items-center justify-between shadow-lg"
              >
                <div>
                  <span className="font-bold block text-sm text-[var(--status-success)]">
                    Bridge Transfer Complete!
                  </span>
                  <span className="text-[var(--text-secondary)]">
                    {amount} {sourceToken.symbol} delivered to your wallet on {destChain.name}.
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    hapticEngine.play("click");
                    setBridgeComplete(false);
                  }}
                  className="rounded-lg bg-[var(--status-success)] px-3 py-1 font-bold text-black hover:brightness-110 cursor-pointer"
                >
                  Done
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </ApplePhysicsCard>
      </div>

      {/* Network Selector Modal for Source / Destination */}
      <NetworkSelectorModal
        isOpen={networkModalTarget !== null}
        onClose={() => setNetworkModalTarget(null)}
        selectedNetworkId={networkModalTarget === "source" ? sourceChain.id : destChain.id}
        title={networkModalTarget === "source" ? "Select Source Network" : "Select Destination Network"}
        onSelect={(net) => {
          if (networkModalTarget === "source") {
            setSourceChain(net);
          } else {
            setDestChain(net);
          }
          setNetworkModalTarget(null);
        }}
      />

      {/* Token Selector Modal for Source / Destination */}
      <TokenSelectorModal
        isOpen={tokenModalTarget !== null}
        onClose={() => setTokenModalTarget(null)}
        selectedToken={tokenModalTarget === "source" ? sourceToken : destToken}
        networkName={tokenModalTarget === "source" ? sourceChain.name : destChain.name}
        title={tokenModalTarget === "source" ? "Select Source Token" : "Select Destination Token"}
        onSelect={(tok) => {
          if (tokenModalTarget === "source") {
            setSourceToken(tok);
          } else {
            setDestToken(tok);
          }
          setTokenModalTarget(null);
        }}
      />

      <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />
    </div>
  );
}
