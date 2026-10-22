"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Droplet,
  ShieldCheck,
  ExternalLink,
  Award,
  Zap,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { FAUCET_CHAINS } from "@/data/mockData";
import { FaucetChain } from "@/types";
import { useWeb3 } from "@/context/Web3Context";
import { WalletModal } from "@/components/WalletModal";
import { ApplePhysicsCard } from "@/components/ApplePhysicsCard";
import { hapticEngine } from "@/lib/appleHaptics";

export default function FaucetPage() {
  const { wallet } = useWeb3();
  const [claimingId, setClaimingId] = useState<number | null>(null);
  const [claimedList, setClaimedList] = useState<number[]>([]);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [hasBaseBadge, setHasBaseBadge] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "direct" | "badge">("all");
  const [claimedChain, setClaimedChain] = useState<FaucetChain | null>(null);

  const filteredChains = FAUCET_CHAINS.filter((chain) => {
    if (activeFilter === "direct" && chain.requiresBadge) return false;
    if (activeFilter === "badge" && !chain.requiresBadge) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        chain.name.toLowerCase().includes(q) ||
        chain.id.toString().includes(q) ||
        chain.dripAmount.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleClaim = async (chain: FaucetChain) => {
    if (!wallet.isConnected) {
      hapticEngine.play("click");
      setIsWalletOpen(true);
      return;
    }

    hapticEngine.play("click");
    setClaimingId(chain.id);
    await new Promise((r) => setTimeout(r, 1400));
    setClaimingId(null);
    setClaimedList((prev) => [...prev, chain.id]);
    setClaimedChain(chain);
    hapticEngine.play("success");

    try {
      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.7 },
        colors: ["#d4ff3f", "#ff2dab", "#38bdf8"],
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative py-6 sm:py-10 lg:py-14 bg-[var(--bg-canvas)]">
      {/* Background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[320px] sm:w-[650px] h-[180px] sm:h-[320px] bg-[#d4ff3f]/6 blur-[100px] sm:blur-[130px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-3 py-1 sm:px-4 sm:py-1.5 text-xs font-semibold text-[var(--color-primary)] mb-2 sm:mb-3">
            <Droplet className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span>Testnet Gas Hub</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Multi-Chain{" "}
            <span className="bg-gradient-to-r from-[#d4ff3f] via-[#d4ff3f] to-[#ff2dab] bg-clip-text text-transparent">
              Faucet Portal
            </span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] px-2">
            Claim testnet gas across leading EVM development testnets. Hold the Base Faucet Badge for verified fast-lane drips.
          </p>
        </div>

        {/* Quick Stats Metric Bar (Mobile Optimized) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto mb-4 sm:mb-6">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 sm:p-3 text-center">
            <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
              Supported Chains
            </div>
            <div className="text-xs sm:text-base font-extrabold text-[var(--color-primary)]">
              {FAUCET_CHAINS.length} Testnets
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 sm:p-3 text-center">
            <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
              Max Drip
            </div>
            <div className="text-xs sm:text-base font-extrabold text-[#ff2dab]">
              0.05 ETH / 24h
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 sm:p-3 text-center">
            <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
              Fast-Lane
            </div>
            <div className="text-xs sm:text-base font-extrabold text-[var(--text-primary)]">
              Soulbound ✓
            </div>
          </div>
        </div>

        {/* Base Faucet Badge Status Banner (Responsive) */}
        <ApplePhysicsCard
          tiltIntensity={2.5}
          glareOpacity={0.05}
          className="mb-5 sm:mb-8 rounded-2xl sm:rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 sm:p-6 backdrop-blur-xl shadow-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-6">
            <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
              <div className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-tr from-[#d4ff3f] to-[#ff2dab] text-black shadow-lg shadow-[#d4ff3f]/20 shrink-0">
                <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                    Base Faucet Verification Layer
                  </h3>
                  {hasBaseBadge ? (
                    <span className="rounded-full bg-[var(--status-success)]/15 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-[var(--status-success)] border border-[var(--status-success)]/30">
                      Badge Verified ✓
                    </span>
                  ) : (
                    <span className="rounded-full bg-[#ff2dab]/15 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-[#ff2dab] border border-[#ff2dab]/30">
                      Badge Missing
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-[var(--text-secondary)] line-clamp-2 max-w-xl">
                  Soulbound NFT verification on Base prevents Sybil attacks and grants automated testnet drips with zero social hurdles.
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <Link
                href="/badges"
                onClick={() => hapticEngine.play("click")}
                className="w-full sm:w-auto rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-3.5 py-2 text-xs font-bold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Award className="h-3.5 w-3.5" />
                <span>Get Faucet Badge</span>
              </Link>
            </div>
          </div>
        </ApplePhysicsCard>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4 mb-5 sm:mb-6">
          {/* Quick Filter Tabs */}
          <div className="grid grid-cols-3 sm:inline-flex rounded-xl sm:rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1 gap-1">
            {[
              { id: "all", label: "All Faucets", count: FAUCET_CHAINS.length },
              { id: "direct", label: "No Badge", count: FAUCET_CHAINS.filter((c) => !c.requiresBadge).length },
              { id: "badge", label: "Requires Badge", count: FAUCET_CHAINS.filter((c) => c.requiresBadge).length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  hapticEngine.play("toggle");
                  setActiveFilter(tab.id as any);
                }}
                className={`flex items-center justify-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-bold transition select-none cursor-pointer ${
                  activeFilter === tab.id
                    ? "bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] rounded-full px-1.5 py-0.2 ${
                  activeFilter === tab.id ? "bg-black/20 text-[var(--color-on-primary)] font-extrabold" : "bg-[var(--bg-surface-hover)] text-[var(--text-muted)]"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search testnets..."
              className="w-full pl-8.5 pr-8 py-1.5 sm:py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Faucets Grid: 1 col on xs, 2 on sm, 4 on lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredChains.map((chain) => {
            const isClaimed = claimedList.includes(chain.id);
            const isClaiming = claimingId === chain.id;

            return (
              <ApplePhysicsCard
                key={chain.id}
                tiltIntensity={4}
                glareOpacity={0.08}
                depth={10}
                className="group flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 sm:p-5 backdrop-blur-xl transition-colors duration-300 hover:border-[var(--color-primary)]/40 hover:bg-[var(--bg-surface-hover)] shadow-xl"
              >
                <div>
                  {/* Card Header: Chain Logo & Info */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <img
                        src={chain.icon}
                        alt={chain.name}
                        className="h-8 w-8 rounded-full object-cover border border-[var(--border-subtle)] shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-[var(--text-primary)] text-xs sm:text-sm truncate">
                          {chain.name}
                        </h4>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono block">
                          Chain ID: {chain.id}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold border ${
                        chain.requiresBadge
                          ? "bg-[#ff2dab]/10 text-[#ff2dab] border-[#ff2dab]/30"
                          : "bg-[var(--status-success)]/10 text-[var(--status-success)] border-[var(--status-success)]/30"
                      }`}
                    >
                      {chain.requiresBadge ? "Badge" : "Open"}
                    </span>
                  </div>

                  {/* Drip Details Table */}
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-2.5 sm:p-3 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-[var(--text-secondary)]">
                      <span className="text-[11px]">Drip Amount:</span>
                      <span className="font-bold text-[var(--color-primary)] font-mono text-xs">
                        {chain.dripAmount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[var(--text-secondary)]">
                      <span className="text-[11px]">Cooldown:</span>
                      <span className="text-[var(--text-muted)] font-mono text-[11px]">
                        {chain.cooldownHours}h per wallet
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[var(--text-secondary)]">
                      <span className="text-[11px]">Verification:</span>
                      <span
                        className={`text-[11px] font-semibold ${
                          chain.requiresBadge ? "text-[#ff2dab]" : "text-[var(--status-success)]"
                        }`}
                      >
                        {chain.requiresBadge ? "Soulbound Badge" : "Instant Drip"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions (Responsive side-by-side on mobile, stacked on desktop) */}
                <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
                  <motion.button
                    whileHover={{ scale: isClaimed || isClaiming ? 1 : 1.02 }}
                    whileTap={{ scale: isClaimed || isClaiming ? 1 : 0.96 }}
                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    onClick={() => handleClaim(chain)}
                    disabled={isClaimed || isClaiming}
                    className={`w-full rounded-xl py-2 sm:py-2.5 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer disabled:cursor-not-allowed ${
                      isClaimed
                        ? "bg-[var(--status-success)]/15 text-[var(--status-success)] border border-[var(--status-success)]/30 cursor-not-allowed"
                        : "bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:brightness-110 shadow-lg shadow-[#d4ff3f]/25"
                    }`}
                  >
                    {isClaiming ? (
                      <>
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                        <span>Sending {chain.dripAmount}...</span>
                      </>
                    ) : isClaimed ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-[var(--status-success)]" />
                        <span>Claimed (Cooldown)</span>
                      </>
                    ) : (
                      <>
                        <Droplet className="h-3.5 w-3.5" />
                        <span>Instant Drip {chain.dripAmount}</span>
                      </>
                    )}
                  </motion.button>

                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    href={chain.faucetUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => hapticEngine.play("click")}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] py-1.5 text-[11px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] hover:border-[var(--color-primary)]/40 transition cursor-pointer"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="h-3 w-3" />
                  </motion.a>
                </div>
              </ApplePhysicsCard>
            );
          })}
        </div>
      </div>

      {/* Claim Success Dialog */}
      <AnimatePresence>
        {claimedChain && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setClaimedChain(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: "spring", stiffness: 450, damping: 26 }}
              className="relative w-full max-w-sm rounded-2xl sm:rounded-3xl border border-[var(--color-primary)]/30 bg-[var(--bg-surface)] p-5 text-center shadow-2xl z-10"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 text-[var(--color-primary)] mb-3">
                <Droplet className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-extrabold text-[var(--text-primary)]">
                Drip Confirmed! 💧
              </h3>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Successfully sent <span className="font-bold text-[var(--color-primary)]">{claimedChain.dripAmount}</span> to your connected wallet on {claimedChain.name}.
              </p>

              <div className="mt-4 p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-left text-xs space-y-1.5">
                <div className="flex justify-between text-[var(--text-muted)] text-[11px]">
                  <span>Network:</span>
                  <span className="text-[var(--text-primary)] font-medium">{claimedChain.name}</span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)] text-[11px]">
                  <span>Status:</span>
                  <span className="text-[var(--status-success)] font-semibold">24h Cooldown Activated</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <a
                  href={claimedChain.faucetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition flex items-center justify-center gap-1"
                >
                  <span>Portal</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <button
                  onClick={() => {
                    hapticEngine.play("click");
                    setClaimedChain(null);
                  }}
                  className="flex-1 py-2 rounded-xl bg-[var(--color-primary)] text-xs font-bold text-black hover:brightness-110 shadow-md shadow-[#d4ff3f]/25 transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />
    </div>
  );
}
