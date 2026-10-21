"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, ExternalLink, Copy, Check, Sparkles, ShieldCheck, Loader2 } from "lucide-react";
import { BadgeItem } from "@/types";
import { hapticEngine } from "@/lib/appleHaptics";

interface MintBadgeModalProps {
  badge: BadgeItem | null;
  isOpen: boolean;
  onClose: () => void;
  isMinting: boolean;
  isSuccess: boolean;
  onConfirmMint: () => void;
}

export function MintBadgeModal({
  badge,
  isOpen,
  onClose,
  isMinting,
  isSuccess,
  onConfirmMint,
}: MintBadgeModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !badge) return null;

  const handleCopy = () => {
    if (badge.contractAddress) {
      navigator.clipboard.writeText(badge.contractAddress);
      setCopied(true);
      hapticEngine.play("click");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    hapticEngine.play("click");
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          onClick={isMinting ? undefined : handleClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 450, damping: 28 }}
          className="relative w-full max-w-sm sm:max-w-md rounded-2xl sm:rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-6 shadow-2xl shadow-black/90 overflow-hidden my-auto"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#d4ff3f]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#ff2dab]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={handleClose}
            disabled={isMinting}
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 rounded-full p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] hover:text-white transition disabled:opacity-40"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {isSuccess ? (
            /* Mint Success State */
            <div className="text-center py-2 sm:py-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[var(--status-success)]/15 border border-[var(--status-success)]/40 text-[var(--status-success)] mb-3"
              >
                <CheckCircle2 className="h-8 w-8 sm:h-9 sm:w-9" />
              </motion.div>

              <h3 className="text-lg sm:text-xl font-extrabold text-[var(--text-primary)]">
                Badge Minted! 🎉
              </h3>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Your collectible NFT is now verified on-chain.
              </p>

              {/* Minted Badge Card Preview */}
              <div className="mt-4 p-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] flex items-center gap-3 text-left">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-[#d4ff3f]/20 via-[#ff2dab]/15 to-[#d4ff3f]/20 border border-[var(--color-primary)]/40 shrink-0">
                  <img
                    src={badge.imageUrl}
                    alt={badge.name}
                    className="h-7 w-7 object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs sm:text-sm text-[var(--text-primary)] truncate">
                    {badge.name}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5">
                    <span>{badge.networkName}</span>
                    <span>•</span>
                    <span className="text-[var(--status-success)] font-semibold">Confirmed</span>
                  </div>
                </div>
              </div>

              {/* Transaction details */}
              <div className="mt-3 p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] text-left space-y-1.5 text-[11px]">
                <div className="flex justify-between items-center text-[var(--text-muted)]">
                  <span>Tx Hash:</span>
                  <span className="font-mono text-[var(--color-primary)]">0x8f2a...c4b9</span>
                </div>
                <div className="flex justify-between items-center text-[var(--text-muted)]">
                  <span>Network:</span>
                  <span className="text-white font-medium">{badge.networkName}</span>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <a
                  href={`https://etherscan.io`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] py-2 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--color-primary)] transition"
                >
                  <span>Explorer</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <button
                  onClick={handleClose}
                  className="flex-1 rounded-xl bg-[var(--color-primary)] py-2 text-xs font-bold text-[var(--color-on-primary)] hover:brightness-110 shadow-md shadow-[#d4ff3f]/20 transition"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Confirm Mint State */
            <div>
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)]">
                    Mint Collectible Badge
                  </h3>
                  <p className="text-[10px] sm:text-xs text-[var(--text-muted)]">
                    Direct on-chain mint to your connected wallet
                  </p>
                </div>
              </div>

              {/* Badge Preview Hero */}
              <div className="relative rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3.5 sm:p-4 text-center my-3 overflow-hidden">
                <div className="relative mx-auto flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#d4ff3f]/20 via-[#ff2dab]/15 to-[#d4ff3f]/20 border border-[var(--color-primary)]/40 shadow-lg shadow-black/80">
                  <img
                    src={badge.imageUrl}
                    alt={badge.name}
                    className="h-12 w-12 sm:h-14 sm:w-14 object-contain drop-shadow"
                  />
                  <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-black">
                    <ShieldCheck className="h-3 w-3" />
                  </div>
                </div>

                <div className="mt-3">
                  <h4 className="font-extrabold text-sm sm:text-base text-[var(--text-primary)]">
                    {badge.name}
                  </h4>
                  <p className="mt-1 text-xs text-[var(--text-secondary)] line-clamp-2 px-2">
                    {badge.description}
                  </p>
                </div>
              </div>

              {/* Order Breakdown */}
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-muted)]">Network:</span>
                  <span className="font-medium text-[var(--text-primary)] flex items-center gap-1.5">
                    <img src={badge.imageUrl} alt="" className="h-3.5 w-3.5 rounded-full" />
                    {badge.networkName}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-muted)]">Mint Fee:</span>
                  <span className="font-bold text-[var(--color-primary)]">{badge.fee}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-muted)]">Est. Network Gas:</span>
                  <span className="text-[var(--text-secondary)]">~0.00002 ETH</span>
                </div>

                {badge.contractAddress && (
                  <div className="pt-2 border-t border-[var(--border-subtle)] flex justify-between items-center">
                    <span className="text-[var(--text-muted)] text-[11px]">Contract:</span>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-[11px] font-mono text-[var(--text-secondary)] hover:text-white transition"
                    >
                      <span>
                        {badge.contractAddress.slice(0, 6)}...{badge.contractAddress.slice(-4)}
                      </span>
                      {copied ? (
                        <Check className="h-3 w-3 text-[var(--status-success)]" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Mint Button */}
              <div className="mt-4">
                <button
                  onClick={onConfirmMint}
                  disabled={isMinting || badge.status === "coming_soon"}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-[var(--color-on-primary)] hover:brightness-110 shadow-lg shadow-[#d4ff3f]/25 disabled:opacity-50 transition cursor-pointer"
                >
                  {isMinting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-black" />
                      <span>Minting on {badge.networkName}...</span>
                    </>
                  ) : (
                    <span>Confirm & Mint Badge</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
