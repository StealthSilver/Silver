/**
 * Audio "deconstruction" for the immersion experience.
 *
 * There are two data sources:
 *
 *   1. The **live AnalyserNode** created in `ImmersiveModeContext`. Cheap
 *      but noisy and browser-dependent — kept around as a fallback when
 *      pre-baked motion is unavailable.
 *   2. **Pre-baked motion timelines** produced offline by
 *      `scripts/analyze-music.mjs`. Each of the five immersion tracks is
 *      decoded, FFT'd and band-summed into per-frame sub/bass/mid/high
 *      energies at ~60fps; at runtime we sample the timeline by the
 *      audio element's `currentTime` so beat drops land on the exact
 *      sample they were baked for. This is what drives the sphere in
 *      production — see {@link analyseMotionFrame}.
 *
 * In both cases the raw band values are fed through the same transient /
 * beat-drop detector so the downstream visuals don't need to know which
 * source is active.
 *
 * Everything here is pure + synchronous so it can run safely inside a
 * `useFrame` callback without allocating.
 *
 * Band layout (assumes default sampleRate ≈ 44.1 kHz and fftSize = 1024, so
 * each bin ≈ 43 Hz):
 *   - sub  : bins 1-4    (~43-170 Hz)   — sub bass, kick fundamental
 *   - bass : bins 1-10   (~43-430 Hz)   — kick, bass guitar
 *   - mid  : bins 12-70  (~520-3000 Hz) — vocals, guitar body
 *   - high : bins 80-220 (~3.4-9.5 kHz) — cymbals, hi-hats, air
 */

/** Mutable per-sphere state that carries running averages between frames. */
export interface AudioBandState {
  /**
   * Reused scratch buffer for `getByteFrequencyData`. Explicitly typed as
   * `Uint8Array<ArrayBuffer>` (not `ArrayBufferLike`) so recent TS lib typings
   * accept it directly as the Web Audio API argument.
   */
  freqBuffer: Uint8Array<ArrayBuffer>;
  subAvg: number;
  bassAvg: number;
  midAvg: number;
  highAvg: number;
  pulseLow: number;
  pulseHigh: number;
  /** Dedicated beat-drop pulse — spikes on simultaneous low+high transients. */
  beat: number;
  /** Running peak of `beat` so visuals can normalize their response. */
  beatPeak: number;
  /** Smoothed overall energy for gentle ambient behaviour. */
  energy: number;
}

/** Create a fresh analysis buffer + baselines. Call once per consumer. */
export function createAudioBandState(): AudioBandState {
  return {
    freqBuffer: new Uint8Array(new ArrayBuffer(512)),
    subAvg: 0.1,
    bassAvg: 0.1,
    midAvg: 0.1,
    highAvg: 0.1,
    pulseLow: 0,
    pulseHigh: 0,
    beat: 0,
    beatPeak: 0.25,
    energy: 0,
  };
}

/** Normalised per-frame energy reading. All values in 0..~3 range. */
export interface AudioEnergy {
  /** Average sub-bass energy this frame (0..1). */
  sub: number;
  /** Average bass energy this frame (0..1). */
  bass: number;
  /** Average mid energy this frame (0..1). */
  mid: number;
  /** Average treble energy this frame (0..1). */
  high: number;
  /** Bass transient — spikes above the running baseline, decays over time. */
  pulseLow: number;
  /** Treble transient — sizzle on cymbals / hi-hats. */
  pulseHigh: number;
  /**
   * Combined beat-drop signal. Normalised against a running peak so the
   * biggest hit in the song sits near 1.0 — ideal for driving scale / flash
   * multipliers that need a predictable ceiling.
   */
  beat: number;
  /** Smoothed overall energy (0..1). */
  energy: number;
}

/**
 * Pull a single frame from the analyser, mutate the running state, and return
 * normalised energy values ready to drive visuals. If `analyser` is null we
 * just decay the existing pulse state so things glide to rest.
 */
export function analyseFrame(
  analyser: AnalyserNode | null,
  state: AudioBandState,
): AudioEnergy {
  if (!analyser) {
    return decayToRest(state);
  }

  const buf = state.freqBuffer;
  const n = Math.min(buf.length, analyser.frequencyBinCount);
  analyser.getByteFrequencyData(buf);

  // --- Band averages ----------------------------------------------------
  // Sub-bass (kick drum fundamental) — small, weighted heavily.
  let subSum = 0;
  let subCount = 0;
  const subEnd = Math.min(5, n);
  for (let i = 1; i < subEnd; i++) {
    subSum += buf[i];
    subCount++;
  }
  const sub = subCount > 0 ? subSum / subCount / 255 : 0;

  let bSum = 0;
  let bCount = 0;
  const bEnd = Math.min(10, n);
  for (let i = 1; i < bEnd; i++) {
    bSum += buf[i];
    bCount++;
  }
  const bass = bCount > 0 ? bSum / bCount / 255 : 0;

  let mSum = 0;
  let mCount = 0;
  const mEnd = Math.min(70, n);
  for (let i = 12; i < mEnd; i++) {
    mSum += buf[i];
    mCount++;
  }
  const mid = mCount > 0 ? mSum / mCount / 255 : 0;

  let hSum = 0;
  let hCount = 0;
  const hEnd = Math.min(220, n);
  for (let i = 80; i < hEnd; i++) {
    hSum += buf[i];
    hCount++;
  }
  const high = hCount > 0 ? hSum / hCount / 255 : 0;

  return deriveEnergy(sub, bass, mid, high, state);
}

