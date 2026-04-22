"use client";

import { Pause, Play } from "lucide-react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { navLinkColor } from "@/lib/nav-link-color";
import { useImmersiveMode } from "@/contexts/ImmersiveModeContext";

const immersiveBorderColor = "rgba(168, 172, 186, 0.85)";
const immersiveBackground = "#000000";

export default function ImmersiveZone() {
  const {
    requestExitImmersive,
    immersiveMusicPaused,
    toggleImmersiveMusicPaused,
    immersivePrevTrack,
    immersiveNextTrack,
  } = useImmersiveMode();

  return (
    <div
      className="fixed inset-0 z-[40] overflow-hidden bg-black"
      role="region"
      aria-label="Immersion zone"
    >
      <div className="pointer-events-auto absolute top-[max(0.65rem,env(safe-area-inset-top))] left-[max(0.65rem,env(safe-area-inset-left))] z-[50] sm:top-4 sm:left-4">
        <div className="relative">
          <a
            href="mailto:rajat.saraswat.work@gmail.com"
            className="inline-flex h-10 min-w-[9.5rem] cursor-pointer items-center justify-center rounded-none border bg-black px-4 shadow-sm transition-colors hover:bg-muted sm:px-5"
            style={{ borderColor: immersiveBorderColor }}
            aria-label="Contact Rajat"
          >
            <span
              className={`${GeistMono.className} text-[14px] font-medium uppercase tracking-[0.14em]`}
              style={{ color: navLinkColor }}
            >
              Contact
            </span>
          </a>
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
      <div className="pointer-events-auto absolute top-[max(0.65rem,env(safe-area-inset-top))] right-[max(0.65rem,env(safe-area-inset-right))] z-[50] inline-grid w-max max-w-[min(100vw-1.5rem,22rem)] grid-cols-1 gap-2 justify-items-stretch sm:top-4 sm:right-4">
        <div className="relative">
          <button
            type="button"
            onClick={requestExitImmersive}
            className="inline-flex h-10 min-w-0 cursor-pointer items-center justify-center rounded-none border bg-black px-4 shadow-sm transition-colors hover:bg-muted sm:px-5"
            style={{ borderColor: immersiveBorderColor }}
          >
            <span
              className={`${GeistMono.className} text-[14px] font-medium uppercase tracking-[0.14em]`}
              style={{ color: navLinkColor }}
            >
              Return to minimal
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
            className="flex h-10 min-w-0 w-full items-stretch rounded-none border shadow-sm"
            style={{ borderColor: immersiveBorderColor, backgroundColor: immersiveBackground }}
          >
            <button
              type="button"
              onClick={immersivePrevTrack}
              className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent text-xs font-semibold uppercase tracking-[0.08em] transition-colors hover:bg-muted"
              aria-label="Previous immersion track"
              title="Previous track"
              style={{ color: navLinkColor }}
            >
              {"<"}
            </button>
            <button
              type="button"
              onClick={toggleImmersiveMusicPaused}
              className="relative inline-flex h-10 min-w-0 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-none border-0 bg-transparent px-4 transition-colors hover:bg-muted"
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
              className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent text-xs font-semibold uppercase tracking-[0.08em] transition-colors hover:bg-muted"
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
