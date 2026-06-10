"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Custom cursor: a precise dot plus a lagging ring that enlarges over
 * interactive elements. Renders only on fine-pointer, non-reduced-motion devices.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [hidden, setHidden] = useState(true);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    setEnabled(true);
    document.body.classList.add("has-custom-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
    };
    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement)?.closest?.(
        "a, button, [role='group'] button, [data-cursor='hover']"
      );
      setHovering(Boolean(t));
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => setHidden(true);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.addEventListener("mouseleave", leave);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.removeEventListener("mouseleave", leave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      style={{ opacity: hidden ? 0 : 1 }}
      className="transition-opacity duration-200"
    >
      {/* Precise dot */}
      <motion.div
        className="accent-morph pointer-events-none fixed left-0 top-0 z-[300] h-2 w-2 rounded-full bg-accent"
        style={{ x, y, marginLeft: -4, marginTop: -4 }}
        animate={{ scale: pressed ? 0.6 : hovering ? 0 : 1 }}
        transition={{ duration: 0.18 }}
      />
      {/* Lagging ring */}
      <motion.div
        className="accent-morph pointer-events-none fixed left-0 top-0 z-[300] h-9 w-9 rounded-full border border-accent"
        style={{ x: ringX, y: ringY, marginLeft: -18, marginTop: -18 }}
        animate={{
          scale: pressed ? 0.85 : hovering ? 1.7 : 1,
          opacity: hovering ? 1 : 0.55,
          backgroundColor: hovering
            ? "rgb(var(--accent) / 0.12)"
            : "rgb(var(--accent) / 0)",
        }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
