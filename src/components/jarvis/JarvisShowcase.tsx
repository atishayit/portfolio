"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import {
  AlarmClock,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Fingerprint,
  Mail,
  Mic,
  Music,
  Rocket,
  SlidersHorizontal,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { JarvisVideo } from "./JarvisVideo";
import { Reveal } from "@/components/Reveal";
import { IDENTITIES, JARVIS, type Identity } from "@/content/jarvis";

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring", stiffness: 380, damping: 32 } as const;

const FEATURE_ICONS: Record<string, LucideIcon> = {
  mic: Mic,
  sliders: SlidersHorizontal,
  calendar: Calendar,
  mail: Mail,
  alarm: AlarmClock,
  music: Music,
  sparkles: Sparkles,
  rocket: Rocket,
  fingerprint: Fingerprint,
};

export function JarvisShowcase() {
  const [identity, setIdentity] = useState<Identity>("jarvis");
  const id = IDENTITIES[identity];

  return (
    <div
      className="jx relative min-h-screen bg-[#04060b] text-slate-300"
      data-identity={identity}
    >
      <AuroraCyber />
      <div aria-hidden="true" className="jarvis-grid pointer-events-none fixed inset-0" />
      <div
        aria-hidden="true"
        className="jarvis-scanlines pointer-events-none fixed inset-0 opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full blur-[120px]"
        style={{ background: "rgb(var(--j) / 0.12)", transition: "background 0.5s ease" }}
      />

      <Nav identity={identity} setIdentity={setIdentity} />
      <Hero identity={identity} setIdentity={setIdentity} />
      <Meet setIdentity={setIdentity} />
      <WhatItDoes />
      <Boot />
      <TheHud />
      <TheInstaller />
      <UnderTheHood />
      <DownloadSection id={id} />
      <Foot />
    </div>
  );
}

/** Animated aurora over the cyber grid — drifting accent + violet glows and a
 *  slow conic sheen. Themed to the active identity via the `--j` accent var. */
