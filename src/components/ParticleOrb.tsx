"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A cinematic WebGL particle sphere — thousands of additive-blended points that
 * breathe, auto-spin, follow the cursor and gently disperse on scroll. The colour
 * is read live from the `--accent` CSS variable, so it re-themes with role/theme.
 *
 * Loaded client-only (ssr:false) from the hero. Renders nothing on machines that
 * can't get a WebGL context — the CSS glow behind it stays visible as a fallback.
 */

const COUNT = 7400;

function readAccent(): THREE.Color {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--accent")
    .trim();
  const [r, g, b] = raw.split(/\s+/).map((n) => parseInt(n, 10) / 255);
  const c = new THREE.Color();
  if ([r, g, b].every((v) => Number.isFinite(v))) c.setRGB(r, g, b);
  else c.setRGB(0.2, 0.8, 0.7);
  return c;
}

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uProgress;
  uniform float uPixelRatio;
  attribute vec3 aScatter;
  attribute float aSeed;
  varying float vAlpha;
  varying float vSeed;

  void main() {
    // radial "breathing"
    float n = sin(uTime * 0.8 + aSeed * 6.2831) * 0.5 + 0.5;
    vec3 breathed = position * (1.0 + n * 0.05);
    // disperse toward a scattered shell as the page scrolls
    vec3 pos = mix(breathed, aScatter, uProgress);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float s = uSize * (0.55 + aSeed * 0.85);
    gl_PointSize = s * uPixelRatio * (300.0 / -mv.z);

    vAlpha = 1.0 - uProgress * 0.55;
    vSeed = aSeed;
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  varying float vAlpha;
  varying float vSeed;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float glow = smoothstep(0.5, 0.0, d);
    float core = smoothstep(0.16, 0.0, d);
    vec3 col = uColor + core * 0.8;       // hot white-ish centre
    float a = glow * vAlpha * (0.62 + vSeed * 0.45);
    gl_FragColor = vec4(col, a);
  }
`;

export default function ParticleOrb({ themeKey }: { themeKey: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  // Re-read the accent whenever role/theme changes.
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uColor.value = readAccent();
    }
  }, [themeKey]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const size = () => Math.max(1, mount.clientWidth);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return; // no WebGL — CSS glow fallback remains
    }
    const pr = Math.min(window.devicePixelRatio || 1, 1.8);
    renderer.setPixelRatio(pr);
    renderer.setSize(size(), size());
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 3.2;

    // ---- geometry ----
    const positions = new Float32Array(COUNT * 3);
    const scatter = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    const golden = Math.PI * (3 - Math.sqrt(5));
    const v = new THREE.Vector3();
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const rr = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      const shell = 0.82 + Math.random() * 0.18;
      positions[i * 3] = Math.cos(theta) * rr * shell;
      positions[i * 3 + 1] = y * shell;
      positions[i * 3 + 2] = Math.sin(theta) * rr * shell;

      v.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1)
        .normalize()
        .multiplyScalar(1.4 + Math.random() * 1.8);
      scatter[i * 3] = v.x;
      scatter[i * 3 + 1] = v.y;
      scatter[i * 3 + 2] = v.z;
      seeds[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 0.023 },
        uProgress: { value: 0 },
        uPixelRatio: { value: pr },
        uColor: { value: readAccent() },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    materialRef.current = material;

    const points = new THREE.Points(geo, material);
    scene.add(points);

    // ---- interaction state ----
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let baseRot = 0;
    let progress = 0;

    const onMove = (e: MouseEvent) => {
      if (reduce) return;
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // ---- resize ----
    const onResize = () => {
      const s = size();
      renderer.setSize(s, s);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    // ---- visibility gating ----
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !reduce) loop();
      },
      { threshold: 0.05 }
    );
    io.observe(mount);

    const clock = new THREE.Clock();
    let raf = 0;
    let running = false;

    const render = () => {
      const t = clock.getElapsedTime();
      material.uniforms.uTime.value = t;

      // ease cursor + subtle parallax rotation
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      baseRot += 0.0016;
      points.rotation.y = baseRot + mouse.x * 0.5;
      points.rotation.x = mouse.y * 0.3;

      // disperse a little as the hero scrolls away
      const target = Math.min(
        1,
        Math.max(0, window.scrollY / (window.innerHeight * 0.9))
      );
      progress += (target * 0.5 - progress) * 0.06;
      material.uniforms.uProgress.value = progress;

      renderer.render(scene, camera);
    };

    const loop = () => {
      if (running) return;
      running = true;
      const tick = () => {
        if (!visible || document.hidden) {
          running = false;
          return;
        }
        render();
        raf = requestAnimationFrame(tick);
      };
      tick();
    };

    const onVisibility = () => {
      if (!document.hidden && visible && !reduce) loop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    if (reduce) render(); // single static frame
    else loop();

    return () => {
      cancelAnimationFrame(raf);
      running = false;
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
      io.disconnect();
      geo.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      materialRef.current = null;
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
