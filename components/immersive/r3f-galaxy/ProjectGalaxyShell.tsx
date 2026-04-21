"use client";

import { Canvas } from "@react-three/fiber";
import { GeistSans } from "geist/font/sans";
import { Suspense, useMemo, useRef } from "react";
import { GalaxyShellContext } from "./GalaxyShellContext";
import { ProjectGalaxyScene } from "./ProjectGalaxyScene";
import { ScrollBridge } from "./ScrollBridge";
import { WheelForwardScroll } from "./WheelForwardScroll";
import { cn } from "@/lib/utils";

export function ProjectGalaxyShell({ className }: { className?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollSmoothedRef = useRef(0);
  const ctx = useMemo(
    () => ({ scrollRef, scrollSmoothedRef }),
    [],
  );

  return (
    <GalaxyShellContext.Provider value={ctx}>
      <div className={cn("relative h-full w-full", className)}>
        <div
          ref={scrollRef}
          className="absolute inset-0 z-0 overflow-y-auto overflow-x-hidden scroll-smooth [scrollbar-width:thin]"
          tabIndex={0}
          aria-label="Scroll through the project galaxy"
        >
          <div className="pointer-events-none h-[min(380vh,3200px)] w-full" />
        </div>

        <Canvas
          className="absolute inset-0 z-[1] !h-full !w-full touch-none"
          camera={{ position: [0, 1, 8], fov: 52, near: 0.08, far: 220 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <ProjectGalaxyScene />
          </Suspense>
          <ScrollBridge />
          <WheelForwardScroll />
        </Canvas>

        <p
          className={`${GeistSans.className} pointer-events-none absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-[2] w-[min(92vw,24rem)] -translate-x-1/2 text-center text-[10px] font-medium tracking-[0.32em] text-white/40 uppercase sm:text-[11px]`}
        >
          Scroll — dive into the archive
        </p>
      </div>
    </GalaxyShellContext.Provider>
  );
}
