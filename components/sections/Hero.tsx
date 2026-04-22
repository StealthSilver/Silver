"use client";

import { useEffect, useId, useState } from "react";
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

export default function Hero() {
  const { requestEnterImmersive } = useImmersiveMode();
  const zoneArrowMarkerId = useId().replace(/:/g, "");
  const [isKnowMoreOpen, setIsKnowMoreOpen] = useState(false);

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
                className={`${GeistMono.className} absolute inset-0 grid place-items-center bg-black/55 text-[14px] uppercase tracking-[0.14em] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100`}
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
                className={`${GeistMono.className} text-[14px] leading-snug text-balance text-muted-foreground`}
                variants={{
                  initial: { y: -10, opacity: 0 },
                  animate: { y: -1, opacity: 1 },
                  exit: { y: 10, opacity: 0 },
                }}
                interval={3.5}
              >
                {USER.flipSentences.map((line) => (
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
          className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4 backdrop-blur-md"
          onClick={() => setIsKnowMoreOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="know-more-title"
        >
          <div
            className="relative w-full max-w-[40rem] border border-line bg-background p-5 shadow-xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <span
              className="pointer-events-none absolute left-[-4.5px] top-[-3.5px] z-2 flex size-2 border bg-background"
              style={{ borderColor: "var(--line)" }}
              aria-hidden
            />
            <span
              className="pointer-events-none absolute right-[-4.5px] top-[-3.5px] z-2 flex size-2 border bg-background"
              style={{ borderColor: "var(--line)" }}
              aria-hidden
            />
            <span
              className="pointer-events-none absolute bottom-[-3.5px] left-[-4.5px] z-2 flex size-2 border bg-background"
              style={{ borderColor: "var(--line)" }}
              aria-hidden
            />
            <span
              className="pointer-events-none absolute bottom-[-3.5px] right-[-4.5px] z-2 flex size-2 border bg-background"
              style={{ borderColor: "var(--line)" }}
              aria-hidden
            />

            <div className="mb-4 flex items-center justify-between border-b border-line pb-2">
              <h3
                id="know-more-title"
                className={`${GeistSans.className} text-xl font-semibold tracking-tight text-foreground`}
              >
                Since you have clicked my profile picture
              </h3>
              <button
                type="button"
                onClick={() => setIsKnowMoreOpen(false)}
                className={`${GeistMono.className} text-[13px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground`}
                aria-label="Close popup"
              >
                Close
              </button>
            </div>

            <div className={`${GeistMono.className} space-y-4 text-[14px] leading-relaxed text-muted-foreground`}>
              <blockquote className="border-l border-line pl-3 italic text-foreground/90">
                <p>What is earth without art.</p>
                <p>It&apos;s just a bare rock floating in space.</p>
                <footer className="mt-1 text-muted-foreground">- Anonymous</footer>
              </blockquote>

              <div>
                <p className="mb-1 text-foreground">Music</p>
                <p>Linkin Park</p>
                <p>R.E.M.</p>
                <p>
                Avenged Sevenfold</p>
              </div>

              <div>
                <p className="mb-1 text-foreground">Books</p>
                <p>The Road — by Cormac McCarthy</p>
                <p>A Fine Balance — by Rohinton Mistry</p>
              </div>

              <div>
                <p className="mb-1 text-foreground">Movies</p>
                <p>The Prestige</p>
                <p>Phantom Thread</p>
                <p>Moneyball</p>
                <p>Udaan</p>
              </div>

              <div>
                <p className="mb-1 text-foreground">Actors I Admire</p>
                <p>Irfan Khan</p>
                <p>Christian Bale</p>
              </div>

              <div>
                <p className="mb-1 text-foreground">Comedians</p>
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
