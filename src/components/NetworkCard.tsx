"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Network } from "@/data/networks";
import { getNetworkUI } from "@/data/networkMetadata";
import { hapticEngine } from "@/lib/appleHaptics";

interface NetworkCardProps {
  network: Network;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onGm: (network: Network) => void;
  onDeploy: (network: Network) => void;
  index?: number;
}

function getButtonTextColor(colorHex: string): "text-[#0a0a0c]" | "text-white" {
  if (!colorHex || colorHex.startsWith("var(")) return "text-white";
  const hex = colorHex.replace("#", "");
  if (hex.length !== 6 && hex.length !== 3) return "text-white";
  const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2), 16);
  const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4), 16);
  const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return "text-white";
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 155 ? "text-[#0a0a0c]" : "text-white";
}

export function NetworkCard({
  network,
  isFavorite,
  onToggleFavorite,
  onGm,
  onDeploy,
  index = 0,
}: NetworkCardProps) {
  const [imgError, setImgError] = useState(false);
  const [isGmLoading, setIsGmLoading] = useState(false);

  const {
    color,
    ringBorderColor,
    ringBorderColorSubtle,
    ringGlow,
    ringGlowSubtle,
    badge,
    bridgeUrl,
  } = getNetworkUI(network);

  const isDarkAccent = color === "#18181b" || color === "#000000" || color === "black";
  const buttonBg = isDarkAccent ? "#18181b" : color;
  const buttonBorder = isDarkAccent ? "border border-[#262626] hover:border-[var(--color-primary)]/50" : "";
  const buttonTextColor = isDarkAccent ? "text-white" : getButtonTextColor(buttonBg);

  const handleGmClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    hapticEngine.play("click");
    setIsGmLoading(true);
    try {
      await onGm(network);
    } finally {
      setIsGmLoading(false);
    }
  };

  const handleDeployClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    hapticEngine.play("click");
    onDeploy(network);
  };

  const handleFavClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    hapticEngine.play("toggle");
    onToggleFavorite(network.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 450,
        damping: 32,
        delay: Math.min(index * 0.012, 0.25),
      }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 sm:p-4 text-[var(--text-primary)] transition-[box-shadow,border-color,transform] duration-200 ease-out isolate hover:z-20 hover:-translate-y-0.5 hover:border-[var(--color-primary)]/40 hover:shadow-xl hover:shadow-black/60"
      data-network-id={network.id}
      role="article"
      aria-label={`${network.name} network card`}
    >
      {/* Top Left: Favorite Toggle */}
      <div className="absolute left-2.5 top-2.5 z-20">
        <button
          type="button"
          onClick={handleFavClick}
          className={`flex size-8 cursor-pointer items-center justify-center rounded-full transition-all duration-150 ease-out active:scale-95 focus-visible:outline-none ${
            isFavorite
              ? "text-[var(--color-secondary)] bg-[var(--color-secondary)]/15 opacity-100"
              : "opacity-60 hover:bg-black/5 dark:hover:bg-white/5 hover:opacity-100 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
          aria-label={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        >
          <Heart
            className={`h-4 w-4 transition-transform duration-200 ${
              isFavorite ? "fill-[var(--color-secondary)] scale-110" : "scale-100"
            }`}
          />
        </button>
      </div>

      {/* Top Right: Status Badge (Hot in Hot Pink / New in Chartreuse) */}
      {badge && (
        <div className="absolute right-2.5 top-2.5 z-20">
          <span
            data-slot="badge"
            className={`inline-flex w-fit shrink-0 items-center justify-center whitespace-nowrap rounded-full border py-0.2 font-semibold transition-colors h-4.5 px-2 text-[10px] ${
              badge === "Hot"
                ? "border-[var(--color-secondary)]/30 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] dark:border-[#ff2dab]/30 dark:bg-[#ff2dab]/10 dark:text-[#ff2dab]"
                : "border-[#4d7c0f]/30 bg-[#4d7c0f]/10 text-[#3f6212] dark:border-[#d4ff3f]/30 dark:bg-[#d4ff3f]/10 dark:text-[#d4ff3f]"
            }`}
          >
            {badge}
          </span>
        </div>
      )}

      {/* Card Content */}
      <div className="relative flex min-h-0 flex-1 flex-col pt-1">
        <div className="relative mb-3.5">
          <div className="flex items-center justify-center gap-3 w-full min-w-0">
            {/* Pulsing Animated Dual Halo Rings */}
            <div className="relative flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] sm:min-w-[48px] flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border-[3px] pointer-events-none animate-logo-ring opacity-100"
                aria-hidden="true"
                style={{
                  borderColor: ringBorderColor,
                  width: "calc(100% + 14px)",
                  height: "calc(100% + 14px)",
                  margin: "-7px",
                  boxShadow: ringGlow ? `0 0 12px ${ringGlow}` : undefined,
                }}
              />
              <div
                className="absolute inset-0 rounded-full border-[3px] pointer-events-none animate-logo-ring hidden sm:block sm:opacity-100"
                aria-hidden="true"
                style={{
                  borderColor: ringBorderColorSubtle,
                  width: "calc(100% + 14px)",
                  height: "calc(100% + 14px)",
                  margin: "-7px",
                  boxShadow: ringGlowSubtle ? `0 0 16px ${ringGlowSubtle}` : undefined,
                }}
              />

              {/* Logo Image */}
              {!imgError && network.icon ? (
                <img
                  src={network.icon}
                  alt={network.name}
                  width={48}
                  height={48}
                  loading="lazy"
                  decoding="async"
                  onError={() => setImgError(true)}
                  className="relative z-10 h-11 w-11 min-w-[44px] sm:h-12 sm:w-12 sm:min-w-[48px] rounded-full bg-[var(--bg-canvas)] ring-2 ring-white/10 transition-transform duration-200 sm:group-hover:scale-[1.04] object-cover shadow-sm"
                />
              ) : (
                <div
                  className="relative z-10 flex h-11 w-11 min-w-[44px] sm:h-12 sm:w-12 sm:min-w-[48px] items-center justify-center rounded-full bg-[var(--bg-canvas)] ring-2 ring-white/10 font-bold text-sm shadow-sm"
                  style={{ color: isDarkAccent ? "var(--color-primary)" : color }}
                >
                  {network.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            {/* Network Name & Bridge Link */}
            <div className="flex min-w-0 flex-col items-start text-left">
              <h3 className="mb-1 self-stretch truncate font-bold text-base leading-snug tracking-tight text-[var(--text-primary)]">
                {network.name}
              </h3>
              <div className="mt-1 min-h-[1.75rem] w-full min-w-0 flex flex-wrap items-center justify-start gap-1.5">
                <Link
                  href={bridgeUrl}
                  target={bridgeUrl.startsWith("http") ? "_blank" : undefined}
                  rel={bridgeUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label="Bridge"
                  onClick={(e) => {
                    e.stopPropagation();
                    hapticEngine.play("click");
                  }}
                  className={`inline-flex items-center justify-center ${buttonTextColor} hover:opacity-90 active:scale-[0.98] cursor-pointer group/bridge whitespace-nowrap no-underline gap-1 min-h-[26px] px-2.5 py-0.5 rounded-lg text-[10px] leading-tight font-medium shadow-sm transition-all ${buttonBorder}`}
                  style={{ backgroundColor: buttonBg }}
                >
                  <span>Bridge</span>
                  <ExternalLink className="w-2.5 h-2.5 shrink-0 transition-transform group-hover/bridge:translate-x-0.5 group-hover/bridge:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Row: GM & Deploy Buttons */}
        <div className="mt-auto min-h-[3.25rem] border-t border-[var(--border-subtle)] pt-3">
          <div className="flex flex-row gap-2">
            <button
              type="button"
              onClick={handleGmClick}
              disabled={isGmLoading}
              className={`relative inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold shadow-sm transition-all duration-150 ease-out cursor-pointer active:scale-[0.98] w-1/2 flex-none px-2 ${buttonTextColor} overflow-hidden group/btn hover:brightness-110 disabled:opacity-60 ${buttonBorder}`}
              style={{ backgroundColor: buttonBg }}
              aria-label={`Send GM on ${network.name}`}
            >
              <span className="relative z-10 whitespace-nowrap">
                {isGmLoading ? "Sending..." : "GM"}
              </span>
            </button>
            <button
              type="button"
              onClick={handleDeployClick}
              className={`relative inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold shadow-sm transition-all duration-150 ease-out cursor-pointer active:scale-[0.98] w-1/2 flex-none px-2 ${buttonTextColor} overflow-hidden group/btn hover:brightness-110 ${buttonBorder}`}
              style={{ backgroundColor: buttonBg }}
              aria-label={`Deploy on ${network.name}`}
            >
              <span className="relative z-10 whitespace-nowrap">Deploy</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
