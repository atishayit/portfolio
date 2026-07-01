"use client";

import { useRef } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Section } from "./Section";
import { useSite } from "./providers";
import { BrandIcon } from "./brands";
import { EXPERIENCE, type RoleId } from "@/content/data";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Experience() {
  const { role } = useSite();
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <Section
      id="experience"
      index="03 / Experience"
      title="Where I've shipped."
      intro="The same roles, told through the lens you choose — scroll to stack the timeline, bullets adapt to your selected focus."
    >
      <div ref={containerRef} className="relative">
        {EXPERIENCE.map((job, i) => (
          <ExpCard
            key={`${job.company}-${job.period}`}
            job={job}
            i={i}
            total={EXPERIENCE.length}
            role={role}
            reduce={!!reduce}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </Section>
  );
}

type Job = (typeof EXPERIENCE)[number];

function ExpCard({
  job,
  i,
  total,
  role,
  reduce,
  progress,
}: {
  job: Job;
  i: number;
  total: number;
  role: RoleId;
  reduce: boolean;
  progress: MotionValue<number>;
}) {
  // Covered cards shrink slightly as the next one stacks over them.
  const last = i === total - 1;
  const scale = useTransform(
    progress,
    [i / total, (i + 1) / total],
    [1, last ? 1 : 0.93]
  );
  const present = job.period.includes("Present");

  return (
    <div
      className="sticky pb-5"
      style={{ top: `${112 + i * 28}px` }}
    >
      <motion.div
        style={reduce ? undefined : { scale }}
        className="group relative origin-top overflow-hidden rounded-3xl border border-hairline bg-surface-raised/80 p-6 shadow-2xl shadow-black/10 backdrop-blur-xl transition-colors duration-300 hover:border-accent/40 sm:p-8"
      >
        <div
          aria-hidden="true"
          className="accent-morph pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        />
        <div className="relative flex items-start gap-4">
          <span className="accent-morph grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent/40 font-display text-lg font-bold text-accent-contrast shadow-lg shadow-accent/25">
            {job.company.charAt(0)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              <h3 className="font-display text-lg font-semibold text-ink sm:text-xl">
                {job.role}
              </h3>
              <span className="shrink-0 font-mono text-xs text-ink-faint">{job.period}</span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="accent-morph text-sm font-semibold text-accent">
                {job.company}
              </span>
              <span className="text-ink-faint">·</span>
              <span className="text-sm text-ink-faint">{job.location}</span>
              {present && (
                <span className="accent-morph ml-1 inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                  <span className="relative flex h-1.5 w-1.5">
                    {!reduce && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                    )}
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                  Current
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Role-morphing bullets */}
        <div className="relative mt-5 min-h-[8rem]">
          <AnimatePresence mode="wait">
            <motion.ul
              key={role}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="space-y-2.5"
            >
              {job.bullets[role].map((b, bi) => (
                <li
                  key={bi}
                  className="flex gap-3 text-sm leading-relaxed text-ink-muted sm:text-[15px]"
                >
                  <span className="accent-morph mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
                  <span>{b}</span>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>

        {/* Tech tags */}
        <ul className="relative mt-4 flex flex-wrap gap-2">
          {job.tags.map((tag) => (
            <li
              key={tag}
              className="flex items-center gap-1.5 rounded-md bg-accent/10 px-2 py-0.5 font-mono text-xs text-accent"
            >
              <BrandIcon name={tag} size={13} className="shrink-0" />
              {tag}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
