"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/** Served from `public/music/a.mp3` */
export const IMMERSIVE_MUSIC_SRC = "/music/a.mp3";

export type ImmersiveSheet =
  | "none"
  | "immersive-enter-cover"
  | "immersive-enter-reveal"
  | "immersive-exit-cover"
  | "immersive-exit-reveal";

interface ImmersiveModeContextType {
  isImmersive: boolean;
  sheet: ImmersiveSheet;
  immersiveMusicPaused: boolean;
  requestEnterImmersive: () => void;
  requestExitImmersive: () => void;
  toggleImmersiveMusicPaused: () => void;
  onEnterCoverComplete: () => void;
  onEnterRevealComplete: () => void;
  onExitCoverComplete: () => void;
  onExitRevealComplete: () => void;
}

const ImmersiveModeContext = createContext<
  ImmersiveModeContextType | undefined
>(undefined);

export function ImmersiveModeProvider({ children }: { children: ReactNode }) {
  const [isImmersive, setIsImmersive] = useState(false);
  const [sheet, setSheet] = useState<ImmersiveSheet>("none");
  const [immersiveMusicPaused, setImmersiveMusicPaused] = useState(false);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  const ensureMusic = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!musicRef.current) {
      const a = new Audio(IMMERSIVE_MUSIC_SRC);
      a.loop = true;
      a.preload = "auto";
      musicRef.current = a;
    }
    return musicRef.current;
  }, []);

  const stopMusic = useCallback(() => {
    const a = musicRef.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
  }, []);

  const requestEnterImmersive = useCallback(() => {
    if (sheet !== "none" || isImmersive) return;
    setImmersiveMusicPaused(false);
    const a = ensureMusic();
    if (a) {
      void a.play().catch(() => {});
    }
    setSheet("immersive-enter-cover");
  }, [sheet, isImmersive, ensureMusic]);

  const onEnterCoverComplete = useCallback(() => {
    setIsImmersive(true);
    setSheet((s) => (s === "immersive-enter-cover" ? "immersive-enter-reveal" : s));
  }, []);

  const onEnterRevealComplete = useCallback(() => {
    setSheet((s) => (s === "immersive-enter-reveal" ? "none" : s));
  }, []);

  const requestExitImmersive = useCallback(() => {
    if (!isImmersive) return;
    if (
      sheet === "immersive-exit-cover" ||
      sheet === "immersive-exit-reveal"
    ) {
      return;
    }
    stopMusic();
    setImmersiveMusicPaused(false);
    setSheet("immersive-exit-cover");
  }, [sheet, isImmersive, stopMusic]);

  const toggleImmersiveMusicPaused = useCallback(() => {
    if (!isImmersive) return;
    const a = ensureMusic();
    if (!a) return;
    setImmersiveMusicPaused((wasPaused) => {
      if (wasPaused) {
        void a.play().catch(() => {});
        return false;
      }
      a.pause();
      return true;
    });
  }, [isImmersive, ensureMusic]);

  const onExitCoverComplete = useCallback(() => {
    setIsImmersive(false);
    setSheet((s) => (s === "immersive-exit-cover" ? "immersive-exit-reveal" : s));
  }, []);

  const onExitRevealComplete = useCallback(() => {
    setSheet((s) => (s === "immersive-exit-reveal" ? "none" : s));
  }, []);

  useEffect(() => {
    if (!isImmersive) {
      document.body.style.removeProperty("overflow");
      stopMusic();
      setImmersiveMusicPaused(false);
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isImmersive, stopMusic]);

  /** After enter transition, keep music playing unless the user paused it. */
  useEffect(() => {
    if (!isImmersive || immersiveMusicPaused || sheet !== "none") return;
    const a = musicRef.current;
    if (a && a.paused) {
      void a.play().catch(() => {});
    }
  }, [isImmersive, immersiveMusicPaused, sheet]);

  return (
    <ImmersiveModeContext.Provider
      value={{
        isImmersive,
        sheet,
        immersiveMusicPaused,
        requestEnterImmersive,
        requestExitImmersive,
        toggleImmersiveMusicPaused,
        onEnterCoverComplete,
        onEnterRevealComplete,
        onExitCoverComplete,
        onExitRevealComplete,
      }}
    >
      {children}
    </ImmersiveModeContext.Provider>
  );
}

export function useImmersiveMode() {
  const context = useContext(ImmersiveModeContext);
  if (context === undefined) {
    throw new Error(
      "useImmersiveMode must be used within ImmersiveModeProvider",
    );
  }
  return context;
}
