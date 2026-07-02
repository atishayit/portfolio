"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Award, Medal, Rocket, Trophy, type LucideIcon } from "lucide-react";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { AWARDS, type AwardItem } from "@/content/data";

const ICONS: Record<AwardItem["icon"], LucideIcon> = {
  trophy: Trophy,
  rocket: Rocket,
  medal: Medal,
  award: Award,
};

const METRICS = [
  { to: 3, prefix: "", suffix: "+", label: "Years shipping production software" },
  { to: 20, prefix: "$", suffix: "K", label: "Saved annually by one AI MVP" },
  { to: 2, prefix: "", suffix: "", label: "IEEE research publications" },
  { to: 7, prefix: "", suffix: "", label: "Professional certifications" },
];

/** Counts up from 0 to `to` once it scrolls into view. */
function Counter({
  to,
  prefix = "",
  suffix = "",
  duration = 1500,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let finalTimer = 0;
    let started = false;

    const run = () => {
      if (started) return;
      started = true;
      if (reduce) {
        setN(to);
        return;
      }
      const t0 = performance.now();
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        setN(Math.round(ease(p) * to));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      // Guarantee the final value even if rAF is throttled (e.g. background tab).
      finalTimer = window.setTimeout(() => setN(to), duration + 200);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(finalTimer);
    };
  }, [to, reduce, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {n}
      {suffix}
    </span>
  );
}

export function Recognition() {
  const reduce = useReducedMotion();

  return (
    <Section
      id="recognition"
      index="04 / Recognition"
      title="Recognised for the work."
      intro="Awards and honours earned for delivering critical products and high-accuracy models under pressure — and the impact behind them."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {AWARDS.map((award, i) => {
          const Icon = ICONS[award.icon] ?? Trophy;
          return (
            <Reveal key={award.title} delay={i * 0.1}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-amber-500/40 bg-amber-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/60 hover:shadow-xl hover:shadow-amber-500/15 [@media(hover:none)]:border-amber-500/60 [@media(hover:none)]:shadow-xl [@media(hover:none)]:shadow-amber-500/15 dark:border-amber-400/20 dark:bg-amber-400/[0.05] dark:hover:border-amber-400/50 dark:hover:shadow-amber-400/10 dark:[@media(hover:none)]:border-amber-400/40 dark:[@media(hover:none)]:shadow-amber-400/10">
                {/* Gold corner glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-400/25 blur-2xl"
                />

                {/* Shine — once on scroll-in */}
                {!reduce && (
                  <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-amber-200/50 to-transparent"
                    initial={{ x: "-60%", opacity: 0 }}
                    whileInView={{ x: "420%", opacity: [0, 1, 0] }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: "easeInOut" }}
                  />
                )}

                {/* Shine — replays on hover (snaps back instantly via duration-0 base) */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[150%] -skew-x-12 bg-gradient-to-r from-transparent via-amber-200/55 to-transparent transition-transform duration-0 ease-out group-hover:translate-x-[420%] group-hover:duration-[1100ms]"
                />

                <div className="relative flex items-start justify-between">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/40 dark:from-amber-300 dark:to-amber-500 dark:text-amber-950 dark:shadow-amber-500/30">
                    <Icon size={26} strokeWidth={2} />
                  </span>
                  {award.badge && (
                    <span className="rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 font-mono text-xs font-semibold text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300">
                      {award.badge}
                    </span>
                  )}
                </div>

                <h3 className="relative mt-5 font-display text-xl font-semibold text-ink">
                  {award.title}
                </h3>
                <p className="relative mt-1 text-sm font-semibold text-amber-700 dark:text-amber-300/90">
                  {award.issuer}
                </p>
                <p className="relative mt-3 text-sm leading-relaxed text-ink-muted">
                  {award.detail}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Impact metrics */}
      <div className="mt-12 border-t border-hairline pt-10">
        <Reveal>
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-accent">
            <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
            Impact by the numbers
          </div>
        </Reveal>
        <div className="mt-7 grid grid-cols-2 gap-6 md:grid-cols-4">
          {METRICS.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.08}>
              <p className="accent-morph font-display text-4xl font-bold text-accent sm:text-5xl">
                <Counter to={m.to} prefix={m.prefix} suffix={m.suffix} />
              </p>
              <p className="mt-2 text-sm leading-snug text-ink-muted">{m.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
