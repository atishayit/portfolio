"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useSite } from "./providers";

/**
 * Full-screen interactive WebGL hero background (react-three-fiber).
 * A point network morphs between a structured orthogonal grid (Full Stack) and
 * an organic sphere (Data Science), wires nearby nodes with lines, and repels
 * away from the cursor. Vertex morph is a per-frame lerp (GPU-friendly).
 */

export function TacticalNetwork() {
  const { role } = useSite();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState<number | null>(null);
  const [color, setColor] = useState("110 145 255");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setCount(0);
      return;
    }
    const w = window.innerWidth;
    setCount(w < 700 ? 70 : w < 1200 ? 110 : 150);
  }, []);

  // Re-read the accent whenever the identity changes (after the wipe swaps it).
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const raw = getComputedStyle(el).getPropertyValue("--accent").trim();
    if (raw) setColor(raw);
  }, [role]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: -1 }}
    >
      {count && count > 0 ? (
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0, 0, 15], fov: 55 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ background: "transparent" }}
        >
          <Network count={count} mode={role === "fullstack" ? "grid" : "sphere"} colorRGB={color} />
        </Canvas>
      ) : null}
    </div>
  );
}

const MAX_LINES = 900;
const LERP = 0.045;
const LINK = 2.6; // connect nodes within this distance
const REPEL = 2.4; // cursor repulsion radius

