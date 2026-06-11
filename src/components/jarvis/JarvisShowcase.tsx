"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowLeft } from "lucide-react";
import { JarvisVideo } from "./JarvisVideo";
import { Reveal } from "@/components/Reveal";
import { GithubIcon } from "@/components/icons";
import type { Project } from "@/content/projects";

export function JarvisShowcase({ project }: { project: Project }) {
  return (
    <div className="relative min-h-screen bg-[#04060b] text-slate-300">
      <div aria-hidden="true" className="jarvis-grid pointer-events-none fixed inset-0" />
      <div
        aria-hidden="true"
        className="jarvis-scanlines pointer-events-none fixed inset-0 opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]"
      />

      <Nav project={project} />
      <Hero project={project} />
      <HowItWorks project={project} />
      <Capabilities project={project} />
      <Tech project={project} />
      <Cta project={project} />
    </div>
  );
}

function Nav({ project }: { project: Project }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-cyan-400/15 bg-[#04060b]/70 px-4 py-2.5 backdrop-blur">
        <Link
          href="/projects/"
          className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-cyan-300"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          Projects
        </Link>
        <span className="font-mono text-xs tracking-[0.3em] text-cyan-300/80">{project.name}</span>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-cyan-300"
        >
          <GithubIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Repo</span>
        </a>
      </div>
    </header>
  );
}

function Hero({ project }: { project: Project }) {
  return (
    <section className="relative mx-auto flex min-h-screen max-w-6xl items-center px-5 pb-20 pt-28 sm:px-6">
      <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
        <div>
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400/80">
              {"// Featured project — "}
              {project.year} · {project.platform} · {project.status}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1
              className="mt-5 font-display text-6xl font-bold tracking-tight text-white sm:text-7xl"
              style={{ textShadow: "0 0 44px rgb(34 211 238 / 0.25)" }}
            >
              {project.name}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-3 font-mono text-sm text-cyan-300/90 sm:text-base">{project.full}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
              {project.tagline}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#capabilities"
                className="group inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#04060b] shadow-lg shadow-cyan-500/30 transition-transform hover:-translate-y-0.5"
              >
                See what it does
                <ArrowDown size={15} className="transition-transform group-hover:translate-y-0.5" />
              </a>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 backdrop-blur transition-colors hover:border-cyan-400/60 hover:text-cyan-300"
              >
                <GithubIcon className="h-4 w-4" /> View code
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.28}>
            <BootLog lines={project.bootLog} />
          </Reveal>
        </div>

        <Reveal delay={0.1} className="relative mx-auto w-full max-w-md">
          <JarvisVideo
            src={project.heroVideo.src}
            poster={project.heroVideo.poster}
            label="● Standby"
            aspect="square"
            ambient
          />
        </Reveal>
      </div>
    </section>
  );
}

function BootLog({ lines }: { lines: string[] }) {
  const reduce = useReducedMotion();
  return (
    <div className="mt-8 max-w-md rounded-xl border border-cyan-400/15 bg-black/40 p-4 font-mono text-[11px] leading-6 text-cyan-300/75 sm:text-xs">
      {lines.map((l, i) => (
        <motion.div
          key={i}
          initial={reduce ? false : { opacity: 0, x: -6 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.22, duration: 0.3 }}
        >
          {l}
        </motion.div>
      ))}
      <span className="mt-1 inline-block h-3.5 w-2 animate-pulse bg-cyan-400/80 align-middle" />
    </div>
  );
}

function HowItWorks({ project }: { project: Project }) {
  return (
    <section className="relative mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-28">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400/70">
          {"// How it works"}
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">
          Wake. Listen. Reason. Speak.
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {project.steps.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div className="relative h-full rounded-2xl border border-cyan-400/15 bg-white/[0.02] p-5">
              <div className="font-mono text-xs uppercase tracking-widest text-cyan-300/70">
                {s.label}
              </div>
              <h3 className="mt-3 font-display text-xl font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.desc}</p>
              <span className="mt-4 inline-flex rounded-md border border-cyan-400/20 bg-cyan-400/5 px-2 py-0.5 font-mono text-xs text-cyan-300">
                {s.tech}
              </span>
              {i < project.steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-2 top-1/2 hidden font-mono text-cyan-400/40 lg:block"
                >
                  →
                </span>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Capabilities({ project }: { project: Project }) {
  return (
    <section id="capabilities" className="relative mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-24">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400/70">
          {"// Capabilities"}
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">
          What it can do.
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
          Real moments, captured on my Mac. More demos drop in as I record them.
        </p>
      </Reveal>

      {/* Alternating video rows */}
      <div className="mt-16 space-y-20 sm:space-y-28">
        {project.showcase.map((clip, i) => {
          const flip = i % 2 === 1;
          return (
            <div
              key={clip.title}
              className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12"
            >
              <Reveal className={flip ? "lg:order-2" : ""}>
                <JarvisVideo
                  src={clip.src}
                  poster={clip.poster}
                  aspect={clip.aspect ?? "video"}
                  label={clip.src ? "● Live" : undefined}
                />
              </Reveal>
              <Reveal delay={0.08} className={flip ? "lg:order-1" : ""}>
                <div>
                  <span className="font-mono text-xs text-cyan-500/70">
                    {String(i + 1).padStart(2, "0")} / {String(project.showcase.length).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-semibold text-white sm:text-3xl">
                    {clip.title}
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-slate-400">
                    {clip.desc}
                  </p>
                  {clip.command && (
                    <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/5 px-3.5 py-1.5 font-mono text-sm text-cyan-300">
                      <span className="text-cyan-500/70">›</span>
                      {clip.command}
                    </p>
                  )}
                </div>
              </Reveal>
            </div>
          );
        })}
      </div>

      {/* And-more feature grid */}
      <div className="mt-24 border-t border-cyan-400/10 pt-14">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400/70">
            {"// And it also…"}
          </p>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {project.features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 4) * 0.06}>
              <div className="group h-full rounded-2xl border border-cyan-400/[0.12] bg-white/[0.02] p-5 transition-colors duration-300 hover:border-cyan-400/40">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-cyan-500/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-cyan-400/30 transition-colors group-hover:bg-cyan-400" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Tech({ project }: { project: Project }) {
  return (
    <section className="relative mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-28">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400/70">
          {"// System architecture"}
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">Built with</h2>
      </Reveal>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {project.tech.map((g, i) => (
          <Reveal key={g.group} delay={i * 0.06}>
            <div className="h-full rounded-2xl border border-cyan-400/15 bg-white/[0.02] p-5">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cyan-300/80">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                {g.group}
              </div>
              <ul className="mt-4 space-y-2">
                {g.items.map((it) => (
                  <li key={it} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="font-mono text-cyan-500/70">›</span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Cta({ project }: { project: Project }) {
  return (
    <section className="relative px-5 py-28 sm:px-6 sm:py-36">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="font-display text-4xl font-semibold text-white sm:text-5xl">
            Explore the build.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-md text-slate-400">
            The full source — HUD, tool calls, voice pipeline and Mac integrations — is on GitHub.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-[#04060b] shadow-lg shadow-cyan-500/30 transition-transform hover:-translate-y-0.5"
            >
              <GithubIcon className="h-4 w-4" /> View on GitHub
            </a>
            <Link
              href="/projects/"
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-cyan-400/60 hover:text-cyan-300"
            >
              <ArrowLeft size={16} /> All projects
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
