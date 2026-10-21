"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeShockwave, ShockwaveEvent } from "@/components/ThemeShockwave";

export type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (event?: React.MouseEvent | { clientX: number; clientY: number; currentTarget?: any }) => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [shockwaveEvent, setShockwaveEvent] = useState<ShockwaveEvent | null>(null);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("onchaingm_theme") as Theme | null;
      if (savedTheme === "light" || savedTheme === "dark") {
        setThemeState(savedTheme);
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(savedTheme);
      } else {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
      }
    } catch {
      // ignore
    }
  }, []);

  const applyThemeClasses = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("onchaingm_theme", newTheme);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newTheme);
    } catch {
      // ignore
    }
  };

  const setTheme = (newTheme: Theme) => {
    applyThemeClasses(newTheme);
  };

  const toggleTheme = (
    event?: React.MouseEvent | { clientX: number; clientY: number; currentTarget?: any }
  ) => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    // Calculate exact impact origin
    let x = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
    let y = typeof window !== "undefined" ? 40 : 0;

    if (event) {
      if (
        "clientX" in event &&
        typeof event.clientX === "number" &&
        (event.clientX !== 0 || event.clientY !== 0)
      ) {
        x = event.clientX;
        y = event.clientY;
      } else if ("currentTarget" in event && event.currentTarget) {
        try {
          const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
          x = rect.left + rect.width / 2;
          y = rect.top + rect.height / 2;
        } catch {
          // ignore
        }
      }
    }

    // Trigger glowing shockwave ring animation
    setShockwaveEvent({
      x,
      y,
      toTheme: nextTheme,
      id: Date.now(),
    });

    // Check if View Transitions API is supported
    const doc = typeof document !== "undefined" ? (document as any) : null;
    const isReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (doc && typeof doc.startViewTransition === "function" && !isReducedMotion) {
      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = doc.startViewTransition(() => {
        applyThemeClasses(nextTheme);
      });

      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${Math.ceil(maxRadius * 1.15)}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 720,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        })
        .catch(() => {
          applyThemeClasses(nextTheme);
        });
    } else {
      // Direct apply for non-supporting browsers or reduced-motion
      applyThemeClasses(nextTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
      <ThemeShockwave
        event={shockwaveEvent}
        onComplete={() => setShockwaveEvent(null)}
      />
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