function Network({
  count,
  mode,
  colorRGB,
}: {
  count: number;
  mode: "grid" | "sphere";
  colorRGB: string;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { camera } = useThree();

  // Precompute the two target layouts + working buffers.
  const layouts = useMemo(() => {
    const grid = new Float32Array(count * 3);
    const sphere = new Float32Array(count * 3);
    const current = new Float32Array(count * 3);

    // Orthogonal 3D lattice (wide, shallow) — circuit-board feel.
    const gx = Math.max(2, Math.round(Math.cbrt(count) * 1.9));
    const gy = Math.max(2, Math.round(Math.cbrt(count) * 1.25));
    const gz = Math.max(2, Math.ceil(count / (gx * gy)));
    const spanX = 15,
      spanY = 8,
      spanZ = 5;
    for (let i = 0; i < count; i++) {
      const xi = i % gx;
      const yi = Math.floor(i / gx) % gy;
      const zi = Math.floor(i / (gx * gy)) % gz;
      grid[i * 3] = (xi / (gx - 1) - 0.5) * spanX;
      grid[i * 3 + 1] = (yi / (gy - 1) - 0.5) * spanY;
      grid[i * 3 + 2] = (zi / Math.max(1, gz - 1) - 0.5) * spanZ;
    }

    // Fibonacci sphere with light radial jitter — organic neural cloud.
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      const rad = 5.4 + (Math.sin(i * 12.9898) * 43758.5453 % 1) * 0.9;
      sphere[i * 3] = Math.cos(theta) * r * rad;
      sphere[i * 3 + 1] = y * rad;
      sphere[i * 3 + 2] = Math.sin(theta) * r * rad;
    }

    const src = mode === "grid" ? grid : sphere;
    current.set(src);
    return { grid, sphere, current };
  }, [count]); // eslint-disable-line react-hooks/exhaustive-deps

  const displayPos = useMemo(() => new Float32Array(count * 3), [count]);
  const linePos = useMemo(() => new Float32Array(MAX_LINES * 2 * 3), []);
  const lineCol = useMemo(() => new Float32Array(MAX_LINES * 2 * 3), []);

  const targetRef = useRef<Float32Array>(mode === "grid" ? layouts.grid : layouts.sphere);
  useEffect(() => {
    targetRef.current = mode === "grid" ? layouts.grid : layouts.sphere;
  }, [mode, layouts]);

  // Cursor in normalised device coords (off-screen when idle).
  const ndc = useRef(new THREE.Vector2(9999, 9999));
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      ndc.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    const onOut = () => ndc.current.set(9999, 9999);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onOut);
    };
  }, []);

  const nodeColor = useMemo(() => new THREE.Color(0.43, 0.57, 1), []);
  useEffect(() => {
    const [r, g, b] = colorRGB.split(/\s+/).map((n) => parseInt(n, 10) / 255);
    if ([r, g, b].every(Number.isFinite)) nodeColor.setRGB(r, g, b);
    const mat = pointsRef.current?.material as THREE.PointsMaterial | undefined;
    mat?.color.copy(nodeColor);
  }, [colorRGB, nodeColor]);

  const tmp = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const cur = layouts.current;
    const tgt = targetRef.current;

    // Project the cursor onto the z = 0 plane.
    let mx = 9999,
      my = 9999;
    if (ndc.current.x < 9000) {
      tmp.set(ndc.current.x, ndc.current.y, 0.5).unproject(camera);
      tmp.sub(camera.position).normalize();
      const dist = -camera.position.z / tmp.z;
      mx = camera.position.x + tmp.x * dist;
      my = camera.position.y + tmp.y * dist;
    }

    // Morph (lerp) toward the active layout + cursor repulsion into displayPos.
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      cur[ix] += (tgt[ix] - cur[ix]) * LERP;
      cur[ix + 1] += (tgt[ix + 1] - cur[ix + 1]) * LERP;
      cur[ix + 2] += (tgt[ix + 2] - cur[ix + 2]) * LERP;

      let ox = 0,
        oy = 0;
      const dx = cur[ix] - mx;
      const dy = cur[ix + 1] - my;
      const d2 = dx * dx + dy * dy;
      if (d2 < REPEL * REPEL) {
        const d = Math.sqrt(d2) || 0.001;
        const f = (1 - d / REPEL) * 1.8;
        ox = (dx / d) * f;
        oy = (dy / d) * f;
      }
      displayPos[ix] = cur[ix] + ox;
      displayPos[ix + 1] = cur[ix + 1] + oy;
      displayPos[ix + 2] = cur[ix + 2];
    }

    const pg = pointsRef.current?.geometry;
    if (pg) (pg.attributes.position as THREE.BufferAttribute).needsUpdate = true;

    // Rebuild proximity lines (brighter near the cursor).
    let li = 0;
    const glowR2 = (REPEL * 1.7) * (REPEL * 1.7);
    for (let i = 0; i < count && li < MAX_LINES; i++) {
      const ax = displayPos[i * 3],
        ay = displayPos[i * 3 + 1],
        az = displayPos[i * 3 + 2];
      for (let j = i + 1; j < count && li < MAX_LINES; j++) {
        const bx = displayPos[j * 3],
          by = displayPos[j * 3 + 1],
          bz = displayPos[j * 3 + 2];
        const ddx = ax - bx,
          ddy = ay - by,
          ddz = az - bz;
        const dist2 = ddx * ddx + ddy * ddy + ddz * ddz;
        if (dist2 > LINK * LINK) continue;
        const o = li * 6;
        linePos[o] = ax;
        linePos[o + 1] = ay;
        linePos[o + 2] = az;
        linePos[o + 3] = bx;
        linePos[o + 4] = by;
        linePos[o + 5] = bz;
        const t = 1 - Math.sqrt(dist2) / LINK;
        const mxd = (ax + bx) * 0.5 - mx;
        const myd = (ay + by) * 0.5 - my;
        const near = mxd * mxd + myd * myd < glowR2;
        const b = near ? 1 : 0.15 + t * 0.35;
        lineCol[o] = nodeColor.r * b;
        lineCol[o + 1] = nodeColor.g * b;
        lineCol[o + 2] = nodeColor.b * b;
        lineCol[o + 3] = nodeColor.r * b;
        lineCol[o + 4] = nodeColor.g * b;
        lineCol[o + 5] = nodeColor.b * b;
        li++;
      }
    }
    const lg = linesRef.current?.geometry;
    if (lg) {
      (lg.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (lg.attributes.color as THREE.BufferAttribute).needsUpdate = true;
      lg.setDrawRange(0, li * 2);
    }
  });

  return (
    <group>
      <points ref={pointsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={displayPos} count={count} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          sizeAttenuation
          transparent
          opacity={0.95}
          color={nodeColor}
          depthWrite={false}
        />
      </points>
      <lineSegments ref={linesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={linePos} count={MAX_LINES * 2} itemSize={3} />
          <bufferAttribute attach="attributes-color" array={lineCol} count={MAX_LINES * 2} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}
