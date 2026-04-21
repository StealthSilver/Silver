"use client";

import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";

import { ElectricBorder } from "@/components/ui/ElectricBorder";

const HOVER_DELAY_MS = 150;

/** Electric blue border on hover; wraps a single child (e.g. avatar). */
export function AvatarElectricEffect({ children }: { children: ReactElement }) {
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHoverTimeout = () => {
    if (!hoverTimeoutRef.current) return;

    clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = null;
  };

  useEffect(() => {
    return () => {
      clearHoverTimeout();
    };
  }, []);

  const handleMouseEnter = () => {
    clearHoverTimeout();

    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, HOVER_DELAY_MS);
  };

  const handleMouseLeave = () => {
    clearHoverTimeout();
    setIsHovered(false);
  };

  return (
    <ElectricBorder
      chaos={0.03}
      borderRadius={999}
      color="#38bdf8"
      active={isHovered}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </ElectricBorder>
  );
}
