#!/usr/bin/env node
/**
 * Offline music deconstruction for the immersion sphere.
 *
 * Decodes each mp3 under `public/music/*.mp3` with ffmpeg (44.1 kHz mono
 * f32 PCM), runs a short-time FFT, and emits a per-track "motion timeline"
 * JSON under `public/music/motion/<track>.json` containing band energies
 * (sub / bass / mid / high) sampled at 60 fps.
 *
 * These timelines are loaded by the browser at runtime and fed into the
 * particle sphere so its motion is locked to the actual song rather than
 * whatever the live analyser happens to report at any given frame. Beat
 * drops therefore land on the exact sample they were baked for.
 *
 * Regenerate with:
 *   npm run analyze:music
 *
 * Requires `ffmpeg` on PATH (already pre-installed on most macs via Homebrew).
 */
import { spawn } from "node:child_process";
import { writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const MUSIC_DIR = resolve(ROOT, "public/music");
const OUT_DIR = resolve(MUSIC_DIR, "motion");
const TRACKS = ["a", "b", "c", "d", "e"];

const SAMPLE_RATE = 44100;
const FFT_SIZE = 2048;
// 735 samples/hop at 44.1 kHz = exactly 60 fps — high enough resolution
// for the sphere to react on every beat, and cheap to interpolate at
// whatever rate the browser is repainting.
const HOP_SIZE = 735;
const FPS = SAMPLE_RATE / HOP_SIZE;

// Frequency bands (Hz). Tuned to the live runtime analyser in
// `lib/audio-analysis.ts` so the offline data and the live fallback behave
// the same way.
const BANDS = {
  sub: [20, 90],
  bass: [60, 260],
  mid: [260, 2200],
  high: [3800, 12000],
};

function hzToBin(hz) {
  return Math.max(
    0,
    Math.min(FFT_SIZE / 2 - 1, Math.round((hz * FFT_SIZE) / SAMPLE_RATE)),
  );
}

/**
 * Decode an mp3 to an interleaved mono Float32 PCM buffer via ffmpeg.
 * Returns a Float32Array at `SAMPLE_RATE`.
 */
function decodePcm(path) {
  return new Promise((resolvePromise, reject) => {
    const args = [
      "-loglevel",
      "error",
      "-i",
      path,
      "-f",
      "f32le",
      "-ac",
      "1",
      "-ar",
      String(SAMPLE_RATE),
      "-",
    ];
    const ff = spawn("ffmpeg", args);
    const chunks = [];
    let byteLen = 0;
    ff.stdout.on("data", (c) => {
      chunks.push(c);
      byteLen += c.length;
    });
    ff.stderr.on("data", () => {});
    ff.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`ffmpeg exited ${code} for ${path}`));
        return;
      }
      const buf = Buffer.concat(chunks, byteLen);
      // Copy into a properly-aligned ArrayBuffer so Float32Array is happy.
      const ab = new ArrayBuffer(byteLen);
      new Uint8Array(ab).set(buf);
      const samples = new Float32Array(ab);
      resolvePromise(samples);
    });
    ff.on("error", reject);
  });
}

/**
 * Iterative in-place radix-2 Cooley-Tukey FFT. `real` / `imag` must be
 * Float64Array of the same power-of-two length.
 */
function fft(real, imag) {
  const n = real.length;
  let j = 0;
  for (let i = 1; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) {
      j ^= bit;
    }
    j ^= bit;
    if (i < j) {
      const tr = real[i];
      real[i] = real[j];
      real[j] = tr;
      const ti = imag[i];
      imag[i] = imag[j];
      imag[j] = ti;
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wlenR = Math.cos(ang);
    const wlenI = Math.sin(ang);
    const half = len >> 1;
    for (let i = 0; i < n; i += len) {
      let wR = 1;
      let wI = 0;
      for (let k = 0; k < half; k++) {
        const uR = real[i + k];
        const uI = imag[i + k];
        const xR = real[i + k + half];
        const xI = imag[i + k + half];
        const vR = xR * wR - xI * wI;
        const vI = xR * wI + xI * wR;
        real[i + k] = uR + vR;
        imag[i + k] = uI + vI;
        real[i + k + half] = uR - vR;
        imag[i + k + half] = uI - vI;
        const nwR = wR * wlenR - wI * wlenI;
        const nwI = wR * wlenI + wI * wlenR;
        wR = nwR;
        wI = nwI;
      }
    }
  }
}

