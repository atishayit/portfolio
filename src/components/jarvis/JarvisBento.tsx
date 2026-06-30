"use client";

import { motion } from "framer-motion";
import {
  Check,
  Pause,
  Play,
  Rocket,
  SkipBack,
  SkipForward,
  Sun,
  Volume2,
  Wifi,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { JARVIS } from "@/content/jarvis";

/* ──────────────────────────────────────────────────────────────────────────
 * JARVIS "What it does" bento — each card carries a small, looping, on-brand
 * mini-UI mockup (cyan/dark) that demonstrates the capability.
 * ──────────────────────────────────────────────────────────────────────── */

const J = "var(--j)";

// Bento span per feature index (mic / music get the big tiles).
const BENTO: Record<number, string> = {
  0: "lg:col-span-2 lg:row-span-2", // Voice-first
  1: "lg:col-span-2", // Runs your Mac
  5: "lg:col-span-2 lg:row-span-2", // Music
  // Knowledge & chat is a 1×1 tile so the dense grid fills the gap by Startup
  // ritual instead of leaving empty space.
};

const loop = (d: number, delay = 0) =>
  ({ duration: d, repeat: Infinity, ease: "easeInOut", delay }) as const;

/** Animated waveform / equaliser bars. */
function Bars({
  n = 16,
  h = 30,
  bottom = false,
  className = "",
}: {
  n?: number;
  h?: number;
  bottom?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex ${bottom ? "items-end" : "items-center"} gap-1 ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: n }).map((_, k) => (
        <motion.span
          key={k}
          className="w-1 rounded-full"
          style={{
            height: h,
            background: `rgb(${J} / 0.85)`,
            transformOrigin: bottom ? "bottom" : "center",
          }}
          animate={{ scaleY: [0.3, 1, 0.45, 0.8, 0.3] }}
          transition={loop(1.1 + (k % 3) * 0.25, k * 0.06)}
        />
      ))}
    </div>
  );
}

function Dots() {
  return (
    <span className="inline-flex gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: `rgb(${J})` }}
          animate={{ opacity: [0.2, 1, 0.2], y: [0, -2, 0] }}
          transition={loop(0.9, i * 0.18)}
        />
      ))}
    </span>
  );
}

/* ── Voice-first (big): listening panel ──────────────────────────────────── */
function MicMock() {
  return (
    <div className="flex h-full flex-col justify-center gap-4 p-4 sm:p-5">
      <div
        className="flex w-fit items-center gap-2 rounded-full border px-3 py-1.5"
        style={{ borderColor: `rgb(${J} / 0.3)`, background: `rgb(${J} / 0.08)` }}
      >
        <span className="relative flex h-2 w-2">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full"
            style={{ background: `rgb(${J})`, opacity: 0.7 }}
          />
          <span className="relative h-2 w-2 rounded-full" style={{ background: `rgb(${J})` }} />
        </span>
        <span
          className="font-mono text-[11px] uppercase tracking-[0.2em]"
          style={{ color: `rgb(${J})` }}
        >
          Listening
        </span>
      </div>
      <Bars n={22} h={42} className="justify-center" />
      <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-slate-200">
        &ldquo;Hey Jarvis, what&rsquo;s on today?&rdquo;
        <motion.span
          className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5"
          style={{ background: `rgb(${J})` }}
          animate={{ opacity: [1, 0, 1] }}
          transition={loop(1)}
        />
      </div>
    </div>
  );
}

