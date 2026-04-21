"use client";

import Image from "next/image";
import { TextHoverEffect } from "../ui/TextHoverEffect";
import Separator from "../ui/Separator";

const heroDotBg = {
  backgroundColor: "var(--background)",
  backgroundImage: "radial-gradient(var(--line) 0.85px, transparent 0.85px)",
  backgroundSize: "14px 14px",
} as const;

export default function Hero() {
  return (
    <section className="relative">
      <div className="relative pb-0 pt-14" style={heroDotBg}>
        <div className="flex justify-center px-4">
          <div className="mx-auto aspect-[480/128] w-full max-w-[min(96vw,720px)] py-2">
            <TextHoverEffect text="Silver" duration={0.3} />
          </div>
        </div>

        <div
          role="presentation"
          className="relative left-1/2 mt-10 h-px w-screen max-w-none -translate-x-1/2 bg-line"
          aria-hidden
        />
      </div>

      <div className="relative mx-auto w-full max-w-3xl">
        <div className="relative z-[2] flex items-center gap-0">
          <div className="relative size-36 shrink-0 overflow-hidden rounded-full ring-1 ring-line sm:size-40">
            <Image
              src="/profile_pic.png"
              alt="Silver"
              fill
              sizes="(max-width: 640px) 144px, 160px"
              className="object-cover"
              priority
            />
          </div>
          <div
            aria-hidden
            className="ml-0 h-32 w-px shrink-0 self-center bg-line sm:h-40"
          />
        </div>
        <Separator />
      </div>
    </section>
  );
}
