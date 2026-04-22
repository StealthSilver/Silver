"use client";

import { useState, useEffect, useId, useRef } from "react";
import { Github, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { GeistSans } from "geist/font/sans";
import ThemeToggle from "./ui/ThemeToggle";
import { useTheme } from "next-themes";
import { useImmersiveMode } from "@/contexts/ImmersiveModeContext";
import { cn } from "@/lib/utils";
import { navLinkColor } from "@/lib/nav-link-color";

const navItems = [
  { href: "/#experience", label: "Experience" },
  { href: "/#projects", label: "Projects" },
  { href: "/#education", label: "Education" },
  { href: "/Resume1.pdf", label: "Resume" },
] as const;

const mobileMenuEase = [0.16, 1, 0.3, 1] as const;
const mobileMenuTransition = {
  duration: 0.38,
  ease: mobileMenuEase,
} as const;

export function SiteHeader() {
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileNavId = useId();
  const bodyOverflowBeforeMenu = useRef<string | null>(null);
  const pathname = usePathname();
  const { theme } = useTheme();
  const { isImmersive } = useImmersiveMode();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    bodyOverflowBeforeMenu.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }, [mobileOpen]);

  useEffect(() => {
    return () => {
      if (bodyOverflowBeforeMenu.current != null) {
        document.body.style.overflow = bodyOverflowBeforeMenu.current;
        bodyOverflowBeforeMenu.current = null;
      }
    };
  }, []);

  if (isImmersive) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-50 max-w-screen overflow-x-hidden bg-background px-2 pt-2">
        <div className="mx-auto md:max-w-3xl">
          <div
            className="screen-line-top screen-line-bottom relative flex h-12 items-center justify-between gap-2 border-x px-2 after:z-1 after:transition-[background-color] sm:gap-4"
            style={{ borderColor: "var(--line)" }}
          >
            <div className="flex min-w-0 flex-1 items-center overflow-hidden gap-3 sm:gap-4 md:gap-6">
              {/* Brand/Logo */}
              <Link
                className="shrink-0 transition-[scale] ease-out active:scale-[0.98] [&_img]:h-6 [&_img]:shrink-0"
                href="/"
                aria-label="Home"
              >
                <motion.img
                  key={mounted ? theme : "default"}
                  src={
                    !mounted
                      ? "/logo2.svg"
                      : theme === "dark"
                        ? "/logo.svg"
                        : "/logo2.svg"
                  }
                  alt="Silver icon"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>

              <nav
                className={cn(
                  GeistSans.className,
                  "no-scrollbar hidden min-w-0 flex-1 items-center gap-4 overflow-x-auto text-[14px] py-1 sm:flex md:gap-6 md:overflow-x-visible md:py-0",
                )}
                aria-label="Primary"
              >
                {navItems.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="shrink-0 transition-opacity hover:opacity-80"
                    style={{ color: navLinkColor }}
                    {...(href.endsWith(".pdf")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Desktop Icons */}
            <div className="flex shrink-0 items-center gap-2 max-sm:*:data-[slot=command-menu-trigger]:hidden">
              <a
                href="https://github.com/StealthSilver"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-[scale] ease-out active:scale-[0.98] p-2 rounded-md hover:bg-muted"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>

              <div className="h-4 w-px shrink-0 border-0 bg-line" aria-hidden />

              <ThemeToggle />

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileOpen((o) => !o)}
                className="sm:hidden transition-[scale] ease-out active:scale-[0.98] p-2 rounded-md hover:bg-muted"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                aria-controls={mobileNavId}
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

      {/* Mobile: nav in hamburger — slides from above / exits upward */}
      <AnimatePresence
        onExitComplete={() => {
          if (bodyOverflowBeforeMenu.current != null) {
            document.body.style.overflow = bodyOverflowBeforeMenu.current;
            bodyOverflowBeforeMenu.current = null;
          } else {
            document.body.style.removeProperty("overflow");
          }
        }}
      >
        {mobileOpen ? (
          <motion.div
            key="site-header-mobile-scrim"
            className="sm:hidden fixed inset-0 z-40 bg-background/55 backdrop-blur-sm dark:bg-background/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={mobileMenuTransition}
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
        ) : null}
        {mobileOpen ? (
          <motion.div
            key="site-header-mobile-panel"
            className="sm:hidden pointer-events-none fixed top-14 right-0 left-0 z-50 flex max-h-[min(70dvh,calc(100dvh-3.5rem-1.5rem))] justify-center overflow-x-hidden overflow-y-auto overscroll-contain px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] will-change-transform"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={mobileMenuTransition}
          >
            <div
              id={mobileNavId}
              role="dialog"
              aria-modal="true"
              aria-label="Main menu"
              className={cn(
                GeistSans.className,
                "screen-line-top screen-line-bottom pointer-events-auto relative w-full max-w-3xl border-x border-b border-line bg-background text-[15px] shadow-sm",
              )}
            >
              <nav className="flex flex-col" aria-label="Primary">
                {navItems.map(({ href, label }, index) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block px-4 py-3.5 transition-[background-color,color] hover:bg-muted/80 active:bg-muted",
                      index < navItems.length - 1 && "border-b border-line",
                    )}
                    style={{ color: navLinkColor }}
                    {...(href.endsWith(".pdf")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              <div
                className="absolute top-[-3.5px] left-[-4.5px] z-2 flex size-2 border bg-background"
                style={{ borderColor: "var(--line)" }}
                aria-hidden
              />
              <div
                className="absolute top-[-3.5px] right-[-4.5px] z-2 flex size-2 border bg-background"
                style={{ borderColor: "var(--line)" }}
                aria-hidden
              />
              <div
                className="absolute bottom-[-3.5px] left-[-4.5px] z-2 flex size-2 border bg-background"
                style={{ borderColor: "var(--line)" }}
                aria-hidden
              />
              <div
                className="absolute right-[-4.5px] bottom-[-3.5px] z-2 flex size-2 border bg-background"
                style={{ borderColor: "var(--line)" }}
                aria-hidden
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
