"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useGalaxyShell } from "./GalaxyShellContext";

/** Route wheel / touch drag from the WebGL layer into the scroll container (dive interaction). */
export function WheelForwardScroll() {
  const gl = useThree((s) => s.gl);
  const { scrollRef } = useGalaxyShell();
  const touchY0 = useRef(0);
  const touchScroll0 = useRef(0);

  useEffect(() => {
    const el = gl.domElement;
    const onWheel = (e: WheelEvent) => {
      const sc = scrollRef.current;
      if (!sc) return;
      sc.scrollTop += e.deltaY;
      e.preventDefault();
    };
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const sc = scrollRef.current;
      if (!sc) return;
      touchY0.current = e.touches[0].clientY;
      touchScroll0.current = sc.scrollTop;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const sc = scrollRef.current;
      if (!sc) return;
      const dy = e.touches[0].clientY - touchY0.current;
      sc.scrollTop = touchScroll0.current - dy;
      e.preventDefault();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [gl, scrollRef]);

  return null;
}
