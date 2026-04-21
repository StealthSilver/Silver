"use client";

import Image from "next/image";
import { Caveat } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { AvatarElectricEffect } from "../ui/AvatarElectricEffect";
import { TextHoverEffect } from "../ui/TextHoverEffect";
import { TextFlip } from "../ui/TextFlip";
import Separator from "../ui/Separator";
import { USER } from "@/config/user.config";

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
  return (
    <section className="relative">
      <div className="relative pb-0 pt-14" style={heroDotBg}>
        <div className="flex flex-col items-center justify-center px-4">
          <div className="relative mx-auto aspect-[480/128] w-full max-w-[min(96vw,720px)] py-2">
            <TextHoverEffect text="Silver" duration={0.3} />
            <p
              className={`${heroPencil.className} pointer-events-none absolute bottom-[12px] right-[12px] z-[1] max-w-[min(58%,16rem)] text-right text-lg leading-tight tracking-wide sm:text-xl md:text-2xl`}
              style={{
                color: "color-mix(in oklab, var(--muted-foreground) 82%, var(--foreground) 18%)",
                fontWeight: 600,
                textShadow:
                  "0.55px 0.45px 0 color-mix(in oklab, var(--foreground) 18%, transparent), -0.45px -0.35px 0 color-mix(in oklab, var(--background) 42%, transparent), 0.35px -0.28px 0 color-mix(in oklab, var(--foreground) 10%, transparent), -0.2px 0.5px 0 color-mix(in oklab, var(--foreground) 6%, transparent)",
                transform: "rotate(-1.1deg)",
              }}
            >
              Enter the different zone
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
            <div className="relative size-36 shrink-0 overflow-hidden rounded-full ring-1 ring-line sm:size-40">
              <Image
                src="/profile_pic.png"
                alt={USER.displayName}
                fill
                sizes="(max-width: 640px) 144px, 160px"
                className="object-cover"
                priority
              />
            </div>
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
    </section>
  );
}
