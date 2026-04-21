"use client";
import React, { useId, useRef, useEffect, useState } from "react";
import { motion } from "motion/react";

const VIEW_W = 480;
const VIEW_H = 128;

export const TextHoverEffect = ({
  text,
  duration,
}: {
  text: string;
  duration?: number;
}) => {
  const displayText = text.toUpperCase();
  const uid = useId().replace(/:/g, "");
  const shimmerId = `silverShimmer-${uid}`;
  const revealMaskId = `revealMask-${uid}`;
  const textMaskId = `textMask-${uid}`;

  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

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
      className="block h-full w-full select-none"
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
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.45"
        className="
          fill-neutral-300 stroke-neutral-700
          text-8xl font-medium [font-family:var(--font-cinzel),ui-serif,Georgia,serif]
          dark:stroke-neutral-400 dark:fill-neutral-800
        "
        style={{
          opacity: 0.6,
          fontFamily: "var(--font-cinzel), ui-serif, Georgia, serif",
        }}
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
        className="fill-transparent text-8xl font-medium [font-family:var(--font-cinzel),ui-serif,Georgia,serif]"
        mask={`url(#${textMaskId})`}
        style={{
          opacity: 0.9,
          fontFamily: "var(--font-cinzel), ui-serif, Georgia, serif",
        }}
      >
        {displayText}
      </text>
    </svg>
  );
};
