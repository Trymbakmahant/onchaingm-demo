"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Sparkles, SearchX, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NETWORKS_LIST, Network } from "@/data/networks";
import { getNetworkUI } from "@/data/networkMetadata";
import { PromoBanner } from "@/components/PromoBanner";
import { NetworkFilterBar, FilterCategory } from "@/components/NetworkFilterBar";
import { NetworkCard } from "@/components/NetworkCard";
import { HomeSidebar } from "@/components/HomeSidebar";
import { WalletModal } from "@/components/WalletModal";
import { useWeb3 } from "@/context/Web3Context";
import { hapticEngine } from "@/lib/appleHaptics";

export default function HomePage() {
  const router = useRouter();
  const { wallet, setSelectedNetwork, sendGm, streak } = useWeb3();

  const [currentCategory, setCurrentCategory] = useState<FilterCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    description: string;
    txHash?: string;
  } | null>(null);

  // Prevent scroll jump on reload so top banner is always visible
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ocgm_favorite_networks");
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save favorites to localStorage
  const handleToggleFavorite = (networkId: number) => {
    setFavorites((prev) => {
      let next: number[];
      if (prev.includes(networkId)) {
        next = prev.filter((id) => id !== networkId);
      } else {
        next = [...prev, networkId];
      }
      try {
        localStorage.setItem("ocgm_favorite_networks", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Counts for tabs
  const counts = useMemo(() => {
    const testnetCount = NETWORKS_LIST.filter((n) => getNetworkUI(n).isTestnet).length;
    return {
      all: NETWORKS_LIST.length,
      testnet: testnetCount,
      favorites: favorites.length,
    };
  }, [favorites]);

  // Filter networks based on category & search query
  const filteredNetworks = useMemo(() => {
    return NETWORKS_LIST.filter((network) => {
      const ui = getNetworkUI(network);

      // Category filter
      if (currentCategory === "testnet" && !ui.isTestnet) {
        return false;
      }
      if (currentCategory === "favorites" && !favorites.includes(network.id)) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = network.name.toLowerCase().includes(q);
        const matchesCurrency = network.currency?.toLowerCase().includes(q);
        const matchesId = network.id.toString().includes(q);
        if (!matchesName && !matchesCurrency && !matchesId) {
          return false;
        }
      }

      return true;
    });
  }, [currentCategory, searchQuery, favorites]);

  // Handle GM click
  const handleGm = async (network: Network) => {
    if (!wallet.isConnected) {
      setSelectedNetwork(network);
      setIsWalletModalOpen(true);
      return;
    }

    setSelectedNetwork(network);
    const result = await sendGm(`GM from ${network.name}!`);
    if (result.success) {
      hapticEngine.play("success");
      setToastMessage({
        title: `GM Sent on ${network.name}! ☀️`,
        description: `Your daily on-chain ritual is recorded. Streak is now ${streak + 1} days!`,
        txHash: result.txHash,
      });
      setTimeout(() => {
        setToastMessage(null);
      }, 5000);
    }
  };

  // Handle Deploy click
  const handleDeploy = (network: Network) => {
    setSelectedNetwork(network);
    router.push("/b20");
  };

  // Handle Refresh
  const handleRefresh = () => {
    setSearchQuery("");
    setCurrentCategory("all");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      {/* Top Reward Pool Announcement Promo with Lowered Breathing Room */}
      <PromoBanner />

      {/* Main Page Layout: Left Grid + Right Sidebar */}
      <main id="main-content" className="w-full">
        <div className="page-canvas home-page-atmosphere relative py-4 sm:py-5 px-3 sm:px-6 lg:px-8 max-w-[1720px] mx-auto">
          <div className="relative z-[1] w-full flex flex-col lg:flex-row gap-5 items-start">
            {/* Left Column: Network Filter Bar & Cards Grid */}
            <div className="flex-1 min-w-0 w-full">
              <NetworkFilterBar
                currentCategory={currentCategory}
                onSelectCategory={setCurrentCategory}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                counts={counts}
                onRefresh={handleRefresh}
              />

              {filteredNetworks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4">
                  {filteredNetworks.map((network, index) => (
                    <NetworkCard
                      key={network.id}
                      network={network}
                      isFavorite={favorites.includes(network.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onGm={handleGm}
                      onDeploy={handleDeploy}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                /* Empty state */
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] py-16 px-4 text-center my-6 shadow-sm"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-4 ring-1 ring-[var(--color-primary)]/20">
                    <SearchX className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">
                    {currentCategory === "favorites"
                      ? "No Favorite Networks Yet"
                      : "No Networks Found"}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] max-w-sm mb-6">
                    {currentCategory === "favorites"
                      ? "Click the heart icon on any network card to add it to your quick-access favorites list."
                      : `No blockchain matches "${searchQuery}". Try searching for Base, Ink, Ethereum, or clearing filters.`}
                  </p>
                  <button
                    type="button"
                    onClick={handleRefresh}
                    className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] text-[var(--color-on-primary)] px-5 py-2.5 text-sm font-bold shadow-md shadow-[#d4ff3f]/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Reset All Filters</span>
                  </button>
                </motion.div>
              )}
            </div>

            {/* Right Column: Sidebar Widgets */}
            <HomeSidebar
              onOpenWalletModal={() => setIsWalletModalOpen(true)}
              onGmNetwork={(id) => {
                const net = NETWORKS_LIST.find((n) => n.id === id);
                if (net) handleGm(net);
              }}
            />
          </div>
        </div>
      </main>

      {/* Wallet Connect Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />

      {/* Floating Success Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 28 }}
            className="fixed bottom-6 right-6 z-50 flex max-w-md items-start gap-3 rounded-2xl border border-[var(--color-primary)]/40 bg-[var(--bg-surface)] p-4 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/20 text-[var(--color-primary)]">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <span>{toastMessage.title}</span>
                <Flame className="h-4 w-4 text-[var(--color-secondary)] fill-[var(--color-secondary)]" />
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {toastMessage.description}
              </p>
              {toastMessage.txHash && (
                <div className="mt-2 text-[11px] font-mono text-[var(--color-primary)] truncate bg-[var(--bg-canvas)] px-2.5 py-1 rounded-lg border border-[var(--border-subtle)]">
                  Tx: {toastMessage.txHash}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
