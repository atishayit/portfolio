"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Holographic AI core — an Iron-Man-style HUD projected on a pedestal.
 *
 * Pure CSS/SVG (no WebGL): rotating HUD rings, a pulsing arc-reactor, a
 * projection cone rising from a base disc, drifting data streaks and live HUD
 * readouts. GPU-cheap (transform/opacity only), so it stays smooth on phones
 * where the old WebGL particle core stuttered. Colour tracks the `--j` identity
 * var (cyan Jarvis / amber Friday); reduced-motion renders a calm static frame.
 */

const J = "rgb(var(--j))";
const J06 = "rgb(var(--j) / 0.06)";

// Live-ish HUD readouts that tick so the core feels "working", not static.
function useLiveReadouts(animate: boolean) {
  const [r, setR] = useState({ synapse: 76, latency: 18, acc: 99.8 });
  useEffect(() => {
    if (!animate) return;
    const id = setInterval(() => {
      setR({
        synapse: 68 + Math.round(Math.random() * 16), // 68–84%
        latency: 14 + Math.round(Math.random() * 9), // 14–23ms
        acc: 99.4 + Math.round(Math.random() * 6) / 10, // 99.4–100.0
      });
    }, 1400);
    return () => clearInterval(id);
  }, [animate]);
  return r;
}

export function HolographicCore() {
  const reduce = useReducedMotion();
  const animate = !reduce;
  const readouts = useLiveReadouts(animate);
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={wrapRef} className="relative aspect-square w-full select-none">
      {/* ambient bloom behind the whole scene */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[12%] rounded-full blur-3xl"
        style={{ background: "rgb(var(--j) / 0.18)" }}
      />

      {/* projection cone + base pedestal (behind the core) */}
      <Pedestal animate={animate} />

      {/* drifting data streaks passing through the core */}
      {animate && <Streaks />}

      {/* the HUD core itself */}
      <CoreSVG animate={animate} />

      {/* labels */}
      <span
        className="absolute left-1 top-1 font-mono text-[9px] uppercase tracking-[0.25em] sm:text-[10px]"
        style={{ color: "rgb(var(--j) / 0.85)" }}
      >
        {"● neural core"}
      </span>
      <span className="absolute bottom-1 right-1 font-mono text-[8px] uppercase tracking-[0.22em] text-slate-600 sm:text-[10px]">
        core_integration_complete
      </span>

      {/* corner brackets */}
      {[
        "left-0 top-0 border-l-2 border-t-2",
        "right-0 top-0 border-r-2 border-t-2",
        "bottom-0 left-0 border-b-2 border-l-2",
        "bottom-0 right-0 border-b-2 border-r-2",
      ].map((c) => (
        <span
          key={c}
          aria-hidden="true"
          className={`pointer-events-none absolute h-4 w-4 sm:h-5 sm:w-5 ${c}`}
          style={{ borderColor: "rgb(var(--j) / 0.45)" }}
        />
      ))}

      {/* floating HUD readouts */}
      <Readout
        className="right-0 top-[14%]"
        rows={[
          ["speech_recog", `${readouts.acc.toFixed(1)}%`, true],
          ["neural_net[1.4B]", "loaded", false],
        ]}
      />
      <Readout
        className="bottom-[14%] right-0"
        rows={[
          ["response_time", `${readouts.latency}ms`, false],
          ["synapse_load", `${readouts.synapse}%`, true],
        ]}
      />

      {/* floating code snippet */}
      <div
        className="jx-bd absolute left-0 top-[18%] hidden rounded-lg border bg-[#04060b]/70 px-2.5 py-2 font-mono text-[8px] leading-relaxed backdrop-blur-sm sm:block"
        style={{ boxShadow: "0 0 24px rgb(var(--j) / 0.12)" }}
      >
        <span className="text-slate-500">void</span>{" "}
        <span style={{ color: J }}>check_wake_word</span>
        <span className="text-slate-500">(input) {"{"}</span>
        <br />
        <span className="pl-2 text-slate-500">if (input == </span>
        <span className="text-amber-300/90">&quot;hey jarvis&quot;</span>
        <span className="text-slate-500">) {"{"}</span>
        <br />
        <span className="pl-4" style={{ color: J }}>
          initiate_boot
        </span>
        <span className="text-slate-500">(); {"}"}</span>
        <br />
        <span className="text-slate-500">{"}"}</span>
      </div>
    </div>
  );
}

