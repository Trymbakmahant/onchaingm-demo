"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sun,
  Flame,
  Globe,
  Wallet,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Copy,
  Check,
  Award,
  Layers,
  Droplet,
  Trophy,
  Coins,
  Moon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeb3 } from "@/context/Web3Context";
import { WalletModal } from "./WalletModal";
import { NetworkSelectorModal } from "./NetworkSelectorModal";
import { hapticEngine } from "@/lib/appleHaptics";

const NAV_LINKS = [
  { name: "Home", href: "/", icon: Sun },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Bridge", href: "/bridge", icon: Layers },
  { name: "Badges", href: "/badges", icon: Award },
  { name: "Faucet", href: "/faucet", icon: Droplet },
  { name: "B20 Deploy", href: "/b20", icon: Coins },
];

export function Header() {
  const pathname = usePathname();
  const { wallet, disconnectWallet, selectedNetwork, streak } = useWeb3();
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (wallet.address) {
      hapticEngine.play("click");
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1720px] items-center justify-between px-3 sm:px-6 lg:px-8">
          {/* Logo & Brand with Neon Obsidian Styling */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            <Link
              href="/"
              onClick={() => hapticEngine.play("cardPop")}
              className="group flex items-center gap-2.5 py-1.5 rounded-lg focus-visible:outline-none"
              aria-label="ONCHAINGM — home"
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#d4ff3f] via-[#ff2dab] to-[#d4ff3f] p-0.5 shadow-lg shadow-[#d4ff3f]/20 group-hover:scale-105 transition-transform shrink-0">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[var(--bg-canvas)]">
                  <Sun className="h-5 w-5 text-[var(--color-primary)]" />
                </div>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-[var(--text-primary)] flex items-center gap-1.5">
                  OnChain<span className="text-[var(--color-primary)]">GM</span>
                  <span className="rounded-full bg-[var(--color-primary)]/10 px-2 py-0.2 text-[9px] font-bold text-[var(--color-primary)] border border-[var(--color-primary)]/30">
                    V3
                  </span>
                </span>
                <span className="text-[10px] text-[var(--text-secondary)] hidden xl:block font-medium">
                  Your Daily Web3 Ritual
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Rail with Apple dynamic sliding spring pill */}
            <nav className="hidden lg:flex items-center space-x-1 relative" aria-label="Primary navigation">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => hapticEngine.play("click")}
                    className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors duration-200 z-10 ${
                      isActive
                        ? "text-[var(--color-primary)] font-semibold"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeHeaderPill"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        className="absolute inset-0 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] shadow-sm -z-10"
                      />
                    )}
                    <Icon className={`h-4 w-4 relative z-10 ${isActive ? "text-[var(--color-primary)]" : "text-[var(--text-muted)]"}`} />
                    <span className="relative z-10">{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Streak Counter Chip */}
            <div className="hidden sm:flex items-center space-x-1.5 rounded-full border border-[#ff2dab]/30 bg-[#ff2dab]/10 px-3 py-1 text-xs font-semibold text-[#ff2dab]">
              <Flame className="h-3.5 w-3.5 fill-[#ff2dab] text-[#ff2dab] animate-pulse" />
              <span>{streak} Day Streak</span>
            </div>

            {/* Network Selector Button */}
            <button
              type="button"
              onClick={() => {
                hapticEngine.play("click");
                setIsNetworkOpen(true);
              }}
              className="flex items-center space-x-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 sm:px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] transition hover:border-[var(--color-primary)] hover:bg-[var(--bg-surface-hover)] cursor-pointer"
            >
              {selectedNetwork.icon ? (
                <img
                  src={selectedNetwork.icon}
                  alt={selectedNetwork.name}
                  className="h-4 w-4 rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <Globe className="h-4 w-4 text-[var(--text-muted)]" />
              )}
              <span className="hidden md:inline max-w-[80px] truncate">{selectedNetwork.name}</span>
              <ChevronDown className="h-3 w-3 text-[var(--text-muted)]" />
            </button>

            {/* Theme Toggle Pill (Dark) */}
            <div className="hidden xl:flex items-center">
              <button
                type="button"
                onClick={() => hapticEngine.play("click")}
                className="flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-white transition cursor-pointer"
                aria-label="Theme: Dark"
                title="Theme: Dark"
              >
                <Moon className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                <span>Dark</span>
              </button>
            </div>

            {/* Language Pill (EN) */}
            <div className="hidden xl:flex items-center">
              <button
                type="button"
                onClick={() => hapticEngine.play("click")}
                className="flex items-center gap-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-white transition cursor-pointer"
                aria-label="Language: English"
                title="Language: English"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>EN</span>
              </button>
            </div>

            {/* Wallet Connect / Account Details - Using Theme Primary Chartreuse */}
            {wallet.isConnected ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    hapticEngine.play("click");
                    setIsUserMenuOpen(!isUserMenuOpen);
                  }}
                  className="flex items-center space-x-2 rounded-xl border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)] hover:border-[var(--color-primary)] transition cursor-pointer"
                >
                  <div className="h-2 w-2 rounded-full bg-[var(--status-success)] animate-pulse" />
                  <span>{wallet.address}</span>
                  <ChevronDown className="h-3 w-3 text-[var(--text-muted)]" />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -5 }}
                      transition={{ type: "spring", stiffness: 450, damping: 28 }}
                      className="absolute right-0 mt-2 w-52 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 shadow-2xl backdrop-blur-xl ring-1 ring-white/5 z-50"
                    >
                      <div className="px-3 py-2 border-b border-[var(--border-subtle)]">
                        <div className="text-[10px] text-[var(--text-muted)] font-medium">Connected Account</div>
                        <div className="text-xs font-bold text-[var(--text-primary)] truncate font-mono mt-0.5">
                          {wallet.address}
                        </div>
                        <div className="text-[11px] text-[var(--color-primary)] mt-1">
                          Balance: {wallet.balance} {selectedNetwork.currency || "ETH"}
                        </div>
                      </div>
                      <div className="mt-1 space-y-1">
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Copy className="h-3.5 w-3.5" />
                            {copied ? "Address Copied!" : "Copy Address"}
                          </span>
                          {copied && <Check className="h-3.5 w-3.5 text-[var(--status-success)]" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            hapticEngine.play("click");
                            disconnectWallet();
                            setIsUserMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-[var(--status-error)] hover:bg-[var(--status-error)]/10 transition cursor-pointer"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          Disconnect
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  hapticEngine.play("click");
                  setIsWalletOpen(true);
                }}
                className="relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-[#d4ff3f]/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => {
                hapticEngine.play("click");
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 text-neutral-300 hover:text-white"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-canvas)]/95 px-4 pt-3 pb-5 space-y-2 backdrop-blur-2xl">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    hapticEngine.play("click");
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2.5 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-[var(--color-primary)] text-[var(--color-on-primary)] font-bold shadow-sm"
                      : "text-[var(--text-secondary)] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Network Selector Modal */}
      <NetworkSelectorModal
        isOpen={isNetworkOpen}
        onClose={() => setIsNetworkOpen(false)}
      />

      {/* Wallet Connect Modal */}
      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
      />
    </>
  );
}
