"use client";

import React, { useState, useMemo } from "react";
import { X, Search, Coins, Check } from "lucide-react";
import { hapticEngine } from "@/lib/appleHaptics";

export interface BridgeToken {
  symbol: string;
  name: string;
  decimals: number;
  icon: string;
  balance: string;
  priceUsd: number;
}

export const BRIDGE_TOKENS: BridgeToken[] = [
  {
    symbol: "ETH",
    name: "Ether",
    decimals: 18,
    icon: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    balance: "0.45",
    priceUsd: 2450.0,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    icon: "https://assets.coingecko.com/coins/images/6319/small/usdc.png",
    balance: "1,250.00",
    priceUsd: 1.0,
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    icon: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
    balance: "840.50",
    priceUsd: 1.0,
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    decimals: 18,
    icon: "https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png",
    balance: "500.00",
    priceUsd: 1.0,
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    decimals: 8,
    icon: "https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png",
    balance: "0.025",
    priceUsd: 67200.0,
  },
  {
    symbol: "ARB",
    name: "Arbitrum",
    decimals: 18,
    icon: "https://assets.coingecko.com/coins/images/16547/small/arbitrum-shield.png",
    balance: "350.00",
    priceUsd: 0.58,
  },
  {
    symbol: "OP",
    name: "Optimism",
    decimals: 18,
    icon: "https://assets.coingecko.com/coins/images/25244/small/Optimism.png",
    balance: "220.00",
    priceUsd: 1.75,
  },
  {
    symbol: "OCGM",
    name: "OnChainGM Token",
    decimals: 18,
    icon: "https://onchaingm.com/chains/base.jpg",
    balance: "10,000",
    priceUsd: 0.045,
  },
];

interface TokenSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedToken: BridgeToken;
  onSelect: (token: BridgeToken) => void;
  title?: string;
  networkName?: string;
}

export function TokenSelectorModal({
  isOpen,
  onClose,
  selectedToken,
  onSelect,
  title = "Select Token",
  networkName,
}: TokenSelectorModalProps) {
  const [query, setQuery] = useState("");

  const filteredTokens = useMemo(() => {
    if (!query.trim()) return BRIDGE_TOKENS;
    const q = query.toLowerCase();
    return BRIDGE_TOKENS.filter(
      (t) => t.symbol.toLowerCase().includes(q) || t.name.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (t: BridgeToken) => {
    hapticEngine.play("click");
    onSelect(t);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-2xl sm:rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl p-4 sm:p-6 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[var(--border-subtle)]">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 text-[var(--color-primary)]">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)]">{title}</h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                {networkName ? `Available on ${networkName}` : "Select asset to bridge"}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              hapticEngine.play("click");
              onClose();
            }}
            className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="mt-3.5 relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search token name or symbol..."
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] pl-10 pr-4 py-2 text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--color-primary)] focus:outline-none transition"
          />
        </div>

        {/* Quick popular chips */}
        {!query && (
          <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] text-[var(--text-muted)] mr-1">Popular:</span>
            {BRIDGE_TOKENS.slice(0, 4).map((t) => (
              <button
                key={t.symbol}
                onClick={() => handleSelect(t)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                  selectedToken.symbol === t.symbol
                    ? "bg-[var(--color-primary)]/15 border-[var(--color-primary)]/40 text-[var(--color-primary)]"
                    : "bg-[var(--bg-canvas)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <img src={t.icon} alt={t.symbol} className="h-3.5 w-3.5 rounded-full object-cover" />
                <span>{t.symbol}</span>
              </button>
            ))}
          </div>
        )}

        {/* Token List */}
        <div className="mt-3 overflow-y-auto space-y-1.5 pr-1 flex-1">
          {filteredTokens.map((t) => {
            const isSelected = selectedToken.symbol === t.symbol;

            return (
              <button
                key={t.symbol}
                onClick={() => handleSelect(t)}
                className={`flex w-full items-center justify-between p-2.5 sm:p-3 rounded-xl border text-left transition ${
                  isSelected
                    ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)]/40"
                    : "bg-[var(--bg-canvas)] border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--color-primary)]/30"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={t.icon}
                    alt={t.symbol}
                    className="h-8 w-8 rounded-full border border-[var(--border-subtle)] object-cover bg-neutral-900"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-[var(--text-primary)] flex items-center gap-1.5">
                      {t.symbol}
                      <span className="text-[10px] text-[var(--text-muted)] font-normal">{t.name}</span>
                    </div>
                    <div className="text-[10px] text-[var(--text-secondary)]">
                      ≈ ${t.priceUsd.toLocaleString()} USD
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-[var(--text-primary)] font-mono">{t.balance}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Balance</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
