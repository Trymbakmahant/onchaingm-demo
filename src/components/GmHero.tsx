"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Sun,
  Flame,
  Globe,
  Sparkles,
  CheckCircle2,
  Share2,
  ExternalLink,
  ChevronDown,
  Tag,
  ArrowRight,
  Shield,
  Zap,
} from "lucide-react";
import { useWeb3 } from "@/context/Web3Context";
import { NetworkSelectorModal } from "./NetworkSelectorModal";
import { WalletModal } from "./WalletModal";
import { ApplePhysicsCard } from "./ApplePhysicsCard";
import { hapticEngine } from "@/lib/appleHaptics";

export function GmHero() {
  const {
    wallet,
    selectedNetwork,
    streak,
    totalGmsSent,
    sendGm,
    isSendingGm,
    lastGmTx,
    cooldownSeconds,
  } = useWeb3();

  const [message, setMessage] = useState("GM to the builders! Another day on-chain 🌞");
  const [referralCode, setReferralCode] = useState("0x39b4f028...881");
  const [hasReferral, setHasReferral] = useState(true);
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleSendGm = async () => {
    if (!wallet.isConnected) {
      hapticEngine.playTabClick();
      setIsWalletModalOpen(true);
      return;
    }
    hapticEngine.playTabClick();
    const res = await sendGm(message, hasReferral ? referralCode : undefined);
    if (res.success) {
      hapticEngine.playCardPop();
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#d4ff3f", "#ff2dab", "#00f59b", "#ffffff"],
      });
      setShowCelebration(true);
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-[var(--bg-canvas)]">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#d4ff3f]/8 via-[#ff2dab]/6 to-transparent blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute -top-24 right-10 w-72 h-72 bg-[#d4ff3f]/6 blur-[100px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Announcement Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-4 py-1.5 text-xs text-[var(--color-primary)] backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-[var(--color-primary)] animate-ping" />
            <span className="font-semibold">OnChainGM V3 Protocol Live</span>
            <span className="text-[var(--border-subtle)]">•</span>
            <span className="text-[var(--text-secondary)]">Over 125+ Networks Supported</span>
            <ArrowRight className="h-3 w-3 text-[var(--color-primary)]" />
          </div>
        </motion.div>

        {/* Hero Headline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 26, delay: 0.05 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.15]">
            Your Daily <span className="bg-gradient-to-r from-[#d4ff3f] via-[#d4ff3f] to-[#ff2dab] bg-clip-text text-transparent">Web3 Ritual</span> Across 125+ Chains
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Send your daily GM on-chain, collect Soulbound NFT cards, maintain your immutable streak, and earn 10% referral rewards on every blockchain.
          </p>
        </motion.div>

        {/* Main GM Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          {/* Left Column: Interactive GM Sender Console */}
          <ApplePhysicsCard tiltIntensity={3.5} glareOpacity={0.06} className="lg:col-span-7">
            <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-6 border-b border-[var(--border-subtle)]">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary)]">
                    <Sun className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">Daily GM Terminal</h2>
                    <p className="text-xs text-[var(--text-secondary)]">Mint daily soulbound proof to chosen blockchain</p>
                  </div>
                </div>

                {/* Network Selector Pill */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 450, damping: 22 }}
                  onClick={() => setIsNetworkModalOpen(true)}
                  className="flex items-center space-x-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3.5 py-2 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--bg-surface-hover)] transition cursor-pointer"
                >
                  {selectedNetwork.icon ? (
                    <img
                      src={selectedNetwork.icon}
                      alt={selectedNetwork.name}
                      className="h-4 w-4 rounded-full object-cover"
                    />
                  ) : (
                    <Globe className="h-4 w-4 text-[var(--text-muted)]" />
                  )}
                  <span>{selectedNetwork.name}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                </motion.button>
              </div>

              {/* Form Inputs */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                    GM Message (Stored in Soulbound NFT Metadata)
                  </label>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Leave a morning note on-chain..."
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition"
                  />
                </div>

                {/* Referral Toggle */}
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] p-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-[var(--color-primary)]" />
                      <span className="text-xs font-medium text-[var(--text-primary)]">Referral Discount</span>
                      <span className="rounded bg-[var(--status-success)]/15 px-2 py-0.5 text-[10px] font-bold text-[var(--status-success)] border border-[var(--status-success)]/30">
                        15% OFF
                      </span>
                    </div>
                    <button
                      onClick={() => setHasReferral(!hasReferral)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        hasReferral ? "bg-[var(--color-primary)]" : "bg-[var(--border-subtle)]"
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-[var(--color-on-primary)] transition-transform ${
                          hasReferral ? "translate-x-4" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {hasReferral && (
                    <div className="mt-2.5">
                      <input
                        type="text"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        placeholder="Referrer wallet address (0x...)"
                        className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-1.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] font-mono"
                      />
                    </div>
                  )}
                </div>

                {/* Pricing & Gas Breakdown */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3">
                    <div className="text-[11px] text-[var(--text-secondary)]">Mint Fee</div>
                    <div className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5 mt-0.5">
                      <span>{hasReferral ? "0.000030" : "0.000035"} {selectedNetwork.currency || "ETH"}</span>
                      {hasReferral && (
                        <span className="text-[10px] text-[var(--status-success)] font-semibold line-through">
                          0.000035
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)]">~$0.10 USD (Dynamic Chainlink)</div>
                  </div>

                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3">
                    <div className="text-[11px] text-[var(--text-secondary)]">Est. Network Gas</div>
                    <div className="text-sm font-bold text-[var(--status-success)] flex items-center gap-1 mt-0.5">
                      <Zap className="h-3.5 w-3.5" />
                      <span>&lt; $0.001</span>
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)]">Ultra-low L2 / Rollup cost</div>
                  </div>
                </div>

                {/* Action Button with Apple Spring Physics */}
                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.018 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 450, damping: 22 }}
                    onClick={handleSendGm}
                    disabled={isSendingGm}
                    className="group relative flex w-full items-center justify-center space-x-2 rounded-2xl bg-[var(--color-primary)] p-4 font-bold text-[var(--color-on-primary)] shadow-xl shadow-[#d4ff3f]/25 transition hover:brightness-110 disabled:opacity-50 cursor-pointer"
                  >
                    {isSendingGm ? (
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                        <span>Broadcasting GM to {selectedNetwork.name}...</span>
                      </div>
                    ) : (
                      <>
                        <Sun className="h-5 w-5 text-black group-hover:rotate-45 transition-transform" />
                        <span className="text-base tracking-wide">
                          {wallet.isConnected ? `Send Daily GM on ${selectedNetwork.name}` : "Connect Wallet to Send GM"}
                        </span>
                        <Sparkles className="h-4 w-4 text-black" />
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Cooldown note */}
                <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] pt-1 px-1">
                  <span className="flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                    1 GM per network per 24 hours (UTC)
                  </span>
                  <span className="text-[var(--color-primary)] font-mono text-[11px]">Next reset in 07h 42m</span>
                </div>
              </div>
            </div>
          </ApplePhysicsCard>

          {/* Right Column: Dynamic Soulbound Card Preview with 3D Tilt */}
          <div className="lg:col-span-5 flex flex-col items-center w-full">
            <ApplePhysicsCard tiltIntensity={9} glareOpacity={0.16} depth={18} className="w-full max-w-sm">
              <div className="w-full rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-2xl relative overflow-hidden backdrop-blur-2xl group hover:border-[var(--color-primary)]/50 transition duration-300">
                {/* Holographic header accent */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#d4ff3f] via-[#ff2dab] to-[#d4ff3f]" />

                {/* Card Badge Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {selectedNetwork.icon ? (
                      <img
                        src={selectedNetwork.icon}
                        alt={selectedNetwork.name}
                        className="h-6 w-6 rounded-full object-cover border border-[var(--border-subtle)]"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] flex items-center justify-center text-xs font-bold">
                        GM
                      </div>
                    )}
                    <span className="text-xs font-semibold text-[var(--text-primary)]">{selectedNetwork.name}</span>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-[#ff2dab]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#ff2dab] border border-[#ff2dab]/30">
                    <Flame className="h-3 w-3 fill-[#ff2dab]" />
                    <span>#{streak} Streak</span>
                  </div>
                </div>

                {/* Visual Card Artwork */}
                <div className="relative aspect-square w-full rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] p-5 flex flex-col justify-between overflow-hidden shadow-inner">
                  {/* Sun Glow artwork */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#d4ff3f]/15 blur-3xl rounded-full" />

                  <div className="flex justify-between items-start z-10">
                    <div className="rounded-lg bg-[var(--bg-surface)] px-2.5 py-1 text-[10px] font-mono text-[var(--color-primary)] border border-[var(--border-subtle)]">
                      SOULBOUND NFT
                    </div>
                    <div className="text-[10px] font-mono text-[var(--text-muted)]">
                      2026-10-16
                    </div>
                  </div>

                  <div className="my-auto text-center py-4 z-10">
                    <div className="inline-flex p-4 rounded-3xl bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 text-[var(--color-primary)] mb-3 shadow-lg shadow-[#d4ff3f]/15">
                      <Sun className="h-10 w-10 text-[var(--color-primary)] animate-spin-slow" />
                    </div>
                    <div className="text-2xl font-black tracking-wider text-[var(--text-primary)]">GM WEB3</div>
                    <p className="mt-1 text-xs text-[var(--text-secondary)] italic max-w-[220px] mx-auto truncate">
                      &quot;{message}&quot;
                    </p>
                  </div>

                  <div className="z-10 flex items-center justify-between pt-3 border-t border-[var(--border-subtle)] text-[10px] text-[var(--text-secondary)] font-mono">
                    <span>MINTED BY: {wallet.address || "0xYourWallet"}</span>
                    <span className="text-[var(--color-primary)] font-bold">1/1 VERIFIED</span>
                  </div>
                </div>

                {/* Card Meta Footer */}
                <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
                  <span>Ecosystem: {selectedNetwork.name}</span>
                  <span className="text-[var(--text-muted)] font-mono">ID: #892104</span>
                </div>
              </div>
            </ApplePhysicsCard>

            {/* Quick Helper text */}
            <div className="mt-4 text-center text-xs text-[var(--text-muted)]">
              Each GM is permanently stored as an on-chain soulbound token on {selectedNetwork.name}.
            </div>
          </div>
        </div>
      </div>

      {/* Celebration Modal after successful GM */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowCelebration(false)} />
          <div className="relative w-full max-w-md rounded-3xl border border-[var(--color-primary)]/40 bg-[var(--bg-surface)] p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 text-[var(--color-primary)] mb-4 animate-bounce">
              <Sun className="h-9 w-9 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-2xl font-extrabold text-[var(--text-primary)]">GM Minted Successfully!</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Your GM on <span className="text-[var(--color-primary)] font-semibold">{lastGmTx?.network}</span> has been confirmed. Your streak is now{" "}
              <span className="text-[#ff2dab] font-bold">{streak} days</span>!
            </p>

            <div className="mt-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3 text-xs font-mono text-[var(--text-secondary)] flex items-center justify-between">
              <span>Tx Hash:</span>
              <span className="text-[var(--color-primary)] font-bold">{lastGmTx?.hash}</span>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => {
                  window.open(
                    `https://twitter.com/intent/tweet?text=Just sent my daily GM on ${lastGmTx?.network} with @onchainGM! Streak: ${streak} days 🌞 https://onchaingm.com`,
                    "_blank"
                  );
                }}
                className="flex-1 rounded-xl bg-[var(--color-primary)] py-2.5 text-xs font-bold text-[var(--color-on-primary)] hover:brightness-110 transition flex items-center justify-center gap-1.5 shadow-md shadow-[#d4ff3f]/20"
              >
                <Share2 className="h-4 w-4" />
                Share on X
              </button>
              <button
                onClick={() => setShowCelebration(false)}
                className="flex-1 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] py-2.5 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Network Modal */}
      <NetworkSelectorModal isOpen={isNetworkModalOpen} onClose={() => setIsNetworkModalOpen(false)} />
      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
    </section>
  );
}
