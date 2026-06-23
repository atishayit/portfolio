"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { Reveal, RevealGroup } from "../Reveal";
import { GithubIcon } from "../icons";
import { VoltaChart } from "./VoltaChart";
import { VoltaModelDiagram } from "./VoltaModelDiagram";
import { VOLTA } from "@/content/volta";

const V = VOLTA.accent; // amber "r g b"
const V2 = VOLTA.accent2; // electric blue

/** A small pulsing "live" dot. */
function LiveDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span
        className="absolute inline-flex h-full w-full animate-ping rounded-full"
        style={{ background: `rgb(${V})`, opacity: 0.7 }}
      />
      <span
        className="relative inline-flex h-2 w-2 rounded-full"
        style={{ background: `rgb(${V})` }}
      />
    </span>
  );
}

/** Counts a numeric value up from zero when scrolled into view. */
function CountUp({ value }: { value: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  // Accept an ASCII or Unicode minus in the numeric part.
  const m = value.match(/^(\D*?)(-?−?[\d.]+)(.*)$/);
  const prefix = m ? m[1] : "";
  const numStr = m ? m[2].replace("−", "-") : "";
  const suffix = m ? m[3] : "";
  const target = numStr ? parseFloat(numStr) : 0;
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  const sign = numStr.trim().startsWith("-") ? "−" : "";
  const [disp, setDisp] = useState(0);

  // Depend only on primitives — `m` is a fresh array each render and would
  // otherwise restart the animation on every setDisp tick (twitch + stuck near 0).
  useEffect(() => {
    if (!numStr) return;
    if (reduce || !inView) {
      setDisp(Math.abs(target));
      return;
    }
    const controls = animate(0, Math.abs(target), {
      duration: 1.3,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisp(v),
    });
    return () => controls.stop();
  }, [inView, reduce, target, numStr]);

  if (!m) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref}>
      {prefix}
      {sign}
      {disp.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/** Subtle pointer-driven 3D tilt wrapper. */
function Tilt({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), {
    stiffness: 150,
    damping: 18,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), {
    stiffness: 150,
    damping: 18,
  });
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Amber HUD corner brackets around a framed element. */
function Brackets() {
  return (
    <>
      {[
        "left-0 top-0 border-l-2 border-t-2",
        "right-0 top-0 border-r-2 border-t-2",
        "bottom-0 left-0 border-b-2 border-l-2",
        "bottom-0 right-0 border-b-2 border-r-2",
      ].map((c) => (
        <span
          key={c}
          aria-hidden="true"
          style={{ borderColor: `rgb(${V} / 0.7)` }}
          className={`pointer-events-none absolute h-5 w-5 ${c}`}
        />
      ))}
    </>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-mono text-xs uppercase tracking-[0.3em]"
      style={{ color: `rgb(${V})` }}
    >
      {children}
    </p>
  );
}

export function VoltaShowcase() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070d] text-slate-300">
      {/* ambient grid + amber glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(255 255 255 / 0.035) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.035) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full blur-[130px]"
        style={{ background: `rgb(${V} / 0.12)` }}
      />

      <Nav />

      <main className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <Hero />
        <LiveDemo />
        <Pipeline />
        <Model />
        <Features />
        <Tech />
        <Closing />
      </main>

      <Foot />
    </div>
  );
}

function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-40 mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6">
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/50 px-4 py-2 backdrop-blur">
        <Link
          href="/projects/"
          className="inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} /> Projects
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <a
          href={VOLTA.github}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-sm text-slate-300 backdrop-blur transition-colors hover:text-white sm:inline-flex"
        >
          <GithubIcon className="h-4 w-4" /> Code
        </a>
        <a
          href={VOLTA.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-black"
          style={{ background: `rgb(${V})` }}
        >
          Live demo <ArrowUpRight size={15} />
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="pb-16 pt-28 sm:pt-36">
      <Reveal>
        <Kicker>{"// energy forecasting · anomaly detection"}</Kicker>
      </Reveal>
      <Reveal delay={0.05}>
        <h1
          className="mt-5 font-display text-6xl font-bold tracking-tight text-white sm:text-8xl"
          style={{ textShadow: `0 0 50px rgb(${V} / 0.25)` }}
        >
          VOLTA
        </h1>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-3 font-mono text-sm" style={{ color: `rgb(${V} / 0.85)` }}>
          {VOLTA.full}
        </p>
      </Reveal>
      <Reveal delay={0.15}>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
          {VOLTA.tagline}
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={VOLTA.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
            style={{ background: `rgb(${V})` }}
          >
            Try the live demo <ArrowUpRight size={16} />
          </a>
          <a
            href={VOLTA.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-white/30"
          >
            <GithubIcon className="h-4 w-4" /> View the code
          </a>
        </div>
      </Reveal>

      {/* headline metrics */}
      <RevealGroup className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {VOLTA.metrics.map((m) => (
          <Reveal key={m.label}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p
                className="font-display text-3xl font-bold"
                style={{ color: `rgb(${V})` }}
              >
                <CountUp value={m.value} />
              </p>
              <p className="mt-1 text-xs leading-snug text-slate-500">{m.label}</p>
            </div>
          </Reveal>
        ))}
      </RevealGroup>

      {/* live forecast readout — animated signature */}
      <Reveal delay={0.05} className="mt-10">
        <div
          className="relative overflow-hidden rounded-2xl border bg-[#070b14] p-4 sm:p-5"
          style={{ borderColor: `rgb(${V} / 0.2)` }}
        >
          <div className="mb-1 flex items-center justify-between">
            <span
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest"
              style={{ color: `rgb(${V})` }}
            >
              <LiveDot /> 24h demand forecast
            </span>
            <span className="font-mono text-[11px] text-slate-600">
              actual <span style={{ color: `rgb(${V2})` }}>→ forecast</span>
            </span>
          </div>
          <VoltaChart className="h-40 w-full sm:h-52" />
        </div>
      </Reveal>

      {/* hero screenshot */}
      <Reveal delay={0.1} className="mt-6">
        <div className="relative [perspective:1200px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-3 rounded-[2rem] blur-2xl"
            style={{ background: `rgb(${V} / 0.12)` }}
          />
          <Tilt>
            <div
              className="relative overflow-hidden rounded-2xl border bg-black"
              style={{ borderColor: `rgb(${V} / 0.25)` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={VOLTA.shots.hero}
                alt="VOLTA dashboard — forecast and what-if simulator"
                className="w-full"
              />
            </div>
          </Tilt>
          <Brackets />
        </div>
      </Reveal>
    </section>
  );
}

function LiveDemo() {
  return (
    <section className="border-t border-white/5 py-20">
      <Reveal>
        <Kicker>{"// try it yourself"}</Kicker>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-semibold text-white sm:text-5xl">
          The real app, running right here.
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
          This is the live VOLTA deployment, embedded. Drag the temperature and the
          CNN-BiLSTM re-forecasts the next 24 hours — the model runs in your browser
          via ONNX, with no server behind it.
        </p>
      </Reveal>

      <Reveal delay={0.12} className="mt-8">
        <div className="relative">
          <div
            className="relative overflow-hidden rounded-2xl border bg-black"
            style={{ borderColor: `rgb(${V} / 0.3)` }}
          >
            {/* faux browser chrome */}
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-white/15" />
              <span className="h-3 w-3 rounded-full bg-white/15" />
              <span className="h-3 w-3 rounded-full bg-white/15" />
              <span className="ml-3 truncate font-mono text-xs text-slate-500">
                volta-virid.vercel.app
              </span>
              <span
                className="ml-2 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider"
                style={{ color: `rgb(${V})`, background: `rgb(${V} / 0.1)` }}
              >
                <LiveDot /> live
              </span>
              <a
                href={VOLTA.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-white"
              >
                Open full screen <ExternalLink size={12} />
              </a>
            </div>

            {/* desktop: live iframe; small screens: screenshot + button */}
            <iframe
              src={VOLTA.demo}
              title="VOLTA live demo"
              loading="lazy"
              className="hidden h-[680px] w-full bg-[#05070d] md:block"
            />
            <div className="md:hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={VOLTA.shots.dashboard}
                alt="VOLTA full dashboard"
                className="w-full"
              />
              <a
                href={VOLTA.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border-t border-white/10 px-5 py-4 text-sm font-semibold"
                style={{ color: `rgb(${V})` }}
              >
                Open the live demo <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Pipeline() {
  return (
    <section className="border-t border-white/5 py-20">
      <Reveal>
        <Kicker>{"// how it works"}</Kicker>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-white sm:text-4xl">
          From real grid data to an in-browser forecast.
        </h2>
      </Reveal>
      <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VOLTA.steps.map((s) => (
          <Reveal key={s.label}>
            <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p
                className="font-mono text-xs uppercase tracking-widest"
                style={{ color: `rgb(${V})` }}
              >
                {s.label}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold text-white">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.desc}</p>
              <p className="mt-4 font-mono text-xs text-slate-600">{s.tech}</p>
            </div>
          </Reveal>
        ))}
      </RevealGroup>
    </section>
  );
}

function Model() {
  const sc = VOLTA.model.scorecard;
  return (
    <section className="border-t border-white/5 py-20">
      <Reveal>
        <Kicker>{"// the model"}</Kicker>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-white sm:text-4xl">
          A CNN-BiLSTM that learns the grid&apos;s rhythm.
        </h2>
      </Reveal>

      {/* animated architecture diagram — the showpiece */}
      <Reveal delay={0.1} className="mt-10">
        <div className="group relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-2 rounded-[2rem] blur-2xl transition-opacity duration-500"
            style={{ background: `rgb(${V} / 0.1)` }}
          />
          <div
            className="relative overflow-hidden rounded-2xl border bg-[#070b14]/80 px-2 py-4 sm:px-6 sm:py-6"
            style={{
              borderColor: `rgb(${V} / 0.22)`,
              backgroundImage:
                "linear-gradient(rgb(255 255 255 / 0.025) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.025) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          >
            <div className="mb-1 flex items-center justify-between px-2">
              <span
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest"
                style={{ color: `rgb(${V})` }}
              >
                <LiveDot /> architecture
              </span>
              <span className="font-mono text-[11px] text-slate-600">
                window <span style={{ color: `rgb(${V2})` }}>→ 24h forecast</span>
              </span>
            </div>
            <VoltaModelDiagram className="h-[220px] w-full sm:h-[300px]" />
          </div>
          <Brackets />
        </div>
      </Reveal>

      <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <p className="text-base leading-relaxed text-slate-400">
              {VOLTA.model.blurb}
            </p>
          </Reveal>
        </div>

        <div>
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="border-b border-white/10 px-5 py-3">
                <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
                  Model scorecard · {sc.caption}
                </p>
              </div>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-500">
                    {sc.headers.map((h) => (
                      <th key={h} className="px-4 py-3 font-mono text-xs font-normal">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sc.rows.map((r) => (
                    <tr
                      key={r.cells[0]}
                      className="border-t border-white/5"
                      style={
                        r.highlight
                          ? { background: `rgb(${V} / 0.06)` }
                          : undefined
                      }
                    >
                      {r.cells.map((c, i) => (
                        <td
                          key={i}
                          className={`px-4 py-3 ${i === 0 ? "font-semibold" : "font-mono"}`}
                          style={
                            r.highlight && i === 0
                              ? { color: `rgb(${V})` }
                              : i === 0
                                ? { color: "rgb(226 232 240)" }
                                : undefined
                          }
                        >
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div
              className="mt-4 rounded-2xl border p-5"
              style={{
                borderColor: `rgb(${V} / 0.2)`,
                background: `rgb(${V} / 0.04)`,
              }}
            >
              <p className="text-sm leading-relaxed text-slate-300">
                {VOLTA.model.story}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="border-t border-white/5 py-20">
      <Reveal>
        <Kicker>{"// what's inside"}</Kicker>
      </Reveal>
      <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {VOLTA.features.map((f) => (
          <Reveal key={f.title}>
            <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="font-display text-lg font-semibold text-white">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.desc}</p>
            </div>
          </Reveal>
        ))}
      </RevealGroup>
    </section>
  );
}

function Tech() {
  return (
    <section className="border-t border-white/5 py-20">
      <Reveal>
        <Kicker>{"// under the hood"}</Kicker>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
          Serious machinery, zero servers.
        </h2>
      </Reveal>
      <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VOLTA.tech.map((t) => (
          <Reveal key={t.group}>
            <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p
                className="font-mono text-xs uppercase tracking-widest"
                style={{ color: `rgb(${V})` }}
              >
                {t.group}
              </p>
              <ul className="mt-3 space-y-1.5">
                {t.items.map((it) => (
                  <li key={it} className="text-sm text-slate-400">
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </RevealGroup>
    </section>
  );
}

function Closing() {
  return (
    <section className="border-t border-white/5 py-20">
      <Reveal>
        <Kicker>{"// built, deployed, free"}</Kicker>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-white sm:text-5xl">
          Trained offline. Runs in your browser.
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-400">
          {VOLTA.summary}
        </p>
      </Reveal>
      <Reveal delay={0.15}>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={VOLTA.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
            style={{ background: `rgb(${V})` }}
          >
            Open the live demo <ArrowUpRight size={16} />
          </a>
          <a
            href={VOLTA.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-white/30"
          >
            <GithubIcon className="h-4 w-4" /> View the code
          </a>
          <Link
            href="/projects/"
            className="inline-flex items-center gap-2 px-2 py-3 text-sm font-semibold text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={16} /> Back to projects
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

function Foot() {
  return (
    <footer className="relative border-t border-white/5 py-10 text-center">
      <p className="font-mono text-xs text-slate-600">
        VOLTA · CNN-BiLSTM energy forecasting · trained offline, served static · 2026
      </p>
    </footer>
  );
}
