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

export const IMMERSIVE_TRACKS = [
  "/music/a.mp3",
  "/music/b.mp3",
  "/music/c.mp3",
] as const;

/** @deprecated use IMMERSIVE_TRACKS[0] */
export const IMMERSIVE_MUSIC_SRC = IMMERSIVE_TRACKS[0];

const FADE_IN_MS = 3000;
const FADE_OUT_MS = 2000;

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
  immersiveTrackIndex: number;
  requestEnterImmersive: () => void;
  requestExitImmersive: () => void;
  toggleImmersiveMusicPaused: () => void;
  immersivePrevTrack: () => void;
  immersiveNextTrack: () => void;
  onEnterCoverComplete: () => void;
  onEnterRevealComplete: () => void;
  onExitCoverComplete: () => void;
  onExitRevealComplete: () => void;
  /** Returns the live Web Audio analyser bound to the immersion music, or null. */
  getImmersiveAnalyser: () => AnalyserNode | null;
}

const ImmersiveModeContext = createContext<
  ImmersiveModeContextType | undefined
>(undefined);

function trackUrlMatches(audio: HTMLAudioElement, path: string) {
  try {
    return audio.src === new URL(path, window.location.href).href;
  } catch {
    return audio.src.endsWith(path);
  }
}

export function ImmersiveModeProvider({ children }: { children: ReactNode }) {
  const [isImmersive, setIsImmersive] = useState(false);
  const [sheet, setSheet] = useState<ImmersiveSheet>("none");
  const [immersiveMusicPaused, setImmersiveMusicPaused] = useState(false);
  const [immersiveTrackIndex, setImmersiveTrackIndex] = useState(0);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const fadeGenRef = useRef(0);
  const pausedRef = useRef(false);
  const trackIndexRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaSourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    pausedRef.current = immersiveMusicPaused;
  }, [immersiveMusicPaused]);

  useEffect(() => {
    trackIndexRef.current = immersiveTrackIndex;
  }, [immersiveTrackIndex]);

  const cancelFadeIn = useCallback(() => {
    fadeGenRef.current += 1;
  }, []);

  const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

  const startFadeIn = useCallback((audio: HTMLAudioElement) => {
    const gen = ++fadeGenRef.current;
    audio.volume = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      if (fadeGenRef.current !== gen) return;
      const t = clamp01((now - t0) / FADE_IN_MS);
      const el = musicRef.current;
      if (!el) return;
      el.volume = clamp01(t);
      if (t < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, []);

  const startFadeOut = useCallback((audio: HTMLAudioElement) => {
    const gen = ++fadeGenRef.current;
    const v0 = clamp01(audio.volume);
    const t0 = performance.now();
    const step = (now: number) => {
      if (fadeGenRef.current !== gen) return;
      const t = clamp01((now - t0) / FADE_OUT_MS);
      const el = musicRef.current;
      if (!el) return;
      el.volume = clamp01(v0 * (1 - t));
      if (t < 1) {
        requestAnimationFrame(step);
        return;
      }
      el.pause();
      el.currentTime = 0;
      el.volume = 1;
    };
    requestAnimationFrame(step);
  }, []);

  const ensureMusic = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!musicRef.current) {
      const a = new Audio(IMMERSIVE_TRACKS[0]);
      a.preload = "auto";
      a.loop = true;
      a.crossOrigin = "anonymous";
      musicRef.current = a;
    }
    return musicRef.current;
  }, []);

  /**
   * Lazily create the Web Audio graph (MediaElementSource -> Analyser -> destination).
   * Must be invoked in a user gesture so the AudioContext is allowed to start.
   * Re-running is safe: the graph is created at most once per audio element.
   */
  const ensureAudioGraph = useCallback((audio: HTMLAudioElement) => {
    if (typeof window === "undefined") return;
    try {
      if (!audioCtxRef.current) {
        const AC =
          window.AudioContext ||
          (
            window as typeof window & {
              webkitAudioContext?: typeof AudioContext;
            }
          ).webkitAudioContext;
        if (!AC) return;
        audioCtxRef.current = new AC();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (!mediaSourceRef.current) {
        mediaSourceRef.current = ctx.createMediaElementSource(audio);
      }
      if (!analyserRef.current) {
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.78;
        mediaSourceRef.current.connect(analyser);
        analyser.connect(ctx.destination);
        analyserRef.current = analyser;
      }
      if (ctx.state === "suspended") {
        void ctx.resume().catch(() => {});
      }
    } catch {
      // Analyser is optional — swallow errors (e.g. duplicate source nodes on HMR).
    }
  }, []);

  const getImmersiveAnalyser = useCallback(() => analyserRef.current, []);

  const stopMusic = useCallback(() => {
    cancelFadeIn();
    const a = musicRef.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
    a.volume = 1;
  }, [cancelFadeIn]);

  const requestEnterImmersive = useCallback(() => {
    if (sheet !== "none" || isImmersive) return;
    cancelFadeIn();
    setImmersiveMusicPaused(false);
    trackIndexRef.current = 0;
    setImmersiveTrackIndex(0);
    const a = ensureMusic();
    if (!a) {
      setSheet("immersive-enter-cover");
      return;
    }
    a.loop = true;
    const first = IMMERSIVE_TRACKS[0];
    if (!trackUrlMatches(a, first)) {
      a.src = first;
      a.load();
    }
    a.volume = 0;
    ensureAudioGraph(a);
    void a.play().catch(() => {});
    startFadeIn(a);
    setSheet("immersive-enter-cover");
  }, [sheet, isImmersive, ensureMusic, ensureAudioGraph, cancelFadeIn, startFadeIn]);

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
    const a = musicRef.current;
    if (a && !pausedRef.current && !a.paused) {
      startFadeOut(a);
    } else if (a) {
      cancelFadeIn();
      a.pause();
      a.currentTime = 0;
      a.volume = 1;
    }
    setImmersiveMusicPaused(false);
    trackIndexRef.current = 0;
    setImmersiveTrackIndex(0);
    setSheet("immersive-exit-cover");
  }, [sheet, isImmersive, cancelFadeIn, startFadeOut]);

  const toggleImmersiveMusicPaused = useCallback(() => {
    if (!isImmersive) return;
    const a = ensureMusic();
    if (!a) return;
    setImmersiveMusicPaused((wasPaused) => {
      if (wasPaused) {
        if (a.volume < 1) a.volume = 1;
        ensureAudioGraph(a);
        void a.play().catch(() => {});
        return false;
      }
      cancelFadeIn();
      a.pause();
      return true;
    });
  }, [isImmersive, ensureMusic, ensureAudioGraph, cancelFadeIn]);

  const immersivePrevTrack = useCallback(() => {
    if (!isImmersive) return;
    const a = ensureMusic();
    if (!a) return;
    cancelFadeIn();
    const next =
      (trackIndexRef.current + IMMERSIVE_TRACKS.length - 1) %
      IMMERSIVE_TRACKS.length;
    trackIndexRef.current = next;
    setImmersiveTrackIndex(next);
    a.src = IMMERSIVE_TRACKS[next];
    a.load();
    a.loop = true;
    a.volume = 1;
    ensureAudioGraph(a);
    if (!pausedRef.current) void a.play().catch(() => {});
  }, [isImmersive, ensureMusic, ensureAudioGraph, cancelFadeIn]);

  const immersiveNextTrack = useCallback(() => {
    if (!isImmersive) return;
    const a = ensureMusic();
    if (!a) return;
    cancelFadeIn();
    const next = (trackIndexRef.current + 1) % IMMERSIVE_TRACKS.length;
    trackIndexRef.current = next;
    setImmersiveTrackIndex(next);
    a.src = IMMERSIVE_TRACKS[next];
    a.load();
    a.loop = true;
    a.volume = 1;
    ensureAudioGraph(a);
    if (!pausedRef.current) void a.play().catch(() => {});
  }, [isImmersive, ensureMusic, ensureAudioGraph, cancelFadeIn]);

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
      setImmersiveMusicPaused(false);
      trackIndexRef.current = 0;
      setImmersiveTrackIndex(0);
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isImmersive]);

  useEffect(() => {
    return () => {
      cancelFadeIn();
      const a = musicRef.current;
      if (a) {
        a.pause();
        a.currentTime = 0;
        a.volume = 1;
      }
    };
  }, [cancelFadeIn]);

  /** If playback failed on the SILVER click, retry once the zone is stable. */
  useEffect(() => {
    if (!isImmersive || immersiveMusicPaused || sheet !== "none") return;
    const a = musicRef.current;
    if (a && a.paused) {
      if (a.volume < 1) a.volume = 1;
      void a.play().catch(() => {});
    }
  }, [isImmersive, immersiveMusicPaused, sheet]);

  return (
    <ImmersiveModeContext.Provider
      value={{
        isImmersive,
        sheet,
        immersiveMusicPaused,
        immersiveTrackIndex,
        requestEnterImmersive,
        requestExitImmersive,
        toggleImmersiveMusicPaused,
        immersivePrevTrack,
        immersiveNextTrack,
        onEnterCoverComplete,
        onEnterRevealComplete,
        onExitCoverComplete,
        onExitRevealComplete,
        getImmersiveAnalyser,
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
