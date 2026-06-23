"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * A living schematic of the CNN-BiLSTM. Data flows left → right: a 168h×8 input
 * window → 1-D CNN → bidirectional LSTM (pulses travel both ways) → last⊕mean⊕max
 * read-out → 24-step forecast bars. Powers on in sequence when scrolled into view,
 * then loops energy pulses along the wires. Deterministic geometry → no hydration
 * drift; fully static under prefers-reduced-motion.
 */

const AMBER = "255 176 32";
const ELECTRIC = "45 212 255";
const W = 1000;
const H = 300;
const MID = 150;

// Deterministic "spectrogram" opacity for the input heatmap.
const heat = (r: number, c: number) => {
  const v =
    0.16 +
    0.42 * Math.abs(Math.sin(r * 1.27 + c * 0.63) * Math.cos(c * 0.41 - r * 0.22)) +
    0.18 * Math.abs(Math.sin(c * 0.9 - 1.1));
  return Math.min(0.9, v);
};

// Deterministic daily-shaped 24h forecast heights (0..1).
const FCAST = Array.from({ length: 24 }, (_, i) => {
  const t = (i / 23) * Math.PI * 2;
  return 0.4 + 0.32 * Math.sin(t - 1.6) + 0.16 * Math.sin(t * 2 - 0.4);
});

