"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { Reveal, RevealGroup } from "../Reveal";
import { GithubIcon } from "../icons";
import { VoltaChart } from "./VoltaChart";
import { VOLTA } from "@/content/volta";

const V = VOLTA.accent; // amber "r g b"
const V2 = VOLTA.accent2; // electric blue
const EASE = [0.22, 1, 0.36, 1] as const;
const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/** Mask-and-skew text reveal — each char/word rises from a clipped box. */
function MaskText({
  text,
  by = "word",
  className = "",
  delay = 0,
  stagger = 0.05,
}: {
  text: string;
  by?: "word" | "char";
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>{text}</span>;
  const parts = by === "char" ? Array.from(text) : text.split(" ");
  return (
    <motion.span
      className={`inline-block ${className}`}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {parts.map((p, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom"
          style={{ paddingBottom: "0.12em", marginBottom: "-0.12em" }}
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "115%", skewY: 7 },
              show: { y: 0, skewY: 0, transition: { duration: 0.75, ease: EASE } },
            }}
          >
            {p === " " ? " " : p}
            {by === "word" && i < parts.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/** Pointer-magnetic translate (spring-eased). */
function useMagnetic(strength = 0.2) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });
  const onMagMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  return { x: sx, y: sy, onMagMove, reset };
}

/** An infinite marquee whose speed + direction track scroll velocity. */
function VelocityMarquee({
  items,
  baseVelocity = 3,
  className = "",
}: {
  items: string[];
  baseVelocity?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const dir = useRef(1);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let moveBy = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    moveBy += dir.current * moveBy * f;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div className="flex w-max flex-nowrap" style={{ x }}>
        {[...items, ...items].map((it, i) => (
          <span
            key={i}
            className="mx-2 inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-sm text-slate-300"
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: `rgb(${V})` }}
            />
            {it}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

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

/** A block that lifts (with a springy ease), glows and sweeps a sheen on hover. */
function Card({
  children,
  className = "",
  glow = V,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform hover:-translate-y-1.5 motion-reduce:transform-none motion-reduce:transition-none ${className}`}
      style={style}
    >
      {/* inner ring + drop glow that fade in on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow: `inset 0 0 0 1px rgb(${glow} / 0.45), 0 22px 60px -20px rgb(${glow} / 0.5)`,
        }}
      />
      {/* diagonal sheen that sweeps across on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 -translate-x-[160%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[420%] motion-reduce:hidden"
      />
      {/* content sits above the overlays */}
      <div className="relative h-full">{children}</div>
    </div>
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
    <div className="relative bg-[#05070d] text-slate-300">
      {/* curtain panel — opaque content that slides up to reveal the footer */}
      <div className="relative z-10 mb-[16rem] min-h-screen overflow-hidden bg-[#05070d]">
        {/* ambient grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(255 255 255 / 0.035) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.035) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        {/* amber glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/3 rounded-full blur-[130px]"
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
      </div>

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

/** The dashboard screenshot, scroll-scrubbed: tilts up from the page and
 *  flattens + scales to full as it enters — an Apple-style product reveal. */
function HeroShot() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "start 0.3"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [22, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.25, 1]);
  return (
    <div ref={ref} className="relative mt-6 [perspective:1500px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 rounded-[2rem] blur-2xl"
        style={{ background: `rgb(${V} / 0.12)` }}
      />
      <motion.div
        style={
          reduce
            ? undefined
            : {
                rotateX,
                scale,
                y,
                opacity,
                transformPerspective: 1500,
                transformOrigin: "50% 100%",
              }
        }
      >
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
      </motion.div>
      <Brackets />
    </div>
  );
}

function Hero() {
  return (
    <section className="pb-16 pt-28 sm:pt-36">
      <Reveal>
        <Kicker>{"// energy forecasting · anomaly detection"}</Kicker>
      </Reveal>
      <h1
        className="mt-5 font-display text-6xl font-bold tracking-tight text-white sm:text-8xl"
        style={{ textShadow: `0 0 50px rgb(${V} / 0.25)` }}
      >
        <MaskText text="VOLTA" by="char" stagger={0.07} />
      </h1>
      <p className="mt-3 font-mono text-sm" style={{ color: `rgb(${V} / 0.85)` }}>
        <MaskText text={VOLTA.full} by="word" delay={0.25} stagger={0.035} />
      </p>
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

      {/* hero screenshot — Apple-style: rises and flattens as you scroll */}
      <HeroShot />
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

      <LiveEmbed />
    </section>
  );
}

function LiveEmbed() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.4"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.78, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.45, 1]);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = glowRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} className="mt-8">
      <motion.div
        ref={glowRef}
        onMouseMove={onMove}
        style={reduce ? undefined : { scale, opacity }}
        className="relative origin-top will-change-transform"
      >
        {/* mouse-reactive glow behind the embed */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-6 rounded-[2.5rem] blur-3xl"
          style={{
            background: `radial-gradient(440px circle at var(--mx, 50%) var(--my, 50%), rgb(${V} / 0.2), transparent 65%)`,
          }}
        />
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
      </motion.div>
    </div>
  );
}

function PipelineCard({ s }: { s: (typeof VOLTA.steps)[number] }) {
  const { x, y, onMagMove, reset } = useMagnetic(0.16);
  const glowRef = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    onMagMove(e);
    const el = glowRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, rotateX: -15, y: 26 },
        show: { opacity: 1, rotateX: 0, y: 0, transition: { duration: 0.7, ease: EASE } },
      }}
      style={{ x, y, transformPerspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      <div
        ref={glowRef}
        className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors duration-300 hover:border-white/20"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgb(${V} / 0.16), transparent 60%)`,
          }}
        />
        <p
          className="relative font-mono text-xs uppercase tracking-widest"
          style={{ color: `rgb(${V})` }}
        >
          {s.label}
        </p>
        <h3 className="relative mt-3 font-display text-xl font-semibold text-white">
          {s.title}
        </h3>
        <p className="relative mt-2 text-sm leading-relaxed text-slate-400">{s.desc}</p>
        <p className="relative mt-4 font-mono text-xs text-slate-600">{s.tech}</p>
      </div>
    </motion.div>
  );
}

function Pipeline() {
  const reduce = useReducedMotion();
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
      <motion.div
        className="mt-10 grid gap-4 [perspective:1100px] sm:grid-cols-2 lg:grid-cols-4"
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        transition={{ staggerChildren: 0.1 }}
      >
        {VOLTA.steps.map((s) => (
          <PipelineCard key={s.label} s={s} />
        ))}
      </motion.div>
    </section>
  );
}

function Model() {
  const sc = VOLTA.model.scorecard;
  const reduce = useReducedMotion();
  return (
    <section className="border-t border-white/5 py-20">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="min-w-0">
          <Reveal>
            <Kicker>{"// the model"}</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
              A CNN-BiLSTM that learns the grid&apos;s rhythm.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-base leading-relaxed text-slate-400">
              {VOLTA.model.blurb}
            </p>
          </Reveal>
        </div>

        <div className="min-w-0">
          <Reveal>
            <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-shadow duration-300 hover:shadow-[0_22px_60px_-24px_rgb(255_176_32/0.4)]">
              <div className="border-b border-white/10 px-5 py-3">
                <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
                  Model scorecard · {sc.caption}
                </p>
              </div>
              <div className="overflow-x-auto">
              <table className="w-full min-w-[24rem] text-left text-sm">
                <thead>
                  <tr className="text-slate-500">
                    {sc.headers.map((h) => (
                      <th key={h} className="px-4 py-3 font-mono text-xs font-normal">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <motion.tbody
                  initial={reduce ? false : "hidden"}
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ staggerChildren: 0.12 }}
                >
                  {sc.rows.map((r) => (
                    <motion.tr
                      key={r.cells[0]}
                      variants={{
                        hidden: { opacity: 0, x: -36 },
                        show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } },
                      }}
                      className="group/row border-t border-white/5 transition-colors duration-200 hover:bg-[rgb(255_176_32/0.09)]"
                      style={
                        r.highlight ? { background: `rgb(${V} / 0.06)` } : undefined
                      }
                    >
                      {r.cells.map((c, i) => (
                        <td
                          key={i}
                          className={`px-4 py-3 transition-colors duration-200 ${i === 0 ? "font-semibold group-hover/row:text-[rgb(255_176_32)]" : "font-mono"}`}
                          style={
                            r.highlight && i === 0
                              ? { color: `rgb(${V})` }
                              : i === 0
                                ? { color: "rgb(226 232 240)" }
                                : undefined
                          }
                        >
                          {r.highlight && i === 0 && !reduce ? (
                            <motion.span
                              className="inline-block"
                              initial={{ textShadow: "0 0 0px rgb(255 176 32 / 0)" }}
                              whileInView={{
                                textShadow: [
                                  "0 0 0px rgb(255 176 32 / 0)",
                                  "0 0 18px rgb(255 176 32 / 0.95)",
                                  "0 0 7px rgb(255 176 32 / 0.5)",
                                ],
                              }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.9, duration: 1, times: [0, 0.45, 1] }}
                            >
                              {c}
                            </motion.span>
                          ) : (
                            c
                          )}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <Card
              className="mt-4 p-5"
              style={{
                borderColor: `rgb(${V} / 0.2)`,
                background: `rgb(${V} / 0.04)`,
              }}
            >
              <p className="text-sm leading-relaxed text-slate-300">
                {VOLTA.model.story}
              </p>
            </Card>
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
            <Card className="p-6">
              <h3 className="font-display text-lg font-semibold text-white">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.desc}</p>
            </Card>
          </Reveal>
        ))}
      </RevealGroup>
    </section>
  );
}

function Tech() {
  const items = VOLTA.tech.flatMap((t) => t.items);
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
      <Reveal delay={0.1}>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-400">
          The full stack behind VOLTA — modelling, data, web and in-browser inference.
          Scroll to spin it up.
        </p>
      </Reveal>
      <div className="mt-10 flex flex-col gap-3">
        <VelocityMarquee items={items} baseVelocity={2.4} />
        <VelocityMarquee items={[...items].reverse()} baseVelocity={-2.4} />
      </div>
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

/** Revealed by the curtain: fixed behind the content panel, exposed at the end. */
function Foot() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-0 flex h-[16rem] items-center">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-6 text-center">
        <p
          className="font-display text-3xl font-bold text-white"
          style={{ textShadow: `0 0 40px rgb(${V} / 0.3)` }}
        >
          VOLTA
        </p>
        <p className="max-w-md text-sm text-slate-500">
          CNN-BiLSTM energy forecasting — trained offline, served static, running in your
          browser.
        </p>
        <div className="flex items-center gap-3">
          <a
            href={VOLTA.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-black"
            style={{ background: `rgb(${V})` }}
          >
            Live demo <ArrowUpRight size={14} />
          </a>
          <Link
            href="/projects/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={15} /> Projects
          </Link>
        </div>
        <p className="font-mono text-[11px] text-slate-700">© 2026 Atishay Jain</p>
      </div>
    </footer>
  );
}
