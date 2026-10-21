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

  // Single, uniform monochromatic wave color matching the target theme
  const isGoingDark = toTheme === "dark";
  const waveColor = isGoingDark ? "#d4ff3f" : "#a7e000";

  // Slow, uniform cinematic animation timing
  const DURATION = 1.25; // seconds
  const EASING = [0.22, 1, 0.36, 1] as const; // Smooth cinematic ease-out

  return (
    <div className="fixed inset-0 pointer-events-none z-[999999] overflow-hidden">
      <AnimatePresence>
        <div key={id} className="absolute inset-0 pointer-events-none">
          {/* 1. Subtle Origin Ping (Single Uniform Color) */}
          <motion.div
            initial={{ scale: 0.2, opacity: 0.9 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 40,
              height: 40,
              marginLeft: -20,
              marginTop: -20,
              borderRadius: "50%",
              backgroundColor: waveColor,
              boxShadow: `0 0 30px 10px ${waveColor}88`,
            }}
          />

          {/* 2. Primary Uniform Shockwave Wave Ring */}
          <motion.div
            initial={{ width: 0, height: 0, opacity: 0.85 }}
            animate={{
              width: diameter,
              height: diameter,
              opacity: [0.85, 0.75, 0.45, 0],
            }}
            transition={{
              duration: DURATION,
              ease: EASING,
            }}
            onAnimationComplete={onComplete}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              border: `2px solid ${waveColor}`,
              boxShadow: `0 0 30px 4px ${waveColor}77, inset 0 0 20px 2px ${waveColor}44`,
            }}
          />

          {/* 3. Soft Ambient Wavefront Glow (Same Uniform Color) */}
          <motion.div
            initial={{ width: 0, height: 0, opacity: 0.3 }}
            animate={{
              width: diameter * 0.96,
              height: diameter * 0.96,
              opacity: [0.3, 0.25, 0.1, 0],
            }}
            transition={{
              duration: DURATION,
              delay: 0.04,
              ease: EASING,
            }}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              border: `1px solid ${waveColor}66`,
              boxShadow: `0 0 15px 2px ${waveColor}44`,
            }}
          />
        </div>
      </AnimatePresence>
    </div>
  );
}
