"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { BadgeItem } from "@/types";

interface ApplePhysicsBadgeCardProps {
  badge: BadgeItem;
  index: number;
  onMint: (badge: BadgeItem) => void;
}

export function ApplePhysicsBadgeCard({ badge, index, onMint }: ApplePhysicsBadgeCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw mouse coordinates relative to card center (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Apple-grade physical spring damping
  const springConfig = { stiffness: 280, damping: 24, mass: 0.6 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  // 3D Tilt angles (Apple visionOS / tvOS depth)
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);

  // Glare / Specular reflection position
  const glareX = useTransform(smoothX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseEnter = () => {
    if (!cardRef.current) return;
    rectRef.current = cardRef.current.getBoundingClientRect();
    setIsHovered(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = rectRef.current || cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const normalizedX = clientX / rect.width - 0.5;
    const normalizedY = clientY / rect.height - 0.5;

    x.set(normalizedX);
    y.set(normalizedY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rectRef.current = null;
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 28,
        },
      }}
      exit={{
        opacity: 0,
        scale: 0.95,
        transition: {
          duration: 0.1,
          ease: "easeOut",
        },
      }}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
      }}
      className="group relative"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileTap={{
          scale: 0.97,
          y: 2,
          transition: { type: "spring", stiffness: 600, damping: 30 },
        }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative flex flex-col justify-between rounded-xl sm:rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2.5 sm:p-5 backdrop-blur-2xl transition-colors duration-300 hover:border-[var(--color-primary)]/60 hover:bg-[var(--bg-surface-hover)] shadow-xl shadow-black/70 overflow-hidden"
      >
        {/* Dynamic Specular Glare (Physical light simulation) */}
        <motion.div
          className="pointer-events-none absolute -inset-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 hidden sm:block"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle 280px at ${gx} ${gy}, rgba(212,255,63,0.14), transparent 70%)`
            ),
          }}
        />

        {/* Ambient top edge highlight (Apple glass border effect) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div style={{ transform: "translateZ(16px)", transformStyle: "preserve-3d" }}>
          {/* Artwork preview container with layered depth */}
          <div className="relative aspect-square w-full rounded-lg sm:rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] overflow-hidden flex items-center justify-center p-2 sm:p-6 transition-all duration-300 group-hover:border-[var(--color-primary)]/30">
            {/* Network pill (Floats at Z=25px) */}
            <div
              style={{ transform: "translateZ(25px)" }}
              className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 z-10 flex items-center gap-1 sm:gap-1.5 rounded-full bg-[var(--bg-surface)]/90 px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[8px] sm:text-[10px] font-semibold text-[var(--text-primary)] border border-[var(--border-subtle)] backdrop-blur-md shadow-sm"
            >
              <img
                src={badge.imageUrl}
                alt={badge.networkName}
                className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 rounded-full object-cover shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <span className="truncate max-w-[55px] sm:max-w-none">{badge.networkName}</span>
            </div>

            {/* Status indicator */}
            <div
              style={{ transform: "translateZ(20px)" }}
              className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 z-10"
            >
              <span
                className={`rounded-full px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${
                  badge.status === "available" || badge.status === "mint_now"
                    ? "bg-[var(--status-success)]/15 text-[var(--status-success)] border-[var(--status-success)]/30"
                    : "bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-subtle)]"
                }`}
              >
                {badge.status === "coming_soon" ? "Soon" : "Live"}
              </span>
            </div>

            {/* Radial glow backdrop */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4ff3f]/10 via-transparent to-[#ff2dab]/10 opacity-70 group-hover:opacity-100 transition-opacity" />

            {/* Central Badge Icon Artwork (Floats with spring rotation) */}
            <motion.div
              style={{ transform: "translateZ(30px)" }}
              animate={
                isHovered
                  ? { rotate: 3, scale: 1.05, y: -3 }
                  : { rotate: 0, scale: 1, y: 0 }
              }
              transition={{ type: "spring", stiffness: 320, damping: 20 }}
              className="relative flex h-16 w-16 sm:h-28 sm:w-28 items-center justify-center rounded-xl sm:rounded-3xl bg-gradient-to-tr from-[#d4ff3f]/15 via-[#ff2dab]/10 to-[#d4ff3f]/15 border border-[var(--color-primary)]/30 shadow-xl shadow-black/60 group-hover:border-[var(--color-primary)]/60"
            >
              <img
                src={badge.imageUrl}
                alt={badge.name}
                className="h-9 w-9 sm:h-16 sm:w-16 object-contain drop-shadow-[0_8px_16px_rgba(212,255,63,0.25)]"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </motion.div>
          </div>

          {/* Details */}
          <div className="mt-2 sm:mt-4" style={{ transform: "translateZ(14px)" }}>
            <div className="flex items-center gap-1 justify-between">
              <h3 className="font-bold text-[var(--text-primary)] text-xs sm:text-base group-hover:text-[var(--color-primary)] transition-colors truncate">
                {badge.name}
              </h3>
              {badge.isMainnet && (
                <span className="shrink-0 text-[8px] sm:text-[10px] font-semibold text-[#ff2dab] bg-[#ff2dab]/10 border border-[#ff2dab]/30 rounded px-1 py-0.2 hidden xs:inline">
                  Mainnet
                </span>
              )}
            </div>
            <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-[var(--text-secondary)] line-clamp-1 sm:line-clamp-2 leading-relaxed">
              {badge.description}
            </p>
          </div>
        </div>

        {/* Action & Fee */}
        <div
          style={{ transform: "translateZ(16px)" }}
          className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-[var(--border-subtle)] flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-1.5 sm:gap-2"
        >
          <div>
            <span className="text-[8px] sm:text-[10px] text-[var(--text-muted)] block leading-none">Mint Fee</span>
            <span className="text-[10px] sm:text-xs font-bold text-[var(--color-primary)] leading-tight">{badge.fee}</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 22 }}
            onClick={(e) => {
              e.stopPropagation();
              onMint(badge);
            }}
            disabled={badge.status === "coming_soon"}
            className={`w-full xs:w-auto rounded-lg sm:rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold transition shadow-sm cursor-pointer whitespace-nowrap text-center ${
              badge.status === "coming_soon"
                ? "bg-[var(--bg-surface-hover)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border-subtle)]"
                : "bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:brightness-110 shadow-md shadow-[#d4ff3f]/25 active:brightness-95"
            }`}
          >
            {badge.status === "coming_soon" ? "Soon" : (
              <>
                <span className="xs:hidden">Mint</span>
                <span className="hidden xs:inline">Mint Badge</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
