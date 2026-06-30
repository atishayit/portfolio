"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { EDUCATION } from "@/content/data";

/** Animated radial progress ring for an academic score. */
function ScoreRing({ value }: { value: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [p, setP] = useState(0);
  const decimals = Number.isInteger(value) ? 0 : 1;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let timer = 0;
    let started = false;

    const run = () => {
      if (started) return;
      started = true;
      if (reduce) {
        setP(value);
        return;
      }
      const t0 = performance.now();
      const dur = 1400;
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);
      const tick = (now: number) => {
        const q = Math.min(1, (now - t0) / dur);
        setP(ease(q) * value);
        if (q < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      timer = window.setTimeout(() => setP(value), dur + 200);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [value, reduce]);

  const R = 52;
  const C = 2 * Math.PI * R;
  const offset = C * (1 - Math.min(p, 100) / 100);

  return (
    <div ref={ref} className="relative h-28 w-28 shrink-0 sm:h-32 sm:w-32">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle
          cx="60"
          cy="60"
          r={R}
          fill="none"
          strokeWidth="8"
          style={{ stroke: "rgb(var(--hairline))" }}
        />
        <circle
          cx="60"
          cy="60"
          r={R}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          style={{ stroke: "rgb(var(--accent))", transition: "stroke 0.6s" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="accent-morph font-display text-2xl font-bold text-accent sm:text-3xl">
          {p.toFixed(decimals)}
          <span className="text-lg text-ink-faint">%</span>
        </span>
      </div>
    </div>
  );
}

export function Education() {
  const reduce = useReducedMotion();

  return (
    <Section
      id="education"
      index="07 / Education"
      title="Academic foundation."
      intro="High distinction across both degrees — the grounding behind the engineering and the science."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {EDUCATION.map((edu, i) => {
          const inProgress = edu.period.includes("Expected");
          return (
            <Reveal key={edu.institution} delay={i * 0.1}>
              <div className="group flex h-full items-center gap-5 rounded-3xl border border-hairline bg-surface-raised/40 p-6 transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 sm:gap-7 sm:p-7">
                <ScoreRing value={parseFloat(edu.score)} />
                <div className="min-w-0">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider ${
                      inProgress
                        ? "accent-morph border-accent/30 bg-accent/10 text-accent"
                        : "border-hairline text-ink-faint"
                    }`}
                  >
                    {inProgress ? (
                      <>
                        <span className="relative flex h-1.5 w-1.5">
                          {!reduce && (
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                          )}
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                        </span>
                        In progress
                      </>
                    ) : (
                      <>
                        <Check size={12} /> Completed
                      </>
                    )}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-semibold text-ink">
                    {edu.institution}
                  </h3>
                  <p className="mt-1 text-ink-muted">{edu.credential}</p>
                  <p className="mt-3 font-mono text-xs text-ink-faint">
                    {edu.detail} · {edu.period}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
