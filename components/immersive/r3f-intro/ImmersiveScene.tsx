"use client";

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
  Vignette,
} from "@react-three/postprocessing";
import { Text } from "@react-three/drei";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { X, ExternalLink, Github, Figma } from "lucide-react";
import Image from "next/image";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import * as THREE from "three";
import { PROJECTS, type Project } from "@/data/project.data";
import {
  IMMERSIVE_TRACKS,
  useImmersiveMode,
} from "@/contexts/ImmersiveModeContext";
import {
  analyseFrame,
  analyseMotionFrame,
  createAudioBandState,
  type AudioBandState,
} from "@/lib/audio-analysis";
import {
  getMotionData,
  loadMotionData,
  motionUrlForTrack,
  type MotionData,
} from "@/lib/music-motion";
/* ========================================================================== */
/*  CONSTANTS                                                                 */
/* ========================================================================== */

// Horizontal page row
// Pages sit in a single line; scroll translates the row from right-to-left.
const PAGE_W = 5.2;                    // landscape 4:3 cards — wider than tall
const PAGE_H = 3.9;
const HSPACE = 6.4;                    // horizontal gap between pages (center-to-center)
const PAGE_ROW_Y = 0.75;               // lifted slightly above center for better visual balance
const TOTAL_WIDTH = (PROJECTS.length - 1) * HSPACE;

// Dark-theme tile palette — matches the site's cards (black card on a faint
// silver-grey line). Colours are picked to read well under additive bloom.
const TILE_BG_COLOR = "#050507";
const TILE_BORDER_COLOR = "#9ea3b4";
const TILE_BORDER_THICKNESS = 0.018;   // 3D thickness of the silver border
const TILE_CORNER_SIZE = 0.115;        // side length of the small corner squares
const TILE_TITLE_COLOR = "#e4e6ef";

// Fixed camera — DO NOT MOVE
const CAMERA_POS = new THREE.Vector3(0, 0, 8);
const CAMERA_LOOK = new THREE.Vector3(0, 0, 0);

// Timeline (seconds). Pages start chaotic at t=0 and settle into the row.
const FORMATION_START = 0.15;
const FORMATION_END = 4.0;
const INTERACTIVE_T = 4.4;

// Particle counts
const SPARK_COUNT = 140;

// Assets
const GEIST_MONO_FONT_URL = "/fonts/GeistMono-Regular.ttf";

/* ========================================================================== */
/*  HELPERS                                                                   */
/* ========================================================================== */

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

/* ========================================================================== */
/*  PROCEDURAL TEXTURES                                                       */
/* ========================================================================== */

function makeRadialTexture(
  size: number,
  stops: Array<[number, string]>,
): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const half = size / 2;
  const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
  for (const [offset, color] of stops) grad.addColorStop(offset, color);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/* ========================================================================== */
/*  GRADIENT SKY                                                              */
/* ========================================================================== */

