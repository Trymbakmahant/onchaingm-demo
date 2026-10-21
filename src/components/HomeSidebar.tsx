"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Wallet,
  Clock,
  ExternalLink,
  HelpCircle,
  Droplets,
  Radio,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useWeb3 } from "@/context/Web3Context";
import { hapticEngine } from "@/lib/appleHaptics";

interface HomeSidebarProps {
  onOpenWalletModal: () => void;
  onGmNetwork?: (networkId: number) => void;
}

export function HomeSidebar({ onOpenWalletModal, onGmNetwork }: HomeSidebarProps) {
  const { wallet, streak } = useWeb3();

  // Testnet icons for the Faucet banner
  const testnetIcons = [
    "https://onchaingm.com/chains/dogeos.svg",
    "https://onchaingm.com/chains/maroo.png",
    "/chains/qms.svg",
    "https://onchaingm.com/chains/dac.jpg",
    "https://onchaingm.com/chains/simplechain.jpg",
    "https://onchaingm.com/chains/arc.jpg",
    "https://onchaingm.com/chains/litvm.svg",
    "https://onchaingm.com/chains/giwa.svg",
    "https://onchaingm.com/chains/rice.jpg",
    "https://onchaingm.com/chains/kii.jpg",
    "https://onchaingm.com/chains/neura.jpg",
    "https://onchaingm.com/chains/push.jpg",
    "https://onchaingm.com/chains/x1logo.svg",
    "https://onchaingm.com/chains/iopn.jpg",
    "https://onchaingm.com/chains/ether.svg",
  ];

  // Networks for Revoke banner
  const revokeIcons = [
    "https://onchaingm.com/chains/base.jpg",
    "https://onchaingm.com/chains/ether.svg",
    "https://onchaingm.com/chains/arbitrum.svg",
    "https://onchaingm.com/chains/optimism.svg",
    "https://onchaingm.com/chains/polygon.svg",
    "https://onchaingm.com/chains/logoBsc.png",
    "https://onchaingm.com/chains/soneium.svg",
    "https://onchaingm.com/chains/ink.svg",
    "https://onchaingm.com/chains/unichain.svg",
    "https://onchaingm.com/chains/linea.png",
  ];

  // Countdown timer state
  const [secondsRemaining, setSecondsRemaining] = useState(67320); // ~18 hours

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 86400));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <aside className="w-full lg:w-[320px] xl:w-[340px] shrink-0 flex flex-col gap-4">
      {/* 1. Connect Your Wallet / Connected Account Card */}
      {!wallet.isConnected ? (
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => {
            hapticEngine.play("click");
            onOpenWalletModal();
          }}
          className="group flex items-center gap-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-sm hover:border-[var(--color-primary)]/50 hover:bg-[var(--bg-surface-hover)] transition-all cursor-pointer backdrop-blur-sm"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/25 text-[var(--color-primary)] group-hover:scale-105 transition-transform">
            <Wallet className="h-5 w-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
              Connect Your Wallet
            </span>
            <span className="text-xs text-[var(--text-secondary)] truncate">
              Connect your wallet to continue
            </span>
          </div>
        </motion.div>
      ) : (
        <div className="flex items-center justify-between gap-3.5 rounded-2xl border border-[var(--color-primary)]/30 bg-[var(--bg-surface)] p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--status-success)]/15 border border-[var(--status-success)]/30 text-[var(--status-success)]">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[var(--text-primary)] font-mono truncate">
                {wallet.address}
              </span>
              <span className="text-[11px] text-[var(--text-secondary)]">
                {wallet.balance} ETH • {streak} Day Streak 🔥
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenWalletModal}
            className="text-[11px] font-semibold text-[var(--color-primary)] hover:underline shrink-0 cursor-pointer"
          >
            Manage
          </button>
        </div>
      )}

      {/* 2. Arcus Early Access Banner */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-2 border border-[var(--color-primary)]/20">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <h4 className="text-sm font-bold text-[var(--text-primary)]">Sign up for early access</h4>
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mt-1">
            Perpetuals trading is currently in closed beta. Follow the steps on the waitlist page to join the queue
          </p>
          <a
            href="https://arcus.exchange"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => hapticEngine.play("click")}
            className="w-full mt-3.5 flex items-center justify-center gap-1.5 rounded-xl border border-[var(--status-success)]/30 bg-[var(--status-success)]/10 py-2 px-3 text-xs font-semibold text-[var(--status-success)] hover:bg-[var(--status-success)]/20 active:scale-98 transition-all"
          >
            <span>Get 5% off all transaction fees on Arcus</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          </a>
        </div>
      </div>

      {/* 3. OnChainGM Faucet Banner */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-sm backdrop-blur-sm flex items-center justify-between gap-3">
        <div className="flex flex-col items-start min-w-0">
          <div className="flex items-center gap-1.5">
            <Droplets className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span className="text-xs font-bold text-[var(--text-primary)] tracking-tight">OnChainGM Faucet</span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] mt-1 max-w-[150px] leading-tight">
            Claim the highest testnet token amounts in one click.
          </p>
          <Link
            href="/faucet"
            onClick={() => hapticEngine.play("click")}
            className="mt-3 inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] text-[var(--color-on-primary)] px-3.5 py-1.5 text-xs font-bold shadow-md shadow-[#d4ff3f]/15 hover:brightness-110 active:scale-95 transition-all"
          >
            Claim tokens
          </Link>
        </div>

        {/* Right Testnet Icons Cluster */}
        <div className="flex flex-col items-center shrink-0">
          <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)]">
            {testnetIcons.slice(0, 12).map((icon, i) => (
              <img
                key={i}
                src={icon}
                alt="Testnet"
                className="h-4 w-4 rounded-full object-cover bg-zinc-800"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ))}
          </div>
          <div className="text-[10px] text-[var(--text-secondary)] mt-1 text-center font-medium">
            <span className="text-[var(--text-primary)] font-bold">15 Networks</span>
            <div className="text-[9px] text-[var(--text-muted)]">Testnet tokens</div>
          </div>
        </div>
      </div>

      {/* 4. InfinityName Revoke Banner */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-sm backdrop-blur-sm flex items-center justify-between gap-3">
        <div className="flex flex-col items-start min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-semibold text-[var(--color-secondary)]">∞ InfinityName</span>
          </div>
          <h4 className="text-sm font-bold text-[var(--text-primary)] tracking-tight mt-0.5">Revoke</h4>
          <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 max-w-[150px] leading-tight">
            Scan your wallet & revoke risky approvals in one click.
          </p>
          <a
            href="https://revoke.cash"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => hapticEngine.play("click")}
            className="mt-3 inline-flex items-center justify-center rounded-xl bg-[var(--color-secondary)] text-[var(--color-on-secondary)] px-3.5 py-1.5 text-xs font-bold shadow-md shadow-[#ff2dab]/15 hover:brightness-110 active:scale-95 transition-all"
          >
            Scan Wallet
          </a>
        </div>

        {/* Right Revoke Networks Cluster */}
        <div className="flex flex-col items-center shrink-0">
          <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)]">
            {revokeIcons.slice(0, 12).map((icon, i) => (
              <img
                key={i}
                src={icon}
                alt="Network"
                className="h-4 w-4 rounded-full object-cover bg-zinc-800"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ))}
          </div>
          <div className="text-[10px] text-[var(--text-secondary)] mt-1 text-center font-medium">
            <span className="text-[var(--text-primary)] font-bold">19 Networks</span>
            <div className="text-[9px] text-[var(--text-muted)]">Token • NFT • Permit2</div>
          </div>
        </div>
      </div>

      {/* 5. Next GM Timers Widget */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-sm backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[var(--text-primary)]">Next GM Timers</h4>
              <p className="text-[11px] text-[var(--text-secondary)]">Countdown to your next GM</p>
            </div>
          </div>
          <button
            type="button"
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition p-1"
            title="GMs can be sent once every 24 hours per network"
          >
            <HelpCircle className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Content */}
        {!wallet.isConnected ? (
          <div
            onClick={() => {
              hapticEngine.play("click");
              onOpenWalletModal();
            }}
            className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-5 text-center cursor-pointer hover:border-[var(--color-primary)]/40 transition"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-2">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-[var(--text-primary)]">Connect Your Wallet</span>
            <span className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              Connect your wallet to continue
            </span>
          </div>
        ) : (
          <div className="mt-3.5 space-y-2.5">
            {[
              { id: 8453, name: "Base", icon: "https://onchaingm.com/chains/base.jpg", color: "#2a58f4" },
              { id: 1868, name: "Soneium", icon: "https://onchaingm.com/chains/soneium.svg", color: "#63aecb" },
              { id: 57073, name: "Ink", icon: "https://onchaingm.com/chains/ink.svg", color: "#7b2cfe" },
              { id: 4663, name: "Robinhood", icon: "https://onchaingm.com/chains/robinhood.png", color: "#00c805" },
            ].map((chain) => (
              <div
                key={chain.id}
                className="flex items-center justify-between rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] p-2 px-2.5"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={chain.icon}
                    alt={chain.name}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  <span className="text-xs font-semibold text-[var(--text-primary)] truncate">{chain.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#15803d] dark:text-[var(--color-primary)] font-bold">
                    {formatTime(secondsRemaining)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onGmNetwork && onGmNetwork(chain.id)}
                    className="px-2.5 py-0.5 text-[10px] font-bold rounded-lg bg-[var(--color-primary)]/20 text-[#122100] dark:bg-[var(--color-primary)]/15 dark:text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] transition"
                  >
                    GM
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
