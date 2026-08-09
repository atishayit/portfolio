"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowLeft, ArrowUpRight, Download, Moon, Sun } from "lucide-react";
import { Reveal } from "../Reveal";
import { TEMPO } from "@/content/tempo";

const T = TEMPO.accent; // violet
const G = TEMPO.accent2; // the app's gold
const EASE = [0.22, 1, 0.36, 1] as const;

type Theme = "dark" | "light";

function shot(theme: Theme, file: string) {
  return `/tempo/${theme}/${file}`;
}

/* -------------------------------------------------------------------------- */
/*  Primitives                                                                */
/* -------------------------------------------------------------------------- */

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-mono text-xs uppercase tracking-[0.3em]"
      style={{ color: `rgb(${T})` }}
    >
      {children}
    </p>
  );
}

/** Android device bezel around a 486×1080 capture. */
function PhoneFrame({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0b12] p-1.5 shadow-[0_40px_90px_-30px_rgb(0_0_0/0.9)] ${className}`}
    >
      {/* speaker pill */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-3 z-10 h-1 w-14 -translate-x-1/2 rounded-full bg-white/15"
      />
      <div className="overflow-hidden rounded-[1.6rem]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={486}
          height={1080}
          loading={priority ? "eager" : "lazy"}
          className="block h-auto w-full"
        />
      </div>
    </div>
  );
}

/** Pointer-tilt wrapper (desktop only; disabled for reduced motion). */
function Tilt({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), {
    stiffness: 220,
    damping: 26,
  });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), {
    stiffness: 220,
    damping: 26,
  });

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export function TempoShowcase() {
  return (
    <div className="relative bg-[#06060c] text-slate-300">
      <div className="relative z-10 mb-[16rem] min-h-screen overflow-hidden bg-[#06060c]">
        {/* ambient grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(rgb(255 255 255 / 0.035) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.035) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        {/* violet → gold glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/3 rounded-full blur-[130px]"
          style={{ background: `rgb(${T} / 0.16)` }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-[45%] h-[26rem] w-[26rem] translate-x-1/3 rounded-full blur-[130px]"
          style={{ background: `rgb(${G} / 0.08)` }}
        />

        <Nav />

        <main className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <Hero />
          <Stats />
          <Problem />
          <DeviceDemo />
          <Pipeline />
          <MoneyEngine />
          <OnTrack />
          <Features />
          <Tech />
          <Closing />
        </main>
      </div>

      <Foot />
    </div>
  );
}

function Nav() {
  return (
    <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-6">
      <Link
        href="/projects/"
        className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
        Projects
      </Link>
      <span
        className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest"
        style={{
          borderColor: `rgb(${T} / 0.3)`,
          background: `rgb(${T} / 0.1)`,
          color: `rgb(${T})`,
        }}
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: `rgb(${T})` }} />
        {TEMPO.status}
      </span>
    </header>
  );
}

function Hero() {
  return (
    <section className="grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-20">
      <div className="min-w-0">
        <Reveal>
          <Kicker>{TEMPO.kicker}</Kicker>
        </Reveal>
        <Reveal delay={0.05}>
          <h1
            className="mt-5 font-display text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl"
            style={{ textShadow: `0 0 46px rgb(${T} / 0.35)` }}
          >
            {TEMPO.name}
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 font-display text-2xl text-slate-200 sm:text-3xl">
            {TEMPO.headline}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            {TEMPO.summary}
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#screens"
              className="group inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
              style={{ background: `rgb(${T})` }}
            >
              See it running
              <ArrowUpRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            {TEMPO.apk ? (
              <a
                href={TEMPO.apk}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-white/30 hover:text-white"
              >
                <Download size={15} /> Download the APK
              </a>
            ) : null}
          </div>
        </Reveal>
        <Reveal delay={0.26}>
          <p className="mt-6 font-mono text-xs text-slate-600">
            {TEMPO.platform} · {TEMPO.year}
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.12} className="min-w-0">
        <Tilt className="mx-auto w-full max-w-[260px] sm:max-w-[300px]">
          <PhoneFrame
            src={shot("dark", TEMPO.screens[0].file)}
            alt={TEMPO.screens[0].caption}
            priority
          />
        </Tilt>
      </Reveal>
    </section>
  );
}

function Stats() {
  return (
    <section className="border-t border-white/5 py-14">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {TEMPO.metrics.map((m, i) => (
          <Reveal key={m.label} delay={i * 0.08}>
            <p
              className="font-display text-4xl font-bold sm:text-5xl"
              style={{ color: `rgb(${G})` }}
            >
              {m.value}
            </p>
            <p className="mt-2 text-sm leading-snug text-slate-500">{m.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section className="border-t border-white/5 py-20">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="min-w-0">
          <Reveal>
            <Kicker>{TEMPO.problem.kicker}</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">
              {TEMPO.problem.title}
            </h2>
          </Reveal>
        </div>
        <div className="min-w-0 space-y-5">
          {TEMPO.problem.body.map((p, i) => (
            <Reveal key={i} delay={0.1 + i * 0.06}>
              <p className="text-base leading-relaxed text-slate-400 sm:text-lg">{p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * The closest thing an Android app gets to a live embed: flip the device
 * between the app's real light and dark themes and page through nine real
 * captures. Only the active shot is rendered, so the page stays light.
 */
function DeviceDemo() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [i, setI] = useState(0);
  const screen = TEMPO.screens[i];
  const src = shot(theme, screen.file);

  return (
    <section id="screens" className="scroll-mt-20 border-t border-white/5 py-20">
      <Reveal>
        <Kicker>{"// THE APP ITSELF"}</Kicker>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold text-white sm:text-5xl">
          Nine screens, both themes, real data.
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
          An Android app can&apos;t be embedded in a page — so here it is on a device you can
          drive. Flip the theme, step through the screens.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-16">
        {/* device */}
        <Reveal className="min-w-0">
          <div className="mx-auto w-full max-w-[280px]">
            <div className="relative">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={src}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98, position: "absolute", inset: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <PhoneFrame src={src} alt={screen.caption} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* theme switch */}
            <div className="mt-6 flex items-center justify-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
              {(["dark", "light"] as Theme[]).map((t) => {
                const on = theme === t;
                const Icon = t === "dark" ? Moon : Sun;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    aria-pressed={on}
                    className="relative flex-1 rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors"
                    style={{ color: on ? "#06060c" : "rgb(148 163 184)" }}
                  >
                    {on && (
                      <motion.span
                        layoutId="tempo-theme-pill"
                        className="absolute inset-0 -z-10 rounded-full"
                        style={{ background: `rgb(${G})` }}
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="inline-flex items-center justify-center gap-1.5">
                      <Icon size={14} /> {t}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* screen picker */}
        <Reveal delay={0.1} className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-600">
            {String(i + 1).padStart(2, "0")} / {String(TEMPO.screens.length).padStart(2, "0")}
          </p>
          <p
            key={screen.id}
            className="mt-3 min-h-[3.5rem] font-display text-xl text-slate-200 sm:text-2xl"
          >
            {screen.caption}
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {TEMPO.screens.map((s, idx) => {
              const on = idx === i;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setI(idx)}
                  aria-pressed={on}
                  className="rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors"
                  style={{
                    borderColor: on ? `rgb(${T} / 0.6)` : "rgb(255 255 255 / 0.12)",
                    background: on ? `rgb(${T} / 0.15)` : "transparent",
                    color: on ? `rgb(${T})` : "rgb(148 163 184)",
                  }}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          <p className="mt-8 max-w-md text-sm leading-relaxed text-slate-500">
            Captured from a real device running {TEMPO.facts.version} on a seeded demo
            dataset — the numbers are the app&apos;s own, not mockups.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Pipeline() {
  return (
    <section className="border-t border-white/5 py-20">
      <Reveal>
        <Kicker>{"// FROM ROSTER TO BANK BALANCE"}</Kicker>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold text-white sm:text-5xl">
          Four steps from a shift to what lands.
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TEMPO.steps.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors duration-300 hover:border-white/20 [@media(hover:none)]:border-white/20">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
                style={{ background: `rgb(${T} / 0.25)` }}
              />
              <p className="font-mono text-xs" style={{ color: `rgb(${T})` }}>
                {s.label}
              </p>
              <h3 className="relative mt-4 font-display text-2xl font-semibold text-white">
                {s.title}
              </h3>
              <p className="relative mt-1 text-sm font-medium text-slate-300">{s.lead}</p>
              <p className="relative mt-3 text-sm leading-relaxed text-slate-500">{s.desc}</p>
              <p
                className="relative mt-5 font-mono text-[11px] uppercase tracking-widest"
                style={{ color: `rgb(${G} / 0.9)` }}
              >
                {s.tech}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function MoneyEngine() {
  const tax = TEMPO.screens.find((s) => s.id === "tax")!;
  return (
    <section className="border-t border-white/5 py-20">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="min-w-0">
          <Reveal>
            <Kicker>{TEMPO.money.kicker}</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">
              {TEMPO.money.title}
            </h2>
          </Reveal>
          {TEMPO.money.body.map((p, i) => (
            <Reveal key={i} delay={0.1 + i * 0.06}>
              <p className="mt-5 text-base leading-relaxed text-slate-400">{p}</p>
            </Reveal>
          ))}
          <Reveal delay={0.25}>
            <div className="mt-8 flex flex-wrap gap-2">
              {["integer cents", "effective-dated rates", "2024-25 brackets", "Medicare levy"].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-full border px-3 py-1 font-mono text-[11px]"
                    style={{ borderColor: `rgb(${G} / 0.3)`, color: `rgb(${G})` }}
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="min-w-0">
          <div className="mx-auto w-full max-w-[280px]">
            <PhoneFrame src={shot("dark", tax.file)} alt={tax.caption} />
            <p className="mt-4 text-center font-mono text-xs text-slate-600">{tax.caption}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function OnTrack() {
  const study = TEMPO.screens.find((s) => s.id === "study")!;
  return (
    <section className="border-t border-white/5 py-20">
      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <Reveal className="order-2 min-w-0 lg:order-1">
          <div className="mx-auto w-full max-w-[280px]">
            <PhoneFrame src={shot("dark", study.file)} alt={study.caption} />
            <p className="mt-4 text-center font-mono text-xs text-slate-600">{study.caption}</p>
          </div>
        </Reveal>

        <div className="order-1 min-w-0 lg:order-2">
          <Reveal>
            <Kicker>{TEMPO.ontrack.kicker}</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">
              {TEMPO.ontrack.title}
            </h2>
          </Reveal>
          {TEMPO.ontrack.body.map((p, i) => (
            <Reveal key={i} delay={0.1 + i * 0.06}>
              <p className="mt-5 text-base leading-relaxed text-slate-400">{p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="border-t border-white/5 py-20">
      <Reveal>
        <Kicker>{"// CAPABILITIES"}</Kicker>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold text-white sm:text-5xl">
          What it actually does.
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {TEMPO.features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.06}>
            <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors duration-300 hover:border-white/20 [@media(hover:none)]:border-white/20">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
                style={{ background: `rgb(${T} / 0.2)` }}
              />
              <h3 className="relative font-display text-xl font-semibold text-white">
                {f.title}
              </h3>
              <p className="relative mt-3 text-sm leading-relaxed text-slate-400">{f.desc}</p>
              <div className="relative mt-5 flex flex-wrap gap-2">
                {f.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border px-2.5 py-1 font-mono text-[10px]"
                    style={{ borderColor: `rgb(${G} / 0.28)`, color: `rgb(${G} / 0.95)` }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Tech() {
  return (
    <section className="border-t border-white/5 py-20">
      <Reveal>
        <Kicker>{"// UNDER THE HOOD"}</Kicker>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold text-white sm:text-5xl">
          Serious machinery, no servers.
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPO.tech.map((group, i) => (
          <Reveal key={group.group} delay={i * 0.06}>
            <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p
                className="font-mono text-[11px] uppercase tracking-[0.25em]"
                style={{ color: `rgb(${T})` }}
              >
                {group.group}
              </p>
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                      style={{ background: `rgb(${G})` }}
                    />
                    {item}
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

function Closing() {
  return (
    <section className="border-t border-white/5 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="font-display text-4xl font-semibold text-white sm:text-5xl">
            {TEMPO.closing.title}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-6 text-base leading-relaxed text-slate-400 sm:text-lg">
            {TEMPO.closing.body}
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {TEMPO.apk ? (
              <a
                href={TEMPO.apk}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
                style={{ background: `rgb(${T})` }}
              >
                <Download size={15} /> Download the APK
              </a>
            ) : null}
            <Link
              href="/projects/"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-white/30 hover:text-white"
            >
              <ArrowLeft size={15} /> All projects
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Foot() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-0 flex h-[16rem] items-center">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-6 text-center">
        <p
          className="font-display text-3xl font-bold text-white"
          style={{ textShadow: `0 0 40px rgb(${T} / 0.35)` }}
        >
          Tempo
        </p>
        <p className="max-w-md text-sm text-slate-500">
          Work, study and money in one local-first Android app — no account, no server,
          nothing leaves the device.
        </p>
        <Link
          href="/projects/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft size={15} /> Projects
        </Link>
        <p className="font-mono text-[11px] text-slate-700">© 2026 Atishay Jain</p>
      </div>
    </footer>
  );
}
