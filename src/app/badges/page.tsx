"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Sparkles, ShieldCheck, Search, RefreshCw, CheckCircle2 } from "lucide-react";
import { BADGES_DATA } from "@/data/mockData";
import { BadgeItem } from "@/types";
import { useWeb3 } from "@/context/Web3Context";
import { WalletModal } from "@/components/WalletModal";
import { AppleSegmentedFilter, BadgeFilterType, BadgeViewMode } from "@/components/AppleSegmentedFilter";
import { ApplePhysicsBadgeCard } from "@/components/ApplePhysicsBadgeCard";
import { MintBadgeModal } from "@/components/MintBadgeModal";
import { hapticEngine } from "@/lib/appleHaptics";

export default function BadgesPage() {
  const { wallet } = useWeb3();
  const [filter, setFilter] = useState<BadgeFilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<BadgeViewMode>("grid");
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [minting, setMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  const filterContainerRef = useRef<HTMLDivElement | null>(null);

  const counts = {
    all: BADGES_DATA.length,
    mainnet: BADGES_DATA.filter((b) => b.isMainnet).length,
    testnet: BADGES_DATA.filter((b) => !b.isMainnet).length,
  };

  const filteredBadges = BADGES_DATA.filter((b) => {
    // Category filter
    if (filter === "mainnet" && !b.isMainnet) return false;
    if (filter === "testnet" && b.isMainnet) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = b.name.toLowerCase().includes(q);
      const matchNetwork = b.networkName.toLowerCase().includes(q);
      const matchDesc = b.description.toLowerCase().includes(q);
      return matchName || matchNetwork || matchDesc;
    }

    return true;
  });

  const handleFilterChange = (newFilter: BadgeFilterType) => {
    setFilter(newFilter);
  };

  const handleInitiateMint = (badge: BadgeItem) => {
    if (!wallet.isConnected) {
      hapticEngine.play("click");
      setIsWalletOpen(true);
      return;
    }
    hapticEngine.play("click");
    setSelectedBadge(badge);
    setMintSuccess(false);
    setMinting(false);
    setIsMintModalOpen(true);
  };

  const handleConfirmMint = async () => {
    if (!selectedBadge) return;
    hapticEngine.play("click");
    setMinting(true);

    // Simulate blockchain confirmation
    await new Promise((r) => setTimeout(r, 1400));
    setMinting(false);
    setMintSuccess(true);
    hapticEngine.play("success");
  };

  return (
    <div className="relative min-h-screen py-5 sm:py-10 lg:py-14 overflow-hidden bg-[var(--bg-canvas)]">
      {/* Background glow effects */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[320px] sm:w-[650px] h-[180px] sm:h-[320px] bg-[#d4ff3f]/6 blur-[90px] sm:blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-40 left-1/3 -translate-x-1/2 w-[220px] sm:w-[400px] h-[160px] sm:h-[300px] bg-[#ff2dab]/6 blur-[80px] sm:blur-[120px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#ff2dab]/30 bg-[#ff2dab]/10 px-3 py-1 sm:px-4 sm:py-1.5 text-xs font-semibold text-[#ff2dab] mb-2 sm:mb-3 shadow-inner"
          >
            <Award className="h-3.5 w-3.5 text-[#ff2dab]" />
            <span>On-Chain Collectibles</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 24, delay: 0.05 }}
            className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]"
          >
            OnChainGM{" "}
            <span className="bg-gradient-to-r from-[#d4ff3f] via-[#d4ff3f] to-[#ff2dab] bg-clip-text text-transparent">
              Badges
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 24, delay: 0.1 }}
            className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-[var(--text-secondary)] px-2"
          >
            Exclusive collectible NFTs representing your early participation in emerging and top-tier blockchain ecosystems.
          </motion.p>
        </div>

        {/* Quick Stats Banner (Mobile Optimized) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto mb-4 sm:mb-6">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 sm:p-3 text-center">
            <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
              Total Badges
            </div>
            <div className="text-xs sm:text-base font-extrabold text-[var(--color-primary)]">
              {BADGES_DATA.length}
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 sm:p-3 text-center">
            <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
              Total Minted
            </div>
            <div className="text-xs sm:text-base font-extrabold text-[#ff2dab]">
              98,400+
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 sm:p-3 text-center">
            <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
              Live Chains
            </div>
            <div className="text-xs sm:text-base font-extrabold text-white">
              {counts.mainnet} Mainnets
            </div>
          </div>
        </div>

        {/* Apple Segmented Physics Filter + Search + View Mode */}
        <div ref={filterContainerRef}>
          <AppleSegmentedFilter
            currentFilter={filter}
            onChangeFilter={handleFilterChange}
            counts={counts}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>

        {/* No Results Fallback */}
        {filteredBadges.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] max-w-md mx-auto my-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-3">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
              No Badges Found
            </h3>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              No collectibles matched &ldquo;{searchQuery}&rdquo;. Try clearing your search or switching categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setFilter("all");
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-primary)] px-4 py-2 text-xs font-bold text-[var(--color-on-primary)] hover:brightness-110 shadow-sm"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View: 2 columns on mobile, 2 on tablet, 3 on desktop, 4 on xl */
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6 min-h-[450px]">
            <AnimatePresence mode="popLayout">
              {filteredBadges.map((badge, index) => (
                <ApplePhysicsBadgeCard
                  key={badge.id}
                  badge={badge}
                  index={index}
                  onMint={handleInitiateMint}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* List View: Sleek horizontal rows optimized for quick mobile & desktop scanning */
          <div className="space-y-2.5 max-w-4xl mx-auto min-h-[450px]">
            <AnimatePresence mode="popLayout">
              {filteredBadges.map((badge) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ type: "spring", stiffness: 450, damping: 28 }}
                  className="group relative flex items-center justify-between rounded-xl sm:rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2.5 sm:p-4 hover:border-[var(--color-primary)]/50 hover:bg-[var(--bg-surface-hover)] transition-all shadow-md shadow-black/40"
                >
                  <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 pr-2">
                    {/* Badge Artwork Icon */}
                    <div className="relative flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-tr from-[#d4ff3f]/15 via-[#ff2dab]/10 to-[#d4ff3f]/15 border border-[var(--color-primary)]/30 shrink-0 shadow-sm">
                      <img
                        src={badge.imageUrl}
                        alt={badge.name}
                        className="h-7 w-7 sm:h-9 sm:w-9 object-contain drop-shadow"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>

                    {/* Text Details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-bold text-xs sm:text-sm text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors truncate">
                          {badge.name}
                        </h3>
                        <span
                          className={`shrink-0 text-[8px] sm:text-[9px] font-bold uppercase rounded px-1.5 py-0.2 border ${
                            badge.isMainnet
                              ? "text-[#ff2dab] bg-[#ff2dab]/10 border-[#ff2dab]/30"
                              : "text-[var(--color-primary)] bg-[var(--color-primary)]/10 border-[var(--color-primary)]/30"
                          }`}
                        >
                          {badge.networkName}
                        </span>
                      </div>

                      <p className="text-[10px] sm:text-xs text-[var(--text-secondary)] line-clamp-1 mt-0.5">
                        {badge.description}
                      </p>

                      <div className="flex items-center gap-2 mt-1 text-[10px]">
                        <span className="text-[var(--text-muted)]">Fee:</span>
                        <span className="font-bold text-[var(--color-primary)]">{badge.fee}</span>
                        {badge.totalMinted && (
                          <>
                            <span className="text-[var(--border-subtle)]">•</span>
                            <span className="text-[var(--text-muted)] hidden xs:inline">
                              {badge.totalMinted.toLocaleString()} minted
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mint Action Button */}
                  <div className="shrink-0 pl-1">
                    <button
                      onClick={() => handleInitiateMint(badge)}
                      disabled={badge.status === "coming_soon"}
                      className={`rounded-lg sm:rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold transition shadow-sm cursor-pointer ${
                        badge.status === "coming_soon"
                          ? "bg-[var(--bg-surface-hover)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border-subtle)]"
                          : "bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:brightness-110 shadow-md shadow-[#d4ff3f]/25 active:brightness-95"
                      }`}
                    >
                      {badge.status === "coming_soon" ? "Soon" : "Mint"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Narrative / About Badges Section (Mobile Optimized) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="mt-10 sm:mt-16 rounded-2xl sm:rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-8 md:p-10 backdrop-blur-xl shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[#ff2dab]/10 to-transparent pointer-events-none rounded-full blur-3xl" />
          <div className="max-w-3xl relative z-10">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2">
              <Sparkles className="h-4 w-4" />
              <span>Badge Philosophy</span>
            </div>
            <h2 className="text-lg sm:text-3xl font-extrabold text-[var(--text-primary)]">
              What are OnChainGM Badges?
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              OnChainGM Badges are exclusive collectible NFTs that represent your participation in various blockchain ecosystems. Each badge is minted on its respective network, making it a true on-chain collectible. Build your collection and showcase your multi-chain presence in the Web3 space.
            </p>
            <p className="mt-2 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              Many badges are launched as the first NFT collection on newly emerging networks, created to mark early community participation and highlight support for each ecosystem from day one.
            </p>

            <div className="mt-4 sm:mt-5 flex flex-wrap gap-2 sm:gap-4 text-xs text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5 text-[var(--status-success)] font-medium">
                <ShieldCheck className="h-4 w-4" /> Verified Contract Registry
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="font-medium">100% On-Chain Minting</span>
              <span className="hidden sm:inline">•</span>
              <span className="font-medium">Cross-Chain Showcase</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mint Confirmation / Details Modal */}
      <MintBadgeModal
        badge={selectedBadge}
        isOpen={isMintModalOpen}
        onClose={() => setIsMintModalOpen(false)}
        isMinting={minting}
        isSuccess={mintSuccess}
        onConfirmMint={handleConfirmMint}
      />

      {/* Wallet Modal */}
      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
      />
    </div>
  );
}
