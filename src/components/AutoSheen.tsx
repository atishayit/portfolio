"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * A one-shot diagonal light sweep that plays when its card scrolls into view.
 * Gives cards a "lit up" moment on touch devices, where `:hover` never fires —
 * pair it with `(hover: none)` styles for a persistent glow. Drop it as the
 * first child of a `relative overflow-hidden` card.
 */
export function AutoSheen({
  delay = 0,
  color = "rgb(var(--accent) / 0.16)",
}: {
  delay?: number;
  color?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12"
      style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      initial={{ x: "-40%", opacity: 0 }}
      whileInView={{ x: "320%", opacity: [0, 1, 0] }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.15, delay: delay + 0.25, ease: "easeInOut" }}
    />
  );
}
