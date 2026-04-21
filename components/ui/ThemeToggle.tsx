"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import soundManager from "@/lib/sound-mamager";
import { cn } from "@/lib/utils";

const DEFAULT_VIEW_TRANSITION_MS = 400;

export type ThemeToggleProps = ComponentPropsWithoutRef<"button"> & {
  duration?: number;
};

export default function ThemeToggle({
  className,
  duration = DEFAULT_VIEW_TRANSITION_MS,
  ...props
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  const toggleTheme = useCallback(() => {
    if (!mounted || resolvedTheme === undefined) return;

    soundManager.playClick();

    const button = buttonRef.current;
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

    const applyTheme = () => {
      flushSync(() => {
        setTheme(nextTheme);
      });
    };

    if (!button || typeof document.startViewTransition !== "function") {
      applyTheme();
      return;
    }

    const { top, left, width, height } = button.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const maxRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y),
    );

    const transition = document.startViewTransition(applyTheme);

    const ready = transition?.ready;
    if (ready && typeof ready.then === "function") {
      void ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      });
    }
  }, [duration, mounted, resolvedTheme, setTheme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "d" || e.key === "D") &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        toggleTheme();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleTheme]);

  if (!mounted) {
    return (
      <button
        type="button"
        ref={buttonRef}
        aria-label="Toggle theme"
        className={cn(
          "inline-flex cursor-wait items-center justify-center rounded-md p-2 opacity-70 transition-[scale] ease-out",
          className,
        )}
        disabled
        {...props}
      />
    );
  }

  const showSun = resolvedTheme === "dark";

  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={toggleTheme}
      aria-label={`Switch to ${showSun ? "light" : "dark"} theme`}
      title={`Switch to ${showSun ? "light" : "dark"} theme (Press D)`}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-md p-2 transition-[scale] ease-out hover:bg-muted active:scale-[0.98]",
        className,
      )}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        {showSun ? (
          <motion.span
            key="sun"
            className="inline-flex items-center gap-2"
            initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <Sun size={18} />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            className="inline-flex items-center gap-2"
            initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <Moon size={18} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
