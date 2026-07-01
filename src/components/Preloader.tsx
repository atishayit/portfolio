"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSite } from "./providers";
import { PERSON } from "@/content/data";

const EASE = [0.76, 0, 0.24, 1] as const;

export function Preloader() {
  const { intro, completeIntro } = useSite();
  const reduce = useReducedMotion();
  // If the provider says the intro is already done (return visit / reduced motion), never show.
  const [skipped] = useState(intro);
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  // Render nothing until mounted so SSR and the first client render match
  // (avoids a hydration mismatch when the intro was already seen this session).
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (skipped) {
      if (!intro) completeIntro();
      return;
    }
    document.body.style.overflow = "hidden";

    const duration = reduce ? 0 : 1500;
    const start = performance.now();
    let raf = 0;
    let revealTimer = 0;
    let finished = false;

    // Idempotent completion — lifts the curtain and reveals the hero.
    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      clearTimeout(revealTimer);
      clearTimeout(failsafe);
      setCount(100);
      completeIntro();
      setLeaving(true);
      document.body.style.overflow = "";
    };

    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const tick = (now: number) => {
      const p = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
      setCount(Math.round(easeOutExpo(p) * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // Reveal the hero underneath as the curtain begins to lift (layered feel).
        revealTimer = window.setTimeout(finish, 280);
      }
    };
    raf = requestAnimationFrame(tick);

    // Hard failsafe: guarantees the site is never stuck on the loader, even if
    // requestAnimationFrame is throttled/paused (e.g. loaded in a background tab).
    const failsafe = window.setTimeout(finish, reduce ? 80 : 2600);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(revealTimer);
      clearTimeout(failsafe);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted || skipped) return null;

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-surface"
          initial={{ clipPath: "circle(150% at 50% 50%)" }}
          animate={{ clipPath: "circle(150% at 50% 50%)" }}
          exit={{ clipPath: "circle(0% at 50% 50%)" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {/* Center: monogram + name rising into view */}
          <div className="flex flex-col items-center overflow-hidden">
            <motion.div
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="accent-morph bg-gradient-to-br from-accent to-accent/40 bg-clip-text font-display text-7xl font-bold leading-none text-transparent sm:text-8xl"
            >
              {PERSON.initials}
            </motion.div>
          </div>
          <div className="mt-5 overflow-hidden">
            <motion.p
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
              className="font-mono text-xs uppercase tracking-[0.5em] text-ink-muted sm:text-sm"
            >
              {PERSON.name}
            </motion.p>
          </div>

          {/* Progress line */}
          <div className="mt-8 h-px w-44 overflow-hidden bg-hairline sm:w-56">
            <motion.div
              className="accent-morph h-full bg-accent"
              style={{ width: `${count}%` }}
            />
          </div>

          {/* Big counter, bottom-right */}
          <div className="pointer-events-none absolute bottom-6 right-6 flex items-end font-mono font-medium text-ink sm:bottom-10 sm:right-10">
            <span className="text-5xl tabular-nums sm:text-7xl">{count}</span>
            <span className="mb-1 ml-1 text-xl text-accent sm:text-2xl">%</span>
          </div>

          {/* Small label, bottom-left */}
          <div className="absolute bottom-7 left-6 font-mono text-[11px] uppercase tracking-widest text-ink-faint sm:bottom-11 sm:left-10">
            Loading portfolio
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