function GradientSky({
  exposureRef,
}: {
  exposureRef: React.MutableRefObject<number>;
}) {
  const matRef = useRef<THREE.ShaderMaterial | null>(null);
  const mat = useMemo(() => {
    const m = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uCenter: { value: new THREE.Color("#0b1a3a") },
        uMid: { value: new THREE.Color("#020617") },
        uEdge: { value: new THREE.Color("#000000") },
        uExposure: { value: 0 },
      },
      vertexShader: /* glsl */ `
        varying vec3 vPos;
        void main() {
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vPos;
        uniform vec3 uCenter;
        uniform vec3 uMid;
        uniform vec3 uEdge;
        uniform float uExposure;
        void main() {
          float t = clamp(vPos.y / 55.0 + 0.5, 0.0, 1.0);
          vec3 col = mix(uEdge, uMid, smoothstep(0.0, 0.45, t));
          col = mix(col, uCenter, smoothstep(0.45, 0.9, t));
          float r = length(vPos) / 60.0;
          col *= mix(1.0, 0.65, smoothstep(0.6, 1.1, r));
          gl_FragColor = vec4(col * uExposure, 1.0);
        }
      `,
    });
    matRef.current = m;
    return m;
  }, []);
  useFrame(() => {
    if (matRef.current) {
      matRef.current.uniforms.uExposure.value = exposureRef.current;
    }
  });
  return (
    <mesh renderOrder={-10}>
      <sphereGeometry args={[60, 24, 24]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

/* ========================================================================== */
/*  MUSIC-SYNC PARTICLE SPHERE                                                */
/* ========================================================================== */

/**
 * Soft silvery radial sprite — echoes the ring cursor that appears over the
 * SILVER wordmark on the hero. Particles read as glowing polished metal.
 */
function makeEmberTexture(): THREE.Texture {
  return makeRadialTexture(128, [
    [0.0, "rgba(255,255,255,1)"],
    [0.22, "rgba(236,238,244,0.95)"],
    [0.5, "rgba(196,200,212,0.55)"],
    [0.78, "rgba(120,124,138,0.18)"],
    [1.0, "rgba(0,0,0,0)"],
  ]);
}

type AnalyserGetter = () => AnalyserNode | null;
type AudioGetter = () => HTMLAudioElement | null;
type MotionGetter = () => MotionData | null;

// Sphere geometry: slightly smaller sphere pushed further down so only its
// upper dome peeks over the bottom edge of the viewport — reads like a
// rising silver moon reacting to the music.
// Camera is at z=8 with a 50° vertical FOV, so visible half-height at z=0 is
// 8 * tan(25°) ≈ 3.73. Centering the sphere at y = -4.15 with radius 2.45
// leaves a smaller, lower "cap" on screen.
const SPHERE_RADIUS = 2.45;
const SPHERE_CENTER_Y = -4.15;
// Particle count is a heavy driver of per-frame cost; the GPU can chew
// through this many points, but 4200 is the smallest count at which the
// sphere still reads as a continuous shimmering shell instead of discrete
// dots — a sweet spot for quality vs. cost.
const SPHERE_PARTICLE_COUNT = 4200;

/**
 * Silvery particle sphere that sits half-below the viewport. Reacts in
 * multiple channels to the music, each channel sourced in priority order:
 *
 *   1. **Pre-baked motion timeline** for the current track (primary). The
 *      offline analyser (`scripts/analyze-music.mjs`) has already decoded
 *      the mp3, run an FFT and stored per-frame band energies, so the
 *      sphere reacts on the *exact* sample where each beat drop lands
 *      rather than whatever the live analyser guesses this frame. We
 *      sample the timeline by the audio element's `currentTime`.
 *   2. **Live AnalyserNode** (fallback). Only used if the motion JSON
 *      failed to load.
 *   3. **Silent decay** when the user pauses the track — pulses ease back
 *      to zero so the sphere smoothly comes to rest and resumes on play.
 *
 * Visual channels:
 *   - `pulseLow`  (kick / bass)  → radial outward punch + sphere scale-up
 *   - `pulseHigh` (hats / cymbal) → randomized jitter + brightness flare
 *   - `bass`                     → overall warm glow + ambient light
 *   - `mid` / `high`             → rotation speed + color drift toward hot
 *   - `beat` (combined drop)     → outsized slam on the loudest hits
 *
 * The per-particle animation runs entirely in a custom `ShaderMaterial` —
 * audio values + time are pushed as uniforms, and the vertex shader derives
 * per-particle position offsets, colour glow and point size. The CPU side
 * only updates a handful of uniforms per frame, so visual complexity
 * scales with the GPU rather than JavaScript.
 *
 * Stays hidden until `visibleRef` flips on (pages are horizontal) and fades
 * in smoothly.
 */
function MusicSphere({
  getAnalyser,
  getAudio,
  getMotion,
  visibleRef,
}: {
  getAnalyser: AnalyserGetter;
  getAudio: AudioGetter;
  getMotion: MotionGetter;
  visibleRef: React.MutableRefObject<boolean>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const rimLightRef = useRef<THREE.PointLight>(null);
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);

  const emberTex = useMemo(() => makeEmberTexture(), []);

  /**
   * Pre-compute all per-particle attribute buffers once. These never change
   * on the CPU — the vertex shader reads them straight from the GPU.
   */
  const buffers = useMemo(() => {
    const positions = new Float32Array(SPHERE_PARTICLE_COUNT * 3);
    const baseColors = new Float32Array(SPHERE_PARTICLE_COUNT * 3);
    const phases = new Float32Array(SPHERE_PARTICLE_COUNT);
    const responsiveness = new Float32Array(SPHERE_PARTICLE_COUNT);

    // Silver / polished-metal palette — pulled from the shimmer gradient used
    // on the SILVER wordmark (#a1a1aa → #f5f5f5 → #d4d4d8) and extended into
    // cooler shadow tones so the sphere reads as burnished metal.
    const palette: Array<[number, number, number]> = [
      [1.0, 1.0, 1.0],      // white-hot highlight
      [0.96, 0.97, 0.99],   // bright silver (matches #f5f5f5)
      [0.86, 0.88, 0.92],   // soft silver
      [0.74, 0.76, 0.82],   // mid silver (matches #d4d4d8 region)
      [0.61, 0.63, 0.70],   // steel
      [0.48, 0.50, 0.58],   // darker steel (matches #a1a1aa region)
      [0.33, 0.35, 0.42],   // shadow
      [0.19, 0.20, 0.25],   // deep shadow
    ];

    for (let i = 0; i < SPHERE_PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const nx = Math.sin(phi) * Math.cos(theta);
      const ny = Math.sin(phi) * Math.sin(theta);
      const nz = Math.cos(phi);
      positions[i * 3] = nx * SPHERE_RADIUS;
      positions[i * 3 + 1] = ny * SPHERE_RADIUS;
      positions[i * 3 + 2] = nz * SPHERE_RADIUS;

      // Bias palette with y-coordinate: top = white-hot highlight, bottom =
      // darker steel shadow, like a polished metal sphere lit from above.
      const warmBias = (ny + 1) / 2;
      const idxRaw =
        (1 - warmBias) * (palette.length - 1) + (Math.random() - 0.5) * 1.6;
      const idx = Math.max(0, Math.min(palette.length - 1, Math.round(idxRaw)));
      const c = palette[idx];
      baseColors[i * 3] = c[0];
      baseColors[i * 3 + 1] = c[1];
      baseColors[i * 3 + 2] = c[2];

      phases[i] = Math.random() * Math.PI * 2;
      responsiveness[i] = 0.6 + Math.random() * 0.9;
    }
    return { positions, baseColors, phases, responsiveness };
  }, []);

  /**
   * Custom shader material — all per-particle motion, glow and size lives
   * in the vertex shader. We only upload uniforms each frame (a handful of
   * floats) instead of re-uploading 4200 × 3 floats of positions + colours.
   */
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uBass: { value: 0 },
        uMid: { value: 0 },
        uHigh: { value: 0 },
        uPulseLow: { value: 0 },
        uPulseHigh: { value: 0 },
        uBeat: { value: 0 },
        uBaseSize: { value: 0.14 },
        uScale: { value: 600 },
        uOpacity: { value: 0 },
        uMap: { value: emberTex },
      },
      vertexShader: /* glsl */ `
        attribute vec3 aBaseColor;
        attribute float aPhase;
        attribute float aResponsiveness;

        uniform float uTime;
        uniform float uBass;
        uniform float uMid;
        uniform float uHigh;
        uniform float uPulseLow;
        uniform float uPulseHigh;
        uniform float uBeat;
        uniform float uBaseSize;
        uniform float uScale;

        varying vec3 vColor;

        // Stateless pseudo-random hash — gives each particle its own "grain"
        // without needing Math.random() on the CPU.
        float hash11(float n) { return fract(sin(n) * 43758.5453); }

        void main() {
          vec3 radial = normalize(position);

          // Bass transient → radial outward puff; beat-drops add a big
          // extra slam so the sphere audibly "explodes" outward on the
          // loudest hits. Gated so sub-threshold audio leaves the sphere
          // still (no jitter during whisper-quiet passages).
          float beatPush = uPulseLow > 0.04
            ? uPulseLow * 0.38 + uBeat * 0.28
            : uBeat * 0.12;
          // Coarse time quantisation so the hash "rerolls" a few times a
          // second — cheap stand-in for per-frame CPU randomness.
          float tStepLow = floor(uTime * 6.0);
          float randR = 0.5 + hash11(aPhase * 13.37 + tStepLow) * 0.7;
          float radialOffset = beatPush * randR * aResponsiveness;

          // High transient → small per-particle jitter; drops double down
          // with extra beat-driven scatter to sell the "hit".
          float jitterAmp = uPulseHigh > 0.05
            ? uPulseHigh * 0.14 + uBeat * 0.07
            : uBeat * 0.03;
          float tStepHi = floor(uTime * 30.0);
          vec3 jit = vec3(
            hash11(aPhase + 1.1 + tStepHi) - 0.5,
            hash11(aPhase + 2.3 + tStepHi) - 0.5,
            hash11(aPhase + 3.7 + tStepHi) - 0.5
          ) * jitterAmp * aResponsiveness;

          // Continuous shimmer — tiny radial breathing correlated with the
          // mid / high band, zero when audio is silent.
          float wig = sin(uTime * 4.2 + aPhase)
            * (uHigh * 0.05 + uMid * 0.02 + uBeat * 0.035);

          vec3 pos = position + radial * radialOffset + jit + position * wig;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          float glowBase = 0.7 + uBass * 1.1 + uPulseLow * 4.2
                         + uHigh * 0.5 + uPulseHigh * 2.2 + uBeat * 2.0;
          float flick = 0.88 + 0.12 * sin(uTime * 7.0 + aPhase * 2.7);
          float g = glowBase * flick;
          float hotLift = uPulseHigh * 0.32 + uHigh * 0.14;
          vec3 c = aBaseColor * g
                 + vec3(hotLift * 0.42, hotLift * 0.44, hotLift * 0.50);
          vColor = min(c, vec3(1.5));

          // Match PointsMaterial.sizeAttenuation:
          //   gl_PointSize = size * ( scale / -mvPosition.z )
          // where scale = renderTarget.height / 2 (in physical pixels).
          gl_PointSize = uBaseSize * uScale / -mvPosition.z;
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;
        uniform sampler2D uMap;
        uniform float uOpacity;
        void main() {
          vec4 tex = texture2D(uMap, gl_PointCoord);
          if (tex.a < 0.01) discard;
          gl_FragColor = vec4(vColor, 1.0) * tex * uOpacity;
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
  }, [emberTex]);

  // Persistent analysis state (running avgs + decaying pulses). Outlives
  // component re-renders via useRef so transitions read naturally.
  const audioStateRef = useRef<AudioBandState>(createAudioBandState());
  const opacityRef = useRef(0);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    // ---- visibility fade --------------------------------------------------
    const target = visibleRef.current ? 1 : 0;
    opacityRef.current = lerp(opacityRef.current, target, 0.05);
    const vis = opacityRef.current;
    group.visible = vis > 0.001;
    if (!group.visible) return;

    // ---- audio "deconstruction" ------------------------------------------
    // Primary source: pre-baked motion timeline for the current track,
    // sampled by `audio.currentTime` so the sphere is perfectly synced to
    // the music. Falls back to the live analyser if the motion JSON isn't
    // loaded, and decays to rest when the user pauses.
    const audio = getAudio();
    const motion = getMotion();
    const playing = !!audio && !audio.paused && !audio.ended;
    const energy =
      motion || !audio
        ? analyseMotionFrame(
            motion,
            audio?.currentTime ?? 0,
            playing && !!motion,
            audioStateRef.current,
          )
        : analyseFrame(playing ? getAnalyser() : null, audioStateRef.current);
    const { bass, mid, high, pulseLow, pulseHigh, beat } = energy;
    const hit = pulseLow + pulseHigh * 0.6;

    // ---- whole-sphere transforms -----------------------------------------
    // Beat drops slam the sphere outward; smaller hits still breathe
    // visibly but the real punch is reserved for the cross-band beat
    // signal (simultaneous kick + crash). Gentle idle breathing keeps
    // the shape alive even between hits.
    const idleBreath = 0.012 * Math.sin(state.clock.elapsedTime * 1.8);
    const targetScale =
      (0.90 +
        idleBreath +
        beat * 0.13 +
        pulseLow * 0.08 +
        pulseHigh * 0.035 +
        bass * 0.025) * vis;
    const curScale = group.scale.x || 0.001;
    const scaleLerp = targetScale > curScale ? 0.32 : 0.10;
    group.scale.setScalar(lerp(curScale, targetScale, scaleLerp));

    // Rotation is a mix of a steady drift (so the sphere always has gentle
    // life) and beat-driven spin that accelerates on drops.
    group.rotation.y +=
      delta * (0.06 + pulseLow * 0.65 + pulseHigh * 0.05 + beat * 0.45);
    group.rotation.x += delta * (0.02 + pulseHigh * 0.15 + beat * 0.16);
    group.rotation.z += delta * (pulseLow * 0.11 - pulseHigh * 0.05);

    // ---- push audio state to GPU -----------------------------------------
    const u = material.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uBass.value = bass;
    u.uMid.value = mid;
    u.uHigh.value = high;
    u.uPulseLow.value = pulseLow;
    u.uPulseHigh.value = pulseHigh;
    u.uBeat.value = beat;
    u.uBaseSize.value =
      0.12 + pulseLow * 0.04 + pulseHigh * 0.028 + bass * 0.015 + beat * 0.035;
    u.uOpacity.value = vis * (0.45 + pulseLow * 0.2 + beat * 0.18);
    // Match three.js' built-in point-size attenuation (render-height based).
    u.uScale.value = size.height * gl.getPixelRatio() * 0.5;

    if (lightRef.current) {
      lightRef.current.intensity =
        (0.45 + bass * 1.8 + pulseLow * 8.0 + hit * 2.2 + beat * 4.5) * vis;
    }
    if (rimLightRef.current) {
      rimLightRef.current.intensity =
        (0.2 + high * 1.2 + pulseHigh * 5.5 + beat * 3.0) * vis;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, SPHERE_CENTER_Y, 0]}
      visible={false}
      scale={0.001}
    >
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[buffers.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-aBaseColor"
            args={[buffers.baseColors, 3]}
          />
          <bufferAttribute
            attach="attributes-aPhase"
            args={[buffers.phases, 1]}
          />
          <bufferAttribute
            attach="attributes-aResponsiveness"
            args={[buffers.responsiveness, 1]}
          />
        </bufferGeometry>
        <primitive object={material} attach="material" />
      </points>
      {/* Cool silver core uplight — drives the bass glow onto pages above. */}
      <pointLight
        ref={lightRef}
        color="#e8ecf4"
        intensity={0}
        distance={14}
        decay={1.8}
        position={[0, 1.2, 0]}
      />
      {/* Bright silver rim light, slightly forward of center. */}
      <pointLight
        ref={rimLightRef}
        color="#ffffff"
        intensity={0}
        distance={10}
        decay={2}
        position={[0, 2.4, 1.5]}
      />
    </group>
  );
}

/* ========================================================================== */
/*  HORIZONTAL ROW MATH                                                       */
/* ========================================================================== */

type RowTarget = { x: number; y: number; z: number; rotY: number };

/**
 * Post-flight resting target for page `i`. Pages are laid out left-to-right
 * in order; each face is parallel to the camera. The containing group is
 * translated on X as the user scrolls, so every page eventually passes
 * through screen center right-to-left.
 */
function horizontalTarget(i: number): RowTarget {
  return { x: i * HSPACE, y: PAGE_ROW_Y, z: 0, rotY: 0 };
}

/* ========================================================================== */
/*  CHAOS TRAJECTORY                                                          */
/* ========================================================================== */

type Chaos = {
  ox: number; oy: number; oz: number;
  vx: number; vy: number; vz: number;
  rx: number; ry: number; rz: number;
  rvx: number; rvy: number; rvz: number;
};

function generateChaos(): Chaos {
  const dir = new THREE.Vector3(
    (Math.random() - 0.5) * 2,
    (Math.random() - 0.5) * 2,
    (Math.random() - 0.5) * 2,
  ).normalize();
  const speed = 2.8 + Math.random() * 3.4;
  return {
    ox: (Math.random() - 0.5) * 0.2,
    oy: (Math.random() - 0.5) * 0.25,
    oz: (Math.random() - 0.5) * 0.2,
    vx: dir.x * speed + (Math.random() - 0.5) * 1.0,
    vy: dir.y * speed + 0.6 + Math.random() * 1.2,
    vz: dir.z * speed + (Math.random() - 0.5) * 1.0,
    rx: Math.random() * Math.PI,
    ry: Math.random() * Math.PI,
    rz: Math.random() * Math.PI,
    rvx: (Math.random() - 0.5) * 6,
    rvy: (Math.random() - 0.5) * 6,
    rvz: (Math.random() - 0.5) * 6,
  };
}

/* ========================================================================== */
/*  PROJECT TILE                                                              */
/* ========================================================================== */

type TileRefs = {
  group: THREE.Group | null;
  /** All materials whose opacity should fade with the card frame. */
  frameMats: THREE.MeshBasicMaterial[];
  image: THREE.MeshBasicMaterial | null;
  titleGroup: THREE.Group | null;
  titleMat: THREE.MeshBasicMaterial | null;
};

/**
 * Dark-theme project tile. Mirrors the site's card pattern:
 * black interior, thin silver border, and four tiny corner squares at the
 * edges. Replaces the old aged-paper sheet with something that sits in the
 * same visual language as the rest of the site.
 */
function ProjectTile({
  project,
  texture,
  onHover,
  onPick,
  registerRefs,
}: {
  project: (typeof PROJECTS)[number];
  texture: THREE.Texture | null;
  onHover: (hovered: boolean) => void;
  onPick: () => void;
  registerRefs: (refs: TileRefs) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const titleGroup = useRef<THREE.Group>(null);
  const titleMat = useRef<THREE.MeshBasicMaterial>(null);
  const imgMat = useRef<THREE.MeshBasicMaterial>(null);
  const borderMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const bodyMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const cornerBorderMats = useRef<THREE.MeshBasicMaterial[]>([]);
  const cornerBodyMats = useRef<THREE.MeshBasicMaterial[]>([]);

  useEffect(() => {
    const frameMats = [
      borderMatRef.current,
      bodyMatRef.current,
      ...cornerBorderMats.current,
      ...cornerBodyMats.current,
    ].filter((m): m is THREE.MeshBasicMaterial => Boolean(m));
    registerRefs({
      group: groupRef.current,
      frameMats,
      image: imgMat.current,
      titleGroup: titleGroup.current,
      titleMat: titleMat.current,
    });
    // Force the whole project tile to render on top of every other 3D
    // element (sphere, flames, sparks, etc.) regardless of z-position —
    // the carousel should visually sit above everything else in the scene.
    const g = groupRef.current;
    if (g) {
      g.traverse((obj) => {
        obj.renderOrder = 100;
        const maybeMat = (obj as THREE.Mesh).material as
          | THREE.Material
          | THREE.Material[]
          | undefined;
        if (!maybeMat) return;
        const mats = Array.isArray(maybeMat) ? maybeMat : [maybeMat];
        for (const m of mats) {
          m.depthTest = false;
          m.depthWrite = false;
          m.needsUpdate = true;
        }
      });
    }
    return () =>
      registerRefs({
        group: null,
        frameMats: [],
        image: null,
        titleGroup: null,
        titleMat: null,
      });
  }, [registerRefs]);

  // Project image panel, lifted toward the top of the card — leaves room
  // for the title at the bottom, like the site's project list layout.
  const imgW = PAGE_W * 0.9;
  const imgH = PAGE_H * 0.66;
  const imgY = PAGE_H * 0.12;

  // 4 corner anchor points, offset slightly outside the card's perimeter so
  // the squares visually "punch through" the edges (same trick used in CSS).
  const cornerOffset = TILE_CORNER_SIZE * 0.35;
  const cornerPositions: Array<[number, number]> = [
    [-PAGE_W / 2 - cornerOffset, PAGE_H / 2 + cornerOffset], // top-left
    [PAGE_W / 2 + cornerOffset, PAGE_H / 2 + cornerOffset],  // top-right
    [-PAGE_W / 2 - cornerOffset, -PAGE_H / 2 - cornerOffset], // bottom-left
    [PAGE_W / 2 + cornerOffset, -PAGE_H / 2 - cornerOffset], // bottom-right
  ];
  const cornerBorderInset = TILE_CORNER_SIZE * 0.28;

  return (
    <group ref={groupRef} visible={false} scale={0.001}>
      {/* silver outer border — rendered as a full plane that peeks out
          around the dark body by a couple of millimetres. */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[PAGE_W, PAGE_H]} />
        <meshBasicMaterial
          ref={borderMatRef}
          color={TILE_BORDER_COLOR}
          transparent
          opacity={0}
          toneMapped={false}
        />
      </mesh>

      {/* dark card body */}
      <mesh position={[0, 0, 0.002]}>
        <planeGeometry
          args={[
            PAGE_W - TILE_BORDER_THICKNESS * 2,
            PAGE_H - TILE_BORDER_THICKNESS * 2,
          ]}
        />
        <meshBasicMaterial
          ref={bodyMatRef}
          color={TILE_BG_COLOR}
          transparent
          opacity={0}
          toneMapped={false}
        />
      </mesh>

      {/* corner squares (4) — silver frame with dark inner fill, placed so
          they straddle the edge of the card like the site's CSS variant. */}
      {cornerPositions.map(([cx, cy], i) => (
        <group key={`corner-${i}`} position={[cx, cy, 0.006]}>
          <mesh>
            <planeGeometry args={[TILE_CORNER_SIZE, TILE_CORNER_SIZE]} />
            <meshBasicMaterial
              ref={(m) => {
                if (m) cornerBorderMats.current[i] = m;
              }}
              color={TILE_BORDER_COLOR}
              transparent
              opacity={0}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0, 0, 0.001]}>
            <planeGeometry
              args={[
                TILE_CORNER_SIZE - cornerBorderInset,
                TILE_CORNER_SIZE - cornerBorderInset,
              ]}
            />
            <meshBasicMaterial
              ref={(m) => {
                if (m) cornerBodyMats.current[i] = m;
              }}
              color={TILE_BG_COLOR}
              transparent
              opacity={0}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {/* centered project image.
          Color is a touch below pure white so light-themed project images
          (white backgrounds) read at comfortable brightness against the
          dark scene, while dark images are barely affected. */}
      <mesh position={[0, imgY, 0.005]}>
        <planeGeometry args={[imgW, imgH]} />
        <meshBasicMaterial
          ref={imgMat}
          map={texture ?? undefined}
          color={texture ? "#d9d9d9" : "#2b2f38"}
          transparent
          opacity={0}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* title */}
      <group ref={titleGroup} position={[0, -PAGE_H * 0.38, 0.008]}>
        <Text
          fontSize={0.22}
          font={GEIST_MONO_FONT_URL}
          color={TILE_TITLE_COLOR}
          anchorX="center"
          anchorY="middle"
          maxWidth={PAGE_W - 0.45}
          textAlign="center"
          letterSpacing={0.14}
          outlineWidth={0}
        >
          {project.title.toUpperCase()}
          <meshBasicMaterial
            ref={titleMat}
            attach="material"
            color={TILE_TITLE_COLOR}
            transparent
            opacity={0}
            toneMapped={false}
            depthTest={false}
          />
        </Text>
      </group>

      {/* hit target */}
      <mesh
        position={[0, 0, 0.02]}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          onHover(true);
          if (typeof document !== "undefined") {
            document.body.classList.add("immersive-hover-tile");
          }
        }}
        onPointerOut={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          onHover(false);
          if (typeof document !== "undefined") {
            document.body.classList.remove("immersive-hover-tile");
          }
        }}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onPick();
        }}
      >
        <planeGeometry args={[PAGE_W, PAGE_H]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ========================================================================== */
/*  SCENE                                                                     */
/* ========================================================================== */

type ScreenRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

/**
 * Project the clicked tile's 3D bounding box into screen-space pixel
 * coordinates. The zoom-from-tile overlay uses this to start exactly where
 * the carousel card lives and then expand to fill the viewport.
 */
function computeTileScreenRect(
  group: THREE.Object3D,
  camera: THREE.Camera,
  sizeW: number,
  sizeH: number,
): ScreenRect {
  const worldPos = new THREE.Vector3();
  group.getWorldPosition(worldPos);
  // Use world scale so parent transforms (e.g. the carousel group scaling
  // down on mobile) are accounted for when projecting the tile corners.
  const worldScale = new THREE.Vector3();
  group.getWorldScale(worldScale);
  const halfW = (PAGE_W / 2) * worldScale.x;
  const halfH = (PAGE_H / 2) * worldScale.y;
  const corners: THREE.Vector3[] = [
    new THREE.Vector3(worldPos.x - halfW, worldPos.y + halfH, worldPos.z),
    new THREE.Vector3(worldPos.x + halfW, worldPos.y + halfH, worldPos.z),
    new THREE.Vector3(worldPos.x - halfW, worldPos.y - halfH, worldPos.z),
    new THREE.Vector3(worldPos.x + halfW, worldPos.y - halfH, worldPos.z),
  ];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const c of corners) {
    c.project(camera);
    const sx = (c.x * 0.5 + 0.5) * sizeW;
    const sy = (-c.y * 0.5 + 0.5) * sizeH;
    if (sx < minX) minX = sx;
    if (sy < minY) minY = sy;
    if (sx > maxX) maxX = sx;
    if (sy > maxY) maxY = sy;
  }
  return {
    left: minX,
    top: minY,
    width: Math.max(1, maxX - minX),
    height: Math.max(1, maxY - minY),
  };
}

function Scene({
  scrollTargetRef,
  pickedRef,
  setPicked,
  onInteractive,
}: {
  scrollTargetRef: React.MutableRefObject<number>;
  pickedRef: React.MutableRefObject<number | null>;
  setPicked: (idx: number | null, rect: ScreenRect | null) => void;
  onInteractive: (on: boolean) => void;
}) {
  const camera = useThree((s) => s.camera);
  const clock = useThree((s) => s.clock);
  const gl = useThree((s) => s.gl);
  const size = useThree((s) => s.size);

  const { getImmersiveAnalyser, getImmersiveAudio, immersiveTrackIndex } =
    useImmersiveMode();
  // MusicSphere follows the interactive flag (pages already horizontal).
  const sphereVisibleRef = useRef(false);

  // Motion data source. The ref is mutated whenever the track changes so
  // the useFrame closure always reads the current timeline without needing
  // to re-subscribe. We also prefetch the adjacent tracks so prev/next
  // switches are instant.
  const motionRef = useRef<MotionData | null>(null);
  useEffect(() => {
    const current = IMMERSIVE_TRACKS[immersiveTrackIndex];
    if (!current) return;
    const url = motionUrlForTrack(current);
    const cached = getMotionData(url);
    motionRef.current = cached;

    let cancelled = false;
    if (!cached) {
      void loadMotionData(url).then((data) => {
        if (cancelled) return;
        motionRef.current = data;
      });
    }

    // Warm the cache for neighbouring tracks so user-initiated prev/next
    // switches swap timelines with no fetch stall.
    const n = IMMERSIVE_TRACKS.length;
    const next = IMMERSIVE_TRACKS[(immersiveTrackIndex + 1) % n];
    const prev = IMMERSIVE_TRACKS[(immersiveTrackIndex - 1 + n) % n];
    if (next) void loadMotionData(motionUrlForTrack(next));
    if (prev) void loadMotionData(motionUrlForTrack(prev));

    return () => {
      cancelled = true;
    };
  }, [immersiveTrackIndex]);
  const getMotion = useCallback(() => motionRef.current, []);

  /* ---- refs ---- */
  const sparksRef = useRef<THREE.Points>(null);

  const spiralGroup = useRef<THREE.Group>(null);
  const tileRefs = useRef<TileRefs[]>(
    PROJECTS.map(() => ({
      group: null,
      frameMats: [],
      image: null,
      titleGroup: null,
      titleMat: null,
    })),
  );

  const hoveredRef = useRef(-1);

  const scrollSmoothRef = useRef(0);
  const startRef = useRef<number | null>(null);
  const interactiveRef = useRef(false);
  const skyExposureRef = useRef(0);

  /* ---- textures (memoized) ---- */
  // Silver spark for the initial burst — same cool palette as the sphere so
  // the opening transition reads as bright polished metal rather than embers.
  const sparkTex = useMemo(
    () =>
      makeRadialTexture(64, [
        [0, "rgba(255,255,255,1)"],
        [0.3, "rgba(220,225,236,0.9)"],
        [0.75, "rgba(150,155,170,0.22)"],
        [1, "rgba(0,0,0,0)"],
      ]),
    [],
  );

  /* ---- project image textures ---- */
  // Each successful load would previously trigger `setTextures([...loaded])`,
  // meaning the whole Scene tree re-rendered N times during startup. Batch
  // the updates: once a texture is ready, schedule a single flush on the
  // next frame that publishes whatever has arrived so far — far fewer
  // React reconciliations for the same visual result.
  const [textures, setTextures] = useState<(THREE.Texture | null)[]>(() =>
    PROJECTS.map(() => null),
  );
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const maxAniso = gl.capabilities.getMaxAnisotropy();
    let cancelled = false;
    const loaded: (THREE.Texture | null)[] = PROJECTS.map(() => null);
    let flushScheduled = false;
    const flush = () => {
      flushScheduled = false;
      if (cancelled) return;
      setTextures(loaded.slice());
    };
    PROJECTS.forEach((p, i) => {
      loader.load(
        p.image,
        (tex) => {
          if (cancelled) return;
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = maxAniso;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = true;
          tex.needsUpdate = true;
          loaded[i] = tex;
          if (!flushScheduled) {
            flushScheduled = true;
            requestAnimationFrame(flush);
          }
        },
        undefined,
        () => {
          // swallow — tile falls back to a dark placeholder colour
        },
      );
    });
    return () => {
      cancelled = true;
    };
  }, [gl]);

  /* ---- per-page chaos + targets ---- */
  const chaos = useMemo(() => PROJECTS.map(() => generateChaos()), []);
  const targets = useMemo(() => PROJECTS.map((_, i) => horizontalTarget(i)), []);

  /* ---- spark particles (silver / white, not embers) ---- */
  const sparkData = useMemo(() => {
    const positions = new Float32Array(SPARK_COUNT * 3);
    const velocities = new Float32Array(SPARK_COUNT * 3);
    const colors = new Float32Array(SPARK_COUNT * 3);
    const c = new THREE.Color();
    for (let i = 0; i < SPARK_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const sp = 2.0 + Math.random() * 3.8;
      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * sp;
      velocities[i * 3 + 1] = Math.cos(phi) * sp + 0.9;
      velocities[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * sp;
      const pick = Math.random();
      if (pick < 0.4) c.setRGB(1.0, 1.0, 1.0);          // bright highlight
      else if (pick < 0.8) c.setRGB(0.86, 0.88, 0.92);  // silver
      else c.setRGB(0.62, 0.64, 0.70);                  // steel
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, velocities, colors };
  }, []);

  /* ---- interactions ---- */
  const registerRefs = useMemo(
    () => (i: number) => (r: TileRefs) => {
      tileRefs.current[i] = r;
    },
    [],
  );
  const setHovered = useMemo(
    () => (i: number) => (h: boolean) => {
      if (h) hoveredRef.current = i;
      else if (hoveredRef.current === i) hoveredRef.current = -1;
    },
    [],
  );
  // `pick` is rebuilt whenever the camera / viewport size changes so the
  // screen-space rect we capture for the zoom overlay is always current.
  const pick = (index: number) => () => {
    if (!interactiveRef.current) return;
    if (pickedRef.current !== null) return;
    const refs = tileRefs.current[index];
    if (!refs?.group) {
      setPicked(index, null);
      return;
    }
    const rect = computeTileScreenRect(
      refs.group,
      camera,
      size.width,
      size.height,
    );
    setPicked(index, rect);
  };

  /* ========================= FRAME LOOP ========================= */

  useFrame((_state, _delta) => {
    if (startRef.current === null) startRef.current = clock.getElapsedTime();
    const t = Math.max(0, clock.getElapsedTime() - (startRef.current ?? 0));

    const formProg = smoothstep(FORMATION_START, FORMATION_END, t);

    // sky exposure ramps up smoothly as the scene comes to life
    skyExposureRef.current = clamp01(0.35 + smoothstep(0, FORMATION_END, t) * 0.6);

    /* ----- fixed camera (NEVER moves) ----- */
    camera.position.copy(CAMERA_POS);
    camera.lookAt(CAMERA_LOOK);

    /* ----- scroll smoothing -----
       Low lerp coefficient → the row drifts to its scroll target gradually
       rather than snapping, producing the slow left-hand translate that
       matches the page-is-a-carousel feel. */
    scrollSmoothRef.current = lerp(
      scrollSmoothRef.current,
      scrollTargetRef.current,
      0.04,
    );
    const scroll = scrollSmoothRef.current;

    /* ----- focus flag -----
       Picking a tile no longer runs a 3D zoom animation — the focused
       "page" is rendered as an HTML overlay above the canvas. We still
       freeze scroll while a tile is picked (handled in the wrapper's
       wheel / touch listeners) so the row doesn't drift behind the
       overlay. */
    const picked = pickedRef.current;

    /* ========================= SPARKS ========================= */
    // Short burst at the start, co-emitted with the pages taking flight.
    if (sparksRef.current) {
      const pts = sparksRef.current;
      const mat = pts.material as THREE.PointsMaterial;
      pts.visible = t < 2.5;
      if (pts.visible) {
        const dt = t;
        const posAttr = pts.geometry.getAttribute(
          "position",
        ) as THREE.BufferAttribute;
        const posArr = posAttr.array as Float32Array;
        // exponential damping (approximates per-frame `v *= 0.96`)
        const damping = Math.exp(-dt * 1.15);
        for (let i = 0; i < SPARK_COUNT; i++) {
          posArr[i * 3] = sparkData.velocities[i * 3] * dt * damping;
          posArr[i * 3 + 1] =
            sparkData.velocities[i * 3 + 1] * dt * damping - 0.3 * dt * dt;
          posArr[i * 3 + 2] = sparkData.velocities[i * 3 + 2] * dt * damping;
        }
        posAttr.needsUpdate = true;
        mat.opacity = clamp01(1.3 - dt * 0.85);
      }
    }

    /* ========================= HORIZONTAL ROW GROUP ========================= */
    // Only the parent group transforms. Scroll translates the row in -X so
    // pages drift from the right side of the screen to the left side.
    //
    // On narrow viewports the tiles (PAGE_W = 5.2 world units) are wider
    // than the visible frustum, so we shrink the whole row uniformly.
    // Scaling is stepped so it's predictable across breakpoints and
    // doesn't jitter on minor resize events.
    const sceneScale =
      size.width < 480 ? 0.5 : size.width < 768 ? 0.7 : size.width < 1024 ? 0.85 : 1;
    if (spiralGroup.current) {
      spiralGroup.current.rotation.y = 0;
      spiralGroup.current.scale.setScalar(sceneScale);
      if (interactiveRef.current) {
        // Multiply by sceneScale so the horizontal sweep covers the same
        // number of tiles regardless of breakpoint — pages still travel
        // from right to left at a consistent screen-space cadence.
        spiralGroup.current.position.x = -scroll * TOTAL_WIDTH * sceneScale;
        spiralGroup.current.position.y = 0;
      } else {
        spiralGroup.current.position.x = 0;
        spiralGroup.current.position.y = 0;
      }
    }

    const chaosT = t;
    // Once the row has locked into its horizontal layout the chaos math
    // resolves to its target every frame — we can skip the heavy
    // trig/exp/lerp work entirely and only touch per-tile state that still
    // changes (hover scale, picked visibility).
    const formationSettled = formProg >= 0.999;
    const morph = smoothstep(0, 0.75, formProg);
    const baseScale = lerp(0.18, 1.0, morph);
    const frameOp = lerp(0, 1, morph);
    const frameTransparent = frameOp < 1;

    for (let i = 0; i < PROJECTS.length; i++) {
      const refs = tileRefs.current[i];
      if (!refs?.group || !refs.image || refs.frameMats.length === 0) continue;

      // Hide the 3D tile while it's expanded into the zoom overlay so the
      // HTML panel reads as the tile itself morphing rather than a new
      // element stacked on top.
      refs.group.visible = picked !== i;

      const target = targets[i];

      if (formationSettled) {
        // Post-formation steady state — just lock the page to its target.
        refs.group.position.set(target.x, target.y, target.z);
        refs.group.rotation.set(0, target.rotY, 0);
      } else {
        const c = chaos[i];

        // flight trajectory
        const damp = Math.exp(-chaosT * 0.55);
        const cx = c.ox + c.vx * chaosT * damp;
        const cy = c.oy + c.vy * chaosT * damp - 0.5 * 1.0 * chaosT * chaosT;
        const cz = c.oz + c.vz * chaosT * damp;
        const rotBrake = Math.max(0, 1 - formProg * 1.2);
        const crx = c.rx + c.rvx * chaosT * rotBrake;
        const cry = c.ry + c.rvy * chaosT * rotBrake;
        const crz = c.rz + c.rvz * chaosT * rotBrake;

        // chaos -> stable horizontal-row target
        const px = lerp(cx, target.x, formProg);
        const py = lerp(cy, target.y, formProg);
        const pz = lerp(cz, target.z, formProg);
        const rx = lerp(crx, 0, formProg);
        const ry = lerp(cry, target.rotY, formProg);
        const rz = lerp(crz, 0, formProg);

        refs.group.position.set(px, py, pz);
        refs.group.rotation.set(rx, ry, rz);
      }

      // scale morphs through formation. Hover lifts the focused card a hair
      // so the tile signals interactivity — no extra zoom on pick because
      // the HTML overlay takes over the focus visual.
      const isHovered =
        interactiveRef.current &&
        hoveredRef.current === i &&
        picked === null;
      const hoverScale = isHovered ? 1.05 : 1;
      const targetScale = baseScale * hoverScale;
      const cur2 = refs.group.scale.x || 0.001;
      // Stop lerping once we're effectively at target — cheap bail-out that
      // avoids redundant Math.* calls every frame when the row is idle.
      if (Math.abs(cur2 - targetScale) > 0.0005) {
        refs.group.scale.setScalar(lerp(cur2, targetScale, 0.2));
      } else if (cur2 !== targetScale) {
        refs.group.scale.setScalar(targetScale);
      }

      // opacities — only write while they can still change. Once the
      // frame is fully opaque there's no point rewriting every frame.
      if (!formationSettled || refs.frameMats[0].opacity !== frameOp) {
        for (const fm of refs.frameMats) {
          fm.opacity = frameOp;
          fm.transparent = frameTransparent;
        }
        refs.image.opacity = morph;
        refs.image.transparent = morph < 1;
      }

      if (refs.titleGroup && refs.titleMat) {
        const titleVisible = morph > 0.35;
        if (refs.titleGroup.visible !== titleVisible) {
          refs.titleGroup.visible = titleVisible;
        }
        if (titleVisible && !formationSettled) {
          refs.titleMat.opacity = clamp01((morph - 0.35) / 0.55);
        } else if (formationSettled && refs.titleMat.opacity !== 1) {
          refs.titleMat.opacity = 1;
        }
      }
    }

    /* ----- interactive flag ----- */
    const shouldBeInteractive = t >= INTERACTIVE_T && formProg >= 0.98;
    if (shouldBeInteractive !== interactiveRef.current) {
      interactiveRef.current = shouldBeInteractive;
      onInteractive(shouldBeInteractive);
    }

    // Sphere is visible once pages are horizontal (formProg close to 1) —
    // we show it slightly before `interactiveRef` so it has time to fade in.
    sphereVisibleRef.current = formProg >= 0.85;
  });

  /* ========================= SCENE GRAPH ========================= */

  return (
    <>
      <GradientSky exposureRef={skyExposureRef} />
      <fogExp2 attach="fog" args={["#04061a", 0.035]} />

      {/* lighting rig */}
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[3, 3, 3]}
        intensity={1.15}
        color="#f4f0ff"
      />
      <directionalLight
        position={[-2.5, -1.5, 2]}
        intensity={0.3}
        color="#6b4adf"
      />
      <directionalLight
        position={[0, -4, 2]}
        intensity={0.35}
        color="#1e3a8a"
      />
      <pointLight
        position={[0, 1.5, 3]}
        color="#fef3c7"
        intensity={0.3}
        distance={8}
        decay={2}
      />

      {/* ---- sparks (single burst, velocity-damped) ---- */}
      <points ref={sparksRef} visible={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[sparkData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[sparkData.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.13}
          vertexColors
          map={sparkTex}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* ---- horizontal project row (only group translates on scroll) ---- */}
      <group ref={spiralGroup}>
        {PROJECTS.map((p, i) => (
          <ProjectTile
            key={p.id}
            project={p}
            texture={textures[i]}
            onHover={setHovered(i)}
            onPick={pick(i)}
            registerRefs={registerRefs(i)}
          />
        ))}
      </group>

      {/* ---- music-reactive silver sphere (appears once pages are horizontal) ---- */}
      <MusicSphere
        getAnalyser={getImmersiveAnalyser}
        getAudio={getImmersiveAudio}
        getMotion={getMotion}
        visibleRef={sphereVisibleRef}
      />
    </>
  );
}

/* ========================================================================== */
/*  EXPORTED WRAPPER                                                          */
/* ========================================================================== */

export default function ImmersiveScene() {
  const [interactive, setInteractive] = useState(false);
  const [picked, setPickedState] = useState<number | null>(null);
  const [pickedRect, setPickedRect] = useState<ScreenRect | null>(null);
  const scrollTargetRef = useRef(0);
  const pickedRef = useRef<number | null>(null);
  const interactiveRef = useRef(false);
  const { setImmersiveFocusPageOpen } = useImmersiveMode();

  // Keep ref + state in lock-step. The ref is read inside the r3f render
  // loop (cheap, no re-renders); the state drives the HTML overlay.
  const setPicked = useCallback(
    (idx: number | null, rect: ScreenRect | null) => {
      pickedRef.current = idx;
      setPickedState(idx);
      setPickedRect(rect);
    },
    [],
  );

  useEffect(() => {
    interactiveRef.current = interactive;
  }, [interactive]);

  useEffect(() => {
    setImmersiveFocusPageOpen(picked !== null);
    return () => setImmersiveFocusPageOpen(false);
  }, [picked, setImmersiveFocusPageOpen]);

  // Wheel + touch driven scroll. Scroll (0..1) maps to a horizontal translate
  // of the page row so pages drift in from the right and exit left. While a
  // project is focused we swallow wheel / touch on the window so the row
  // doesn't slide behind the overlay; the overlay itself is `overflow-auto`
  // and scrolls its own content independently.
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!interactiveRef.current) return;
      if (pickedRef.current !== null) return;
      // Much gentler wheel mapping than before so a single scroll tick
      // nudges the row only a couple of hundredths of the timeline — the
      // pages translate slowly to the left instead of lurching.
      scrollTargetRef.current = Math.max(
        0,
        Math.min(1, scrollTargetRef.current + e.deltaY * 0.00022),
      );
    };
    let lastTouchY: number | null = null;
    let lastTouchX: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      lastTouchX = e.touches[0]?.clientX ?? null;
      lastTouchY = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!interactiveRef.current || lastTouchY == null || lastTouchX == null) return;
      const x = e.touches[0]?.clientX ?? null;
      const y = e.touches[0]?.clientY ?? null;
      if (x == null || y == null) return;
      const dx = lastTouchX - x;
      const dy = lastTouchY - y;
      lastTouchX = x;
      lastTouchY = y;
      if (pickedRef.current !== null) return;
      const dominantDelta = Math.abs(dx) > Math.abs(dy) ? dx : dy;
      scrollTargetRef.current = Math.max(
        0,
        Math.min(1, scrollTargetRef.current + dominantDelta * 0.0006),
      );
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  // Escape close is handled inside FocusedProjectPage so it can trigger
  // the reverse-zoom animation before unmounting.

  const pickedProject = picked !== null ? PROJECTS[picked] ?? null : null;

  return (
    <div
      className="absolute inset-0"
      aria-hidden
      style={{ pointerEvents: interactive ? "auto" : "none" }}
    >
      <Canvas
        // Cap DPR at 1.75 — on 2x-3x retina displays that 2x resolution
        // requires 4-9x fragment work vs. 1x, and the perceptual gain from
        // going above 1.75 is tiny once MSAA + bloom are in the pipeline.
        dpr={[1, 1.75]}
        gl={{
          // When the EffectComposer owns the render target we use hardware
          // MSAA via `multisampling` below instead of context-level AA.
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        camera={{ position: [0, 0, 8], fov: 50, near: 0.1, far: 200 }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.15;
        }}
      >
        <Scene
          scrollTargetRef={scrollTargetRef}
          pickedRef={pickedRef}
          setPicked={setPicked}
          onInteractive={setInteractive}
        />
        {/* `multisampling={4}` enables WebGL2 hardware MSAA on the
            composer's intermediate target, which is much cheaper than an
            SMAA post-pass on most GPUs and looks just as clean. */}
        <EffectComposer multisampling={4}>
          {/* Threshold pushed high so only genuinely overbright surfaces
              (the music sphere and the corner flames, both toneMapped=false
              with HDR values > 1) contribute to bloom. The project tile
              images and titles sit well below 1.0 in the framebuffer and
              therefore render crisp with no glow halo around them. */}
          <Bloom
            intensity={1.1}
            luminanceThreshold={0.95}
            luminanceSmoothing={0.22}
            mipmapBlur
            radius={0.7}
          />
          <Vignette eskil={false} offset={0.3} darkness={0.7} />
        </EffectComposer>
      </Canvas>

      {pickedProject ? (
        <FocusedProjectPage
          project={pickedProject}
          startRect={pickedRect}
          onClose={() => setPicked(null, null)}
        />
      ) : null}
    </div>
  );
}

/* ========================================================================== */
/*  FOCUSED PROJECT PAGE (HTML overlay)                                       */
/* ========================================================================== */

/**
 * HTML "page" that appears when the user clicks a tile inside the immersive
 * scene. It starts exactly where the 3D tile is visible on screen (same
 * position, same size) and animates into a full-viewport panel, so it reads
 * as the tile itself zooming in rather than a separate overlay.
 *
 * Layout (when fully open):
 *   - close button in the top-right corner
 *   - project image centered
 *   - project title below the image
 *   - project description below the title
 *   - project link icons (GitHub, Figma, Live) below the description
 *
 * Closing reverses the animation back onto the tile's screen rect before
 * unmounting and restoring the 3D tile.
 */
const focusedBorderColor = "rgba(168, 172, 186, 0.85)";
const focusedBackground = "#000000";
const ZOOM_DURATION_MS = 520;
const ZOOM_EASING = "cubic-bezier(0.22, 0.61, 0.36, 1)";

// Fractional insets for the zoomed panel (in viewport units). Mobile
// shrinks the side/top gap so the panel uses more of the limited
// real estate while still leaving the immersive frame visible.
const PANEL_INSET_TOP = 0.12;    // 12% from top
const PANEL_INSET_SIDE = 0.05;   // 5% from left and right
const PANEL_INSET_BOTTOM = 0;    // flush with bottom
const PANEL_INSET_TOP_MOBILE = 0.14;
const PANEL_INSET_SIDE_MOBILE = 0.05;
const PANEL_INSET_BOTTOM_MOBILE = 0.04;

function FocusedProjectPage({
  project,
  startRect,
  onClose,
}: {
  project: Project;
  startRect: ScreenRect | null;
  onClose: () => void;
}) {
  // `entering` → animate from tile rect to fullscreen.
  // `open`     → settled; content details fade in.
  // `closing`  → animate back to tile rect, then unmount.
  const [phase, setPhase] = useState<"entering" | "open" | "closing">(
    "entering",
  );

  useEffect(() => {
    // Kick off the opening animation on the next frame so the browser has
    // a chance to paint the initial (tile-sized) state first. Without this
    // double-rAF hop the transition can be skipped by the compositor.
    let id2 = 0;
    const id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => setPhase("open"));
    });
    return () => {
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
    };
  }, []);

  const handleClose = useCallback(() => {
    setPhase((p) => (p === "closing" ? p : "closing"));
    window.setTimeout(() => onClose(), ZOOM_DURATION_MS);
  }, [onClose]);

  // Escape closes the page. Allowed during entering / open; ignored while
  // the close animation is already running so double-presses don't queue.
  useEffect(() => {
    if (phase === "closing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, handleClose]);

  const isOpen = phase === "open";

  // Viewport dimensions drive the "from" transform so we can animate with
  // `transform: scale(...) translate(...)` instead of width/height —
  // transform transitions run on the compositor and don't re-lay-out the
  // inner page content on every animation frame.
  const [viewport, setViewport] = useState(() => {
    if (typeof window === "undefined") return { w: 1280, h: 720 };
    return { w: window.innerWidth, h: window.innerHeight };
  });
  useEffect(() => {
    const onResize = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Fall back to a small centered rect if projection failed for any reason.
  const rect: ScreenRect = startRect ?? {
    top: viewport.h / 2 - 150,
    left: viewport.w / 2 - 200,
    width: 400,
    height: 300,
  };

  // Panel sits inset from the viewport. Mobile uses a tighter inset so the
  // page gets more usable real estate on narrow screens.
  // The "compact" (tile-sized) state is achieved by translating + scaling
  // the panel so its top-left corner lands on the tile's screen position.
  const isMobile = viewport.w < 640;
  const insetTop = isMobile ? PANEL_INSET_TOP_MOBILE : PANEL_INSET_TOP;
  const insetSide = isMobile ? PANEL_INSET_SIDE_MOBILE : PANEL_INSET_SIDE;
  const insetBottom = isMobile ? PANEL_INSET_BOTTOM_MOBILE : PANEL_INSET_BOTTOM;
  const panelLeft = viewport.w * insetSide;
  const panelTop = viewport.h * insetTop;
  const panelW = viewport.w * (1 - insetSide * 2);
  const panelH = viewport.h * (1 - insetTop - insetBottom);
  const scaleX = rect.width / panelW;
  const scaleY = rect.height / panelH;
  const tx = rect.left - panelLeft;
  const ty = rect.top - panelTop;
  const compactTransform = `translate(${tx}px, ${ty}px) scale(${scaleX}, ${scaleY})`;
  const panelStyle: React.CSSProperties = {
    position: "fixed",
    top: `${insetTop * 100}%`,
    left: `${insetSide * 100}%`,
    right: `${insetSide * 100}%`,
    bottom: `${insetBottom * 100}%`,
    width: "auto",
    height: "auto",
    transform: isOpen ? "translate(0px, 0px) scale(1, 1)" : compactTransform,
    transformOrigin: "0 0",
    borderColor: focusedBorderColor,
    backgroundColor: focusedBackground,
    backgroundImage: `
      radial-gradient(rgba(210, 214, 224, 0.13) 1px, transparent 1.2px),
      radial-gradient(circle at 12% 8%, rgba(80, 90, 120, 0.10), transparent 45%),
      radial-gradient(circle at 88% 92%, rgba(60, 70, 100, 0.08), transparent 45%)
    `,
    backgroundSize: "14px 14px, auto, auto",
    backgroundPosition: "0 0, 0 0, 0 0",
    transition: `transform ${ZOOM_DURATION_MS}ms ${ZOOM_EASING}`,
    willChange: "transform",
    zIndex: 45,
  };

  // While the tile is still small, keep the rich page content hidden so it
  // doesn't peek out behind the shrinking frame. When open, everything but
  // the image gets a short fade-in staggered behind the frame animation.
  const detailsStyle = (extraDelay = 0): React.CSSProperties => ({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? "translateY(0)" : "translateY(8px)",
    transition: `opacity 260ms ease-out ${isOpen ? ZOOM_DURATION_MS - 180 + extraDelay : 0}ms, transform 260ms ease-out ${isOpen ? ZOOM_DURATION_MS - 180 + extraDelay : 0}ms`,
  });

  const closeButtonStyle: React.CSSProperties = {
    opacity: isOpen ? 1 : 0,
    transition: `opacity 220ms ease-out ${isOpen ? ZOOM_DURATION_MS - 220 : 0}ms`,
    borderColor: focusedBorderColor,
  };

  return (
    <div
      className="pointer-events-auto flex flex-col overflow-hidden border shadow-2xl"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} project`}
      style={panelStyle}
    >
      {/* decorative corner squares (match the card pattern) */}
      <span
        aria-hidden
        className="absolute top-[-3px] left-[-3px] size-1.5 border"
        style={{ borderColor: focusedBorderColor, backgroundColor: focusedBackground }}
      />
      <span
        aria-hidden
        className="absolute top-[-3px] right-[-3px] size-1.5 border"
        style={{ borderColor: focusedBorderColor, backgroundColor: focusedBackground }}
      />
      <span
        aria-hidden
        className="absolute bottom-[-3px] left-[-3px] size-1.5 border"
        style={{ borderColor: focusedBorderColor, backgroundColor: focusedBackground }}
      />
      <span
        aria-hidden
        className="absolute right-[-3px] bottom-[-3px] size-1.5 border"
        style={{ borderColor: focusedBorderColor, backgroundColor: focusedBackground }}
      />

      {/* close button (top-right) */}
      <button
        type="button"
        onClick={handleClose}
        aria-label="Close project"
        className={`${GeistMono.className} absolute top-3 right-3 z-20 inline-flex h-8 items-center gap-1.5 rounded-none border bg-black/60 px-2.5 text-[10px] font-medium tracking-[0.12em] text-neutral-200 uppercase backdrop-blur transition-colors hover:bg-neutral-800 sm:top-4 sm:right-4 sm:h-9 sm:gap-2 sm:px-3 sm:text-[11px] sm:tracking-[0.14em]`}
        style={closeButtonStyle}
      >
        <X className="size-3 sm:size-3.5" strokeLinecap="square" />
        <span>Close</span>
      </button>

      {/* scrollable page content */}
      <div
        className="flex-1 overflow-auto"
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-5 px-4 pt-14 pb-10 sm:gap-8 sm:px-10 sm:pt-20 sm:pb-20">
          {/* project image — centered at the top; fades in as the panel
              settles so the scaled-down entering state reads as the tile
              itself morphing rather than an image shrinking awkwardly. */}
          <div
            className="relative w-full max-w-3xl overflow-hidden border"
            style={{
              borderColor: focusedBorderColor,
              aspectRatio: "16 / 10",
              ...detailsStyle(0),
            }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 1024px) 90vw, 60vw"
              className="object-cover"
              priority
            />
          </div>

          {/* project name */}
          <h1
            className={`${GeistMono.className} text-center text-xl font-semibold tracking-[0.06em] text-neutral-100 uppercase sm:text-4xl sm:tracking-[0.08em]`}
            style={detailsStyle(60)}
          >
            {project.title}
          </h1>

          {/* project description */}
          <p
            className={`${GeistSans.className} max-w-2xl text-center text-[13px] leading-relaxed text-neutral-400 sm:text-base`}
            style={detailsStyle(120)}
          >
            {project.description}
          </p>

          {/* project links */}
          <div
            className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3"
            style={detailsStyle(180)}
          >
            {project.github ? (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} on GitHub`}
                title="GitHub"
                className={`${GeistMono.className} inline-flex h-10 w-10 items-center justify-center rounded-none border bg-black/40 text-neutral-200 transition-colors hover:bg-neutral-800 sm:h-11 sm:w-11`}
                style={{ borderColor: focusedBorderColor }}
              >
                <Github className="size-4" strokeLinecap="square" />
              </a>
            ) : null}
            {project.figma ? (
              <a
                href={project.figma}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} on Figma`}
                title="Figma"
                className={`${GeistMono.className} inline-flex h-10 w-10 items-center justify-center rounded-none border bg-black/40 text-neutral-200 transition-colors hover:bg-neutral-800 sm:h-11 sm:w-11`}
                style={{ borderColor: focusedBorderColor }}
              >
                <Figma className="size-4" strokeLinecap="square" />
              </a>
            ) : null}
            {project.live ? (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} live site`}
                title="Live site"
                className={`${GeistMono.className} inline-flex h-10 w-10 items-center justify-center rounded-none border bg-black/40 text-neutral-200 transition-colors hover:bg-neutral-800 sm:h-11 sm:w-11`}
                style={{ borderColor: focusedBorderColor }}
              >
                <ExternalLink className="size-4" strokeLinecap="square" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
