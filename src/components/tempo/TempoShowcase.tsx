"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowLeft, ArrowUpRight, Download, Moon, Sun } from "lucide-react";
import { TEMPO } from "@/content/tempo";

const T = TEMPO.accent; // violet
const G = TEMPO.accent2; // the app's gold
const EASE = [0.22, 1, 0.36, 1] as const;

type Theme = "dark" | "light";

const shot = (theme: Theme, file: string) => `/tempo/${theme}/${file}`;

/* -------------------------------------------------------------------------- */
/*  Scroll primitives                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Apple-style word-by-word reveal: each word brightens as the block travels
 * through the viewport, so the sentence "writes itself" under the scroll.
 */
function ScrollWords({
  text,
  className = "",
  from = 0.1,
  to = 0.75,
}: {
  text: string;
  className?: string;
  from?: number;
  to?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = text.split(" ");

  if (reduce) return <p className={className}>{text}</p>;

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => {
        const start = from + (i / words.length) * (to - from);
        const end = start + (to - from) / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {w}
          </Word>
        );
      })}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}
      &nbsp;
    </motion.span>
  );
}

/** Full-viewport statement that fades and scales through the viewport. */
function Statement({
  kicker,
  title,
  body,
}: {
  kicker?: string;
  title: string;
  body?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.28, 0.72, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.92, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3], [40, 0]);

  return (
    <section
      ref={ref}
      className="flex min-h-[85svh] items-center justify-center px-5 py-24 sm:px-6"
    >
      <motion.div
        className="mx-auto max-w-4xl text-center"
        style={reduce ? undefined : { opacity, scale, y }}
      >
        {kicker && (
          <p
            className="font-mono text-xs uppercase tracking-[0.3em]"
            style={{ color: `rgb(${T})` }}
          >
            {kicker}
          </p>
        )}
        <h2 className="mt-6 font-display text-[clamp(2.25rem,6.5vw,5rem)] font-semibold leading-[1.05] tracking-tight text-white">
          {title}
        </h2>
        {body && (
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            {body}
          </p>
        )}
      </motion.div>
    </section>
  );
}

