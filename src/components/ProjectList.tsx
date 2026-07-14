"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS, type Project } from "@/content/projects";

/**
 * Kinetic-typography project index with cursor-trailed media.
 *
 * Desktop (fine pointer): a vertical list of massive titles. Hovering a row
 * dims the others, strokes the title to an outline, scrambles its tech stack in,
 * and floats that project's media under a spring-tracked, velocity-tilted cursor.
 * Clicking expands the media to fullscreen for a cinematic cut into the showcase.
 *
 * Touch (no hover): falls back to scroll-snap parallax cards that reveal in view.
 */

const MEDIA_W = 340;
const MEDIA_H = 430;
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>*·_-";
const EASE_IO = [0.83, 0, 0.17, 1] as const;

type Media = { type: "video" | "image"; src: string; poster?: string };

function mediaFor(p: Project): Media {
  if (p.heroVideo?.src) {
    return { type: "video", src: p.heroVideo.src, poster: p.heroVideo.poster };
  }
  return { type: "image", src: p.heroVideo?.poster || p.bootVideo?.poster || "" };
}

function stackFor(p: Project): string[] {
  if (p.stack?.length) return p.stack;
  return p.tech.flatMap((t) => t.items).slice(0, 5);
}

/** Renders the project media, filling its container. Poster stands in for video on touch. */
function MediaInner({ media, still = false }: { media: Media; still?: boolean }) {
  if (media.type === "video" && !still) {
    return (
      <video
        src={media.src}
        poster={media.poster}
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
      />
    );
  }
  const src = media.type === "video" ? media.poster || media.src : media.src;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" className="h-full w-full object-cover" />;
}

export function ProjectList() {
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return touch ? <TouchList /> : <KineticList />;
}

/* -------------------------------------------------------------------------- */
/*  Desktop: kinetic list + cursor-trailed media                              */
/* -------------------------------------------------------------------------- */

