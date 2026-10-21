"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface ShockwaveEvent {
  x: number;
  y: number;
  toTheme: "dark" | "light";
  id: number;
}

interface ThemeShockwaveProps {
  event: ShockwaveEvent | null;
  onComplete?: () => void;
}

export function ThemeShockwave({ event, onComplete }: ThemeShockwaveProps) {
  const [windowSize, setWindowSize] = useState({ width: 1440, height: 900 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  if (!event) return null;

  const { x, y, toTheme, id } = event;

  // Compute maximum distance from (x, y) to the furthest screen corner
  const maxRadius = Math.hypot(
    Math.max(x, windowSize.width - x),
    Math.max(y, windowSize.height - y)
  );

  const diameter = Math.ceil(maxRadius * 2.2);

  const isGoingDark = toTheme === "dark";
  const primaryGlow = isGoingDark ? "#d4ff3f" : "#059669";
  const secondaryGlow = isGoingDark ? "#ff2dab" : "#3b82f6";

  return (
    <div className="fixed inset-0 pointer-events-none z-[999999] overflow-hidden">
      <AnimatePresence>
        <div key={id} className="absolute inset-0 pointer-events-none">
          {/* 1. Central Detonation Blast */}
          <motion.div
            initial={{ scale: 0.1, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 48,
              height: 48,
              marginLeft: -24,
              marginTop: -24,
              borderRadius: "50%",
              background: `radial-gradient(circle, #ffffff 0%, ${primaryGlow} 60%, transparent 100%)`,
              boxShadow: `0 0 50px 20px ${primaryGlow}`,
            }}
          />

          {/* 2. Primary Impact Shockwave Ring (Leading Crest) */}
          <motion.div
            initial={{ width: 0, height: 0, opacity: 0.95 }}
            animate={{
              width: diameter,
              height: diameter,
              opacity: [0.95, 0.85, 0.5, 0],
            }}
            transition={{
              duration: 0.72,
              ease: [0.16, 1, 0.3, 1], // Apple spring-like dynamic deceleration
            }}
            onAnimationComplete={onComplete}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              border: `2.5px solid ${primaryGlow}`,
              boxShadow: `0 0 35px 6px ${primaryGlow}, 0 0 70px 14px ${secondaryGlow}, inset 0 0 25px 4px ${primaryGlow}33`,
            }}
          />

          {/* 3. Secondary Trailing Harmonic Ripple */}
          <motion.div
            initial={{ width: 0, height: 0, opacity: 0.7 }}
            animate={{
              width: diameter * 0.92,
              height: diameter * 0.92,
              opacity: [0.7, 0.6, 0.3, 0],
            }}
            transition={{
              duration: 0.78,
              delay: 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              border: `1.5px solid ${secondaryGlow}`,
              boxShadow: `0 0 20px 4px ${secondaryGlow}88`,
            }}
          />

          {/* 4. Ambient Ionized Glow Sphere */}
          <motion.div
            initial={{ width: 0, height: 0, opacity: 0.25 }}
            animate={{
              width: diameter * 0.65,
              height: diameter * 0.65,
              opacity: [0.25, 0.18, 0],
            }}
            transition={{
              duration: 0.65,
              ease: "easeOut",
            }}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${primaryGlow}22 0%, transparent 70%)`,
            }}
          />
        </div>
      </AnimatePresence>
    </div>
  );
}