function AuroraCyber() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
      <motion.div
        className="absolute -top-1/4 left-[18%] h-[46rem] w-[46rem] rounded-full opacity-30 mix-blend-screen blur-[140px]"
        style={{
          background: "radial-gradient(circle, rgb(var(--j) / 0.6), transparent 65%)",
        }}
        animate={{ x: [0, 120, -40, 0], y: [0, 60, -30, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-18%] right-[6%] h-[40rem] w-[40rem] rounded-full opacity-25 mix-blend-screen blur-[150px]"
        style={{
          background: "radial-gradient(circle, rgb(124 92 255 / 0.5), transparent 65%)",
        }}
        animate={{ x: [0, -100, 40, 0], y: [0, -50, 30, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[-12%] top-[34%] h-[32rem] w-[32rem] rounded-full opacity-20 mix-blend-screen blur-[130px]"
        style={{
          background: "radial-gradient(circle, rgb(var(--j) / 0.5), transparent 60%)",
        }}
        animate={{ x: [0, 90, 0], y: [0, 40, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* slow conic sheen for a techy shimmer over everything */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[140vmax] w-[140vmax] -translate-x-1/2 -translate-y-1/2 opacity-[0.06]"
        style={{
          background:
            "conic-gradient(from 0deg, transparent, rgb(var(--j) / 0.6) 12%, transparent 30%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

function IdentityToggle({
  identity,
  setIdentity,
  size = "sm",
}: {
  identity: Identity;
  setIdentity: (i: Identity) => void;
  size?: "sm" | "lg";
}) {
  const lg = size === "lg";
  return (
    <div
      role="group"
      aria-label="Switch assistant"
      className={`jx-bd inline-flex items-center rounded-full border bg-white/5 backdrop-blur ${lg ? "p-1.5" : "p-1"}`}
    >
      {(["jarvis", "friday"] as Identity[]).map((key) => {
        const active = identity === key;
        const p = IDENTITIES[key];
        return (
          <button
            key={key}
            type="button"
            onClick={() => setIdentity(key)}
            aria-pressed={active}
            className={`relative cursor-pointer rounded-full font-medium transition-colors ${lg ? "px-5 py-2.5 text-sm" : "px-3.5 py-1.5 text-xs"} ${active ? "text-black" : "text-slate-400 hover:text-slate-200"}`}
          >
            {active && (
              <motion.span
                layoutId={`id-pill-${size}`}
                className="jx-fill absolute inset-0 -z-10 rounded-full"
                transition={SPRING}
              />
            )}
            <span className="whitespace-nowrap">{p.short}</span>
            {key === "friday" && (
              <span className={`ml-1.5 font-mono ${lg ? "text-[10px]" : "text-[9px]"} ${active ? "text-black/60" : "text-amber-500/70"}`}>
                wip
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function Nav({ identity, setIdentity }: { identity: Identity; setIdentity: (i: Identity) => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="jx-bd mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl border bg-[#04060b]/70 px-4 py-2.5 backdrop-blur">
        <Link
          href="/projects/"
          className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-100"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          <span className="hidden sm:inline">Projects</span>
        </Link>
        <IdentityToggle identity={identity} setIdentity={setIdentity} />
        <span className="jx-bd jx-accent hidden items-center gap-2 rounded-full border bg-white/5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest backdrop-blur sm:inline-flex">
          <span className="jx-dot h-1.5 w-1.5 rounded-full" /> {JARVIS.status}
        </span>
      </div>
    </header>
  );
}

function Hero({ identity, setIdentity }: { identity: Identity; setIdentity: (i: Identity) => void }) {
  const id = IDENTITIES[identity];
  return (
    <section className="relative mx-auto flex min-h-screen max-w-6xl items-center px-5 pb-20 pt-28 sm:px-6">
      <div className="grid w-full items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal>
            <p className="jx-accent font-mono text-xs uppercase tracking-[0.3em]">
              {"// native macOS AI — "}
              {JARVIS.platform}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1
              className="mt-5 font-display text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl"
              style={{ textShadow: "0 0 44px rgb(var(--j) / 0.3)" }}
            >
              {id.name}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 font-display text-2xl text-slate-200 sm:text-3xl">
              “{id.wake}.”{" "}
              <span className="text-slate-500">Your Mac just woke up.</span>
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
              {JARVIS.pitch}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#boot"
                className="jx-fill group inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
              >
                Watch it boot
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.26}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <IdentityToggle identity={identity} setIdentity={setIdentity} size="lg" />
              <span className="font-mono text-xs text-slate-500">← Jarvis or Friday</span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="relative mx-auto w-full max-w-md">
          <JarvisVideo
            src={JARVIS.media.standby.src}
            poster={JARVIS.media.standby.poster}
            label="● Standby"
            aspect="square"
            ambient
          />
        </Reveal>
      </div>
    </section>
  );
}

function SectionHead({
  kicker,
  title,
  intro,
}: {
  kicker: string;
  title: string;
  intro?: string;
}) {
  return (
    <>
      <Reveal>
        <p className="jx-accent font-mono text-xs uppercase tracking-[0.3em]">{kicker}</p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            {intro}
          </p>
        </Reveal>
      )}
    </>
  );
}

function Meet({ setIdentity }: { setIdentity: (i: Identity) => void }) {
  const cards: { key: Identity; hex: string; available: boolean }[] = [
    { key: "jarvis", hex: "34 211 238", available: true },
    { key: "friday", hex: "245 158 11", available: false },
  ];
  return (
    <section className="relative mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-28">
      <SectionHead
        kicker="// two assistants, one brain"
        title="Meet Jarvis & Friday."
        intro="Same engine, different soul. Pick a personality and the entire experience re-themes — cyan for Jarvis, amber for Friday — so two people can each have their own."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {cards.map((c) => {
          const p = IDENTITIES[c.key];
          return (
            <Reveal key={c.key}>
              <button
                type="button"
                onClick={() => setIdentity(c.key)}
                className="group relative block h-full w-full overflow-hidden rounded-3xl border bg-white/[0.02] p-7 text-left transition-all duration-300 hover:-translate-y-1"
                style={{ borderColor: `rgb(${c.hex} / 0.3)` }}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl"
                  style={{ background: `rgb(${c.hex} / 0.18)` }}
                />
                <div className="relative flex items-center justify-between">
                  <span
                    className="grid h-12 w-12 place-items-center rounded-2xl font-display text-lg font-bold text-black"
                    style={{ background: `rgb(${c.hex})` }}
                  >
                    {p.short.charAt(0)}
                  </span>
                  <span
                    className="rounded-full border px-3 py-1 font-mono text-xs"
                    style={{
                      borderColor: `rgb(${c.hex} / 0.3)`,
                      color: `rgb(${c.hex})`,
                      background: `rgb(${c.hex} / 0.08)`,
                    }}
                  >
                    {c.available ? "Available" : "In progress"}
                  </span>
                </div>
                <h3 className="relative mt-6 font-display text-2xl font-semibold text-white">
                  {p.name}
                </h3>
                <p
                  className="relative mt-1 font-mono text-sm"
                  style={{ color: `rgb(${c.hex})` }}
                >
                  “{p.wake}” · addresses you as {p.honorific}
                </p>
                <p className="relative mt-4 text-sm leading-relaxed text-slate-400">{p.blurb}</p>
                <span
                  className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-medium"
                  style={{ color: `rgb(${c.hex})` }}
                >
                  Preview {p.short}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

// Bento span per feature index (mic / music get the big tiles).
const BENTO: Record<number, string> = {
  0: "lg:col-span-2 lg:row-span-2", // Voice-first
  1: "lg:col-span-2", // Runs your Mac
  5: "lg:col-span-2 lg:row-span-2", // Music
  6: "lg:col-span-2", // Knowledge & chat
};

/** Animated motif for the big audio tiles (equalizer / waveform). */
function BentoBars({ count = 9 }: { count?: number }) {
  return (
    <div className="mt-5 flex items-end gap-1.5" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          className="w-2 rounded-full"
          style={{ height: 30, background: "rgb(var(--j) / 0.8)", transformOrigin: "bottom" }}
          animate={{ scaleY: [0.35, 1, 0.55, 0.9, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.09 }}
        />
      ))}
    </div>
  );
}

function BentoCard({
  f,
  i,
}: {
  f: (typeof JARVIS.features)[number];
  i: number;
}) {
  const Icon = FEATURE_ICONS[f.icon] ?? Sparkles;
  const big = i === 0 || i === 5;
  // Optional real image (drop a PNG into /public and set `img` on the feature).
  const img = (f as { img?: string }).img;
  return (
    <Reveal className={`h-full ${BENTO[i] ?? ""}`} delay={(i % 3) * 0.05}>
      <div className="jx-bd group relative flex h-full flex-col justify-end overflow-hidden rounded-2xl border bg-white/[0.02] p-5 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1.5">
        {/* optional image art */}
        {img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-25 transition-opacity duration-500 group-hover:opacity-40"
          />
        )}
        {/* accent glow that warms on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-50"
          style={{ background: "rgb(var(--j) / 0.7)" }}
        />
        {/* oversized ghost icon */}
        <Icon
          aria-hidden="true"
          strokeWidth={1}
          className="absolute -bottom-5 -right-4 h-28 w-28 text-white/[0.045] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105"
        />
        {/* hover sheen sweep */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 -translate-x-[220%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[460%]"
        />

        <div className="relative flex h-full flex-col">
          <span className="jx-soft jx-accent grid h-11 w-11 place-items-center rounded-xl">
            <Icon size={20} />
          </span>
          {big && <BentoBars count={i === 5 ? 11 : 7} />}
          <div className="mt-auto pt-5">
            <h3 className="font-display text-lg font-semibold text-white">{f.title}</h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">{f.desc}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function WhatItDoes() {
  return (
    <section
      id="capabilities"
      className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-6 sm:py-28"
    >
      <SectionHead
        kicker="// capabilities"
        title="What it actually does."
        intro="Not a chatbot in a tab — a desktop presence that runs your machine and your day."
      />
      <div className="mt-12 grid auto-rows-[168px] grid-flow-dense gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {JARVIS.features.map((f, i) => (
          <BentoCard key={f.title} f={f} i={i} />
        ))}
      </div>
    </section>
  );
}

function Boot() {
  return (
    <section id="boot" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-6 sm:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHead kicker="// power-up" title="It boots like a system." />
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-md text-base leading-relaxed text-slate-400">
              Say the wake word and a frameless holographic HUD powers up — system stats,
              neural link and voice coming online, with a cinematic sound. Turn it up.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="jx-bd mt-7 max-w-md rounded-xl border bg-black/40 p-4 font-mono text-[11px] leading-6 text-slate-400 sm:text-xs">
              {JARVIS.bootLog.map((l, i) => (
                <div key={i}>
                  <span className="jx-accent">{l.slice(0, l.indexOf("]") + 1)}</span>
                  {l.slice(l.indexOf("]") + 1)}
                </div>
              ))}
              <span className="jx-fill mt-1 inline-block h-3.5 w-2 animate-pulse align-middle" />
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="mx-auto w-full max-w-md">
          <JarvisVideo
            src={JARVIS.media.startup.src}
            poster={JARVIS.media.startup.poster}
            label="● Boot · with sound"
            aspect="square"
          />
        </Reveal>
      </div>
    </section>
  );
}

function TheHud() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const states = JARVIS.hudStates;
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setStep(Math.min(states.length - 1, Math.max(0, Math.floor(v * states.length))));
  });
  const cur = states[step];

  return (
    <section
      ref={ref}
      style={{ height: `${states.length * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden px-5 sm:px-6">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <p className="jx-accent font-mono text-xs uppercase tracking-[0.3em]">
              {"// the reactive HUD"}
            </p>
            {/* state rail */}
            <div className="mt-6 flex gap-2">
              {states.map((s, i) => (
                <span
                  key={s.key}
                  className="h-1 flex-1 rounded-full transition-colors duration-500"
                  style={{ background: i <= step ? `rgb(${s.color})` : "rgb(255 255 255 / 0.1)" }}
                />
              ))}
            </div>
            <div className="mt-7 min-h-[12rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <p className="font-mono text-sm" style={{ color: `rgb(${cur.color})` }}>
                    {String(step + 1).padStart(2, "0")} · {cur.label}
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-5xl">
                    {cur.label}.
                  </h2>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-slate-400">
                    {cur.desc}
                  </p>
                </motion.div>
              </AnimatePresence>
              <p className="mt-6 font-mono text-xs text-slate-500">
                Boots with a sci-fi power-up; powers down with a “TV-off” collapse.
              </p>
            </div>
          </div>

          {/* pinned orb — real footage + glow shifts to the current state colour */}
          <div className="relative order-1 mx-auto aspect-square w-full max-w-sm lg:order-2">
            <div
              aria-hidden="true"
              className="absolute inset-4 rounded-full blur-3xl"
              style={{ background: `rgb(${cur.color} / 0.45)`, transition: "background 0.6s ease" }}
            />
            <AnimatePresence>
              <motion.div
                key={cur.key}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <JarvisVideo src={cur.video} aspect="square" ambient />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function TheInstaller() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const shots = JARVIS.installer.shots;
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setStep(Math.min(shots.length - 1, Math.max(0, Math.floor(v * shots.length))));
  });
  const cur = shots[step];

  return (
    <section
      ref={ref}
      style={{ height: `${shots.length * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-screen items-start overflow-hidden px-5 pt-24 sm:px-6 lg:items-center lg:pt-0">
        <div className="mx-auto w-full max-w-6xl">
          <p className="jx-accent font-mono text-xs uppercase tracking-[0.3em]">
            {"// installation, reimagined"}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-white sm:text-4xl">
            The installer is the experience too.
          </h2>
          <div className="mt-6 grid items-center gap-6 lg:mt-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
            {/* step rail */}
            <ol className="order-2 space-y-2 lg:order-1">
              {shots.map((s, i) => {
                const active = i === step;
                return (
                  <li
                    key={s.title}
                    className="rounded-xl border p-3 transition-all duration-300 lg:p-4"
                    style={{
                      borderColor: active ? "rgb(var(--j) / 0.4)" : "rgb(255 255 255 / 0.06)",
                      background: active ? "rgb(var(--j) / 0.06)" : "transparent",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-xs"
                        style={{
                          background: active ? "rgb(var(--j))" : "rgb(255 255 255 / 0.06)",
                          color: active ? "#04060b" : "rgb(148 163 184)",
                        }}
                      >
                        {i + 1}
                      </span>
                      <h3 className={`font-display text-base font-semibold ${active ? "text-white" : "text-slate-400"}`}>
                        {s.title}
                      </h3>
                    </div>
                    <AnimatePresence initial={false}>
                      {active && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden pl-10 text-sm leading-relaxed text-slate-400"
                        >
                          <span className="block pt-2">{s.desc}</span>
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ol>
            {/* pinned installer frame — crossfades between step clips */}
            <div className="order-1 lg:order-2">
              <div className="relative w-full" style={{ aspectRatio: "900 / 640" }}>
                <AnimatePresence>
                  <motion.div
                    key={step}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    <JarvisVideo
                      src={cur.video}
                      label={`Step ${step + 1} / ${shots.length}`}
                      fill
                      ambient
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function UnderTheHood() {
  return (
    <section className="relative mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-28">
      <SectionHead kicker="// under the hood" title="Serious machinery." />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {JARVIS.tech.map((g, i) => (
          <Reveal key={g.group} delay={i * 0.06}>
            <div className="jx-bd h-full rounded-2xl border bg-white/[0.02] p-5">
              <div className="jx-accent flex items-center gap-2 font-mono text-xs uppercase tracking-widest">
                <span className="jx-dot h-1.5 w-1.5 rounded-full" />
                {g.group}
              </div>
              <ul className="mt-4 space-y-2">
                {g.items.map((it) => (
                  <li key={it} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="jx-accent font-mono">›</span>
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

function DownloadSection({ id }: { id: (typeof IDENTITIES)[Identity] }) {
  return (
    <section id="about" className="relative px-5 py-28 sm:px-6 sm:py-36">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="jx-accent font-mono text-xs uppercase tracking-[0.3em]">{"// built, not shipped"}</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">
            A personal build, running 24/7.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-md text-slate-400">
            {id.name} isn&apos;t a public download — it&apos;s a native macOS app I built and run
            on my own machine, packaged as a signed&nbsp;.dmg with its cinematic installer. Friday
            is on the way.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mx-auto mt-10 grid max-w-lg gap-3 sm:grid-cols-3">
            {JARVIS.requirements.map((r) => (
              <div key={r.label} className="jx-bd rounded-xl border bg-white/[0.02] p-4">
                <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500">
                  {r.label}
                </p>
                <p className="mt-1.5 flex items-center justify-center gap-1.5 text-sm text-slate-200">
                  <Check size={13} className="jx-accent" /> {r.value}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.26}>
          <Link
            href="/projects/"
            className="jx-bd mt-9 inline-flex items-center gap-2 rounded-full border bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10"
          >
            <ArrowLeft size={16} /> Back to projects
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function Foot() {
  return (
    <footer className="jx-bd relative border-t px-5 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="font-mono text-xs text-slate-500">
          J.A.R.V.I.S — a native macOS AI assistant.
        </p>
        <Link href="/" className="text-sm text-slate-400 transition-colors hover:text-slate-100">
          Built by Atishay Jain →
        </Link>
      </div>
    </footer>
  );
}
