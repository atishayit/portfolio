import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { RevealText } from "./RevealText";

interface SectionProps {
  id: string;
  /** Monospace kicker, e.g. "01 / About" */
  index: string;
  title: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, index, title, intro, children, className }: SectionProps) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 ${className ?? ""}`}
    >
      <div className="mx-auto w-full max-w-container">
        <Reveal>
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-accent">
            <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
            {index}
          </div>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl md:text-5xl">
            <RevealText text={title} />
          </h2>
          {intro && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
              {intro}
            </p>
          )}
        </Reveal>
        <div className="mt-12 sm:mt-14">{children}</div>
      </div>
    </section>
  );
}
