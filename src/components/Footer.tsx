"use client";

import React from "react";
import Link from "next/link";
import { Sun, Heart, ExternalLink, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-secondary)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-[var(--border-subtle)]">
          {/* Brand info */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#d4ff3f] to-[#ff2dab] text-black shadow-md shadow-[#d4ff3f]/20">
                <Sun className="h-5 w-5 fill-black" />
              </div>
              <span className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
                OnChain<span className="text-[var(--color-primary)]">GM</span>
              </span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed max-w-sm text-[var(--text-secondary)]">
              The universal multi-chain ritual for Web3 enthusiasts. Send your morning greeting across 125+ networks, mint soulbound NFT proofs, and establish your immutable decentralized presence.
            </p>
            <div className="mt-4 flex items-center space-x-3 text-xs">
              <span className="flex items-center gap-1.5 text-[var(--status-success)]">
                <span className="h-2 w-2 rounded-full bg-[var(--status-success)] animate-pulse" />
                All 125+ Networks Operational
              </span>
            </div>
          </div>

          {/* Column 1: Ecosystem */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">Ecosystem</h4>
            <ul className="mt-3 space-y-2 text-xs text-[var(--text-secondary)]">
              <li>
                <Link href="/" className="hover:text-[var(--color-primary)] transition">
                  Daily GM Ritual
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-[var(--color-primary)] transition">
                  Global Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/badges" className="hover:text-[var(--color-primary)] transition">
                  NFT Badges
                </Link>
              </li>
              <li>
                <Link href="/bridge" className="hover:text-[var(--color-primary)] transition">
                  Cross-Chain Bridge
                </Link>
              </li>
              <li>
                <Link href="/faucet" className="hover:text-[var(--color-primary)] transition">
                  Multi-Chain Faucet
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Developers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">Developers</h4>
            <ul className="mt-3 space-y-2 text-xs text-[var(--text-secondary)]">
              <li>
                <a href="#" className="hover:text-[var(--color-primary)] transition">
                  Smart Contracts V3
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--color-primary)] transition">
                  Factory Deploy API
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--color-primary)] transition">
                  Chainlink Oracle Feeds
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--color-primary)] transition">
                  Contract ABIs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--color-primary)] transition">
                  Network Fee Registry
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Community & Social */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">Community</h4>
            <ul className="mt-3 space-y-2 text-xs text-[var(--text-secondary)]">
              <li>
                <a
                  href="https://twitter.com/onchainGM"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[var(--color-primary)] transition flex items-center gap-1"
                >
                  <span>X (Twitter)</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--color-primary)] transition flex items-center gap-1">
                  <span>Farcaster MiniApp</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--color-primary)] transition">
                  Telegram Group
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--color-primary)] transition">
                  Referral Program (10%)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-muted)] gap-4">
          <div>
            © 2026 OnChainGM Protocol. Built for the decentralized web.
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1">
              Made with <Heart className="h-3 w-3 text-[#ff2dab] fill-[#ff2dab]" /> for Web3 Builders
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
