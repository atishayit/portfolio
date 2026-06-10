"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

interface RevealTextProps {
  text: string;
  /**
   * Controlled mode: animate to visible when true, masked when false.
   * Omit to trigger automatically on scroll into view.
   */
  play?: boolean;
  className?: string;
  /** Delay before the first word, in seconds */
  delay?: number;
  stagger?: number;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** Splits text into words, each rising up from behind an overflow mask. */
export function RevealText({
  text,
  play,
  className = "",
  delay = 0,
  stagger = 0.09,
}: RevealTextProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const word: Variants = {
    hidden: { y: reduce ? 0 : "115%" },
    show: { y: 0, transition: { duration: 0.85, ease: EASE } },
  };

  // Controlled when `play` is provided; otherwise reveal on scroll into view.
  const triggerProps =
    play === undefined
      ? { whileInView: "show", viewport: { once: true, margin: "-12%" } }
      : { animate: play ? "show" : "hidden" };

  return (
    <motion.span
      className={className}
      style={{ display: "inline" }}
      variants={container}
      initial="hidden"
      {...triggerProps}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          aria-hidden="true"
          className="inline-flex overflow-hidden align-bottom"
          style={{ paddingBottom: "0.14em", marginBottom: "-0.14em" }}
        >
          <motion.span variants={word} className="inline-block">
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