function hann(n) {
  const w = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    w[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (n - 1));
  }
  return w;
}

/**
 * Per-band percentile scaler. We normalise by the 99th percentile rather
 * than the absolute max so a single DC spike or mastering click doesn't
 * squash the whole song to tiny values — the loudest hits in the song
 * will then sit near 1.0 in the output.
 */
function normalise(arr) {
  const sorted = Array.from(arr).sort((a, b) => a - b);
  const p99 = sorted[Math.floor(sorted.length * 0.99)] || 0;
  const scale = p99 > 0 ? 1 / p99 : 0;
  for (let i = 0; i < arr.length; i++) {
    const v = arr[i] * scale;
    arr[i] = v > 1 ? 1 : v;
  }
}

async function analyze(track) {
  const mp3Path = resolve(MUSIC_DIR, `${track}.mp3`);
  process.stdout.write(`[music-motion] decoding ${mp3Path} … `);
  const t0 = Date.now();
  const samples = await decodePcm(mp3Path);
  const duration = samples.length / SAMPLE_RATE;
  process.stdout.write(`${duration.toFixed(1)}s (${(Date.now() - t0)}ms)\n`);

  const totalFrames = Math.max(
    0,
    Math.floor((samples.length - FFT_SIZE) / HOP_SIZE) + 1,
  );
  const win = hann(FFT_SIZE);
  const real = new Float64Array(FFT_SIZE);
  const imag = new Float64Array(FFT_SIZE);

  const band = {
    sub: { lo: hzToBin(BANDS.sub[0]), hi: hzToBin(BANDS.sub[1]) },
    bass: { lo: hzToBin(BANDS.bass[0]), hi: hzToBin(BANDS.bass[1]) },
    mid: { lo: hzToBin(BANDS.mid[0]), hi: hzToBin(BANDS.mid[1]) },
    high: { lo: hzToBin(BANDS.high[0]), hi: hzToBin(BANDS.high[1]) },
  };

  const bands = {
    sub: new Float32Array(totalFrames),
    bass: new Float32Array(totalFrames),
    mid: new Float32Array(totalFrames),
    high: new Float32Array(totalFrames),
  };

  const keys = /** @type {(keyof typeof bands)[]} */ (["sub", "bass", "mid", "high"]);
  const tStart = Date.now();
  for (let f = 0; f < totalFrames; f++) {
    const off = f * HOP_SIZE;
    for (let i = 0; i < FFT_SIZE; i++) {
      real[i] = samples[off + i] * win[i];
      imag[i] = 0;
    }
    fft(real, imag);
    for (const k of keys) {
      const { lo, hi } = band[k];
      let s = 0;
      let c = 0;
      for (let i = lo; i <= hi; i++) {
        const mag = Math.sqrt(real[i] * real[i] + imag[i] * imag[i]);
        s += mag;
        c++;
      }
      bands[k][f] = c > 0 ? s / c : 0;
    }
  }
  process.stdout.write(
    `[music-motion] ${track}: ${totalFrames} frames in ${
      Date.now() - tStart
    }ms\n`,
  );

  // Temporal smoothing to match the live AnalyserNode's
  // `smoothingTimeConstant = 0.78`. Applied before percentile scaling so
  // baselines are computed against the same signal visuals see at runtime.
  const smooth = 0.78;
  for (const k of keys) {
    const a = bands[k];
    let prev = a[0] ?? 0;
    for (let i = 0; i < a.length; i++) {
      prev = prev * smooth + a[i] * (1 - smooth);
      a[i] = prev;
    }
  }

  for (const k of keys) normalise(bands[k]);

  // Round to 3 decimals to keep JSON small but preserve beat-drop shape.
  const round = (v) => Math.round(v * 1000) / 1000;
  return {
    version: 1,
    fps: FPS,
    duration,
    frameCount: totalFrames,
    sub: Array.from(bands.sub, round),
    bass: Array.from(bands.bass, round),
    mid: Array.from(bands.mid, round),
    high: Array.from(bands.high, round),
  };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  for (const t of TRACKS) {
    const data = await analyze(t);
    const outPath = resolve(OUT_DIR, `${t}.json`);
    await writeFile(outPath, JSON.stringify(data));
    process.stdout.write(`[music-motion] wrote ${outPath}\n`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
