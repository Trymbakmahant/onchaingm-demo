"use client";

import React from "react";
import Link from "next/link";
import { Trophy, ChevronRight } from "lucide-react";
import { hapticEngine } from "@/lib/appleHaptics";

export function PromoBanner() {
  return (
    <div className="w-full pt-2.5 sm:pt-3.5 pb-1">
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 sm:py-3.5 sm:px-5 shadow-sm backdrop-blur-md transition-all hover:border-[var(--color-primary)]/30">
          <div className="flex items-center justify-between gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
            {/* Left: Trophy Icon + Reward Copy */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 text-[var(--color-primary)]">
                <Trophy className="h-4.5 w-4.5" />
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                <span>Each month, claim your share of the </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-[var(--color-primary)]/15 dark:bg-[var(--bg-canvas)] text-[#122100] dark:text-[var(--color-primary)] font-bold border border-[var(--color-primary)]/40 font-mono text-xs mx-1">
                  $2,000 USDC
                </span>
                <span> reward pool for the GM and Deploy transactions you make through OnChainGM.</span>
              </p>
            </div>

            {/* Right: Theme CTA Button */}
            <Link
              href="/leaderboard"
              onClick={() => hapticEngine.play("click")}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--color-primary)] text-[var(--color-on-primary)] px-4 py-2 text-xs font-bold shadow-md shadow-[#d4ff3f]/15 hover:brightness-110 active:scale-95 transition-all shrink-0 ml-auto cursor-pointer"
            >
              <span>View Leaderboard</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
