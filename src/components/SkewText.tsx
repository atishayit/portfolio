"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

interface SkewTextProps {
  text: string;
  /** Controlled: animate in when true. Omit to trigger on scroll into view. */
  play?: boolean;
  className?: string;
  delay?: number;
  stagger?: number;
}

/**
 * Staggered per-character reveal — each glyph rises from a clipped box with a
 * slight skewY that flattens to 0. Words stay intact (break only between them).
 */
export function SkewText({
  text,
  play,
  className = "",
  delay = 0,
  stagger = 0.035,
}: SkewTextProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const glyph: Variants = {
    hidden: { y: reduce ? 0 : "115%", skewY: reduce ? 0 : 5 },
    show: { y: 0, skewY: 0, transition: { duration: 0.7, ease: EASE } },
  };

  const trigger =
    play === undefined
      ? { whileInView: "show" as const, viewport: { once: true, margin: "-12%" } }
      : { animate: play ? "show" : "hidden" };

  return (
    <motion.span
      className={className}
      style={{ display: "inline" }}
      variants={container}
      initial="hidden"
      {...trigger}
      aria-label={text}
    >
      {words.map((word, wi) => (
        <span key={wi} aria-hidden="true">
          <span className="inline-flex align-bottom">
            {Array.from(word).map((c, ci) => (
              <span
                key={ci}
                className="inline-block overflow-hidden"
                style={{ paddingBottom: "0.14em", marginBottom: "-0.14em" }}
              >
                <motion.span variants={glyph} className="inline-block">
                  {c}
                </motion.span>
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : ""}
        </span>
      ))}
    </motion.span>
  );
}
