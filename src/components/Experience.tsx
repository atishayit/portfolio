"use client";

import { useRef } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { useSite } from "./providers";
import { BrandIcon } from "./brands";
import { EXPERIENCE } from "@/content/data";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Experience() {
  const { role } = useSite();
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 75%", "end 65%"],
  });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <Section
      id="experience"
      index="03 / Experience"
      title="Where I've shipped."
      intro="The same roles, told through the lens you choose — bullet points adapt to your selected focus."
    >
      <ol ref={trackRef} className="relative space-y-5 pl-10 sm:pl-14">
        {/* Timeline track + scroll-fill */}
        <div
          aria-hidden="true"
          className="absolute bottom-3 left-[18px] top-3 w-px bg-hairline"
        >
          <motion.div
            className="accent-morph absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-accent via-accent to-transparent"
            style={{ scaleY: reduce ? 1 : fill }}
          />
        </div>

        {EXPERIENCE.map((job, i) => {
          const present = job.period.includes("Present");
          return (
            <Reveal as="li" key={`${job.company}-${job.period}`} delay={i * 0.05} className="relative">
              {/* Node */}
              <span className="absolute -left-[29px] top-8 z-10 flex h-3.5 w-3.5 items-center justify-center sm:-left-[37px]">
                {present && !reduce && (
                  <span className="accent-morph absolute h-3.5 w-3.5 animate-ping rounded-full bg-accent opacity-70" />
                )}
                <span className="accent-morph h-3.5 w-3.5 rounded-full bg-accent ring-4 ring-surface" />
              </span>

              {/* Card */}
              <div className="group relative overflow-hidden rounded-3xl border border-hairline bg-surface-raised/40 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/10 sm:p-6">
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
                      <span className="shrink-0 font-mono text-xs text-ink-faint">
                        {job.period}
                      </span>
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
              </div>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}
