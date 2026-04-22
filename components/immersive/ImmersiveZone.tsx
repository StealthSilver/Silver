"use client";

import { Pause, Play } from "lucide-react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { navLinkColor } from "@/lib/nav-link-color";
import { useImmersiveMode } from "@/contexts/ImmersiveModeContext";

export default function ImmersiveZone() {
  const {
    requestExitImmersive,
    immersiveMusicPaused,
    toggleImmersiveMusicPaused,
  } = useImmersiveMode();

  return (
    <div
      className="fixed inset-0 z-[40] overflow-hidden bg-black"
      role="region"
      aria-label="Immersion zone"
    >
      <div className="pointer-events-auto absolute top-[max(0.65rem,env(safe-area-inset-top))] right-[max(0.65rem,env(safe-area-inset-right))] z-[50] inline-grid w-max max-w-[min(100vw-1.5rem,22rem)] grid-cols-1 gap-2 justify-items-stretch sm:top-4 sm:right-4">
        <button
          type="button"
          onClick={requestExitImmersive}
          className="inline-flex h-10 min-w-0 cursor-pointer items-center justify-center rounded-none border border-line bg-black px-4 shadow-sm transition-colors hover:bg-zinc-900 sm:px-5"
        >
          <span
            className={`${GeistMono.className} text-[14px] font-medium uppercase tracking-[0.14em]`}
            style={{ color: navLinkColor }}
          >
            Return to minimal
          </span>
        </button>
        <div
          className={`${GeistSans.className} flex h-10 min-w-0 w-full items-stretch rounded-none border border-line bg-black shadow-sm`}
        >
          <button
            type="button"
            onClick={toggleImmersiveMusicPaused}
            className="inline-flex h-10 min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 rounded-none border-0 bg-transparent px-4 transition-colors hover:bg-zinc-900"
            aria-pressed={immersiveMusicPaused}
            aria-label={
              immersiveMusicPaused ? "Resume immersion music" : "Pause immersion music"
            }
          >
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
            <span className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: navLinkColor }}>
              Music
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
