"use client";

import React from "react";
import Link from "next/link";
import { Sun, Code2, ArrowLeftRight, Award, CheckCircle, ArrowRight } from "lucide-react";
import { ApplePhysicsCard } from "./ApplePhysicsCard";

export function FeatureCards() {
  const features = [
    {
      title: "Daily GM Ritual",
      badge: "Core Protocol",
      description:
        "Send daily blockchain greetings across 125+ networks and collect unique soulbound NFT cards. Every GM is permanently recorded on-chain as cryptographic proof of your daily Web3 presence.",
      bullets: [
        "Daily cooldown per network (UTC-based)",
        "Soulbound NFTs with immutable on-chain metadata",
        "15% referral discount + 10% direct commission",
      ],
      icon: Sun,
      color: "border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
      cta: "Send GM Today",
      href: "/",
    },
    {
      title: "One-Click Deploy",
      badge: "Contract Factory",
      description:
        "Deploy verified smart contracts to any supported network using factory patterns in a single transaction. Earn passive protocol fees from all activity on your deployed contracts.",
      bullets: [
        "Instant deployment across 125+ EVM chains",
        "Earn on-chain fee split as the contract owner",
        "Ultra-low fixed deployment costs (0.000035 ETH)",
      ],
      icon: Code2,
      color: "border-[#d4ff3f]/30 bg-[#d4ff3f]/10 text-[#d4ff3f]",
      cta: "Explore Deploy",
      href: "/b20",
    },
    {
      title: "Cross-Chain Bridge",
      badge: "Aggregated Routes",
      description:
        "Seamless cross-chain asset transfers and token swaps powered by Li.Fi and Relay protocols. Get automatic best execution routes with minimal slippage and lowest fees.",
      bullets: [
        "Aggregates 15+ liquidity bridges & DEXs",
        "Fast transaction completion (< 60s average)",
        "Lowest gas route optimization engine",
      ],
      icon: ArrowLeftRight,
      color: "border-[#ff2dab]/30 bg-[#ff2dab]/10 text-[#ff2dab]",
      cta: "Bridge Tokens",
      href: "/bridge",
    },
    {
      title: "NFT Badges & Faucet",
      badge: "Community Rewards",
      description:
        "Build your multi-chain collectible portfolio with exclusive ecosystem badges. Use the verified Base Faucet Badge to unlock instant testnet drips across all supported testnets.",
      bullets: [
        "Exclusive mainnet & testnet network badges",
        "Base Faucet verification layer for test tokens",
        "Showcase your multi-chain badge collection",
      ],
      icon: Award,
      color: "border-[var(--status-success)]/30 bg-[var(--status-success)]/10 text-[var(--status-success)]",
      cta: "Collect Badges",
      href: "/badges",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-[var(--bg-canvas)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#d4ff3f]/10 px-3 py-1 text-xs font-semibold text-[var(--color-primary)] border border-[#d4ff3f]/25 mb-3">
            <span>Ecosystem Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            The Complete Multi-Chain Web3 Suite
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--text-secondary)]">
            From daily on-chain greetings to factory contract deployment and cross-chain liquidity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <ApplePhysicsCard key={idx} tiltIntensity={5} glareOpacity={0.1} depth={12}>
                <div
                  className="group relative flex flex-col justify-between rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-7 backdrop-blur-xl transition duration-300 hover:border-[var(--color-primary)]/50 hover:bg-[var(--bg-surface-hover)] hover:shadow-2xl h-full"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl border ${f.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-[#ff2dab]/10 px-3 py-1 text-xs font-bold text-[#ff2dab] border border-[#ff2dab]/30">
                        {f.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                      {f.description}
                    </p>

                    <div className="mt-6 space-y-2.5 border-t border-[var(--border-subtle)] pt-4">
                      {f.bullets.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                          <CheckCircle className="h-4 w-4 text-[var(--status-success)] shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-[var(--border-subtle)]">
                    <Link
                      href={f.href}
                      className="inline-flex items-center gap-2 text-xs font-bold text-[var(--color-primary)] hover:brightness-110 transition"
                    >
                      <span>{f.cta}</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </ApplePhysicsCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