/** Android device bezel around a 486×1080 capture. */
function PhoneFrame({
  src,
  alt,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0b12] p-1.5 shadow-[0_40px_90px_-30px_rgb(0_0_0/0.9)] ${className}`}
    >
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

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export function TempoShowcase() {
  return (
    <div className="relative bg-[#06060c] text-slate-300">
      {/* NB: no `overflow-hidden` here — it would break `position: sticky` in
          the pinned sections. Each section clips its own glows instead. */}
      <div className="relative z-10 mb-[16rem] bg-[#06060c]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(rgb(255 255 255 / 0.03) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.03) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <Nav />
        <Hero />
        <Intro />
        <PinnedScreens />
        <MoneyEngine />
        <Pipeline />
        <OnTrack />
        <Features />
        <Tech />
        <Closing />
      </div>
      <Foot />
    </div>
  );
}

function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-6">
      <Link
        href="/projects/"
        className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
        Projects
      </Link>
      <span
        className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest backdrop-blur"
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

/** Full-bleed opener: type rises, the device scales up and drifts on scroll. */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const phoneScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden px-5 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/4 rounded-full blur-[130px]"
        style={{ background: `rgb(${T} / 0.18)` }}
      />

      <motion.div
        className="relative mx-auto max-w-4xl pt-32 text-center sm:pt-36"
        style={reduce ? undefined : { y: textY, opacity: textOpacity }}
      >
        <motion.p
          className="font-mono text-xs uppercase tracking-[0.3em]"
          style={{ color: `rgb(${T})` }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {TEMPO.kicker}
        </motion.p>
        <motion.h1
          className="mt-6 font-display text-[clamp(3.5rem,14vw,10rem)] font-bold leading-[0.92] tracking-tight text-white"
          style={{ textShadow: `0 0 70px rgb(${T} / 0.35)` }}
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.08, ease: EASE }}
        >
          {TEMPO.name}
        </motion.h1>
        <motion.p
          className="mx-auto mt-5 max-w-2xl font-display text-2xl text-slate-200 sm:text-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18, ease: EASE }}
        >
          {TEMPO.headline}
        </motion.p>
        <motion.div
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.28, ease: EASE }}
        >
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
        </motion.div>
      </motion.div>

      {/* device peeking from the fold, growing as you scroll */}
      <motion.div
        className="relative mx-auto mt-14 w-full max-w-[260px] sm:max-w-[300px]"
        style={reduce ? undefined : { scale: phoneScale, y: phoneY }}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.35, ease: EASE }}
      >
        <PhoneFrame
          src={shot("dark", TEMPO.screens[0].file)}
          alt={TEMPO.screens[0].caption}
          priority
        />
      </motion.div>
    </section>
  );
}

function Intro() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-28 sm:px-6 sm:py-36">
      <p
        className="text-center font-mono text-xs uppercase tracking-[0.3em]"
        style={{ color: `rgb(${T})` }}
      >
        {TEMPO.problem.kicker}
      </p>
      <ScrollWords
        text={TEMPO.problem.body[0]}
        className="mt-10 text-center font-display text-[clamp(1.35rem,3.4vw,2.4rem)] font-medium leading-[1.35] tracking-tight text-white"
      />
      <ScrollWords
        text={TEMPO.problem.body[1]}
        className="mt-8 text-center font-display text-[clamp(1.35rem,3.4vw,2.4rem)] font-medium leading-[1.35] tracking-tight"
      />
    </section>
  );
}

/**
 * The Apple move: the device pins to the viewport and its screen advances as
 * you scroll, with the caption changing alongside. Only the active capture is
 * in the DOM, so the sequence stays light on phones.
 */
function PinnedScreens() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const n = TEMPO.screens.length;
  const [idx, setIdx] = useState(0);
  const [theme, setTheme] = useState<Theme>("dark");

  /**
   * Scroll → screen index, from a passive listener over cached geometry.
   * Deliberately not a per-frame motion value: the index is a 9-step state
   * machine, so we re-render only when it actually changes (9 times) and write
   * the progress rail straight to the DOM. No layout reads on scroll.
   */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // setIdx with the same value is a no-op in React, so this re-renders only on
  // the 9 real step changes — not once per frame.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setIdx(Math.max(0, Math.min(n - 1, Math.floor(v * n * 0.999))));
  });

  const rail = useSpring(scrollYProgress, { stiffness: 260, damping: 40 });
  const screen = TEMPO.screens[idx];

  // Reduced motion: no pinning (the tall container would collapse and strand
  // the user on screen 1) — lay every screen out plainly instead.
  if (reduce) {
    return (
      <div id="screens" className="mx-auto max-w-6xl px-5 py-24 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPO.screens.map((s, k) => (
            <figure key={s.id} className="min-w-0">
              <div className="mx-auto w-full max-w-[240px]">
                <PhoneFrame src={shot(theme, s.file)} alt={s.caption} />
              </div>
              <figcaption className="mt-4 text-center text-sm text-slate-400">
                <span className="font-mono text-xs" style={{ color: `rgb(${T})` }}>
                  {String(k + 1).padStart(2, "0")}
                </span>{" "}
                {s.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    );
  }
  const src = shot(theme, screen.file);

  return (
    <div
      id="screens"
      ref={ref}
      className="relative scroll-mt-0"
      style={{ height: reduce ? undefined : `${n * 52}vh` }}
    >
      {/* Exactly one viewport tall — a sticky box taller than the viewport
          drifts instead of pinning. */}
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden px-5 py-6 sm:px-6 sm:py-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-1/3 h-[26rem] w-[26rem] translate-x-1/3 rounded-full blur-[130px]"
          style={{ background: `rgb(${G} / 0.09)` }}
        />

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,300px)_1fr] lg:gap-20">
          {/* pinned device */}
          <div className="mx-auto w-full max-w-[180px] sm:max-w-[240px] lg:max-w-[280px]">
            <div className="relative">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={src}
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.985, position: "absolute", inset: 0 }}
                  transition={{ duration: 0.34, ease: EASE }}
                >
                  <PhoneFrame src={src} alt={screen.caption} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* changing copy */}
          <div className="min-w-0 text-center lg:text-left">
            <div className="flex items-center justify-center gap-3 lg:justify-start">
              <span className="font-mono text-xs tracking-[0.25em]" style={{ color: `rgb(${T})` }}>
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-xs tracking-[0.25em] text-slate-600">
                / {String(n).padStart(2, "0")}
              </span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={screen.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <h3 className="mt-5 font-display text-[clamp(1.75rem,4.5vw,3.25rem)] font-semibold leading-[1.1] tracking-tight text-white">
                  {screen.label}
                </h3>
                <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-slate-400 sm:text-lg lg:mx-0">
                  {screen.caption}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* progress rail */}
            <div className="mx-auto mt-10 h-px w-full max-w-md overflow-hidden bg-white/10 lg:mx-0">
              <motion.div
                className="h-full origin-left"
                style={{ background: `rgb(${T})`, scaleX: reduce ? 1 : rail }}
              />
            </div>

            {/* theme switch — the app's real light/dark, on demand */}
            <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
              {(["dark", "light"] as Theme[]).map((t) => {
                const on = theme === t;
                const Icon = t === "dark" ? Moon : Sun;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    aria-pressed={on}
                    className="relative rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors"
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
                    <span className="inline-flex items-center gap-1.5">
                      <Icon size={14} /> {t}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Sticky device beside copy that scrolls past it. */
function StickyPair({
  kicker,
  title,
  body,
  screenId,
  side = "left",
  chips,
}: {
  kicker: string;
  title: string;
  body: readonly string[];
  screenId: string;
  side?: "left" | "right";
  chips?: string[];
}) {
  const s = TEMPO.screens.find((x) => x.id === screenId)!;
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-32">
      <div
        className={`grid gap-12 lg:grid-cols-2 lg:gap-20 ${
          side === "right" ? "" : ""
        }`}
      >
        <div className={`min-w-0 ${side === "right" ? "lg:order-2" : ""}`}>
          <div className="lg:sticky lg:top-[calc(50svh-14rem)]">
            <div className="mx-auto w-full max-w-[240px] sm:max-w-[270px]">
              <PhoneFrame src={shot("dark", s.file)} alt={s.caption} />
            </div>
          </div>
        </div>

        <div className={`min-w-0 ${side === "right" ? "lg:order-1" : ""}`}>
          <motion.p
            className="font-mono text-xs uppercase tracking-[0.3em]"
            style={{ color: `rgb(${T})` }}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {kicker}
          </motion.p>
          <motion.h2
            className="mt-5 font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.08] tracking-tight text-white"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, delay: 0.06, ease: EASE }}
          >
            {title}
          </motion.h2>

          {/* Plain reveals rather than per-word motion values — these bodies run
              long, and a motion value per word gets expensive on phones. */}
          {body.map((p, i) => (
            <motion.p
              key={i}
              className="mt-7 text-base leading-relaxed text-slate-300 sm:text-lg"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.7, delay: 0.06 + i * 0.06, ease: EASE }}
            >
              {p}
            </motion.p>
          ))}

          {chips && (
            <motion.div
              className="mt-9 flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {chips.map((c) => (
                <span
                  key={c}
                  className="rounded-full border px-3 py-1 font-mono text-[11px]"
                  style={{ borderColor: `rgb(${G} / 0.3)`, color: `rgb(${G})` }}
                >
                  {c}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function MoneyEngine() {
  return (
    <StickyPair
      kicker={TEMPO.money.kicker}
      title={TEMPO.money.title}
      body={TEMPO.money.body}
      screenId="tax"
      side="right"
      chips={["integer cents", "effective-dated rates", "2024-25 brackets", "Medicare levy"]}
    />
  );
}

function OnTrack() {
  return (
    <StickyPair
      kicker={TEMPO.ontrack.kicker}
      title={TEMPO.ontrack.title}
      body={TEMPO.ontrack.body}
      screenId="study"
      side="left"
    />
  );
}

/** Four steps, each rising and settling as it enters. */
function Pipeline() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-32">
      <motion.p
        className="text-center font-mono text-xs uppercase tracking-[0.3em]"
        style={{ color: `rgb(${T})` }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {"// FROM ROSTER TO BANK BALANCE"}
      </motion.p>
      <motion.h2
        className="mx-auto mt-6 max-w-3xl text-center font-display text-[clamp(2rem,5.5vw,4rem)] font-semibold leading-[1.06] tracking-tight text-white"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        Four steps from a shift to what lands.
      </motion.h2>

      <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TEMPO.steps.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: i * 0.09, ease: EASE }}
            className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors duration-300 hover:border-white/20 [@media(hover:none)]:border-white/20"
          >
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
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-32">
      <motion.p
        className="text-center font-mono text-xs uppercase tracking-[0.3em]"
        style={{ color: `rgb(${T})` }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {"// CAPABILITIES"}
      </motion.p>
      <motion.h2
        className="mx-auto mt-6 max-w-3xl text-center font-display text-[clamp(2rem,5.5vw,4rem)] font-semibold leading-[1.06] tracking-tight text-white"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        What it actually does.
      </motion.h2>

      <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {TEMPO.features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: (i % 3) * 0.09, ease: EASE }}
            className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors duration-300 hover:border-white/20 [@media(hover:none)]:border-white/20"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
              style={{ background: `rgb(${T} / 0.2)` }}
            />
            <h3 className="relative font-display text-xl font-semibold text-white">{f.title}</h3>
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
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Tech() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-32">
      <motion.p
        className="text-center font-mono text-xs uppercase tracking-[0.3em]"
        style={{ color: `rgb(${T})` }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {"// UNDER THE HOOD"}
      </motion.p>
      <motion.h2
        className="mx-auto mt-6 max-w-3xl text-center font-display text-[clamp(2rem,5.5vw,4rem)] font-semibold leading-[1.06] tracking-tight text-white"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        Serious machinery, no servers.
      </motion.h2>

      <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPO.tech.map((group, i) => (
          <motion.div
            key={group.group}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: (i % 3) * 0.08, ease: EASE }}
            className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
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
          </motion.div>
        ))}
      </div>

      {/* the numbers, as a quiet strip */}
      <div className="mt-16 grid grid-cols-2 gap-8 border-t border-white/5 pt-12 md:grid-cols-4">
        {TEMPO.metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
          >
            <p
              className="font-display text-4xl font-bold sm:text-5xl"
              style={{ color: `rgb(${G})` }}
            >
              {m.value}
            </p>
            <p className="mt-2 text-sm leading-snug text-slate-500">{m.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Closing() {
  return (
    <>
      <Statement title={TEMPO.closing.title} body={TEMPO.closing.body} />
      <section className="px-5 pb-32 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
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
      </section>
    </>
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