function Wire({
  x1,
  x2,
  delay,
  reduce,
}: {
  x1: number;
  x2: number;
  delay: number;
  reduce: boolean;
}) {
  return (
    <g>
      <line
        x1={x1}
        x2={x2}
        y1={MID}
        y2={MID}
        stroke={`rgb(${AMBER} / 0.35)`}
        strokeWidth="1.5"
      />
      {!reduce && (
        <circle r="3" fill={`rgb(${AMBER})`} filter="url(#md-glow)">
          <animate
            attributeName="cx"
            from={x1}
            to={x2}
            dur="1.6s"
            begin={`${delay}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values={`${MID};${MID}`}
            dur="1.6s"
            begin={`${delay}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            keyTimes="0;0.1;0.85;1"
            dur="1.6s"
            begin={`${delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      )}
    </g>
  );
}

const moduleV = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

function Label({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      className="font-mono"
      style={{ fontSize: 11, letterSpacing: 2, fill: "rgb(148 163 184)" }}
    >
      {children}
    </text>
  );
}

export function VoltaModelDiagram({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  const container = reduce
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "show" as const,
        viewport: { once: true, margin: "-80px" },
        transition: { staggerChildren: 0.18 },
      };
  const item = reduce ? {} : { variants: moduleV, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } };

  // input heatmap grid
  const IROWS = 8;
  const ICOLS = 14;
  const ix = 34;
  const iy = 86;
  const cw = 6.2;
  const ch = 13;
  const gx = 1.6;
  const gy = 2;

  // bi-lstm cells
  const cells = [0, 1, 2, 3, 4];
  const lcx = (i: number) => 430 + i * 44;

  // output bars
  const ox = 846;
  const obW = 140;
  const obBase = 232;
  const obTop = 70;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="md-bar" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={`rgb(${AMBER})`} stopOpacity="0.85" />
          <stop offset="100%" stopColor={`rgb(${ELECTRIC})`} />
        </linearGradient>
        <linearGradient id="md-heat" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={`rgb(${AMBER})`} />
          <stop offset="100%" stopColor={`rgb(${AMBER})`} stopOpacity="0.7" />
        </linearGradient>
        <filter id="md-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* faint backdrop grid */}
      {[0.5].map((f) => (
        <line key={f} x1="20" x2={W - 20} y1={MID} y2={MID} stroke="rgb(255 255 255 / 0.04)" />
      ))}

      {/* connecting wires */}
      <Wire x1={150} x2={232} delay={0} reduce={!!reduce} />
      <Wire x1={356} x2={406} delay={0.25} reduce={!!reduce} />
      <Wire x1={628} x2={690} delay={0.5} reduce={!!reduce} />
      <Wire x1={788} x2={846} delay={0.75} reduce={!!reduce} />

      <motion.g {...container}>
        {/* ── INPUT ─────────────────────────────────────────── */}
        <motion.g {...item}>
          <rect
            x={24}
            y={70}
            width={130}
            height={160}
            rx={12}
            fill="rgb(255 255 255 / 0.02)"
            stroke={`rgb(${AMBER} / 0.25)`}
          />
          {Array.from({ length: IROWS }).map((_, r) =>
            Array.from({ length: ICOLS }).map((__, c) => (
              <rect
                key={`${r}-${c}`}
                x={ix + c * (cw + gx)}
                y={iy + r * (ch + gy)}
                width={cw}
                height={ch}
                rx={1.5}
                fill="url(#md-heat)"
                opacity={heat(r, c)}
              />
            )),
          )}
          {/* scan line */}
          {!reduce && (
            <rect x={ix} y={iy - 3} width={2.5} height={IROWS * (ch + gy)} fill={`rgb(${ELECTRIC})`} opacity="0.9" filter="url(#md-glow)">
              <animate
                attributeName="x"
                values={`${ix};${ix + ICOLS * (cw + gx) - 3};${ix}`}
                dur="4s"
                repeatCount="indefinite"
              />
            </rect>
          )}
          <Label x={89} y={252}>168h × 8 ch</Label>
          <Label x={89} y={60}>INPUT WINDOW</Label>
        </motion.g>

        {/* ── CNN ───────────────────────────────────────────── */}
        <motion.g {...item}>
          {[10, 5, 0].map((o, i) => (
            <rect
              key={o}
              x={244 + o}
              y={100 + o}
              width={92}
              height={92}
              rx={10}
              fill="rgb(255 255 255 / 0.03)"
              stroke={`rgb(${AMBER} / ${0.25 + i * 0.12})`}
            />
          ))}
          {/* kernel sweep */}
          {[0, 1, 2].map((k) => (
            <line key={k} x1={258} x2={326} y1={120 + k * 22} y2={120 + k * 22} stroke={`rgb(${AMBER} / 0.5)`} strokeWidth="2" strokeLinecap="round" />
          ))}
          {!reduce && (
            <rect x={252} y={108} width={20} height={76} rx={4} fill={`rgb(${ELECTRIC} / 0.18)`} stroke={`rgb(${ELECTRIC} / 0.6)`}>
              <animate attributeName="x" values="252;306;252" dur="3s" repeatCount="indefinite" />
            </rect>
          )}
          <Label x={290} y={252}>1-D CNN</Label>
          <Label x={290} y={88}>FEATURE EXTRACT</Label>
        </motion.g>

        {/* ── Bi-LSTM ───────────────────────────────────────── */}
        <motion.g {...item}>
          <rect x={406} y={84} width={224} height={132} rx={12} fill="rgb(255 255 255 / 0.02)" stroke={`rgb(${AMBER} / 0.25)`} />
          {/* forward track (amber, →) */}
          <line x1={420} x2={616} y1={112} y2={112} stroke={`rgb(${AMBER} / 0.4)`} strokeWidth="1.5" />
          {/* backward track (electric, ←) */}
          <line x1={420} x2={616} y1={188} y2={188} stroke={`rgb(${ELECTRIC} / 0.4)`} strokeWidth="1.5" />
          {cells.map((i) => (
            <g key={i}>
              <rect x={lcx(i) - 15} y={135} width={30} height={30} rx={7} fill="rgb(8 12 20)" stroke={`rgb(${AMBER} / 0.55)`} />
              <circle cx={lcx(i)} cy={150} r={3} fill={`rgb(${AMBER})`} opacity="0.8">
                {!reduce && <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" begin={`${i * 0.2}s`} repeatCount="indefinite" />}
              </circle>
            </g>
          ))}
          {!reduce && (
            <>
              <circle r="3" cy={112} fill={`rgb(${AMBER})`} filter="url(#md-glow)">
                <animate attributeName="cx" values="420;616" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle r="3" cy={188} fill={`rgb(${ELECTRIC})`} filter="url(#md-glow)">
                <animate attributeName="cx" values="616;420" dur="2s" repeatCount="indefinite" />
              </circle>
            </>
          )}
          <Label x={518} y={252}>Bi-LSTM</Label>
          <Label x={518} y={74}>FORWARD ⇄ BACKWARD</Label>
        </motion.g>

        {/* ── READ-OUT ──────────────────────────────────────── */}
        <motion.g {...item}>
          {["last", "mean", "max"].map((t, i) => {
            const cy = 116 + i * 34;
            return (
              <g key={t}>
                <circle cx={712} cy={cy} r={11} fill="rgb(8 12 20)" stroke={`rgb(${AMBER} / 0.55)`} />
                <line x1={723} x2={766} y1={cy} y2={MID} stroke={`rgb(${AMBER} / 0.35)`} strokeWidth="1.2" />
                <text x={712} y={cy + 3} textAnchor="middle" className="font-mono" style={{ fontSize: 8, fill: `rgb(${AMBER})` }}>
                  {t}
                </text>
              </g>
            );
          })}
          <circle cx={772} cy={MID} r={7} fill={`rgb(${AMBER})`} filter="url(#md-glow)" />
          <Label x={730} y={252}>READ-OUT</Label>
        </motion.g>

        {/* ── OUTPUT 24h ────────────────────────────────────── */}
        <motion.g {...item}>
          <rect x={836} y={64} width={150} height={172} rx={12} fill="rgb(255 255 255 / 0.02)" stroke={`rgb(${ELECTRIC} / 0.3)`} />
          {FCAST.map((h, i) => {
            const bw = obW / 24;
            const x = ox + i * bw;
            const barH = (obBase - obTop) * h;
            return (
              <motion.rect
                key={i}
                x={x + 0.6}
                y={obBase - barH}
                width={bw - 1.4}
                height={barH}
                rx={1}
                fill="url(#md-bar)"
                style={reduce ? undefined : { transformBox: "fill-box", transformOrigin: "bottom" }}
                {...(reduce
                  ? {}
                  : {
                      initial: { scaleY: 0, opacity: 0 },
                      whileInView: { scaleY: 1, opacity: 1 },
                      viewport: { once: true, margin: "-80px" },
                      transition: { duration: 0.5, delay: 1.1 + i * 0.022, ease: [0.22, 1, 0.36, 1] },
                    })}
              />
            );
          })}
          <Label x={911} y={252}>24h FORECAST</Label>
          <Label x={911} y={54}>OUTPUT</Label>
        </motion.g>
      </motion.g>
    </svg>
  );
}
