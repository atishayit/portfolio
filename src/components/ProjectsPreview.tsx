"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { AutoSheen } from "./AutoSheen";
import { PROJECTS } from "@/content/projects";

/**
 * Homepage projects teaser — previews each project (themed to its own identity)
 * and drives visitors to the full /projects gallery as they scroll.
 */
export function ProjectsPreview() {
  return (
    <Section
      id="projects-preview"
      index="05 / Projects"
      title="Things I've shipped."
      intro="Not just demos — full products, built end-to-end and running live. Each has its own deep-dive."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {PROJECTS.map((p, i) => {
          const accent = p.accent ?? "34 211 238";
          return (
            <Reveal key={p.slug} delay={i * 0.1}>
              <Link
                href={`/projects/${p.slug}/`}
                aria-label={`Open ${p.name} showcase`}
                className="group relative block h-full overflow-hidden rounded-3xl border bg-[#04060b] p-7 transition-all duration-300 hover:-translate-y-1.5"
                style={{ borderColor: `rgb(${accent} / 0.3)` }}
              >
                {/* in-view light sweep (gives touch devices a lit-up moment) */}
                <AutoSheen delay={i * 0.1} color={`rgb(${accent} / 0.16)`} />
                {/* corner glow — hover on desktop, always-on where there's no hover */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-150 [@media(hover:none)]:opacity-100"
                  style={{ background: `rgb(${accent} / 0.16)` }}
                />
                {/* faint grid */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-50"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgb(255 255 255 / 0.04) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.04) 1px, transparent 1px)",
                    backgroundSize: "36px 36px",
                  }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span
                      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs"
                      style={{
                        borderColor: `rgb(${accent} / 0.3)`,
                        background: `rgb(${accent} / 0.1)`,
                        color: `rgb(${accent})`,
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: `rgb(${accent})` }}
                      />
                      {p.status}
                    </span>
                    <span className="font-mono text-xs text-slate-500">
                      {p.year} · {p.platform}
                    </span>
                  </div>
                  <h3
                    className="mt-5 font-display text-2xl font-bold text-white sm:text-3xl"
                    style={{ textShadow: `0 0 30px rgb(${accent} / 0.25)` }}
                  >
                    {p.name}
                  </h3>
                  <p className="mt-1 font-mono text-sm" style={{ color: `rgb(${accent} / 0.8)` }}>
                    {p.full}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-slate-400">{p.tagline}</p>
                  <span
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium"
                    style={{ color: `rgb(${accent})` }}
                  >
                    Explore the showcase
                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>

      {/* CTA to the full gallery */}
      <Reveal delay={0.2}>
        <div className="mt-10 flex justify-center">
          <Link
            href="/projects/"
            className="accent-morph group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-contrast shadow-lg shadow-accent/30 transition-transform duration-200 hover:-translate-y-0.5"
          >
            Explore all projects
            <ArrowUpRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}
