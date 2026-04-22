/**
 * Runtime loader + sampler for the pre-baked "motion timelines" produced by
 * `scripts/analyze-music.mjs`.
 *
 * Each mp3 under `public/music/*.mp3` has a sibling JSON under
 * `public/music/motion/<track>.json` containing per-frame band energies
 * (sub / bass / mid / high) sampled at ~60fps. The immersion sphere
 * consumes these via {@link sampleMotion} so beat drops land on the
 * exact sample they were baked for rather than whatever the live FFT
 * happens to report on any given frame.
 */
export interface MotionData {
  version: number;
  fps: number;
  duration: number;
  frameCount: number;
  sub: number[];
  bass: number[];
  mid: number[];
  high: number[];
}

type CacheEntry = MotionData | null | Promise<MotionData | null>;

const cache = new Map<string, CacheEntry>();

/**
 * Returns the motion data URL for a given track source, or an empty
 * string if the path doesn't match the expected `/music/<name>.mp3` shape.
 */
export function motionUrlForTrack(trackSrc: string): string {
  const m = trackSrc.match(/\/music\/([^/]+)\.(?:mp3|wav|ogg)(?:$|\?)/);
  if (!m) return "";
  return `/music/motion/${m[1]}.json`;
}

/**
 * Synchronous lookup. Returns the cached MotionData if it has already
 * finished loading, otherwise null. Never triggers a fetch.
 */
export function getMotionData(url: string): MotionData | null {
  const entry = cache.get(url);
  if (!entry) return null;
  if (entry instanceof Promise) return null;
  return entry;
}

/**
 * Kick off (or join) a load of the motion JSON at `url`. Safe to call
 * repeatedly — subsequent calls return the same in-flight promise or the
 * cached result. Failures are cached as null so we stop retrying.
 */
export function loadMotionData(url: string): Promise<MotionData | null> {
  if (!url) return Promise.resolve(null);
  const entry = cache.get(url);
  if (entry instanceof Promise) return entry;
  if (entry !== undefined) return Promise.resolve(entry);
  const p = fetch(url)
    .then(async (r) => {
      if (!r.ok) {
        cache.set(url, null);
        return null;
      }
      const data = (await r.json()) as MotionData;
      cache.set(url, data);
      return data;
    })
    .catch(() => {
      cache.set(url, null);
      return null;
    });
  cache.set(url, p);
  return p;
}

/**
 * Linear-interpolated lookup into a per-frame band array. Out-of-range
 * times clamp to the nearest end-point so the sphere doesn't spasm at
 * the start/end of a song.
 */
function sampleBand(arr: number[], frame: number): number {
  if (arr.length === 0) return 0;
  if (frame <= 0) return arr[0];
  const maxIdx = arr.length - 1;
  if (frame >= maxIdx) return arr[maxIdx];
  const i = Math.floor(frame);
  const f = frame - i;
  return arr[i] * (1 - f) + arr[i + 1] * f;
}

export interface MotionSample {
  sub: number;
  bass: number;
  mid: number;
  high: number;
}

/**
 * Read the motion timeline at a given playback time (seconds).
 * Returns all-zeros when the timeline is missing or empty.
 */
export function sampleMotion(motion: MotionData, time: number): MotionSample {
  const frame = time * motion.fps;
  return {
    sub: sampleBand(motion.sub, frame),
    bass: sampleBand(motion.bass, frame),
    mid: sampleBand(motion.mid, frame),
    high: sampleBand(motion.high, frame),
  };
}
