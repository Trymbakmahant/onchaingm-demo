"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Flame,
  Search,
  ExternalLink,
  Coins,
  Sparkles,
} from "lucide-react";
import { LEADERBOARD_DATA } from "@/data/mockData";
import { useWeb3 } from "@/context/Web3Context";
import { ApplePhysicsCard } from "@/components/ApplePhysicsCard";
import { hapticEngine } from "@/lib/appleHaptics";

export default function LeaderboardPage() {
  const { wallet, streak } = useWeb3();
  const [timeFilter, setTimeFilter] = useState<"all" | "30d" | "7d" | "24h">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = LEADERBOARD_DATA.filter((user) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      user.address.toLowerCase().includes(q) ||
      (user.ens && user.ens.toLowerCase().includes(q))
    );
  });

  const topThree = filteredUsers.slice(0, 3);

  return (
    <div className="relative py-6 sm:py-10 lg:py-14">
      {/* Background ambient lighting */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[350px] sm:w-[650px] h-[200px] sm:h-[300px] bg-[var(--color-primary)]/10 blur-[100px] sm:blur-[140px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-3 py-1 sm:px-4 sm:py-1.5 text-xs font-semibold text-[var(--color-primary)] mb-2 sm:mb-3">
            <Trophy className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span>Global Hall of Fame</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Ecosystem <span className="bg-gradient-to-r from-[var(--color-primary)] via-[#f5f5f7] to-[var(--color-secondary)] bg-clip-text text-transparent">Leaderboard</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] px-2">
            Top Web3 enthusiasts maintaining the longest continuous GM streaks across all 125+ chains.
          </p>
        </div>

        {/* User's Own Ranking Banner (Mobile Optimized) */}
        <ApplePhysicsCard tiltIntensity={2.5} glareOpacity={0.05} className="mb-6 sm:mb-8">
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 sm:p-5 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 text-[var(--color-primary)] font-bold text-sm sm:text-lg shrink-0">
                {wallet.isConnected ? "#42" : "?"}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] sm:text-xs text-[var(--text-secondary)] font-medium">Your Ranking</div>
                <div className="text-sm sm:text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <span className="truncate max-w-[170px] sm:max-w-none">{wallet.address || "Wallet Not Connected"}</span>
                  {wallet.isConnected && (
                    <span className="rounded-full bg-[var(--status-success)]/15 px-1.5 py-0.2 text-[9px] text-[var(--status-success)] font-medium border border-[var(--status-success)]/30 shrink-0">
                      Active
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats row - 3 columns on mobile, flex on desktop */}
            <div className="grid grid-cols-3 gap-2 pt-2 md:pt-0 border-t border-[var(--border-subtle)] md:border-0 md:flex md:items-center md:gap-6 text-center md:text-left">
              <div className="bg-[var(--bg-canvas)] md:bg-transparent p-2 md:p-0 rounded-xl border border-[var(--border-subtle)] md:border-0">
                <div className="text-[10px] sm:text-[11px] text-[var(--text-muted)] truncate">Current Streak</div>
                <div className="text-xs sm:text-sm font-bold text-[var(--color-secondary)] flex items-center gap-1 justify-center md:justify-start">
                  <Flame className="h-3.5 w-3.5 fill-[var(--color-secondary)] text-[var(--color-secondary)]" />
                  <span>{streak} Days</span>
                </div>
              </div>
              <div className="bg-[var(--bg-canvas)] md:bg-transparent p-2 md:p-0 rounded-xl border border-[var(--border-subtle)] md:border-0">
                <div className="text-[10px] sm:text-[11px] text-[var(--text-muted)] truncate">Total GMs</div>
                <div className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">38 Minted</div>
              </div>
              <div className="bg-[var(--bg-canvas)] md:bg-transparent p-2 md:p-0 rounded-xl border border-[var(--border-subtle)] md:border-0">
                <div className="text-[10px] sm:text-[11px] text-[var(--text-muted)] truncate">Chains</div>
                <div className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">14 Chains</div>
              </div>
            </div>
          </div>
        </ApplePhysicsCard>

        {/* Podium for Top 3 (Responsive Olympic Layout) */}
        {topThree.length >= 3 && (
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-6 sm:mb-10 items-end max-w-4xl mx-auto">
            {/* Rank 2 (Silver) */}
            <div className="order-1">
              <div className="rounded-xl sm:rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2.5 sm:p-5 text-center backdrop-blur-xl relative">
                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-slate-300 text-black font-extrabold text-xs sm:text-sm shadow-md">
                  2
                </div>
                <div className="mt-2 text-xs sm:text-base font-bold text-[var(--text-primary)] truncate">
                  {topThree[1].ens || topThree[1].address.slice(0, 6)}
                </div>
                <div className="hidden sm:block text-[10px] text-[var(--text-muted)] font-mono mt-0.5 truncate">
                  {topThree[1].address}
                </div>
                <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row justify-center gap-1 sm:gap-4 text-[10px] sm:text-xs">
                  <span className="font-bold text-[var(--color-secondary)] flex items-center gap-0.5 justify-center">
                    <Flame className="h-3 w-3 fill-[var(--color-secondary)]" /> {topThree[1].streakDays}d
                  </span>
                  <span className="text-[var(--text-muted)] hidden sm:inline">
                    {topThree[1].totalGms} GMs
                  </span>
                </div>
              </div>
            </div>

            {/* Rank 1 (Gold - Elevated) */}
            <div className="order-2">
              <div className="rounded-xl sm:rounded-3xl border border-[var(--color-primary)]/60 bg-[var(--bg-surface)] p-3 sm:p-6 text-center backdrop-blur-2xl relative shadow-xl shadow-[#d4ff3f]/10 pb-4 sm:pb-6">
                <div className="absolute -top-3.5 sm:-top-5 left-1/2 -translate-x-1/2 flex h-7 w-7 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] font-black text-xs sm:text-base shadow-lg shadow-[#d4ff3f]/30">
                  👑
                </div>
                <div className="mt-2 text-xs sm:text-lg font-extrabold text-[var(--color-primary)] truncate">
                  {topThree[0].ens || topThree[0].address.slice(0, 6)}
                </div>
                <div className="hidden sm:block text-[10px] text-[var(--text-muted)] font-mono mt-0.5 truncate">
                  {topThree[0].address}
                </div>
                <div className="mt-2 sm:mt-4 flex flex-col sm:flex-row justify-center gap-1 sm:gap-4 text-[10px] sm:text-xs">
                  <span className="font-extrabold text-[var(--color-secondary)] flex items-center gap-0.5 justify-center">
                    <Flame className="h-3.5 w-3.5 fill-[var(--color-secondary)]" /> {topThree[0].streakDays}d
                  </span>
                  <span className="text-[var(--text-primary)] font-bold hidden sm:inline">
                    {topThree[0].totalGms} GMs
                  </span>
                </div>
              </div>
            </div>

            {/* Rank 3 (Bronze) */}
            <div className="order-3">
              <div className="rounded-xl sm:rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2.5 sm:p-5 text-center backdrop-blur-xl relative">
                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#333333] text-white font-extrabold text-xs sm:text-sm shadow-md border border-[var(--border-subtle)]">
                  3
                </div>
                <div className="mt-2 text-xs sm:text-base font-bold text-[var(--text-primary)] truncate">
                  {topThree[2].ens || topThree[2].address.slice(0, 6)}
                </div>
                <div className="hidden sm:block text-[10px] text-[var(--text-muted)] font-mono mt-0.5 truncate">
                  {topThree[2].address}
                </div>
                <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row justify-center gap-1 sm:gap-4 text-[10px] sm:text-xs">
                  <span className="font-bold text-[var(--color-secondary)] flex items-center gap-0.5 justify-center">
                    <Flame className="h-3 w-3 fill-[var(--color-secondary)]" /> {topThree[2].streakDays}d
                  </span>
                  <span className="text-[var(--text-muted)] hidden sm:inline">
                    {topThree[2].totalGms} GMs
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          {/* Time range pills: 4 equal grid columns on mobile */}
          <div className="grid grid-cols-4 w-full sm:w-auto sm:flex sm:space-x-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1">
            {(["all", "30d", "7d", "24h"] as const).map((t) => {
              const isActive = timeFilter === t;
              return (
                <button
                  key={t}
                  onClick={() => {
                    hapticEngine.play("toggle");
                    setTimeFilter(t);
                  }}
                  className={`relative rounded-lg py-1.5 px-2 text-center text-xs font-bold uppercase transition select-none cursor-pointer ${
                    isActive ? "text-[var(--color-on-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="leaderboardTimeIndicator"
                      className="absolute inset-0 rounded-lg bg-[var(--color-primary)] shadow-sm -z-10"
                      transition={{ type: "spring", stiffness: 450, damping: 30, mass: 0.8 }}
                    />
                  )}
                  <span className="relative z-10">{t === "all" ? "All Time" : t}</span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wallet or ENS..."
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] pl-9 pr-4 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--color-primary)] focus:outline-none"
            />
          </div>
        </div>

        {/* Mobile View: Touch-Friendly Card List (No clunky horizontal scrolling) */}
        <div className="md:hidden space-y-2.5 mb-10">
          {filteredUsers.map((user) => (
            <div
              key={user.rank}
              className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 shadow-sm hover:border-[var(--color-primary)]/30 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Rank Badge */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-xs border ${
                    user.rank === 1
                      ? "bg-[var(--color-primary)]/20 border-[var(--color-primary)]/40 text-[var(--color-primary)]"
                      : user.rank === 2
                      ? "bg-slate-300/20 border-slate-300/40 text-slate-200"
                      : user.rank === 3
                      ? "bg-amber-700/20 border-amber-600/40 text-amber-400"
                      : "bg-[var(--bg-canvas)] border-[var(--border-subtle)] text-[var(--text-secondary)]"
                  }`}
                >
                  {user.rank === 1 ? "🥇" : user.rank === 2 ? "🥈" : user.rank === 3 ? "🥉" : `#${user.rank}`}
                </div>

                {/* Participant Details */}
                <div className="min-w-0">
                  <div className="font-bold text-sm text-[var(--text-primary)] truncate max-w-[130px] min-[400px]:max-w-[170px]">
                    {user.ens || user.address}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] mt-0.5">
                    <span>{user.chainsCount} chains</span>
                    <span>•</span>
                    <span>{user.totalGms.toLocaleString()} GMs</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Streak Badge & Total Badges */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="flex items-center gap-1 font-bold text-xs text-[var(--color-secondary)] bg-[var(--color-secondary)]/10 px-2 py-1 rounded-lg border border-[var(--color-secondary)]/25">
                  <Flame className="h-3 w-3 fill-[var(--color-secondary)]" />
                  <span>{user.streakDays}d</span>
                </span>
                <span className="rounded-lg bg-[var(--color-primary)]/10 px-2 py-1 text-[10px] font-bold text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                  {user.badgesCount} 🏅
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Comprehensive 7-Column Table */}
        <div className="hidden md:block overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] backdrop-blur-xl shadow-xl mb-12">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[var(--text-secondary)]">
              <thead className="border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/60 text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                <tr>
                  <th className="px-6 py-3.5">Rank</th>
                  <th className="px-6 py-3.5">Participant</th>
                  <th className="px-6 py-3.5">Streak</th>
                  <th className="px-6 py-3.5">Total GMs</th>
                  <th className="px-6 py-3.5">Chains</th>
                  <th className="px-6 py-3.5">Badges</th>
                  <th className="px-6 py-3.5">Last GM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filteredUsers.map((user) => (
                  <tr key={user.rank} className="hover:bg-[var(--bg-surface-hover)] transition">
                    <td className="px-6 py-4 font-bold text-[var(--text-primary)]">
                      <div className="flex items-center gap-2">
                        {user.rank === 1 && <span className="text-[var(--color-primary)]">🥇</span>}
                        {user.rank === 2 && <span className="text-slate-300">🥈</span>}
                        {user.rank === 3 && <span className="text-[#a8a29e]">🥉</span>}
                        <span>#{user.rank}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[var(--text-primary)]">{user.ens || user.address}</div>
                      {user.ens && <div className="text-[10px] text-[var(--text-muted)] font-mono">{user.address}</div>}
                    </td>
                    <td className="px-6 py-4 font-semibold text-[var(--color-secondary)]">
                      <div className="flex items-center gap-1">
                        <Flame className="h-3.5 w-3.5 fill-[var(--color-secondary)] text-[var(--color-secondary)]" />
                        <span>{user.streakDays}d</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-[var(--text-primary)]">{user.totalGms.toLocaleString()}</td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">{user.chainsCount} chains</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-[var(--color-primary)]/10 px-2.5 py-0.5 text-[10px] font-bold text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                        {user.badgesCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-muted)] font-mono">{user.lastGmTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
