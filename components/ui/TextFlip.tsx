"use client";

import {
  Children,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

type FlipVariantState = {
  y?: number;
  opacity?: number;
};

const defaultVariants: Record<
  "initial" | "animate" | "exit",
  FlipVariantState
> = {
  initial: { y: -10, opacity: 0 },
  animate: { y: -1, opacity: 1 },
  exit: { y: 10, opacity: 0 },
};

type FlipMotionProps = HTMLMotionProps<"span">;

export type TextFlipProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  interval?: number;
  variants?: Partial<{
    initial: Partial<FlipVariantState>;
    animate: Partial<FlipVariantState>;
    exit: Partial<FlipVariantState>;
  }>;
  as?: ComponentType<FlipMotionProps>;
};

export function TextFlip({
  children,
  className,
  style,
  interval = 2,
  variants,
  as: MotionComp = motion.span,
}: TextFlipProps) {
  const items = useMemo(
    () => Children.toArray(children).filter((c) => c != null),
    [children],
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const ms = Math.max(0.4, interval) * 1000;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, ms);
    return () => window.clearInterval(id);
  }, [items.length, interval]);

  const mergedVariants =
    variants != null
      ? {
          initial: { ...defaultVariants.initial, ...variants.initial },
          animate: { ...defaultVariants.animate, ...variants.animate },
          exit: { ...defaultVariants.exit, ...variants.exit },
        }
      : defaultVariants;

  if (items.length === 0) return null;

  const current = items[index];

  return (
    <span className="inline-flex max-w-full items-start overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <MotionComp
          key={index}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={mergedVariants}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={cn("inline-block text-balance", className)}
          style={style}
        >
          {current}
        </MotionComp>
      </AnimatePresence>
    </span>
  );
}
