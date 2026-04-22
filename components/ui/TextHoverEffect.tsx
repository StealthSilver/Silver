"use client";
import React, { useId, useRef, useEffect, useState } from "react";
import { motion } from "motion/react";

const VIEW_W = 480;
const VIEW_H = 128;

/** Cinzel for the Silver wordmark only; inherited by both SVG text layers. */
const SILVER_FONT_FAMILY = "var(--font-cinzel), serif" as const;

/** Ring + dot hotspot at center for a soft “lens” cursor over the wordmark. */
const SILVER_RING_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='12' fill='none' stroke='%23ffffff' stroke-width='2' opacity='0.9'/%3E%3Ccircle cx='20' cy='20' r='12' fill='none' stroke='%23000000' stroke-width='1.25' opacity='0.22'/%3E%3Ccircle cx='20' cy='20' r='1.75' fill='%23ffffff' opacity='0.85'/%3E%3C/svg%3E") 20 20, pointer`;

export const TextHoverEffect = ({
  text,
  duration,
  interactive,
  onPrimaryAction,
  introSweepOnFirstLoad,
}: {
  text: string;
  duration?: number;
  /** When true, SILVER shows a ring cursor on hover and can activate immersion on click. */
  interactive?: boolean;
  onPrimaryAction?: () => void;
  /** Plays a one-time left-to-right intro sweep on each page load. */
  introSweepOnFirstLoad?: boolean;
}) => {
  const displayText = text.toUpperCase();
  const uid = useId().replace(/:/g, "");
  const shimmerId = `silverShimmer-${uid}`;
  const revealMaskId = `revealMask-${uid}`;
  const textMaskId = `textMask-${uid}`;

  const svgRef = useRef<SVGSVGElement>(null);
  const textMeasureRef = useRef<SVGTextElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });
  const [hovered, setHovered] = useState(false);
  const [introSweepRange, setIntroSweepRange] = useState({ startCx: 8, endCx: 92 });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  useEffect(() => {
    if (!introSweepOnFirstLoad) return;

    const measureSweepRange = () => {
      const textEl = textMeasureRef.current;
      if (!textEl) return;

      const bbox = textEl.getBBox();
      if (!bbox.width) return;

      const startCx = Math.max(0, (bbox.x / VIEW_W) * 100);
      const endCx = Math.min(100, ((bbox.x + bbox.width) / VIEW_W) * 100);
      setIntroSweepRange({ startCx, endCx });
    };

    measureSweepRange();
    if (typeof document !== "undefined" && "fonts" in document) {
      void (document as Document & { fonts: FontFaceSet }).fonts.ready.then(measureSweepRange);
    }
  }, [introSweepOnFirstLoad, displayText]);

  useEffect(() => {
    if (!introSweepOnFirstLoad) return;
    if (typeof window === "undefined") return;

    const totalMs = 950;
    const { startCx, endCx } = introSweepRange;
    const start = performance.now();
    let frameId = 0;

    if (interactive) setHovered(true);

    const tick = (now: number) => {
      const progress = Math.min((now - start) / totalMs, 1);
      const cx = startCx + (endCx - startCx) * progress;
      setMaskPosition({ cx: `${cx}%`, cy: "50%" });

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      } else {
        if (interactive) setHovered(false);
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [introSweepOnFirstLoad, interactive, introSweepRange]);

  const handleKeyDown = (e: React.KeyboardEvent<SVGSVGElement>) => {
    if (!interactive || !onPrimaryAction) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onPrimaryAction();
    }
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      onMouseEnter={() => interactive && setHovered(true)}
      onMouseLeave={() => interactive && setHovered(false)}
      onClick={(e) => {
        if (!interactive || !onPrimaryAction) return;
        e.preventDefault();
        onPrimaryAction();
      }}
      onKeyDown={handleKeyDown}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? "Enter immersion zone" : undefined}
      className="block h-full w-full select-none rounded-sm outline-none focus:outline-none focus-visible:outline-none"
      style={{
        fontFamily: SILVER_FONT_FAMILY,
        cursor: interactive
          ? hovered
            ? SILVER_RING_CURSOR
            : "default"
          : undefined,
      }}
    >
      <defs>
        <motion.linearGradient
          id={shimmerId}
          gradientUnits="userSpaceOnUse"
          x1="-100%"
          y1="0%"
          x2="200%"
          y2="0%"
          animate={{ x1: ["-100%", "0%", "100%"], x2: ["0%", "100%", "200%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        >
          <stop offset="0%" stopColor="#a1a1aa" />
          <stop offset="50%" stopColor="#f5f5f5" />
          <stop offset="100%" stopColor="#d4d4d8" />
        </motion.linearGradient>

        <motion.radialGradient
          id={revealMaskId}
          gradientUnits="userSpaceOnUse"
          r="25%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0.3, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>

        <mask id={textMaskId}>
          <rect width="100%" height="100%" fill={`url(#${revealMaskId})`} />
        </mask>
      </defs>

      <text
        ref={textMeasureRef}
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.45"
        className="fill-neutral-300 stroke-neutral-700 text-8xl font-medium dark:stroke-neutral-400 dark:fill-neutral-800"
        style={{ opacity: 0.6 }}
      >
        {displayText}
      </text>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke={`url(#${shimmerId})`}
        strokeWidth="0.6"
        className="fill-transparent text-8xl font-medium"
        mask={`url(#${textMaskId})`}
        style={{ opacity: 0.9 }}
      >
        {displayText}
      </text>
    </svg>
  );
};
