"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowDown, ArrowUpRight, Download, MapPin } from "lucide-react";
import { useSite } from "./providers";
import { RoleToggle } from "./RoleToggle";
import { RevealText } from "./RevealText";
import { Magnetic } from "./Magnetic";
import { GithubIcon, LinkedinIcon } from "./icons";
import { PERSON, ROLES } from "@/content/data";

const EASE = [0.22, 1, 0.36, 1] as const;

// Role-morph crossfade (independent of the entrance choreography)
const swap = {
  initial: { opacity: 0, y: 14, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -14, filter: "blur(6px)" },
  transition: { duration: 0.4, ease: EASE },
};

// Entrance stagger, gated on the intro preloader finishing
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const up: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

export function Hero() {
  const { role, intro } = useSite();
  const profile = ROLES[role];
  const reduce = useReducedMotion();
  const state = intro ? "show" : "hidden";

  // Pointer parallax for the portrait (desktop only).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 120, damping: 18, mass: 0.6 });
  const py = useSpring(my, { stiffness: 120, damping: 18, mass: 0.6 });
  const cardX = useTransform(px, [-1, 1], [-16, 16]);
  const cardY = useTransform(py, [-1, 1], [-16, 16]);

  const handlePointer = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    mx.set((e.clientX - cx) / cx);
    my.set((e.clientY - cy) / cy);
  };

  return (
    <section
      onMouseMove={handlePointer}
      className="relative flex min-h-[100svh] items-center px-5 pb-16 pt-28 sm:px-8 sm:pt-32"
    >
      <div className="mx-auto grid w-full max-w-container items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        {/* ---- Left: identity ---- */}
        <motion.div variants={container} initial="hidden" animate={state}>
          <motion.div
            variants={up}
            className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-raised/60 px-3 py-1.5 font-mono text-xs text-ink-muted backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <MapPin size={12} className="text-ink-faint" />
            {PERSON.location} · Open to opportunities
          </motion.div>

          <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.95] tracking-tight text-ink sm:text-6xl md:text-7xl">
            <RevealText text={PERSON.name} play={intro} delay={0.2} />
          </h1>

          {/* Morphing role line */}
          <div className="mt-4 h-9 overflow-hidden sm:h-11">
            <AnimatePresence mode="wait">
              <motion.p
                key={profile.id}
                {...swap}
                className="accent-morph font-display text-2xl font-medium text-accent sm:text-3xl"
              >
                {profile.title}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Toggle + hint */}
          <motion.div
            variants={up}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            <RoleToggle size="lg" />
            <span className="font-mono text-xs text-ink-faint">
              ← I do both. Flip to switch focus.
            </span>
          </motion.div>

          {/* Morphing summary */}
          <motion.div
            variants={up}
            className="mt-7 min-h-[7.5rem] max-w-xl sm:min-h-[6rem]"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={profile.id}
                {...swap}
                className="text-base leading-relaxed text-ink-muted sm:text-lg"
              >
                {profile.summary}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={up}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <Link
                href="/#contact"
                className="accent-morph group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-contrast shadow-lg shadow-accent/30 transition-transform duration-200 hover:-translate-y-0.5"
              >
                Get in touch
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </Magnetic>
            <Magnetic>
              <a
                href={profile.resumeHref}
                download
                className="group inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-raised/60 px-5 py-3 text-sm font-semibold text-ink backdrop-blur transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                <Download size={16} />
                <AnimatePresence mode="wait">
                  <motion.span key={profile.id} {...swap} className="whitespace-nowrap">
                    {profile.short} resume
                  </motion.span>
                </AnimatePresence>
              </a>
            </Magnetic>
            <div className="ml-1 flex items-center gap-1">
              <SocialButton href={PERSON.socials.github} label="GitHub">
                <GithubIcon className="h-[18px] w-[18px]" />
              </SocialButton>
              <SocialButton href={PERSON.socials.linkedin} label="LinkedIn">
                <LinkedinIcon className="h-[18px] w-[18px]" />
              </SocialButton>
            </div>
          </motion.div>
        </motion.div>

        {/* ---- Right: portrait / monogram ---- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, clipPath: "inset(8% 8% 8% 8% round 2.25rem)" }}
          animate={
            intro
              ? { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 2.25rem)" }
              : {}
          }
          transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
          style={reduce ? undefined : { x: cardX, y: cardY }}
          className="relative mx-auto hidden aspect-square w-full max-w-sm md:block"
        >
          {/* Rotating dashed ring */}
          <motion.div
            className="absolute inset-0 rounded-[2.25rem] border border-dashed border-accent/30"
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />
          <div className="accent-morph glass absolute inset-4 grid place-items-center overflow-hidden rounded-[1.75rem]">
            <div className="relative grid place-items-center">
              <span className="accent-morph bg-gradient-to-br from-accent to-accent/40 bg-clip-text font-display text-[7rem] font-bold leading-none text-transparent">
                {PERSON.initials}
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-hairline bg-surface/70 px-4 py-3 backdrop-blur">
              <span className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
                Currently
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={profile.id}
                  {...swap}
                  className="accent-morph text-sm font-semibold text-accent"
                >
                  {profile.short}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Floating metric chips */}
          <FloatingChip className="-left-4 top-10" delay={0.7} float={0}>
            {profile.metrics[0].value}
          </FloatingChip>
          <FloatingChip className="-right-3 bottom-16" delay={0.85} float={0.4}>
            {profile.metrics[2].value}
          </FloatingChip>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="/#about"
        aria-label="Scroll to about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-ink-faint transition-colors hover:text-accent lg:block"
        initial={{ opacity: 0 }}
        animate={intro ? { opacity: 1 } : {}}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        <motion.span
          className="block"
          animate={reduce ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={20} />
        </motion.span>
      </motion.a>
    </section>
  );
}

function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-hairline bg-surface-raised/60 text-ink-muted backdrop-blur transition-colors duration-200 hover:border-accent hover:text-accent"
    >
      {children}
    </a>
  );
}

function FloatingChip({
  children,
  className = "",
  delay = 0,
  float = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  float?: number;
}) {
  const { intro } = useSite();
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 10 }}
      animate={intro ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className={`absolute ${className}`}
    >
      <motion.div
        className="accent-morph glass rounded-2xl px-4 py-2.5 text-center shadow-xl"
        animate={reduce ? undefined : { y: [0, -10, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: float,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={String(children)}
            {...swap}
            className="accent-morph block font-display text-lg font-bold text-accent"
          >
            {children}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
