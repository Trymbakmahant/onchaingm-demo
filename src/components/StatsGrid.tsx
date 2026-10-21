"use client";

import React from "react";
import { Globe2, Flame, ShieldCheck, Zap, Users, TrendingUp } from "lucide-react";
import { ApplePhysicsCard } from "./ApplePhysicsCard";

export function StatsGrid() {
  const stats = [
    {
      label: "Supported Networks",
      value: "125+",
      description: "Mainnets & Testnets",
      icon: Globe2,
      color: "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/30",
    },
    {
      label: "Daily GMs Minted",
      value: "2.4M+",
      description: "Recorded permanently on-chain",
      icon: Flame,
      color: "bg-[#ff2dab]/10 text-[#ff2dab] border-[#ff2dab]/30",
    },
    {
      label: "Soulbound Cards",
      value: "100%",
      description: "Immutable Web3 identity",
      icon: ShieldCheck,
      color: "bg-[var(--status-success)]/10 text-[var(--status-success)] border-[var(--status-success)]/30",
    },
    {
      label: "Average Gas Fee",
      value: "< $0.001",
      description: "Optimized L2/L3 execution",
      icon: Zap,
      color: "bg-[#d4ff3f]/10 text-[#d4ff3f] border-[#d4ff3f]/30",
    },
  ];

  return (
    <section className="py-10 border-y border-[var(--border-subtle)] bg-[var(--bg-canvas)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <ApplePhysicsCard key={idx} tiltIntensity={6} glareOpacity={0.12}>
                <div
                  className="relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 backdrop-blur-sm hover:border-[var(--color-primary)]/40 hover:bg-[var(--bg-surface-hover)] transition duration-300 group h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-[var(--text-secondary)]">{s.label}</span>
                      <div className={`p-2 rounded-xl border ${s.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight group-hover:text-[var(--color-primary)] transition-colors">
                      {s.value}
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-[var(--text-muted)]">{s.description}</p>
                </div>
              </ApplePhysicsCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
