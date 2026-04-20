"use client";

import { useState, useEffect } from "react";
import { Github, Sparkles, Menu, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "./ui/ThemeToggle";
import { useTheme } from "next-themes";
import { useImmersiveMode } from "@/contexts/ImmersiveModeContext";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme } = useTheme();
  const { isImmersive, toggleImmersiveMode } = useImmersiveMode();

  useEffect(() => setMounted(true), []);

  return (
    <>
      <header className="sticky top-0 z-50 max-w-screen overflow-x-hidden bg-background px-2 pt-2">
        <div className="mx-auto md:max-w-3xl">
          <div
            className="screen-line-top screen-line-bottom flex h-12 items-center justify-between gap-2 border-x px-2 after:z-1 after:transition-[background-color] sm:gap-4"
            style={{ borderColor: "var(--line)" }}
          >
            {/* Brand/Logo */}
            <Link
              className="transition-[scale] ease-out active:scale-[0.98] [&_img]:h-8 [&_img]:shrink-0"
              href="/"
              aria-label="Home"
            >
              <motion.img
                key={mounted ? theme : "default"}
                src={
                  !mounted
                    ? "/icon2.svg"
                    : theme === "dark"
                      ? "/icon.svg"
                      : "/icon2.svg"
                }
                alt="Silver icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Link>

            <div className="flex-1" />

            {/* Desktop Icons */}
            <div className="flex items-center *:first:mr-2 max-sm:*:data-[slot=command-menu-trigger]:hidden">
              <a
                href="https://github.com/StealthSilver"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-[scale] ease-out active:scale-[0.98] p-2 rounded-md hover:bg-muted"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>

              <div className="mx-2 h-4 w-px border-0 bg-line" />

              <ThemeToggle />

              {isImmersive && (
                <button
                  onClick={toggleImmersiveMode}
                  className="transition-[scale] ease-out active:scale-[0.98] p-2 rounded-md hover:bg-muted"
                  aria-label="Exit immersive mode"
                >
                  <Sparkles size={18} className="animate-spin" />
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="sm:hidden transition-[scale] ease-out active:scale-[0.98] p-2 rounded-md hover:bg-muted"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>

            <div
              className="absolute top-[-3.5px] left-[-4.5px] z-2 flex size-2 border bg-background"
              style={{ borderColor: "var(--line)" }}
            />
            <div
              className="absolute top-[-3.5px] right-[-4.5px] z-2 flex size-2 border bg-background"
              style={{ borderColor: "var(--line)" }}
            />
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-0 z-50 h-[calc(--spacing(24)+env(safe-area-inset-bottom,0px))] bg-linear-to-b from-transparent from-[calc(env(safe-area-inset-bottom,0%))] to-background mask-linear-[to_top,var(--background)_25%,transparent] backdrop-blur-[1px] sm:hidden",
          mobileOpen && "pointer-events-auto",
        )}
      />
    </>
  );
}
