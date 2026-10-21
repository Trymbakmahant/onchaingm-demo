"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface ApplePhysicsCardProps {
  children: React.ReactNode;
  className?: string;
  tiltIntensity?: number; // degrees of tilt, default 7
  glareOpacity?: number; // max glare opacity, default 0.15
  onClick?: () => void;
  depth?: number; // 3D depth in px for children, default 0
  disabled?: boolean;
}

export function ApplePhysicsCard({
  children,
  className = "",
  tiltIntensity = 7,
  glareOpacity = 0.14,
  onClick,
  depth = 0,
  disabled = false,
}: ApplePhysicsCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw mouse coordinates normalized from -0.5 to 0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Ultra-smooth spring physics parameters (Apple iOS momentum feel)
  const springConfig = { stiffness: 350, damping: 28, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Derive tilt angles
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [tiltIntensity, -tiltIntensity]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-tiltIntensity, tiltIntensity]);

  // Derive dynamic specular glare coordinates (0% to 100%)
  const glareX = useTransform(smoothX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseEnter = () => {
    if (disabled || !cardRef.current) return;
    rectRef.current = cardRef.current.getBoundingClientRect();
    setIsHovered(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const rect = rectRef.current || cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rectRef.current = null;
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={disabled ? undefined : { scale: 0.98, transition: { type: "spring", stiffness: 500, damping: 25 } }}
      style={{
        perspective: 1200,
        transformStyle: "preserve-3d",
        rotateX: disabled ? 0 : rotateX,
        rotateY: disabled ? 0 : rotateY,
        willChange: "transform",
      }}
      className={`relative select-none ${className}`}
    >
      {/* 3D Content Container */}
      <div
        style={{
          transform: depth > 0 && isHovered ? `translateZ(${depth}px)` : "translateZ(0px)",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full"
      >
        {children}
      </div>

      {/* Dynamic Specular Sheen Layer */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden transition-opacity duration-300"
          style={{
            opacity: isHovered ? glareOpacity : 0,
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle 320px at ${gx} ${gy}, rgba(255, 255, 255, 0.35), transparent 75%)`
            ),
          }}
        />
      )}
    </motion.div>
  );
}
