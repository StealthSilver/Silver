"use client";

import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import soundManager from "@/lib/sound-mamager";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleToggle = useCallback(() => {
    soundManager.playClick();
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "d" || e.key === "D") &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resolvedTheme, setTheme]);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="inline-flex items-center justify-center rounded-md p-2 opacity-70 cursor-wait transition-[scale] ease-out"
        disabled
      />
    );
  }

  const showSun = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={`Switch to ${showSun ? "light" : "dark"} theme`}
      title={`Switch to ${showSun ? "light" : "dark"} theme (Press D)`}
      className="relative inline-flex items-center justify-center gap-2 rounded-md p-2 transition-[scale] ease-out active:scale-[0.98] hover:bg-muted"
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
