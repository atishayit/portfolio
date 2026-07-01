"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { Asterisk } from "lucide-react";
import { BrandIcon } from "./brands";

const ITEMS = [
  "Full Stack Engineer",
  "Data Scientist",
  "React",
  "TypeScript",
  "Next.js",
  "Python",
  "PyTorch",
  "TensorFlow",
  "Supabase",
  "AWS",
  "Azure",
  "PostgreSQL",
  "Docker",
  "Machine Learning",
  ".NET",
];

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

function Row() {
  return (
    <>
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center" aria-hidden="true">
          <span className="flex items-center gap-3 px-6">
            <BrandIcon name={item} size={26} className="shrink-0" />
            <span className="font-display text-2xl font-medium text-ink/90 sm:text-4xl">
              {item}
            </span>
          </span>
          <Asterisk className="accent-morph h-5 w-5 shrink-0 text-accent sm:h-6 sm:w-6" />
        </span>
      ))}
    </>
  );
}

/** Infinite marquee whose speed + direction track the scroll velocity. */
export function Marquee() {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const dir = useRef(1);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let moveBy = dir.current * 2.4 * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    moveBy += dir.current * moveBy * f;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div
      className="relative overflow-hidden border-y border-hairline bg-surface-raised/30 py-5 sm:py-7"
      role="marquee"
      aria-label="Disciplines and technologies: Full Stack Engineer, Data Scientist, React, TypeScript, Next.js, Python, PyTorch, TensorFlow, Supabase, AWS, Azure, PostgreSQL, Docker, Machine Learning, .NET"
    >
      <motion.div className="flex w-max items-center" style={{ x }}>
        <Row />
        <Row />
      </motion.div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface to-transparent sm:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface to-transparent sm:w-40" />
    </div>
  );
}
