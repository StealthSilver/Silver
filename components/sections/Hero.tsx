"use client";

import { TextHoverEffect } from "../ui/TextHoverEffect";

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center overflow-x-hidden px-4 py-14">
      <div className="h-[160px] w-full max-w-[min(92vw,520px)] sm:h-[180px] md:h-[200px]">
        <TextHoverEffect text="Silver" duration={0.3} />
      </div>
    </section>
  );
}
