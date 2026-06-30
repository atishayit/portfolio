"use client";

import { useEffect, useRef } from "react";

/**
 * A subtle neural-network field: drifting nodes wired by proximity, with data
 * pulses travelling the links and a cursor that lights nearby nodes. 2D canvas,
 * themed from `--j`, paused when hidden. Sits behind all content.
 */

export function NeuralField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const readJ = () => {
      const raw = getComputedStyle(canvas).getPropertyValue("--j").trim();
      const p = raw.split(/\s+/).map((n) => parseInt(n, 10));
      return p.length === 3 && p.every(Number.isFinite) ? p : [34, 211, 238];
    };
    let col = readJ();
    const mo = new MutationObserver(() => (col = readJ()));
    const jx = canvas.closest(".jx");
    if (jx) mo.observe(jx, { attributes: true, attributeFilter: ["data-identity"] });

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0;
    let H = 0;
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = Math.min(64, Math.round((W * H) / 26000));
    const LINK = 150;
    type Node = { x: number; y: number; vx: number; vy: number };
    const nodes: Node[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
    }));

    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("mouseout", onLeave);

    let raf = 0;
    let t = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      t += 1;
      ctx.clearRect(0, 0, W, H);
      const [r, g, b] = col;

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }

      // links + travelling data pulses
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const bn = nodes[j];
          const dx = a.x - bn.x;
          const dy = a.y - bn.y;
          const dist = Math.hypot(dx, dy);
          if (dist > LINK) continue;
          const o = (1 - dist / LINK) * 0.16;
          ctx.strokeStyle = `rgb(${r} ${g} ${b} / ${o})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(bn.x, bn.y);
          ctx.stroke();

          // a pulse sliding along the link
          const ph = ((t * 0.01 + (i + j) * 0.13) % 1);
          ctx.fillStyle = `rgb(${r} ${g} ${b} / ${o * 3})`;
          ctx.beginPath();
          ctx.arc(a.x + (bn.x - a.x) * ph, a.y + (bn.y - a.y) * ph, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // nodes (brighten near cursor)
      for (const n of nodes) {
        const md = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        const near = md < 180 ? 1 - md / 180 : 0;
        const o = 0.25 + near * 0.6;
        ctx.fillStyle = `rgb(${r} ${g} ${b} / ${o})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.3 + near * 1.6, 0, Math.PI * 2);
        ctx.fill();
        if (near > 0) {
          ctx.strokeStyle = `rgb(${r} ${g} ${b} / ${near * 0.25})`;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    };
    if (!reduce) frame();
    else {
      // one static frame
      requestAnimationFrame(frame);
      cancelAnimationFrame(raf);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      mo.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-0 h-full w-full opacity-70"
    />
  );
}
