import * as THREE from "three";

/** Total scripted intro length (seconds). */
export const INTRO_DURATION = 10;

/** Energy core dominates. */
export const PHASE_CORE_END = 3;

/** Galaxy formation / crossfade. */
export const PHASE_GALAXY_END = 7;

/** Deep space + fog (dark blue, not pure black). */
export const COLORS = {
  void: new THREE.Color("#030711"),
  fog: new THREE.Color("#060d1a"),
  /** Galaxy / expansion read (dark blue ramp, still visible on void). */
  explosionInner: new THREE.Color("#2d4d72"),
  explosionMid: new THREE.Color("#1a3550"),
  explosionOuter: new THREE.Color("#0a1524"),
  /** Legacy keys used by imports — map to blue ramp. */
  purple: new THREE.Color("#1e3a5a"),
  blue: new THREE.Color("#0f1f35"),
  white: new THREE.Color("#8fa8c4"),
} as const;

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