function KineticList() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);
  const [trans, setTrans] = useState<null | {
    href: string;
    media: Media;
    startX: number;
    startY: number;
    vw: number;
    vh: number;
    accent: string;
    name: string;
  }>(null);

  // Raw cursor → springy position → velocity-driven tilt.
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const sx = useSpring(mx, { stiffness: 350, damping: 40, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 350, damping: 40, mass: 0.6 });
  const vx = useVelocity(sx);
  const rotateRaw = useTransform(vx, [-1600, 1600], [-14, 14], { clamp: true });
  const rotate = useSpring(rotateRaw, { stiffness: 300, damping: 30 });
  const tx = useTransform(sx, (v) => v - MEDIA_W / 2);
  const ty = useTransform(sy, (v) => v - MEDIA_H / 2);

  const onMove = (e: React.PointerEvent) => {
    mx.set(e.clientX);
    my.set(e.clientY);
  };

  const open = (p: Project) => {
    const href = `/projects/${p.slug}/`;
    if (reduce) {
      router.push(href);
      return;
    }
    setHovered(null);
    setTrans({
      href,
      media: mediaFor(p),
      startX: sx.get(),
      startY: sy.get(),
      vw: window.innerWidth,
      vh: window.innerHeight,
      accent: p.accent ?? "34 211 238",
      name: p.name,
    });
  };

  const showMedia = hovered !== null && !trans;
  const active = hovered !== null ? PROJECTS[hovered] : null;

  return (
    <>
      <div
        onPointerMove={onMove}
        onPointerLeave={() => setHovered(null)}
        className="relative border-t border-hairline"
      >
        {PROJECTS.map((p, i) => (
          <KineticRow
            key={p.slug}
            project={p}
            index={i}
            dim={hovered !== null && hovered !== i}
            hovered={hovered === i}
            onEnter={() => setHovered(i)}
            onOpen={() => open(p)}
          />
        ))}
      </div>

      {/* Cursor-trailed media (desktop only) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[60] overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_90px_-20px_rgb(0_0_0/0.6)]"
        style={{
          width: MEDIA_W,
          height: MEDIA_H,
          x: tx,
          y: ty,
          rotate: reduce ? 0 : rotate,
        }}
        initial={false}
        animate={{
          opacity: showMedia ? 1 : 0,
          scale: showMedia ? 1 : 0.85,
        }}
        transition={{ duration: 0.4, ease: EASE_IO }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {active && (
            <motion.div
              key={active.slug}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE_IO }}
            >
              <MediaInner media={mediaFor(active)} />
              <span
                className="absolute bottom-3 left-3 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white"
                style={{ background: `rgb(${active.accent ?? "34 211 238"} / 0.9)` }}
              >
                {active.status}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Cinematic expand-to-fullscreen on click, then route */}
      <AnimatePresence>
        {trans && (
          <motion.div
            className="fixed left-0 top-0 z-[100] overflow-hidden bg-black"
            initial={{
              x: trans.startX - MEDIA_W / 2,
              y: trans.startY - MEDIA_H / 2,
              width: MEDIA_W,
              height: MEDIA_H,
              borderRadius: 20,
            }}
            animate={{ x: 0, y: 0, width: trans.vw, height: trans.vh, borderRadius: 0 }}
            transition={{ duration: 0.72, ease: EASE_IO }}
            onAnimationComplete={() => router.push(trans.href)}
          >
            <MediaInner media={trans.media} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
            <motion.div
              className="absolute inset-0 grid place-items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.4, ease: EASE_IO }}
            >
              <span
                className="font-display text-5xl font-bold tracking-tight text-white sm:text-7xl"
                style={{ textShadow: `0 0 60px rgb(${trans.accent} / 0.6)` }}
              >
                {trans.name}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function KineticRow({
  project,
  index,
  dim,
  hovered,
  onEnter,
  onOpen,
}: {
  project: Project;
  index: number;
  dim: boolean;
  hovered: boolean;
  onEnter: () => void;
  onOpen: () => void;
}) {
  const accent = project.accent ?? "34 211 238";
  const stack = stackFor(project).join("  /  ");

  return (
    <motion.button
      type="button"
      onPointerEnter={onEnter}
      onClick={onOpen}
      aria-label={`Open ${project.name} showcase`}
      animate={{ opacity: dim ? 0.3 : 1 }}
      transition={{ duration: 0.35, ease: EASE_IO }}
      className="group block w-full cursor-pointer border-b border-hairline py-6 text-left sm:py-8"
    >
      <div className="flex items-center gap-4 sm:gap-8">
        <span className="shrink-0 font-mono text-sm text-ink-faint sm:text-base">
          {String(index + 1).padStart(2, "0")}
        </span>

        <KineticTitle text={project.name} hovered={hovered} accent={accent} />

        <ArrowUpRight
          size={30}
          strokeWidth={1.5}
          className="ml-auto shrink-0 -translate-x-2 text-ink-faint opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
          style={{ color: hovered ? `rgb(${accent})` : undefined }}
        />
      </div>

      <div className="mt-1 flex min-h-[1.25rem] items-center gap-3 pl-9 sm:pl-12">
        <ScrambleText
          text={stack}
          active={hovered}
          className="font-mono text-xs uppercase tracking-[0.2em] sm:text-sm"
          style={{ color: `rgb(${accent})` }}
        />
      </div>
    </motion.button>
  );
}

/** Two stacked layers — filled text crossfading to a stroked outline on hover. */
function KineticTitle({
  text,
  hovered,
  accent,
}: {
  text: string;
  hovered: boolean;
  accent: string;
}) {
  return (
    <span className="relative inline-block font-display font-bold uppercase leading-[0.9] tracking-tight">
      <span
        className="block text-[clamp(2.5rem,9vw,8rem)] text-ink transition-opacity duration-300"
        style={{ opacity: hovered ? 0 : 1 }}
      >
        {text}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 block text-[clamp(2.5rem,9vw,8rem)] transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          color: "transparent",
          WebkitTextStroke: `1.5px rgb(${accent})`,
        }}
      >
        {text}
      </span>
    </span>
  );
}

/** Reveals `text` with a left-to-right glyph scramble when `active` turns on. */
function ScrambleText({
  text,
  active,
  className,
  style,
}: {
  text: string;
  active: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  const [out, setOut] = useState("");
  const raf = useRef(0);

  useEffect(() => {
    cancelAnimationFrame(raf.current);
    if (!active) {
      setOut("");
      return;
    }
    if (reduce) {
      setOut(text);
      return;
    }
    let frame = 0;
    const tick = () => {
      frame++;
      const revealed = Math.floor(frame / 2);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === " ") s += " ";
        else if (i < revealed) s += ch;
        else s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOut(s);
      if (revealed < text.length) raf.current = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, text, reduce]);

  return (
    <span className={className} style={style} aria-hidden={!active}>
      {out || " "}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Touch: scroll-snap parallax cards                                         */
/* -------------------------------------------------------------------------- */

function TouchList() {
  return (
    <div className="mt-8 space-y-5">
      {PROJECTS.map((p, i) => (
        <TouchCard key={p.slug} project={p} index={i} />
      ))}
    </div>
  );
}

function TouchCard({ project, index }: { project: Project; index: number }) {
  const accent = project.accent ?? "34 211 238";
  const media = mediaFor(project);
  const stack = stackFor(project);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: EASE_IO }}
    >
      <Link
        href={`/projects/${project.slug}/`}
        aria-label={`Open ${project.name} showcase`}
        style={{ ["--card" as string]: accent }}
        className="group relative block overflow-hidden rounded-3xl border border-hairline bg-[#04060b] active:scale-[0.99]"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <MediaInner media={media} still />
          <div className="absolute inset-0 bg-gradient-to-t from-[#04060b] via-[#04060b]/30 to-transparent" />
          <span className="absolute right-4 top-4 font-mono text-xs text-white/70">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className="absolute left-4 top-4 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest"
            style={{ background: `rgb(${accent} / 0.9)`, color: "#04060b" }}
          >
            {project.status}
          </span>
        </div>

        <div className="relative -mt-10 px-5 pb-5">
          <h2
            className="font-display text-4xl font-bold uppercase leading-none tracking-tight text-white"
            style={{ textShadow: `0 0 30px rgb(${accent} / 0.3)` }}
          >
            {project.name}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
            {project.tagline}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {stack.map((t) => (
              <span
                key={t}
                className="rounded-full border px-2.5 py-1 font-mono text-[11px]"
                style={{
                  borderColor: `rgb(${accent} / 0.3)`,
                  color: `rgb(${accent})`,
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <span
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium"
            style={{ color: `rgb(${accent})` }}
          >
            Explore the showcase
            <ArrowUpRight size={15} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
