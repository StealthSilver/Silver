"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect } from "react";
import soundManager from "@/lib/sound-mamager";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const switchTheme = useCallback(() => {
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
        switchTheme();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [switchTheme]);

  return (
    <button
      onClick={() => switchTheme()}
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme (Press D)`}
      className="
        relative inline-flex items-center justify-center rounded-full px-3 py-2 text-sm
        transition-colors
        bg-white text-black hover:bg-black hover:text-white
        dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black
      "
    >
      {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