/** Rotating HUD rings + pulsing arc-reactor, drawn in one SVG. */
function CoreSVG({ animate }: { animate: boolean }) {
  const spin = (dur: number, dir = 1) =>
    animate
      ? {
          animate: { rotate: 360 * dir },
          transition: { duration: dur, repeat: Infinity, ease: "linear" as const },
          style: { transformOrigin: "100px 100px" },
        }
      : {};

  // radial tick marks around the outer ring
  const ticks = Array.from({ length: 48 }, (_, i) => i);

  return (
    <svg
      viewBox="0 0 200 200"
      className="absolute inset-0 h-full w-full overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <filter id="hc-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="hc-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.95" />
          <stop offset="35%" stopColor={J} stopOpacity="0.9" />
          <stop offset="100%" stopColor={J} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* outer tick ring */}
      <motion.g {...spin(46)} stroke={J} opacity="0.5">
        {ticks.map((i) => {
          const long = i % 4 === 0;
          const a = (i / ticks.length) * Math.PI * 2;
          const r1 = 92;
          const r2 = long ? 84 : 88;
          // Round so server + client serialize identically (no hydration diff).
          const p = (n: number) => Math.round(n * 100) / 100;
          return (
            <line
              key={i}
              x1={p(100 + Math.cos(a) * r1)}
              y1={p(100 + Math.sin(a) * r1)}
              x2={p(100 + Math.cos(a) * r2)}
              y2={p(100 + Math.sin(a) * r2)}
              strokeWidth={long ? 1.4 : 0.8}
            />
          );
        })}
        <circle cx="100" cy="100" r="92" fill="none" strokeWidth="0.6" opacity="0.4" />
      </motion.g>

      {/* segmented mid ring (opposite spin) */}
      <motion.g {...spin(32, -1)} fill="none" stroke={J} filter="url(#hc-glow)">
        <circle
          cx="100"
          cy="100"
          r="72"
          strokeWidth="2.4"
          strokeDasharray="30 14 8 14"
          opacity="0.8"
        />
      </motion.g>

      {/* thin dashed inner ring */}
      <motion.g {...spin(24)} fill="none" stroke={J} opacity="0.55">
        <circle cx="100" cy="100" r="56" strokeWidth="1" strokeDasharray="3 9" />
      </motion.g>

      {/* hexagon chip frame */}
      <motion.g {...spin(60, -1)} fill="none" stroke={J} opacity="0.7">
        <polygon
          points="100,58 136,79 136,121 100,142 64,121 64,79"
          strokeWidth="1.4"
        />
        {/* hex corner nodes */}
        {[
          [100, 58],
          [136, 79],
          [136, 121],
          [100, 142],
          [64, 121],
          [64, 79],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill={J} stroke="none" />
        ))}
      </motion.g>

      {/* radar sweep */}
      {animate && (
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "100px 100px" }}
        >
          <path d="M100 100 L100 44 A56 56 0 0 1 148 72 Z" fill={J06} />
          <line x1="100" y1="100" x2="100" y2="46" stroke={J} strokeWidth="1" opacity="0.6" />
        </motion.g>
      )}

      {/* arc-reactor: 3 rotating chevrons + bright core */}
      <motion.g {...spin(18)} stroke={J} fill="none" filter="url(#hc-glow)">
        {[0, 120, 240].map((deg) => (
          <path
            key={deg}
            d="M100 82 L112 100 L100 96 L88 100 Z"
            strokeWidth="1.4"
            fill="rgb(var(--j) / 0.25)"
            transform={`rotate(${deg} 100 100)`}
          />
        ))}
      </motion.g>

      <motion.circle
        cx="100"
        cy="100"
        r="16"
        fill="url(#hc-core)"
        animate={
          animate ? { scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] } : undefined
        }
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "100px 100px" }}
      />
      <circle cx="100" cy="100" r="4" fill="white" filter="url(#hc-glow)" />
    </svg>
  );
}

/** Projection cone rising from a glowing base disc — the "hologram on a pedestal". */
function Pedestal({ animate }: { animate: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center"
    >
      {/* beam cone (wide at top near the core, narrow at the projector) */}
      <div
        className="relative h-[42%] w-[62%]"
        style={{
          background:
            "linear-gradient(to bottom, rgb(var(--j) / 0.16), rgb(var(--j) / 0.02) 70%, transparent)",
          clipPath: "polygon(12% 0, 88% 0, 62% 100%, 38% 100%)",
        }}
      >
        {/* rising scan line inside the beam */}
        {animate && (
          <motion.div
            className="absolute inset-x-0 h-px"
            style={{ background: "rgb(var(--j) / 0.6)" }}
            animate={{ top: ["100%", "0%"], opacity: [0, 0.8, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </div>
      {/* base disc */}
      <div className="relative -mt-1 h-3 w-[46%]">
        <div
          className="absolute inset-0 rounded-[100%] border"
          style={{
            borderColor: "rgb(var(--j) / 0.5)",
            background: "rgb(var(--j) / 0.12)",
            boxShadow: "0 0 26px rgb(var(--j) / 0.35)",
          }}
        />
        {animate && (
          <motion.div
            className="absolute inset-0 rounded-[100%]"
            style={{ background: "rgb(var(--j) / 0.25)" }}
            animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.05, 0.9] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>
    </div>
  );
}

/** A few thin horizontal light streaks drifting across the core. */
function Streaks() {
  const rows = [
    { top: "34%", dur: 3.4, delay: 0 },
    { top: "52%", dur: 2.8, delay: 0.8 },
    { top: "68%", dur: 3.9, delay: 1.6 },
  ];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {rows.map((r, i) => (
        <motion.div
          key={i}
          className="absolute h-px w-1/3 mix-blend-screen"
          style={{
            top: r.top,
            background:
              "linear-gradient(90deg, transparent, rgb(var(--j) / 0.9), transparent)",
          }}
          animate={{ left: ["-35%", "135%"], opacity: [0, 1, 0] }}
          transition={{ duration: r.dur, delay: r.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/** A small floating HUD data panel. */
function Readout({
  className,
  rows,
}: {
  className: string;
  rows: [string, string, boolean][];
}) {
  return (
    <div
      className={`jx-bd absolute rounded-lg border bg-[#04060b]/60 px-2 py-1.5 font-mono text-[8px] leading-relaxed backdrop-blur-sm sm:text-[9px] ${className}`}
      style={{ boxShadow: "0 0 20px rgb(var(--j) / 0.1)" }}
    >
      {rows.map(([label, value, live]) => (
        <div key={label} className="flex items-center justify-between gap-2 whitespace-nowrap">
          <span className="uppercase tracking-wider text-slate-500">{label}</span>
          <span style={{ color: live ? J : "rgb(148 163 184)" }}>{value}</span>
        </div>
      ))}
    </div>
  );
}
