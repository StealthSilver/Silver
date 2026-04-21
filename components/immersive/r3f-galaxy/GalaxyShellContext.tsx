"use client";

import { createContext, useContext, type RefObject } from "react";

export type GalaxyShellContextValue = {
  scrollRef: RefObject<HTMLDivElement | null>;
  scrollSmoothedRef: React.MutableRefObject<number>;
};

export const GalaxyShellContext = createContext<GalaxyShellContextValue | null>(
  null,
);

export function useGalaxyShell() {
  const ctx = useContext(GalaxyShellContext);
  if (!ctx) {
    throw new Error("useGalaxyShell must be used within GalaxyShellContext.Provider");
  }
  return ctx;
}

export function useGalaxyShellOptional() {
  return useContext(GalaxyShellContext);
}