/* ── Music (big): Spotify-style now playing ──────────────────────────────── */
function MusicMock() {
  return (
    <div className="flex h-full flex-col justify-center gap-4 p-4 sm:p-5">
      <div className="flex items-center gap-4">
        <div
          className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl"
          style={{
            background: `linear-gradient(135deg, rgb(${J}), #7c5cff 60%, #141c30)`,
          }}
        >
          <motion.div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "conic-gradient(from 0deg, transparent, rgba(255,255,255,0.5), transparent 40%)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          <Play className="absolute inset-0 m-auto text-white/90" size={22} fill="currentColor" />
        </div>
        <div className="min-w-0">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.2em]"
            style={{ color: `rgb(${J})` }}
          >
            Now playing
          </p>
          <p className="mt-1 truncate text-base font-semibold text-white">Drop the Needle</p>
          <p className="truncate text-xs text-slate-400">JARVIS · Focus mix</p>
        </div>
      </div>
      <Bars n={26} h={26} bottom className="h-7 justify-center" />
      <div>
        <div className="h-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `rgb(${J})` }}
            animate={{ width: ["8%", "92%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[10px] text-slate-500">
          <span>1:24</span>
          <span>3:30</span>
        </div>
      </div>
      <div className="flex items-center gap-5 text-slate-300">
        <SkipBack size={16} />
        <span
          className="grid h-8 w-8 place-items-center rounded-full"
          style={{ background: `rgb(${J})`, color: "#04060b" }}
        >
          <Pause size={15} fill="currentColor" />
        </span>
        <SkipForward size={16} />
      </div>
    </div>
  );
}

/* ── Runs your Mac (wide): system controls ───────────────────────────────── */
function ControlRow({
  icon,
  label,
  fill,
  animate,
}: {
  icon: React.ReactNode;
  label: string;
  fill: number;
  animate?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/[0.05] text-slate-300">
        {icon}
      </span>
      <span className="w-20 shrink-0 text-xs text-slate-400">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
        {animate ? (
          <motion.div
            className="h-full rounded-full"
            style={{ background: `rgb(${J})` }}
            animate={{ width: [`${fill}%`, `${Math.min(fill + 35, 95)}%`, `${fill}%`] }}
            transition={loop(3.5)}
          />
        ) : (
          <div className="h-full rounded-full" style={{ width: `${fill}%`, background: `rgb(${J})` }} />
        )}
      </div>
    </div>
  );
}

function SlidersMock() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-4 sm:p-5">
      <ControlRow icon={<Sun size={15} />} label="Brightness" fill={72} />
      <ControlRow icon={<Volume2 size={15} />} label="Volume" fill={45} animate />
      <div className="flex items-center gap-3">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/[0.05] text-slate-300">
          <Wifi size={15} />
        </span>
        <span className="w-20 shrink-0 text-xs text-slate-400">Wi-Fi</span>
        <motion.div
          className="ml-auto flex h-5 w-9 items-center rounded-full p-0.5"
          animate={{ backgroundColor: [`rgb(${J} / 0.25)`, `rgb(${J})`, `rgb(${J})`] }}
          transition={loop(4)}
        >
          <motion.span
            className="h-4 w-4 rounded-full bg-white shadow"
            animate={{ x: [0, 16, 16] }}
            transition={loop(4)}
          />
        </motion.div>
      </div>
    </div>
  );
}

/* ── Knowledge & chat (wide): chat thread ────────────────────────────────── */
function ChatMock() {
  return (
    <div className="flex h-full flex-col justify-center gap-2 p-4 sm:p-5">
      <motion.div
        className="max-w-[80%] self-end rounded-2xl rounded-br-sm border px-3 py-1.5 text-xs text-slate-100"
        style={{ borderColor: `rgb(${J} / 0.3)`, background: `rgb(${J} / 0.14)` }}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Summarise my day
      </motion.div>
      <div className="flex max-w-[85%] items-center gap-2 self-start rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300">
        <Dots />
        <span className="text-slate-400">3 meetings · 2 deadlines</span>
      </div>
    </div>
  );
}

/* ── Calendar (small): agenda ─────────────────────────────────────────────── */
function CalendarMock() {
  const rows = [
    { t: "09:00", e: "Standup" },
    { t: "14:30", e: "Design review" },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-2 p-3.5">
      {rows.map((r, i) => (
        <motion.div
          key={r.t}
          className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5"
          animate={{
            borderColor: [
              "rgba(255,255,255,0.1)",
              i === 0 ? `rgb(${J} / 0.5)` : "rgba(255,255,255,0.1)",
            ],
          }}
          transition={loop(3, i * 1.2)}
        >
          <span className="h-7 w-0.5 rounded-full" style={{ background: `rgb(${J})` }} />
          <span className="font-mono text-[11px] text-slate-400">{r.t}</span>
          <span className="text-xs text-slate-200">{r.e}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Email (small): inbox ─────────────────────────────────────────────────── */
function MailMock() {
  return (
    <div className="flex h-full flex-col justify-center gap-1.5 p-3.5">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-2.5">
          <motion.span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: `rgb(${J})` }}
            animate={i === 0 ? { opacity: [1, 1, 0.15, 0.15, 1] } : undefined}
            transition={i === 0 ? loop(4) : undefined}
          />
          <div className="flex-1">
            <div className="h-1.5 rounded-full bg-white/15" style={{ width: `${70 - i * 12}%` }} />
          </div>
          <div className="h-1.5 w-7 rounded-full bg-white/[0.07]" />
        </div>
      ))}
    </div>
  );
}

