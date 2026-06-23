"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * An animated, on-brand energy-forecast readout (SVG). The "actual" line draws
 * itself on view, a confidence band fades in over the forecast tail, and two
 * energy pulses travel along the line. Used as VOLTA's card visual and as a
 * signature band on the showcase. Deterministic geometry → no hydration drift.
 */

const W = 600;
const H = 220;
const N = 64;
const BOUNDARY = Math.floor(N * 0.62);
const AMBER = "255 176 32";
const ELECTRIC = "45 212 255";

// Deterministic double-hump daily load curve (morning + evening peaks).
function buildPoints() {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < N; i++) {
    const t = (i / (N - 1)) * 48; // 48 hours
    const base =
      0.5 +
      0.22 * Math.sin((t / 24) * 2 * Math.PI - 1.6) +
      0.12 * Math.sin((t / 12) * 2 * Math.PI - 0.5) +
      0.045 * Math.sin(t * 1.7);
    const x = 8 + (i / (N - 1)) * (W - 16);
    const y = 178 - base * 140;
    pts.push({ x, y });
  }
  return pts;
}

const PTS = buildPoints();
const line = (a: { x: number; y: number }[]) =>
  a.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");

const ACTUAL_D = line(PTS.slice(0, BOUNDARY + 1));
const FORECAST_D = line(PTS.slice(BOUNDARY));

// Confidence band that widens across the forecast tail.
const BAND_D = (() => {
  const seg = PTS.slice(BOUNDARY);
  const up = seg.map((p, i) => {
    const w = 2 + (i / (seg.length - 1)) * 15;
    return `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${(p.y - w).toFixed(1)}`;
  });
  const down = [...seg]
    .reverse()
    .map((p, i) => {
      const w = 2 + ((seg.length - 1 - i) / (seg.length - 1)) * 15;
      return `L${p.x.toFixed(1)} ${(p.y + w).toFixed(1)}`;
    });
  return `${up.join(" ")} ${down.join(" ")} Z`;
})();

const BX = PTS[BOUNDARY].x;

export function VoltaChart({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const draw = reduce
    ? {}
    : {
        initial: { pathLength: 0 },
        whileInView: { pathLength: 1 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 1.6, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="va-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={`rgb(${AMBER})`} stopOpacity="0.5" />
          <stop offset="70%" stopColor={`rgb(${AMBER})`} />
          <stop offset="100%" stopColor={`rgb(${ELECTRIC})`} />
        </linearGradient>
        <filter id="va-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* faint horizontal grid */}
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1="8"
          x2={W - 8}
          y1={20 + f * 160}
          y2={20 + f * 160}
          stroke="rgb(255 255 255 / 0.05)"
          strokeWidth="1"
        />
      ))}

      {/* now-divider */}
      <line
        x1={BX}
        x2={BX}
        y1="14"
        y2={H - 14}
        stroke={`rgb(${ELECTRIC} / 0.35)`}
        strokeWidth="1"
        strokeDasharray="3 4"
      />

      {/* confidence band over the forecast tail */}
      <motion.path
        d={BAND_D}
        fill={`rgb(${ELECTRIC} / 0.1)`}
        initial={reduce ? undefined : { opacity: 0 }}
        whileInView={reduce ? undefined : { opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.9 }}
      />

      {/* hidden reference path for the traveling pulses */}
      <path id="va-actual" d={ACTUAL_D} fill="none" stroke="none" />

      {/* forecast (dashed, electric) */}
      <motion.path
        d={FORECAST_D}
        fill="none"
        stroke={`rgb(${ELECTRIC} / 0.85)`}
        strokeWidth="2"
        strokeDasharray="5 5"
        strokeLinecap="round"
        {...(reduce
          ? {}
          : {
              initial: { pathLength: 0 },
              whileInView: { pathLength: 1 },
              viewport: { once: true },
              transition: { duration: 1, delay: 1.1, ease: "easeOut" },
            })}
      />

      {/* actual (solid, amber gradient, glowing) */}
      <motion.path
        d={ACTUAL_D}
        fill="none"
        stroke="url(#va-stroke)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#va-glow)"
        {...draw}
      />

      {/* energy pulses traveling along the actual line */}
      {!reduce &&
        [0, 1.75].map((delay, i) => (
          <circle key={i} r="3.5" fill={`rgb(${AMBER})`} filter="url(#va-glow)">
            <animateMotion dur="3.5s" begin={`${1.4 + delay}s`} repeatCount="indefinite">
              <mpath href="#va-actual" />
            </animateMotion>
          </circle>
        ))}

      {/* pulsing marker at the forecast boundary */}
      <circle cx={BX} cy={PTS[BOUNDARY].y} r="3.5" fill={`rgb(${ELECTRIC})`} filter="url(#va-glow)">
        {!reduce && (
          <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
        )}
      </circle>
    </svg>
  );
}
