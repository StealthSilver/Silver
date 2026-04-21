"use client";

import { Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import type { Project } from "@/data/project.data";

const INTER_WOFF =
  "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.16/files/inter-latin-400-normal.woff";

type Props = {
  project: Project;
  texture: THREE.Texture;
  index: number;
  geometry: THREE.PlaneGeometry;
};

function applyCoverUV(texture: THREE.Texture, planeW: number, planeH: number) {
  const img = texture.image as { width?: number; height?: number } | undefined;
  if (!img?.width || !img?.height) return;
  const imageAspect = img.width / img.height;
  const planeAspect = planeW / planeH;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(1, 1);
  texture.offset.set(0, 0);
  texture.center.set(0.5, 0.5);
  texture.rotation = 0;
  if (imageAspect > planeAspect) {
    const r = planeAspect / imageAspect;
    texture.repeat.x = r;
    texture.offset.x = (1 - r) / 2;
  } else {
    const r = imageAspect / planeAspect;
    texture.repeat.y = r;
    texture.offset.y = (1 - r) / 2;
  }
  texture.needsUpdate = true;
}

export function ProjectGlassTile({ project, texture, index, geometry }: Props) {
  const router = useRouter();
  const { gl } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const scaleRef = useRef(1);

  const angle = index * 0.5;
  const radius = 1.5 + index * 0.25;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = -index * 0.15;

  const planeW = 1.15;
  const planeH = 0.65;

  useLayoutEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    applyCoverUV(texture, planeW, planeH);
  }, [texture, planeW, planeH]);

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#ffffff"),
        map: texture,
        transparent: true,
        opacity: 0.2,
        roughness: 0.1,
        metalness: 0.2,
        transmission: 1,
        thickness: 0.5,
        envMapIntensity: 1,
        clearcoat: 0.35,
        clearcoatRoughness: 0.25,
        side: THREE.DoubleSide,
        depthWrite: true,
      }),
    [texture],
  );

  useLayoutEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  useFrame((state, dt) => {
    const g = groupRef.current;
    if (!g) return;
    const target = hovered ? 1.1 : 1;
    scaleRef.current += (target - scaleRef.current) * (1 - Math.exp(-12 * dt));
    g.scale.setScalar(scaleRef.current);
    g.lookAt(state.camera.position);

    material.emissive.setRGB(0.25, 0.45, 0.75);
    material.emissiveIntensity = hovered ? 0.24 : 0;
  });

  const onClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    router.push(`/projects/${project.slug}`);
  };

  return (
    <group ref={groupRef} position={[x, y, z]} renderOrder={2}>
      <mesh
        geometry={geometry}
        material={material}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          gl.domElement.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          gl.domElement.style.cursor = "auto";
        }}
        onClick={onClick}
      />
      <mesh position={[0, -0.24, 0.018]} renderOrder={3}>
        <planeGeometry args={[1.08, 0.2]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={hovered ? 0.55 : 0.42}
          depthWrite={false}
        />
      </mesh>
      <Text
        position={[0, -0.235, 0.035]}
        font={INTER_WOFF}
        fontSize={0.068}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.02}
        textAlign="center"
        outlineWidth={0.012}
        outlineColor="#000000"
        renderOrder={4}
      >
        {project.title}
      </Text>
    </group>
  );
}
