"use client";

import { TextHoverEffect } from "@/components/ui/TextHoverEffect";

export function SiteFooterInteractiveLogotype() {
  return (
    <div className="screen-line-bottom after:z-1 after:bg-foreground/10">
      <div className="overflow-hidden">
        <div className="mx-auto aspect-[480/128] w-full max-w-[min(96vw,720px)] translate-y-[30%]">
          <TextHoverEffect text="Silver" duration={0.3} />
        </div>
      </div>
    </div>
  );
}
