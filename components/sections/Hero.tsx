"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { Caveat } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { AvatarElectricEffect } from "../ui/AvatarElectricEffect";
import { TextHoverEffect } from "../ui/TextHoverEffect";
import { TextFlip } from "../ui/TextFlip";
import Separator from "../ui/Separator";
import { USER } from "@/config/user.config";
import { useImmersiveMode } from "@/contexts/ImmersiveModeContext";

const heroDotBg = {
  backgroundColor: "var(--background)",
  backgroundImage: "radial-gradient(var(--line) 0.85px, transparent 0.85px)",
  backgroundSize: "14px 14px",
} as const;

const heroPencil = Caveat({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

/** Full-bleed rules in the know-more dialog (offsets `p-3` / `sm:p-6`). */
const KNOW_MORE_RULE =
  "-mx-3 h-px w-[calc(100%+1.5rem)] shrink-0 bg-line sm:-mx-6 sm:w-[calc(100%+3rem)]" as const;

export default function Hero() {
  const { requestEnterImmersive } = useImmersiveMode();
  const zoneArrowMarkerId = useId().replace(/:/g, "");
  const [isKnowMoreOpen, setIsKnowMoreOpen] = useState(false);
  const [showLongFlipLine, setShowLongFlipLine] = useState(false);
  const bodyOverflowBeforeKnowMore = useRef<string | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const apply = () => setShowLongFlipLine(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!isKnowMoreOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsKnowMoreOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isKnowMoreOpen]);

  useEffect(() => {
    if (!isKnowMoreOpen) return;
    bodyOverflowBeforeKnowMore.current = document.body.style.overflow;
    const htmlOverflowBefore = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      if (bodyOverflowBeforeKnowMore.current != null) {
        document.body.style.overflow = bodyOverflowBeforeKnowMore.current;
        bodyOverflowBeforeKnowMore.current = null;
      } else {
        document.body.style.removeProperty("overflow");
      }
      document.documentElement.style.overflow = htmlOverflowBefore;
    };
  }, [isKnowMoreOpen]);

  return (
    <section className="relative">
      <div className="relative pb-0 pt-14" style={heroDotBg}>
        <div className="flex flex-col items-center justify-center px-4">
          <div className="relative mx-auto aspect-[480/128] w-full max-w-[min(96vw,720px)] py-2">
            <svg
              className="pointer-events-none absolute inset-0 z-[1] h-full w-full overflow-visible text-muted-foreground"
              viewBox="0 0 480 128"
              fill="none"
              aria-hidden
            >
              <defs>
                <marker
                  id={zoneArrowMarkerId}
                  markerWidth="5"
                  markerHeight="5"
                  refX="3"
                  refY="2"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path
                    d="M0 0.9 L4 2.2 L20 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </marker>
              </defs>
              {/* Top of “r” in “different” → middle of “R” in SILVER (viewBox 480×128) */}
              <path
                d="M 420 95 C 502 70 390 50 395 48"
                stroke="currentColor"
                strokeWidth="1.15"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="2.2 1.35"
                markerEnd={`url(#${zoneArrowMarkerId})`}
                className="opacity-[0.88]"
              />
            </svg>
            <div className="relative z-[2] h-full w-full">
              <TextHoverEffect
                text="Silver"
                duration={0.3}
                interactive
                introSweepOnFirstLoad
                onPrimaryAction={requestEnterImmersive}
              />
            </div>
            <p
              className={`${heroPencil.className} pointer-events-none absolute bottom-[12px] right-[12px] z-[3] max-w-[min(58%,16rem)] text-right text-lg leading-tight tracking-wide sm:text-xl md:text-2xl`}
              style={{
                color: "color-mix(in oklab, var(--muted-foreground) 82%, var(--foreground) 18%)",
                fontWeight: 600,
                textShadow:
                  "0.55px 0.45px 0 color-mix(in oklab, var(--foreground) 18%, transparent), -0.45px -0.35px 0 color-mix(in oklab, var(--background) 42%, transparent), 0.35px -0.28px 0 color-mix(in oklab, var(--foreground) 10%, transparent), -0.2px 0.5px 0 color-mix(in oklab, var(--foreground) 6%, transparent)",
                transform: "rotate(-1.1deg)",
              }}
            >
              Change the vibes
            </p>
          </div>
        </div>

        <div
          role="presentation"
          className="relative left-1/2 mt-10 h-px w-screen max-w-none -translate-x-1/2 bg-line"
          aria-hidden
        />
      </div>

      <div className="relative mx-auto w-full max-w-3xl">
        <div className="relative z-[2] flex items-end gap-0">
          <AvatarElectricEffect>
            <button
              type="button"
              onClick={() => setIsKnowMoreOpen(true)}
              className="group relative size-36 shrink-0 overflow-hidden rounded-full ring-1 ring-line transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:size-40"
              aria-label="Open favorites popup"
            >
              <Image
                src="/profile_pic.png"
                alt={USER.displayName}
                fill
                sizes="(max-width: 640px) 144px, 160px"
                className="object-cover"
                priority
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[1] rounded-full bg-background/30 dark:bg-background/40"
              />
              <span
                aria-hidden
                className={`${GeistMono.className} absolute inset-0 z-[2] grid place-items-center bg-black/55 text-[14px] uppercase tracking-[0.14em] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100`}
              >
                KNOW ME
              </span>
            </button>
          </AvatarElectricEffect>
          <div aria-hidden className="w-px shrink-0 self-stretch bg-line" />
          <div className="mt-2 flex min-w-0 flex-1 flex-col justify-start gap-0 pl-3 sm:mt-3 sm:pl-4">
            <p
              className={`${GeistSans.className} text-[22px] font-semibold leading-tight tracking-tight text-foreground sm:text-[24px]`}
            >
              {USER.displayName}
            </p>
            <div
              aria-hidden
              className="mt-2.5 h-px w-[calc(100%+0.75rem)] -ml-3 bg-line sm:mt-3 sm:-ml-4 sm:w-[calc(100%+1rem)]"
            />
            <div className="mt-2 mb-[8px] sm:mt-2.5">
              <TextFlip
                key={showLongFlipLine ? "flip-wide" : "flip-narrow"}
                className={`${GeistMono.className} text-[14px] leading-snug text-balance text-muted-foreground`}
                variants={{
                  initial: { y: -10, opacity: 0 },
                  animate: { y: -1, opacity: 1 },
                  exit: { y: 10, opacity: 0 },
                }}
                interval={3.5}
              >
                {(showLongFlipLine
                  ? USER.flipSentences
                  : USER.flipSentences.slice(0, 2)
                ).map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </TextFlip>
            </div>
          </div>
        </div>
        <Separator />
      </div>

      {isKnowMoreOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center overflow-hidden overscroll-none bg-black/45 p-2 pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:p-4 sm:pt-[max(0.75rem,env(safe-area-inset-top))] sm:pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          onClick={() => setIsKnowMoreOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="know-more-title"
        >
          <div
            className="relative my-auto min-h-0 min-w-0 w-full max-w-[40rem] overflow-hidden border border-line bg-background p-3 shadow-xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="pointer-events-none absolute top-[-3.5px] left-[-4.5px] z-2 flex size-2 border border-line bg-background"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute top-[-3.5px] right-[-4.5px] z-2 flex size-2 border border-line bg-background"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute bottom-[-3.5px] left-[-4.5px] z-2 flex size-2 border border-line bg-background"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute right-[-4.5px] bottom-[-3.5px] z-2 flex size-2 border border-line bg-background"
              aria-hidden
            />

            <div className="mb-0 flex flex-col gap-2 pt-0.5 pb-2 sm:mb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 sm:pt-1 sm:pb-2">
              <h3
                id="know-more-title"
                className={`${GeistMono.className} min-w-0 flex-1 text-[13px] leading-snug text-foreground/90 sm:text-[15px] sm:pr-2`}
              >
                Since you have clicked my profile picture
              </h3>
              <button
                type="button"
                onClick={() => setIsKnowMoreOpen(false)}
                className={`${GeistMono.className} shrink-0 self-end text-[11px] uppercase leading-none tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground sm:self-auto sm:text-[13px]`}
                aria-label="Close popup"
              >
                Close
              </button>
            </div>

            <div className={`${KNOW_MORE_RULE} mb-3 sm:mb-4`} aria-hidden />

            <div
              className={`${GeistMono.className} min-w-0 break-words text-[12px] leading-relaxed text-muted-foreground sm:text-[14px]`}
            >
              <blockquote className="border-l border-line pl-2.5 italic text-foreground/90 sm:pl-3">
                <p>What is earth without art?</p>
                <p>It&apos;s just a bare rock floating in space.</p>
                <footer className="mt-1 text-muted-foreground">- Anonymous</footer>
              </blockquote>

              <div className={`${KNOW_MORE_RULE} my-3 sm:my-4`} aria-hidden />

              <div>
                <p className="mb-0.5 text-foreground sm:mb-1">Music</p>
                <p>Linkin Park</p>
                <p>R.E.M.</p>
                <p>
                Avenged Sevenfold</p>
              </div>

              <div className={`${KNOW_MORE_RULE} my-3 sm:my-4`} aria-hidden />

              <div>
                <p className="mb-0.5 text-foreground sm:mb-1">Books</p>
                <p>The Road — by Cormac McCarthy</p>
                <p>A Fine Balance — by Rohinton Mistry</p>
              </div>

              <div className={`${KNOW_MORE_RULE} my-3 sm:my-4`} aria-hidden />

              <div>
                <p className="mb-0.5 text-foreground sm:mb-1">Movies</p>
                <p>The Prestige</p>
                <p>Phantom Thread</p>
                <p>Moneyball</p>
                <p>Udaan</p>
              </div>

              <div className={`${KNOW_MORE_RULE} my-3 sm:my-4`} aria-hidden />

              <div>
                <p className="mb-0.5 text-foreground sm:mb-1">Actors I Admire</p>
                <p>Irfan Khan</p>
                <p>Christian Bale</p>
              </div>

              <div className={`${KNOW_MORE_RULE} my-3 sm:my-4`} aria-hidden />

              <div>
                <p className="mb-0.5 text-foreground sm:mb-1">Comedians</p>
                <p>Bo Burnham</p>
                <p>Kanan Gill</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
