import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Background } from "@/components/Background";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PROJECTS } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected things Atishay Jain has built end-to-end.",
};

export default function ProjectsPage() {
  return (
    <>
      <Background />
      <Header />
      <main className="mx-auto min-h-[100svh] max-w-container px-5 pb-24 pt-32 sm:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
          {"// Selected work"}
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl md:text-6xl">
          Projects
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
          A small, growing set of things I&apos;ve built end-to-end. One is live below — more
          are in progress.
        </p>

        <div className="mt-12 space-y-4">
          {PROJECTS.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}/`}
              aria-label={`Open ${p.name} showcase`}
              className="group relative block overflow-hidden rounded-4xl border border-hairline bg-[#04060b] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-500/10 sm:p-10"
            >
              <div
                aria-hidden="true"
                className="jarvis-grid pointer-events-none absolute inset-0 opacity-60"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]"
              />
              <div className="relative grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-mono text-xs text-cyan-300">
                    Featured · {p.year} · {p.platform}
                  </span>
                  <h2
                    className="mt-5 font-display text-4xl font-bold text-white sm:text-5xl"
                    style={{ textShadow: "0 0 40px rgb(34 211 238 / 0.25)" }}
                  >
                    {p.name}
                  </h2>
                  <p className="mt-2 font-mono text-sm text-cyan-300/80">{p.full}</p>
                  <p className="mt-5 max-w-lg text-slate-400">{p.tagline}</p>
                  <span className="mt-7 inline-flex items-center gap-2 font-medium text-cyan-300">
                    Explore the showcase
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>
                <div className="relative mx-auto w-48 sm:w-60">
                  <div className="overflow-hidden rounded-2xl border border-cyan-400/25">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.bootVideo.poster}
                      alt={`${p.name} HUD`}
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                  {["left-0 top-0 border-l-2 border-t-2", "right-0 top-0 border-r-2 border-t-2", "bottom-0 left-0 border-b-2 border-l-2", "bottom-0 right-0 border-b-2 border-r-2"].map(
                    (c, i) => (
                      <span
                        key={i}
                        aria-hidden="true"
                        className={`pointer-events-none absolute h-4 w-4 border-cyan-400/70 ${c}`}
                      />
                    )
                  )}
                </div>
              </div>
            </Link>
          ))}

          <div className="grid place-items-center rounded-4xl border border-dashed border-hairline p-10 text-center">
            <p className="font-mono text-sm text-ink-faint">
              More projects in progress — building them simultaneously.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
