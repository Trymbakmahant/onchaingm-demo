"use client";

import React, { useRef, useEffect } from "react";
import { Search, RotateCw, X } from "lucide-react";
import { motion } from "framer-motion";
import { hapticEngine } from "@/lib/appleHaptics";

export type FilterCategory = "all" | "testnet" | "favorites";

interface NetworkFilterBarProps {
  currentCategory: FilterCategory;
  onSelectCategory: (category: FilterCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  counts: {
    all: number;
    testnet: number;
    favorites: number;
  };
  onRefresh: () => void;
}

export function NetworkFilterBar({
  currentCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  counts,
  onRefresh,
}: NetworkFilterBarProps) {
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Global ⌘K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        hapticEngine.play("click");
        if (window.innerWidth >= 640) {
          desktopInputRef.current?.focus();
        } else {
          mobileInputRef.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const tabs: { id: FilterCategory; label: string; count?: number }[] = [
    { id: "all", label: "All", count: counts.all },
    { id: "testnet", label: "Testnet" },
    { id: "favorites", label: "Favorites", count: counts.favorites > 0 ? counts.favorites : undefined },
  ];

  return (
    <div className="mb-5 w-full">
      {/* Desktop Filter & Search Shell */}
      <div className="hidden sm:flex w-full items-center justify-between gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1.5 shadow-sm backdrop-blur-sm">
        <div role="tablist" aria-orientation="horizontal" className="flex items-center gap-1.5 relative">
          {tabs.map((tab) => {
            const isActive = currentCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  hapticEngine.play("toggle");
                  onSelectCategory(tab.id);
                }}
                className={`relative inline-flex items-center justify-center whitespace-nowrap rounded-xl transition-all duration-150 focus-visible:outline-none min-h-[38px] gap-2 px-5 py-1.5 text-xs font-semibold cursor-pointer z-10 ${
                  isActive
                    ? "text-[var(--color-on-primary)] font-bold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterPill"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    className="absolute inset-0 rounded-xl bg-[var(--color-primary)] shadow-md shadow-[#d4ff3f]/20 -z-10"
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] leading-none tabular-nums font-bold relative z-10 ${
                      isActive ? "bg-black/20 text-[var(--color-on-primary)]" : "bg-white/10 text-[var(--text-secondary)]"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Desktop Search Input with ⌘K Badge */}
        <div className="relative flex items-center w-52 md:w-60 lg:w-64">
          <div className="group relative flex w-full min-h-[38px] items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-1.5 text-xs transition-colors focus-within:border-[var(--color-primary)]">
            <Search className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)] group-focus-within:text-[var(--color-primary)]" />
            <input
              ref={desktopInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search networks..."
              className="w-full bg-transparent text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
              aria-label="Search networks"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  hapticEngine.play("click");
                  onSearchChange("");
                }}
                className="text-[var(--text-muted)] hover:text-white p-0.5 rounded cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            ) : (
              <kbd className="h-4.5 min-w-[1.25rem] items-center justify-center rounded border border-[var(--border-subtle)] bg-white/5 px-1 font-mono text-[9px] font-medium leading-none text-[var(--text-muted)] ml-auto hidden xl:inline-flex">
                <span aria-hidden="true">⌘</span>
                <span>K</span>
              </kbd>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Tabs & Search */}
      <div className="flex flex-col gap-2.5 sm:hidden">
        <div className="flex w-full items-center gap-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1">
          {tabs.map((tab) => {
            const isActive = currentCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  hapticEngine.play("toggle");
                  onSelectCategory(tab.id);
                }}
                className={`relative flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                  isActive
                    ? "bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm font-bold"
                    : "text-[var(--text-secondary)] hover:text-white"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                      isActive ? "bg-black/20 text-[var(--color-on-primary)]" : "bg-white/10 text-white"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex w-full items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <input
              ref={mobileInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search networks..."
              className="flex w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--color-primary)] focus:outline-none h-10 pl-8 pr-7"
              aria-label="Search networks"
            />
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  hapticEngine.play("click");
                  onSearchChange("");
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white p-1 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              hapticEngine.play("cardPop");
              onRefresh();
            }}
            aria-label="Refresh"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-white hover:border-[var(--color-primary)] transition-colors cursor-pointer active:scale-95"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
