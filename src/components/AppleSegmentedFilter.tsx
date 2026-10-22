"use client";

import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, LayoutGrid, List } from "lucide-react";
import { hapticEngine } from "@/lib/appleHaptics";

export type BadgeFilterType = "all" | "mainnet" | "testnet";
export type BadgeViewMode = "grid" | "list";

interface AppleSegmentedFilterProps {
  currentFilter: BadgeFilterType;
  onChangeFilter: (filter: BadgeFilterType, originEl?: HTMLElement) => void;
  counts: {
    all: number;
    mainnet: number;
    testnet: number;
  };
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: BadgeViewMode;
  onViewModeChange: (mode: BadgeViewMode) => void;
}

export function AppleSegmentedFilter({
  currentFilter,
  onChangeFilter,
  counts,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
}: AppleSegmentedFilterProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const tabs: { id: BadgeFilterType; label: string; mobileLabel: string; count: number }[] = [
    { id: "all", label: "All Badges", mobileLabel: "All", count: counts.all },
    { id: "mainnet", label: "Mainnet", mobileLabel: "Mainnet", count: counts.mainnet },
    { id: "testnet", label: "Testnet", mobileLabel: "Testnet", count: counts.testnet },
  ];

  const handleSelect = (id: BadgeFilterType, e: React.MouseEvent<HTMLButtonElement>) => {
    hapticEngine.play("toggle");
    onChangeFilter(id, e.currentTarget);
  };

  const handleViewToggle = (mode: BadgeViewMode) => {
    hapticEngine.play("toggle");
    onViewModeChange(mode);
  };

  return (
    <div className="flex flex-col gap-2.5 sm:gap-4 mb-6 sm:mb-8 max-w-5xl mx-auto">
      {/* Mobile-first Bar Layout: Flex on sm+, stacked on mobile */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4">
        {/* Segmented Filter Pills */}
        <div
          ref={containerRef}
          className="relative grid grid-cols-3 sm:inline-flex w-full sm:w-auto items-center gap-1 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1 sm:p-1.5 backdrop-blur-2xl shadow-xl shadow-black/60"
        >
          {tabs.map((tab) => {
            const isActive = currentFilter === tab.id;

            return (
              <motion.button
                key={tab.id}
                id={`badge-filter-${tab.id}`}
                data-testid={`badge-filter-${tab.id}`}
                onClick={(e) => handleSelect(tab.id, e)}
                whileHover={{ scale: isActive ? 1 : 1.02 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className={`relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl px-2.5 sm:px-4 py-2 text-xs font-bold select-none cursor-pointer transition-colors duration-200 ${
                  isActive ? "text-[var(--color-on-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {/* Dynamic Apple Spring Pill Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="appleSegmentedIndicator"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#d4ff3f] via-[#d4ff3f] to-[#ff2dab] shadow-md shadow-[#d4ff3f]/20"
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 32,
                      mass: 0.8,
                    }}
                  />
                )}

                {/* Text Label */}
                <span className="relative z-10 hidden sm:inline">{tab.label}</span>
                <span className="relative z-10 sm:hidden">{tab.mobileLabel}</span>

                {/* Counter Bubble */}
                <motion.span
                  layout
                  className={`relative z-10 rounded-full px-1.5 sm:px-2 py-0.2 sm:py-0.5 text-[9px] sm:text-[10px] font-extrabold transition-colors ${
                    isActive
                      ? "bg-black/20 text-[var(--color-on-primary)] shadow-inner"
                      : "bg-[var(--bg-surface-hover)] text-[var(--text-muted)]"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={tab.count}
                      initial={{ y: -4, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 4, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 600, damping: 30 }}
                    >
                      {tab.count}
                    </motion.span>
                  </AnimatePresence>
                </motion.span>
              </motion.button>
            );
          })}
        </div>

        {/* Controls: Search & View Mode (Grid/List) */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)] pointer-events-none" />
            <input
              type="text"
              placeholder="Search badges or chains..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8.5 pr-8 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Toggle: Grid vs List */}
          <div className="flex items-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1 gap-1 shrink-0">
            <button
              onClick={() => handleViewToggle("grid")}
              title="Grid View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleViewToggle("list")}
              title="List View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
