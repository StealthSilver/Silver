/**
 * Lightweight UI sound manager.
 *
 * The theme toggle needs a crisp, reliable click when pressed. We prefer
 * Web Audio synthesis (a short filtered noise burst) because it:
 *   • never depends on network / CORS / third-party asset availability,
 *   • always plays in sync with the user gesture (no loading jitter),
 *   • is effectively free in bundle size.
 *
 * We still fall back to the `HTMLAudioElement` path if Web Audio is
 * unavailable (older browsers, unusual embedding contexts), and cache
 * any remote audio elements so repeat clicks are instant.
 */

type AudioContextCtor = typeof AudioContext;

const REMOTE_CLICK_URL =
  // Source: iOS UI Sounds — used purely as a fallback.
  "https://assets.chanhdai.com/audio/ui-sounds/click.wav";

class SoundManager {
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private audioCtx: AudioContext | null = null;
  private audioCtxFailed = false;

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (this.audioCtx) return this.audioCtx;
    if (this.audioCtxFailed) return null;

    const AC: AudioContextCtor | undefined =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: AudioContextCtor })
        .webkitAudioContext;

    if (!AC) {
      this.audioCtxFailed = true;
      return null;
    }

    try {
      this.audioCtx = new AC();
    } catch {
      this.audioCtxFailed = true;
      return null;
    }
    return this.audioCtx;
  }

  private async resumeContext(ctx: AudioContext) {
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        // Some browsers reject resume() outside a gesture — safe to ignore.
      }
    }
  }

  /**
   * Synthesize a short, tight "tick" click using filtered white noise so
   * it sounds like a clean UI click regardless of the host environment.
   * Returns `true` if the click was successfully scheduled.
   */
  private playSynthClick(): boolean {
    const ctx = this.getAudioContext();
    if (!ctx) return false;

    void this.resumeContext(ctx);

    try {
      const now = ctx.currentTime;
      const duration = 0.05;

      const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Exponential decay envelope → the characteristic "tick" shape.
        const t = i / bufferSize;
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 3);
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 2400;
      filter.Q.value = 0.9;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.55, now + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start(now);
      source.stop(now + duration + 0.02);
      return true;
    } catch {
      return false;
    }
  }

  playAudio(url: string) {
    if (typeof window === "undefined") return;

    let audio = this.audioCache.get(url);

    if (!audio) {
      audio = new Audio(url);
      audio.preload = "auto";
      audio.crossOrigin = "anonymous";
      this.audioCache.set(url, audio);
    }

    audio.currentTime = 0;
    audio.play().catch((err) => {
      console.warn(`Audio play failed for ${url}:`, err);
    });
  }

  playClick() {
    if (typeof window === "undefined") return;
    if (this.playSynthClick()) return;
    this.playAudio(REMOTE_CLICK_URL);
  }
}

const soundManager = new SoundManager();

export default soundManager;
