"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Cinematic AI boot sequence shown once per session when the JARVIS page mounts.
 * Four stages over ~2.6s, then the overlay dissolves to reveal the page. No
 * cheesy progress bar — a HUD with an assembling core and scanning status lines.
 */

const STAGES = [
  { label: "Initializing neural core", sub: "claude · tool-router" },
  { label: "Loading memory banks", sub: "supabase · context store" },
  { label: "Connecting systems", sub: "voice · calendar · mail · spotify" },
  { label: "J.A.R.V.I.S online", sub: "all systems nominal" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function JarvisBoot() {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(0);
  const [done, setDone] = useState(false);

  // Run only once per session, and never for reduced-motion users.
  const [active, setActive] = useState<null | boolean>(null);
  useEffect(() => {
    let skip = false;
    try {
      skip = !!sessionStorage.getItem("jarvis-boot");
    } catch {
      /* ignore */
    }
    if (skip || reduce) {
      setActive(false);
      return;
    }
    try {
      sessionStorage.setItem("jarvis-boot", "1");
    } catch {
      /* ignore */
    }
    setActive(true);
    document.documentElement.style.overflow = "hidden";
  }, [reduce]);

  useEffect(() => {
    if (active !== true) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    [600, 1200, 1800].forEach((t, i) =>
      timers.push(setTimeout(() => setStage(i + 1), t))
    );
    timers.push(setTimeout(() => setDone(true), 2600));
    timers.push(
      setTimeout(() => {
        setActive(false);
        document.documentElement.style.overflow = "";
      }, 3300)
    );
    return () => timers.forEach(clearTimeout);
  }, [active]);

  return (
    <AnimatePresence>
      {active === true && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#04060b]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {/* scanlines + grid */}
          <div className="jarvis-grid pointer-events-none absolute inset-0 opacity-60" />
          <div className="jarvis-scanlines pointer-events-none absolute inset-0 opacity-50" />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
            style={{ background: "rgb(var(--j) / 0.16)" }}
          />

          <div className="relative flex flex-col items-center">
            {/* assembling core */}
            <motion.div
              className="relative grid h-40 w-40 place-items-center"
              animate={done ? { scale: 1.12 } : { scale: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <BootCore done={done} />
            </motion.div>

            {/* status line */}
            <div className="mt-10 h-6 text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={stage}
                  initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="font-mono text-sm uppercase tracking-[0.35em] text-white"
                >
                  {STAGES[stage].label}
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="mt-2 font-mono text-[11px] tracking-widest text-slate-600">
              {STAGES[stage].sub}
            </p>

            {/* stage ticks */}
            <div className="mt-7 flex items-center gap-2">
              {STAGES.map((_, i) => (
                <span
                  key={i}
                  className="h-1 w-8 rounded-full transition-colors duration-300"
                  style={{
                    background:
                      i <= stage ? "rgb(var(--j))" : "rgb(255 255 255 / 0.1)",
                  }}
                />
              ))}
            </div>
          </div>

          <span className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-700">
            secure boot · on-device
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BootCore({ done }: { done: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full">
      <defs>
        <filter id="boot-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* outer rotating arcs */}
      <motion.g
        style={{ transformOrigin: "60px 60px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        stroke="rgb(var(--j))"
        fill="none"
        filter="url(#boot-glow)"
      >
        <motion.circle
          cx="60"
          cy="60"
          r="52"
          strokeWidth="1.5"
          strokeDasharray="40 18"
          opacity="0.7"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: EASE }}
        />
      </motion.g>
      <motion.g
        style={{ transformOrigin: "60px 60px" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        stroke="rgb(var(--j) / 0.6)"
        fill="none"
      >
        <circle cx="60" cy="60" r="40" strokeWidth="1" strokeDasharray="6 10" />
      </motion.g>

      {/* core */}
      <motion.circle
        cx="60"
        cy="60"
        r="14"
        fill="rgb(var(--j) / 0.18)"
        stroke="rgb(var(--j))"
        strokeWidth="1.5"
        filter="url(#boot-glow)"
        animate={
          done
            ? { r: [14, 20, 16], opacity: 1 }
            : { r: [12, 16, 12], opacity: [0.6, 1, 0.6] }
        }
        transition={{ duration: done ? 0.6 : 1.6, repeat: done ? 0 : Infinity, ease: "easeInOut" }}
      />
      <circle cx="60" cy="60" r="3.5" fill="rgb(var(--j))" filter="url(#boot-glow)" />
    </svg>
  );
}
