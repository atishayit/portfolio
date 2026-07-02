"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * The JARVIS AI core — a WebGL particle sphere that breathes, rotates, pulses
 * energy and follows the cursor. Reads its colour live from the `--j` identity
 * var (cyan for Jarvis, amber for Friday). Runs on phones too, with a lighter
 * particle budget; the caller renders a CSS glow fallback behind it.
 */

// Fewer particles + lower pixel ratio on phones so the core stays smooth and
// battery-friendly, while still giving the "living core" feel on touch devices.
const COUNT_DESKTOP = 9000;
const COUNT_MOBILE = 4000;

function readJ(el: HTMLElement): THREE.Color {
  const raw = getComputedStyle(el).getPropertyValue("--j").trim();
  const [r, g, b] = raw.split(/\s+/).map((n) => parseInt(n, 10) / 255);
  const c = new THREE.Color();
  if ([r, g, b].every(Number.isFinite)) c.setRGB(r, g, b);
  else c.setRGB(0.13, 0.83, 0.93);
  return c;
}

const VERT = `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uPulse;
  attribute float aSeed;
  varying float vAlpha;
  varying float vSeed;
  void main() {
    float n = sin(uTime * 0.9 + aSeed * 6.2831) * 0.5 + 0.5;
    // energy pulse ripples outward from the core
    float ring = sin(aSeed * 9.0 - uTime * 2.2);
    vec3 p = position * (1.0 + n * 0.045 + uPulse * 0.06 * ring);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float s = uSize * (0.5 + aSeed * 0.9) * (1.0 + uPulse * 0.5);
    gl_PointSize = s * uPixelRatio * (300.0 / -mv.z);
    vAlpha = 1.0;
    vSeed = aSeed;
  }
`;

const FRAG = `
  precision highp float;
  uniform vec3 uColor;
  uniform float uPulse;
  varying float vAlpha;
  varying float vSeed;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float glow = smoothstep(0.5, 0.0, d);
    float core = smoothstep(0.16, 0.0, d);
    vec3 col = uColor + core * (0.8 + uPulse * 0.6);
    gl_FragColor = vec4(col, glow * (0.85 + vSeed * 0.5) * vAlpha);
  }
`;

export default function JarvisCore({ identityKey }: { identityKey: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const matRef = useRef<THREE.ShaderMaterial | null>(null);
  const mountElForColor = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (matRef.current && mountElForColor.current) {
      matRef.current.uniforms.uColor.value = readJ(mountElForColor.current);
    }
  }, [identityKey]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    mountElForColor.current = mount;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const COUNT = isMobile ? COUNT_MOBILE : COUNT_DESKTOP;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }
    const pr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 1.8);
    const size = () => Math.max(1, mount.clientWidth);
    renderer.setPixelRatio(pr);
    renderer.setSize(size(), size());
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 2.9;

    const positions = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const rr = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      const shell = 0.8 + Math.random() * 0.2;
      positions[i * 3] = Math.cos(theta) * rr * shell;
      positions[i * 3 + 1] = y * shell;
      positions[i * 3 + 2] = Math.sin(theta) * rr * shell;
      seeds[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 0.03 },
        uPixelRatio: { value: pr },
        uPulse: { value: 0 },
        uColor: { value: readJ(mount) },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    matRef.current = material;
    const points = new THREE.Points(geo, material);
    scene.add(points);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const onResize = () => renderer.setSize(size(), size());
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    let visible = true;
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) loop();
      },
      { threshold: 0.02 }
    );
    io.observe(mount);

    const clock = new THREE.Clock();
    let raf = 0;
    let running = false;
    let baseRot = 0;
    const render = () => {
      const t = clock.getElapsedTime();
      material.uniforms.uTime.value = t;
      // energy pulse every ~4s
      const p = Math.max(0, Math.sin(t * 1.6) ** 8);
      material.uniforms.uPulse.value = p;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      baseRot += 0.0018;
      points.rotation.y = baseRot + mouse.x * 0.55;
      points.rotation.x = mouse.y * 0.32;
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
    const onVis = () => {
      if (!document.hidden && visible) loop();
    };
    document.addEventListener("visibilitychange", onVis);
    loop();

    return () => {
      cancelAnimationFrame(raf);
      running = false;
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      ro.disconnect();
      io.disconnect();
      geo.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      matRef.current = null;
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
