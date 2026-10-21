"use client";

import React from "react";
import { Flame, ExternalLink, Activity, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useWeb3 } from "@/context/Web3Context";
import { hapticEngine } from "@/lib/appleHaptics";

export function RecentActivity() {
  const { recentGms } = useWeb3();

  return (
    <section className="py-14 border-t border-[var(--border-subtle)] bg-[var(--bg-canvas)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[var(--status-success)] animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Live Ritual Stream</h2>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              Real-time on-chain GM transactions across all supported chains
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)] font-mono">Auto-refreshing</span>
            <div className="rounded-full bg-[var(--status-success)]/10 px-3 py-1 text-xs font-semibold text-[var(--status-success)] border border-[var(--status-success)]/30 flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5" />
              <span>Network Active</span>
            </div>
          </div>
        </div>

        {/* Activity Table / Grid */}
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] backdrop-blur-xl overflow-hidden shadow-xl">
          <div className="divide-y divide-[var(--border-subtle)]">
            {recentGms.map((gm, idx) => (
              <motion.div
                key={gm.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  delay: Math.min(idx * 0.04, 0.3),
                }}
                whileHover={{
                  x: 6,
                  transition: { type: "spring", stiffness: 450, damping: 25 },
                }}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-[var(--bg-surface-hover)] transition-colors duration-150 gap-3"
              >
                {/* Left: Chain & Wallet */}
                <div className="flex items-center space-x-3.5">
                  {gm.networkIcon ? (
                    <img
                      src={gm.networkIcon}
                      alt={gm.networkName}
                      className="h-8 w-8 rounded-full object-cover border border-[var(--border-subtle)]"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-[var(--bg-canvas)] border border-[var(--border-subtle)] flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">
                      GM
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--text-primary)]">{gm.networkName}</span>
                      <span className="text-xs text-[var(--text-secondary)] font-mono">{gm.address}</span>
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-2 font-mono">
                      <span>Tx: {gm.txHash}</span>
                      <span>•</span>
                      <span>{gm.timeAgo}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Streak & Badges */}
                <div className="flex items-center space-x-3 self-end sm:self-auto">
                  <div className="flex items-center space-x-1.5 rounded-full bg-[#ff2dab]/10 px-3 py-1 text-xs font-semibold text-[#ff2dab] border border-[#ff2dab]/30">
                    <Flame className="h-3.5 w-3.5 fill-[#ff2dab]" />
                    <span>{gm.streak} Days</span>
                  </div>

                  <motion.a
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      hapticEngine.play("click");
                    }}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--bg-canvas)] transition"
                    title="View on Block Explorer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
