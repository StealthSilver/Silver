"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Mail, Pause, Play, X } from "lucide-react";
import { FaDiscord, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { navLinkColor } from "@/lib/nav-link-color";
import { useImmersiveMode } from "@/contexts/ImmersiveModeContext";
import ImmersiveScene from "@/components/immersive/r3f-intro/ImmersiveScene";

const immersiveBorderColor = "rgba(168, 172, 186, 0.85)";
const immersiveBackground = "#000000";

type ContactLink = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color?: string;
  themeAware?: boolean;
};

const contactLinks: ContactLink[] = [
  { label: "X", href: "https://x.com/silver_srs", icon: FaXTwitter, themeAware: true },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/rajat-saraswat-0491a3259/",
    icon: FaLinkedin,
    color: "#0A66C2",
  },
  {
    label: "Discord",
    href: "https://discord.com/users/rajat_28969",
    icon: FaDiscord,
    color: "#5865F2",
  },
  {
    label: "Mail",
    href: "mailto:rajat.saraswat.work@gmail.com",
    icon: Mail,
  },
];

export default function ImmersiveZone() {
  const {
    requestExitImmersive,
    immersiveMusicPaused,
    toggleImmersiveMusicPaused,
    immersivePrevTrack,
    immersiveNextTrack,
  } = useImmersiveMode();

  const [contactOpen, setContactOpen] = useState(false);

  // Clean up the body-level "hover tile" cursor flag whenever the immersive
  // zone unmounts — otherwise the hover cursor can stick around after exit.
  useEffect(() => {
    return () => {
      if (typeof document !== "undefined") {
        document.body.classList.remove("immersive-hover-tile");
      }
    };
  }, []);

  // Close the contact flyout on Escape for consistent keyboard UX.
  useEffect(() => {
    if (!contactOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setContactOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [contactOpen]);

  return (
    <div
      className="immersive-cursor fixed inset-0 z-[40] overflow-hidden bg-black"
      role="region"
      aria-label="Immersion zone"
    >
      <ImmersiveScene />

      <div className="pointer-events-auto absolute top-[max(0.55rem,env(safe-area-inset-top))] left-[max(0.55rem,env(safe-area-inset-left))] z-[50] sm:top-4 sm:left-4">
        <div>
          <div className="relative inline-block w-[7.5rem] sm:w-[9.5rem]">
            <button
              type="button"
              onClick={() => setContactOpen((open) => !open)}
              aria-expanded={contactOpen}
              aria-controls="immersive-contact-flyout"
              aria-label={contactOpen ? "Close contact options" : "Open contact options"}
              className="inline-flex h-9 w-full cursor-pointer items-center justify-center rounded-none border bg-black px-3 shadow-sm transition-colors hover:bg-muted sm:h-10 sm:px-5"
              style={{ borderColor: immersiveBorderColor }}
            >
              {contactOpen ? (
                <X
                  className="size-4 transition-transform duration-200 sm:size-[1.05rem]"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  style={{ color: navLinkColor }}
                  aria-hidden
                />
              ) : (
                <span
                  className={`${GeistMono.className} text-[12px] font-medium uppercase tracking-[0.14em] sm:text-[14px]`}
                  style={{ color: navLinkColor }}
                >
                  Contact
                </span>
              )}
            </button>
            <span
              aria-hidden
              className="absolute top-[-3px] left-[-3px] size-1.5 border"
              style={{ borderColor: immersiveBorderColor, backgroundColor: immersiveBackground }}
            />
            <span
              aria-hidden
              className="absolute top-[-3px] right-[-3px] size-1.5 border"
              style={{ borderColor: immersiveBorderColor, backgroundColor: immersiveBackground }}
            />
            <span
              aria-hidden
              className="absolute bottom-[-3px] left-[-3px] size-1.5 border"
              style={{ borderColor: immersiveBorderColor, backgroundColor: immersiveBackground }}
            />
            <span
              aria-hidden
              className="absolute right-[-3px] bottom-[-3px] size-1.5 border"
              style={{ borderColor: immersiveBorderColor, backgroundColor: immersiveBackground }}
            />
          </div>

          <div
            id="immersive-contact-flyout"
            className="mt-2 flex w-[7.5rem] flex-col gap-1.5 sm:w-[9.5rem] sm:gap-2"
            aria-hidden={!contactOpen}
          >
            {contactLinks.map((item, index) => {
              const { label, href, icon: Icon, color, themeAware } = item;
              const iconColor = themeAware ? "#F3F4F6" : color ?? navLinkColor;
              const openDelay = index * 55;
              const closeDelay = (contactLinks.length - 1 - index) * 35;

              return (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  tabIndex={contactOpen ? 0 : -1}
                  aria-label={label}
                  className="group flex h-9 items-center gap-2 border bg-background px-2.5 transition-colors hover:bg-muted/20 sm:h-10 sm:gap-3 sm:px-3"
                  style={{
                    borderColor: immersiveBorderColor,
                    backgroundColor: immersiveBackground,
                    opacity: contactOpen ? 1 : 0,
                    transform: contactOpen
                      ? "translateY(0) scale(1)"
                      : "translateY(-0.75rem) scale(0.96)",
                    pointerEvents: contactOpen ? "auto" : "none",
                    transition: `opacity 260ms ease ${contactOpen ? openDelay : closeDelay}ms, transform 320ms cubic-bezier(0.22, 1, 0.36, 1) ${contactOpen ? openDelay : closeDelay}ms`,
                  }}
                >
                  <span
                    className="inline-flex size-5 shrink-0 items-center justify-center border bg-muted/40 sm:size-6"
                    style={{ borderColor: immersiveBorderColor }}
                    aria-hidden
                  >
                    <Icon className="size-3 sm:size-3.5" style={{ color: iconColor }} />
                  </span>
                  <span
                    className={`${GeistMono.className} min-w-0 flex-1 text-[11px] font-medium uppercase tracking-[0.1em] no-underline transition-all duration-200 ease-out group-hover:underline underline-offset-2 sm:text-[13px] sm:tracking-[0.12em]`}
                    style={{ color: navLinkColor }}
                  >
                    {label}
                  </span>
                  <ArrowUpRight
                    className="size-3 shrink-0 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:size-3.5"
                    style={{ color: navLinkColor }}
                    aria-hidden
                  />
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <div className="pointer-events-auto absolute top-[max(0.55rem,env(safe-area-inset-top))] right-[max(0.55rem,env(safe-area-inset-right))] z-[50] inline-grid w-max max-w-[min(100vw-1.3rem,22rem)] grid-cols-1 gap-1.5 justify-items-stretch sm:top-4 sm:right-4 sm:gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={requestExitImmersive}
            className="inline-flex h-9 min-w-0 cursor-pointer items-center justify-center rounded-none border bg-black px-3 shadow-sm transition-colors hover:bg-muted sm:h-10 sm:px-5"
            style={{ borderColor: immersiveBorderColor }}
          >
            <span
              className={`${GeistMono.className} text-[12px] font-medium uppercase tracking-[0.12em] sm:text-[14px] sm:tracking-[0.14em]`}
              style={{ color: navLinkColor }}
            >
              <span className="sm:hidden">Exit immersion</span>
              <span className="hidden sm:inline">Return to minimal</span>
            </span>
          </button>
          <span
            aria-hidden
            className="absolute top-[-3px] left-[-3px] size-1.5 border"
            style={{ borderColor: immersiveBorderColor, backgroundColor: immersiveBackground }}
          />
          <span
            aria-hidden
            className="absolute top-[-3px] right-[-3px] size-1.5 border"
            style={{ borderColor: immersiveBorderColor, backgroundColor: immersiveBackground }}
          />
          <span
            aria-hidden
            className="absolute bottom-[-3px] left-[-3px] size-1.5 border"
            style={{ borderColor: immersiveBorderColor, backgroundColor: immersiveBackground }}
          />
          <span
            aria-hidden
            className="absolute right-[-3px] bottom-[-3px] size-1.5 border"
            style={{ borderColor: immersiveBorderColor, backgroundColor: immersiveBackground }}
          />
        </div>
        <div className={`relative ${GeistSans.className}`}>
          <div
            className="flex h-9 min-w-0 w-full items-stretch rounded-none border shadow-sm sm:h-10"
            style={{ borderColor: immersiveBorderColor, backgroundColor: immersiveBackground }}
          >
            <button
              type="button"
              onClick={immersivePrevTrack}
              className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent text-xs font-semibold uppercase tracking-[0.08em] transition-colors hover:bg-muted sm:h-10 sm:w-10"
              aria-label="Previous immersion track"
              title="Previous track"
              style={{ color: navLinkColor }}
            >
              {"<"}
            </button>
            <button
              type="button"
              onClick={toggleImmersiveMusicPaused}
              className="relative inline-flex h-9 min-w-0 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-none border-0 bg-transparent px-3 transition-colors hover:bg-muted sm:h-10 sm:px-4"
              aria-pressed={immersiveMusicPaused}
              aria-label={
                immersiveMusicPaused ? "Resume immersion music" : "Pause immersion music"
              }
            >
              <span
                aria-hidden
                className={`immersive-wave-shell ${immersiveMusicPaused ? "is-paused" : ""}`}
              >
                <svg
                  className="immersive-wave-svg"
                  viewBox="0 0 480 40"
                  preserveAspectRatio="none"
                >
                  {immersiveMusicPaused ? (
                    <path d="M 0 20 L 480 20" />
                  ) : (
                    <path d="M 0 20 Q 10 8 20 20 T 40 20 T 60 20 T 80 20 T 100 20 T 120 20 T 140 20 T 160 20 T 180 20 T 200 20 T 220 20 T 240 20 T 260 20 T 280 20 T 300 20 T 320 20 T 340 20 T 360 20 T 380 20 T 400 20 T 420 20 T 440 20 T 460 20 T 480 20" />
                  )}
                </svg>
              </span>
              <span className="relative z-[1] inline-flex items-center justify-center">
              {immersiveMusicPaused ? (
                <Play
                  className="size-4 sm:size-[1.125rem]"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  style={{ color: navLinkColor }}
                  aria-hidden
                />
              ) : (
                <Pause
                  className="size-4 sm:size-[1.125rem]"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  style={{ color: navLinkColor }}
                  aria-hidden
                />
              )}
              </span>
            </button>
            <button
              type="button"
              onClick={immersiveNextTrack}
              className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent text-xs font-semibold uppercase tracking-[0.08em] transition-colors hover:bg-muted sm:h-10 sm:w-10"
              aria-label="Next immersion track"
              title="Next track"
              style={{ color: navLinkColor }}
            >
              {">"}
            </button>
          </div>
          <span
            aria-hidden
            className="absolute top-[-3px] left-[-3px] size-1.5 border"
            style={{ borderColor: immersiveBorderColor, backgroundColor: immersiveBackground }}
          />
          <span
            aria-hidden
            className="absolute top-[-3px] right-[-3px] size-1.5 border"
            style={{ borderColor: immersiveBorderColor, backgroundColor: immersiveBackground }}
          />
          <span
            aria-hidden
            className="absolute bottom-[-3px] left-[-3px] size-1.5 border"
            style={{ borderColor: immersiveBorderColor, backgroundColor: immersiveBackground }}
          />
          <span
            aria-hidden
            className="absolute right-[-3px] bottom-[-3px] size-1.5 border"
            style={{ borderColor: immersiveBorderColor, backgroundColor: immersiveBackground }}
          />
        </div>
      </div>
    </div>
  );
}
