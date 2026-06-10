"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/** Fixed decorative layer: masked grid + two drifting accent auroras with scroll parallax. */
export function Background() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Parallax: auroras drift at different rates as the page scrolls.
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-45%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "120%"]);
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-grid"
        style={reduce ? undefined : { y: gridY }}
      />

      <motion.div
        className="aurora absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full opacity-60"
        style={reduce ? undefined : { y: y1 }}
        animate={
          reduce
            ? undefined
            : { x: ["-50%", "-38%", "-50%"], scale: [1, 1.08, 1] }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="aurora absolute bottom-[-12rem] right-[-8rem] h-[34rem] w-[34rem] rounded-full opacity-40"
        style={reduce ? undefined : { y: y2 }}
        animate={reduce ? undefined : { x: [0, -40, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Secondary-hue glow for a gentle multi-tone background */}
      <motion.div
        className="aurora-2 absolute top-[28%] right-[6%] h-[26rem] w-[26rem] rounded-full opacity-35"
        style={reduce ? undefined : { y: y3 }}
        animate={reduce ? undefined : { x: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