/**
 * Shared transient / pulse / beat pipeline. Factored out so both the live
 * FFT path and the offline-motion path produce identically-shaped output.
 */
function deriveEnergy(
  sub: number,
  bass: number,
  mid: number,
  high: number,
  state: AudioBandState,
): AudioEnergy {
  // Slow-moving baselines → anything above them is a transient. Slightly
  // faster baseline update (0.88/0.12) makes drops register bigger against
  // the average before it catches up.
  state.subAvg = state.subAvg * 0.9 + sub * 0.1;
  state.bassAvg = state.bassAvg * 0.9 + bass * 0.1;
  state.midAvg = state.midAvg * 0.9 + mid * 0.1;
  state.highAvg = state.highAvg * 0.9 + high * 0.1;

  // Low threshold multipliers — we want even small transients to register so
  // softer kicks aren't missed. The gain after subtraction is what controls
  // the overall snap, not the detection threshold.
  const transientSub = Math.max(0, sub - state.subAvg * 1.02);
  const transientLow = Math.max(0, bass - state.bassAvg * 1.02);
  const transientHigh = Math.max(0, high - state.highAvg * 1.06);

  // Persistent pulse with exponential decay — each hit punches hard and
  // then relaxes so the sphere is snappy / percussive between beats.
  const lowGain = 5.2;
  const highGain = 4.6;
  state.pulseLow = Math.max(
    state.pulseLow * 0.82,
    (transientLow + transientSub * 0.6) * lowGain,
  );
  state.pulseHigh = Math.max(state.pulseHigh * 0.78, transientHigh * highGain);

  // Beat-drop detection: a simultaneous low + high hit (kick + crash) gets
  // weighted higher than either alone, so actual drops in the music drive
  // the biggest visual response. The `beatPeak` slow-tracks the running
  // maximum so `beat` is naturally normalised to ~1.0 on the loudest hit.
  const rawBeat =
    transientLow * 6.0 +
    transientSub * 4.0 +
    transientHigh * 2.0 +
    transientLow * transientHigh * 12.0;
  state.beat = Math.max(state.beat * 0.78, rawBeat);
  if (state.beat > state.beatPeak) {
    state.beatPeak = state.beat;
  } else {
    state.beatPeak = Math.max(0.25, state.beatPeak * 0.9995);
  }
  const beatNorm = state.beat / state.beatPeak;

  const rawEnergy = bass * 0.5 + mid * 0.25 + high * 0.25;
  state.energy = state.energy * 0.85 + rawEnergy * 0.15;

  return {
    sub,
    bass,
    mid,
    high,
    pulseLow: state.pulseLow,
    pulseHigh: state.pulseHigh,
    beat: beatNorm,
    energy: state.energy,
  };
}

/**
 * Decay the running pulses smoothly back to zero. Shared by the null-
 * analyser branch and the paused-playback branch so the sphere always
 * eases to rest the same way.
 */
function decayToRest(state: AudioBandState): AudioEnergy {
  state.pulseLow *= 0.88;
  state.pulseHigh *= 0.82;
  state.beat *= 0.85;
  state.energy *= 0.9;
  return {
    sub: 0,
    bass: 0,
    mid: 0,
    high: 0,
    pulseLow: state.pulseLow,
    pulseHigh: state.pulseHigh,
    beat: state.beat,
    energy: state.energy,
  };
}

/**
 * Motion-timeline path. Reads pre-baked band energies at the given
 * playback time and feeds them through the same transient/beat pipeline
 * as the live analyser. When `playing` is false (the user paused the
 * track) or `motion` is missing we smoothly decay the running pulses so
 * the sphere eases back to a gentle resting state instead of freezing
 * mid-hit.
 */
export function analyseMotionFrame(
  motion: {
    fps: number;
    sub: number[];
    bass: number[];
    mid: number[];
    high: number[];
  } | null,
  currentTime: number,
  playing: boolean,
  state: AudioBandState,
): AudioEnergy {
  if (!motion || !playing) {
    return decayToRest(state);
  }

  const frame = currentTime * motion.fps;
  const maxIdx = motion.sub.length - 1;
  if (maxIdx < 0) {
    return decayToRest(state);
  }
  const clamped = Math.max(0, Math.min(maxIdx, frame));
  const i = Math.floor(clamped);
  const f = clamped - i;
  const j = Math.min(maxIdx, i + 1);
  const sub = motion.sub[i] * (1 - f) + motion.sub[j] * f;
  const bass = motion.bass[i] * (1 - f) + motion.bass[j] * f;
  const mid = motion.mid[i] * (1 - f) + motion.mid[j] * f;
  const high = motion.high[i] * (1 - f) + motion.high[j] * f;

  return deriveEnergy(sub, bass, mid, high, state);
}
