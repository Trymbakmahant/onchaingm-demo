"use client";

import React from "react";
import { X, ShieldCheck, ExternalLink, Wallet } from "lucide-react";
import { useWeb3 } from "@/context/Web3Context";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WALLETS = [
  {
    name: "MetaMask",
    badge: "Popular",
    icon: "🦊",
    color: "from-[var(--color-primary)]/15 to-[var(--color-secondary)]/15 border-[var(--color-primary)]/30",
  },
  {
    name: "Coinbase Wallet",
    badge: "Smart Wallet",
    icon: "🔵",
    color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
  },
  {
    name: "Rainbow",
    badge: "Mobile & Web",
    icon: "🌈",
    color: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
  },
  {
    name: "WalletConnect",
    badge: "300+ Wallets",
    icon: "⚡",
    color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
  },
  {
    name: "Phantom",
    badge: "Multi-Chain",
    icon: "👻",
    color: "from-violet-500/20 to-purple-500/20 border-violet-500/30",
  },
];

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connectWallet } = useWeb3();

  if (!isOpen) return null;

  const handleSelect = async (name: string) => {
    await connectWallet(name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 text-[var(--color-primary)]">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">Connect Wallet</h3>
              <p className="text-xs text-[var(--text-secondary)]">Select your preferred Web3 provider</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wallets List */}
        <div className="mt-4 space-y-2.5">
          {WALLETS.map((w) => (
            <button
              key={w.name}
              onClick={() => handleSelect(w.name)}
              className="group flex w-full items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3.5 text-left transition duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--bg-surface-hover)]"
            >
              <div className="flex items-center space-x-3.5">
                <span className="text-2xl">{w.icon}</span>
                <div>
                  <div className="font-medium text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition">
                    {w.name}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">{w.badge}</div>
                </div>
              </div>
              <span className="text-xs text-[var(--text-muted)] group-hover:text-[var(--color-primary)] font-semibold transition">
                Connect →
              </span>
            </button>
          ))}
        </div>

        {/* Security Notice */}
        <div className="mt-5 rounded-xl border border-[var(--status-success)]/30 bg-[var(--status-success)]/10 p-3 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-2 font-medium text-[var(--status-success)] mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Non-Custodial & Safe</span>
          </div>
          OnChainGM never requests access to your funds or private keys. Each GM transaction only interacts with verified soulbound contracts.
        </div>
      </div>
    </div>
  );
}
