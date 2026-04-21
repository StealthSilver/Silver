"use client";

import { motion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { GeistSans } from "geist/font/sans";
import { useImmersiveMode } from "@/contexts/ImmersiveModeContext";

export default function ImmersiveZone() {
  const {
    requestExitImmersive,
    immersiveMusicPaused,
    toggleImmersiveMusicPaused,
  } = useImmersiveMode();

  return (
    <div
      className="fixed inset-0 z-[40] overflow-hidden bg-background"
      role="region"
      aria-label="Immersion zone"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-90 dark:opacity-100"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 50% -20%, color-mix(in oklab, var(--primary) 35%, transparent), transparent 55%),
            radial-gradient(ellipse 90% 60% at 80% 100%, color-mix(in oklab, var(--muted-foreground) 12%, transparent), transparent 50%),
            linear-gradient(180deg, color-mix(in oklab, var(--muted) 45%, var(--background)) 0%, var(--background) 45%, color-mix(in oklab, var(--background) 88%, var(--foreground) 4%) 100%)
          `,
        }}
      />

      <div
        className="absolute inset-0 flex items-center justify-center pt-8 pb-12"
        style={{ perspective: "1100px" }}
      >
        <motion.div
          className="relative h-[min(72vw,420px)] w-[min(92vw,560px)] [transform-style:preserve-3d]"
          animate={{ rotateX: 18 }}
          transition={{ type: "spring", stiffness: 40, damping: 18 }}
        >
          <motion.div
            className="absolute inset-0 [transform-style:preserve-3d]"
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 56, repeat: Infinity, ease: "linear" }}
          >
            {/* Ground */}
            <div
              className="absolute left-1/2 top-1/2 h-48 w-72 -translate-x-1/2 border border-line/40 bg-card/30 shadow-[0_0_60px_color-mix(in_oklab,var(--primary)_18%,transparent)]"
              style={{
                transform: "translate(-50%, -10%) rotateX(78deg) translateZ(-80px)",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className="absolute inset-2 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                }}
              />
            </div>

            {/* Floating monolith */}
            <div
              className="absolute left-[42%] top-[28%] h-32 w-14 rounded-sm border border-line/50 bg-gradient-to-b from-muted/90 to-muted-foreground/25 shadow-lg"
              style={{
                transform: "translateZ(40px) rotateY(-12deg)",
                boxShadow:
                  "0 20px 40px color-mix(in oklab, var(--foreground) 12%, transparent)",
              }}
            />

            {/* Orb */}
            <motion.div
              className="absolute right-[30%] top-[22%] size-16 rounded-full border border-line/30"
              style={{
                background:
                  "radial-gradient(circle at 32% 28%, color-mix(in oklab, var(--foreground) 35%, transparent), color-mix(in oklab, var(--primary) 25%, transparent) 45%, transparent 70%)",
                transform: "translateZ(90px)",
                boxShadow:
                  "0 0 40px color-mix(in oklab, var(--primary) 35%, transparent)",
              }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Side plane */}
            <div
              className="absolute left-[18%] top-[36%] h-24 w-20 rounded-md border border-line/35 bg-muted/20"
              style={{
                transform: "translateZ(20px) rotateY(52deg)",
              }}
            />

            {/* Distant block */}
            <div
              className="absolute right-[22%] bottom-[32%] h-12 w-20 rounded-sm border border-line/40 bg-card/40"
              style={{
                transform: "translateZ(-30px) rotateX(12deg)",
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="pointer-events-auto absolute top-[max(0.65rem,env(safe-area-inset-top))] right-[max(0.65rem,env(safe-area-inset-right))] z-[50] flex flex-col items-end gap-2 sm:top-4 sm:right-4">
        <motion.button
          type="button"
          onClick={requestExitImmersive}
          className={`${GeistSans.className} rounded-full border border-line bg-background/85 px-4 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur-md transition-[transform,background-color] hover:bg-muted/80 active:scale-[0.98] sm:px-5 sm:py-2.5`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          Return to minimal
        </motion.button>
        <motion.button
          type="button"
          onClick={toggleImmersiveMusicPaused}
          className={`${GeistSans.className} inline-flex items-center gap-2 rounded-full border border-line bg-background/85 px-4 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur-md transition-[transform,background-color] hover:bg-muted/80 active:scale-[0.98] sm:px-5 sm:py-2.5`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          aria-pressed={immersiveMusicPaused}
          aria-label={
            immersiveMusicPaused ? "Resume immersion music" : "Pause immersion music"
          }
        >
          {immersiveMusicPaused ? (
            <Play className="size-4 shrink-0" aria-hidden />
          ) : (
            <Pause className="size-4 shrink-0" aria-hidden />
          )}
          <span>{immersiveMusicPaused ? "Play music" : "Pause music"}</span>
        </motion.button>
      </div>

      <p
        className={`${GeistSans.className} pointer-events-none absolute left-1/2 top-[max(4.25rem,calc(env(safe-area-inset-top)+3rem))] -translate-x-1/2 text-center text-xs font-medium tracking-[0.35em] text-muted-foreground uppercase`}
      >
        Immersion zone
      </p>
    </div>
  );
}
