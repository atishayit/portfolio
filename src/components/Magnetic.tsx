"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** How strongly the element follows the cursor (0–1) */
  strength?: number;
  /** If > 0, the pull activates when the cursor is within this many px of the
   *  element's centre (approach magnetism), not only on direct hover. */
  radius?: number;
}

/** Wraps a control so it's gently pulled toward the cursor (desktop only). */
export function Magnetic({
  children,
  className = "",
  strength = 0.4,
  radius = 0,
}: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.5 });

  // Approach magnetism: a window listener pulls the element once the cursor is
  // within `radius`, and releases it outside.
  useEffect(() => {
    if (reduce || radius <= 0) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < radius) {
        x.set(dx * strength);
        y.set(dy * strength);
      } else {
        x.set(0);
        y.set(0);
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduce, radius, strength, x, y]);

  if (reduce) {
    return <span className={`inline-flex ${className}`}>{children}</span>;
  }

  // Direct-hover mode (radius === 0): pull only while the cursor is over it.
  const handleMove =
    radius > 0
      ? undefined
      : (e: React.MouseEvent<HTMLSpanElement>) => {
          const el = ref.current;
          if (!el) return;
          const r = el.getBoundingClientRect();
          x.set((e.clientX - (r.left + r.width / 2)) * strength);
          y.set((e.clientY - (r.top + r.height / 2)) * strength);
        };
  const reset =
    radius > 0
      ? undefined
      : () => {
          x.set(0);
          y.set(0);
        };

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={`inline-flex ${className}`}
    >
      {children}
    </motion.span>
  );
}
