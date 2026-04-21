"use client";

import { ArrowUpIcon } from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useImmersiveMode } from "@/contexts/ImmersiveModeContext";

export function ScrollToTop({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { isImmersive } = useImmersiveMode();
  const { scrollY } = useScroll();

  const [visible, setVisible] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");

  useMotionValueEvent(scrollY, "change", (latestValue) => {
    setVisible(latestValue >= 400);

    const prev = scrollY.getPrevious() ?? 0;
    const diff = latestValue - prev;
    setScrollDirection(diff > 0 ? "down" : "up");
  });

  if (isImmersive) {
    return null;
  }

  return (
    <button
      data-visible={visible}
      data-scroll-direction={scrollDirection}
      className={cn(
        "[--bottom:0.5rem] lg:[--bottom:2rem]",
        "fixed right-4 bottom-[calc(var(--bottom,0.5rem)+env(safe-area-inset-bottom,0px))] z-50 lg:right-8",
        "transition-[background-color,opacity] duration-300 data-[scroll-direction=down]:opacity-30 data-[scroll-direction=up]:opacity-100 data-[visible=false]:opacity-0",
        "data-[scroll-direction=down]:hover:opacity-100",
        "border-none",
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        "h-10 w-10",
        className,
      )}
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      {...props}
    >
      <ArrowUpIcon className="h-4 w-4" />
    </button>
  );
}
