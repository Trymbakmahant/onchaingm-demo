"use client";

import React, { useState, useMemo } from "react";
import { X, Search, Globe, Check } from "lucide-react";
import { Network, NETWORKS_LIST, POPULAR_CHAIN_IDS } from "@/data/networks";
import { useWeb3 } from "@/context/Web3Context";

interface NetworkSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (net: Network) => void;
  selectedNetworkId?: number;
  title?: string;
}

export function NetworkSelectorModal({
  isOpen,
  onClose,
  onSelect,
  selectedNetworkId,
  title,
}: NetworkSelectorModalProps) {
  const { selectedNetwork, setSelectedNetwork } = useWeb3();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "mainnet" | "testnet">("all");

  const activeId = selectedNetworkId !== undefined ? selectedNetworkId : selectedNetwork.id;

  const filteredNetworks = useMemo(() => {
    return NETWORKS_LIST.filter((net) => {
      const isTestnet = net.name.toLowerCase().includes("testnet") || net.name.toLowerCase().includes("sepolia");
      if (activeTab === "mainnet" && isTestnet) return false;
      if (activeTab === "testnet" && !isTestnet) return false;

      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        net.name.toLowerCase().includes(q) ||
        net.id.toString().includes(q) ||
        (net.currency && net.currency.toLowerCase().includes(q))
      );
    });
  }, [query, activeTab]);

  const popularNetworks = useMemo(() => {
    return NETWORKS_LIST.filter((n) => POPULAR_CHAIN_IDS.includes(n.id));
  }, []);

  if (!isOpen) return null;

  const handleSelect = (net: Network) => {
    if (onSelect) {
      onSelect(net);
    } else {
      setSelectedNetwork(net);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl p-6 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 text-[var(--color-primary)]">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">{title || "Select Network"}</h3>
              <p className="text-xs text-[var(--text-secondary)]">Choose from 125+ supported blockchain networks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="mt-4 relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search network name, chain ID, or symbol..."
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        </div>

        {/* Popular Networks Quick Chips */}
        {!query && (
          <div className="mt-3 flex flex-wrap gap-1.5 items-center">
            <span className="text-xs text-[var(--text-muted)] mr-1">Popular:</span>
            {popularNetworks.slice(0, 6).map((net) => (
              <button
                key={net.id}
                onClick={() => handleSelect(net)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs transition border ${
                  activeId === net.id
                    ? "bg-[var(--color-primary)]/15 border-[var(--color-primary)]/40 text-[var(--color-primary)]"
                    : "bg-[var(--bg-canvas)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
                }`}
              >
                {net.icon ? (
                  <img src={net.icon} alt={net.name} className="h-3.5 w-3.5 rounded-full object-cover" />
                ) : (
                  <span className="h-3.5 w-3.5 rounded-full bg-[var(--border-subtle)]" />
                )}
                <span>{net.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="mt-3 flex space-x-2 border-b border-[var(--border-subtle)] pb-2">
          {(["all", "mainnet", "testnet"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                activeTab === tab
                  ? "bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {tab}
            </button>
          ))}
          <span className="ml-auto text-xs text-[var(--text-muted)] self-center">
            {filteredNetworks.length} networks
          </span>
        </div>

        {/* Network Scrollable List */}
        <div className="mt-3 overflow-y-auto space-y-1.5 pr-1 flex-1">
          {filteredNetworks.map((net) => {
            const isSelected = activeId === net.id;
            const isTestnet = net.name.toLowerCase().includes("testnet") || net.name.toLowerCase().includes("sepolia");

            return (
              <button
                key={net.id}
                onClick={() => handleSelect(net)}
                className={`flex w-full items-center justify-between p-3 rounded-xl border text-left transition ${
                  isSelected
                    ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)]/40 text-[var(--text-primary)]"
                    : "bg-[var(--bg-canvas)] border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--color-primary)]/30 text-[var(--text-secondary)]"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {net.icon ? (
                    <img
                      src={net.icon}
                      alt={net.name}
                      className="h-8 w-8 rounded-full border border-[var(--border-subtle)] object-cover bg-neutral-900"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] flex items-center justify-center text-xs font-bold text-[var(--text-muted)]">
                      {net.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-[var(--text-primary)] flex items-center gap-2">
                      {net.name}
                      {isTestnet && (
                        <span className="rounded bg-[#ff2dab]/10 px-1.5 py-0.5 text-[10px] text-[#ff2dab] border border-[#ff2dab]/30 font-mono">
                          Testnet
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] font-mono">
                      Chain ID: {net.id} • {net.currency || "ETH"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {isSelected && (
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/40">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
