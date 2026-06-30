"use client";

import { useEffect, useRef } from "react";

/**
 * A live voice/neural waveform — smooth animated bars in the given accent colour.
 * Used in the reactive-HUD section; `color` follows the active state. Pauses when
 * hidden / reduced-motion (renders a calm static frame).
 */

export function Waveform({ color, className = "" }: { color: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const colorRef = useRef(color);
  colorRef.current = color;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const BARS = 48;
    let raf = 0;
    let t = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (document.hidden) return;
      t += reduce ? 0 : 0.05;
      ctx.clearRect(0, 0, W, H);
      const [r, g, b] = colorRef.current.split(/\s+/).map(Number);
      const gap = W / BARS;
      const bw = Math.max(2, gap * 0.4);
      for (let i = 0; i < BARS; i++) {
        const x = i * gap + gap / 2;
        // envelope louder in the centre, with layered sine motion
        const env = Math.sin((i / (BARS - 1)) * Math.PI);
        const amp =
          (0.25 +
            0.75 *
              Math.abs(
                Math.sin(t + i * 0.45) * 0.6 + Math.sin(t * 1.7 - i * 0.2) * 0.4
              )) *
          env;
        const h = Math.max(2, amp * H * 0.9);
        const o = 0.35 + env * 0.55;
        ctx.fillStyle = `rgb(${r} ${g} ${b} / ${o})`;
        const rad = bw / 2;
        const y = (H - h) / 2;
        ctx.beginPath();
        ctx.roundRect(x - bw / 2, y, bw, h, rad);
        ctx.fill();
      }
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
