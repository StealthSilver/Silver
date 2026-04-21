"use client";

import { useTexture } from "@react-three/drei";
import { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { PROJECTS } from "@/data/project.data";
import { ProjectGlassTile } from "./ProjectGlassTile";

const urls = PROJECTS.map((p) => p.image);

export function GalaxySpiralProjects() {
  const textures = useTexture(urls);
  const list = useMemo(
    () => (Array.isArray(textures) ? textures : [textures]) as THREE.Texture[],
    [textures],
  );

  useLayoutEffect(() => {
    list.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
    });
  }, [list]);

  const geometry = useMemo(() => new THREE.PlaneGeometry(1.15, 0.65, 1, 1), []);

  useLayoutEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  return (
    <>
      {PROJECTS.map((project, i) => (
        <ProjectGlassTile
          key={project.id}
          project={project}
          texture={list[i]!}
          index={i}
          geometry={geometry}
        />
      ))}
    </>
  );
}
