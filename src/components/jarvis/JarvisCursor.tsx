"use client";

import { useEffect, useRef } from "react";

/**
 * A premium custom cursor scoped to the JARVIS page: a glowing core that tracks
 * instantly, a ring that lags with spring-like easing, and a short particle
 * trail. Grows + locks onto interactive elements (magnetic hover). Desktop +
 * fine-pointer + motion only; otherwise the native cursor is left alone.
 */

const TRAIL = 5;

export function JarvisCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fine = window.matchMedia("(min-width: 768px) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const root = document.querySelector(".jx") as HTMLElement | null;
    if (root) root.style.cursor = "none";

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dot = { x: target.x, y: target.y };
    const ring = { x: target.x, y: target.y };
    const trail = Array.from({ length: TRAIL }, () => ({ x: target.x, y: target.y }));
    let hovering = false;
    let down = false;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const el = e.target as HTMLElement;
      hovering = !!el?.closest?.("a, button, [role='button'], input, [data-cursor]");
    };
    const onDown = () => (down = true);
    const onUp = () => (down = false);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      dot.x += (target.x - dot.x) * 0.4;
      dot.y += (target.y - dot.y) * 0.4;
      ring.x += (target.x - ring.x) * 0.16;
      ring.y += (target.y - ring.y) * 0.16;

      if (dotRef.current)
        dotRef.current.style.transform = `translate(${dot.x}px, ${dot.y}px) translate(-50%, -50%)`;
      if (ringRef.current) {
        const s = (hovering ? 1.8 : 1) * (down ? 0.8 : 1);
        ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px) translate(-50%, -50%) scale(${s})`;
        ringRef.current.style.opacity = hovering ? "1" : "0.5";
      }

      let px = dot.x;
      let py = dot.y;
      for (let i = 0; i < TRAIL; i++) {
        const tp = trail[i];
        tp.x += (px - tp.x) * 0.35;
        tp.y += (py - tp.y) * 0.35;
        const node = trailRefs.current[i];
        if (node) {
          const sc = 1 - i / (TRAIL + 1);
          node.style.transform = `translate(${tp.x}px, ${tp.y}px) translate(-50%, -50%) scale(${sc})`;
          node.style.opacity = `${0.35 * sc}`;
        }
        px = tp.x;
        py = tp.y;
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      if (root) root.style.cursor = "";
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] hidden md:block">
      {Array.from({ length: TRAIL }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          className="absolute left-0 top-0 h-2 w-2 rounded-full"
          style={{ background: "rgb(var(--j))", willChange: "transform" }}
        />
      ))}
      <div
        ref={ringRef}
        className="absolute left-0 top-0 h-9 w-9 rounded-full border"
        style={{
          borderColor: "rgb(var(--j) / 0.8)",
          boxShadow: "0 0 12px rgb(var(--j) / 0.4)",
          willChange: "transform",
          transition: "opacity 0.2s",
        }}
      />
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-2 w-2 rounded-full"
        style={{
          background: "rgb(var(--j))",
          boxShadow: "0 0 10px rgb(var(--j)), 0 0 4px #fff",
          willChange: "transform",
        }}
      />
    </div>
  );
}