/* ── Reminders & timers (small) ───────────────────────────────────────────── */
function TimerMock() {
  return (
    <div className="flex h-full items-center gap-3 p-3.5">
      <svg viewBox="0 0 36 36" className="h-12 w-12 -rotate-90">
        <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
        <motion.circle
          cx="18"
          cy="18"
          r="15"
          fill="none"
          stroke={`rgb(${J})`}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 15}
          animate={{ strokeDashoffset: [2 * Math.PI * 15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      </svg>
      <div>
        <p className="font-mono text-lg font-semibold text-white">10:00</p>
        <p className="text-[11px] text-slate-400">Reminder set</p>
      </div>
    </div>
  );
}

/* ── Startup ritual (small): launch sequence ──────────────────────────────── */
function RocketMock() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-3.5">
      <div className="flex items-center gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className="grid h-7 w-7 place-items-center rounded-lg border"
            style={{ borderColor: `rgb(${J} / 0.3)`, background: `rgb(${J} / 0.06)` }}
            animate={{ opacity: [0.25, 1, 0.25], scale: [0.92, 1, 0.92] }}
            transition={loop(2.2, i * 0.35)}
          >
            {i === 0 && <Rocket size={13} style={{ color: `rgb(${J})` }} />}
          </motion.span>
        ))}
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `rgb(${J})` }}
          animate={{ width: ["0%", "100%"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

/* ── Speaker recognition (small): voiceprint ──────────────────────────────── */
function VoiceprintMock() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-3.5">
      <Bars n={18} h={28} className="justify-center" />
      <div className="flex items-center justify-center gap-1.5">
        <span
          className="grid h-4 w-4 place-items-center rounded-full"
          style={{ background: `rgb(${J})`, color: "#04060b" }}
        >
          <Check size={11} strokeWidth={3} />
        </span>
        <span className="text-xs font-medium text-slate-200">Atishay recognised</span>
      </div>
    </div>
  );
}

function Mock({ kind }: { kind: string }) {
  switch (kind) {
    case "mic":
      return <MicMock />;
    case "music":
      return <MusicMock />;
    case "sliders":
      return <SlidersMock />;
    case "sparkles":
      return <ChatMock />;
    case "calendar":
      return <CalendarMock />;
    case "mail":
      return <MailMock />;
    case "alarm":
      return <TimerMock />;
    case "rocket":
      return <RocketMock />;
    case "fingerprint":
      return <VoiceprintMock />;
    default:
      return null;
  }
}

export function BentoCard({
  f,
  i,
}: {
  f: (typeof JARVIS.features)[number];
  i: number;
}) {
  // Optional real image/video override (drop a file in /public, set `img` on the feature).
  const img = (f as { img?: string }).img;
  return (
    <Reveal className={`h-full ${BENTO[i] ?? ""}`} delay={(i % 3) * 0.05}>
      <div className="jx-bd group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white/[0.02] p-4 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1.5">
        {/* accent glow that warms on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full opacity-15 blur-2xl transition-opacity duration-500 group-hover:opacity-45"
          style={{ background: `rgb(${J} / 0.7)` }}
        />
        {/* hover sheen sweep */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-1/3 top-0 z-10 h-full w-1/3 -translate-x-[220%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[460%]"
        />
        {/* mockup screen */}
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-white/[0.07] bg-[#070b12]/70">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt="" className="h-full w-full object-cover" />
          ) : (
            <Mock kind={f.icon} />
          )}
        </div>
        {/* label */}
        <div className="relative mt-3 shrink-0">
          <h3 className="font-display text-base font-semibold text-white sm:text-lg">
            {f.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400 sm:text-sm">
            {f.desc}
          </p>
        </div>
      </div>
    </Reveal>
  );
}
