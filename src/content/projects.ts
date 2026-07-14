/**
 * Projects shown under /projects. Architected for many; one is live today.
 * The JARVIS showcase at /projects/jarvis is driven entirely by this data.
 */

export interface Step {
  label: string;
  title: string;
  desc: string;
  tech: string;
}

export interface Clip {
  title: string;
  desc: string;
  /** Example spoken command */
  command?: string;
  /** Video src under /public, or "" for a "coming soon" placeholder */
  src: string;
  poster?: string;
  aspect?: "square" | "video";
}

export interface Project {
  slug: string;
  name: string;
  full: string;
  tagline: string;
  summary: string;
  year: string;
  status: string;
  platform: string;
  github: string;
  /** Card identity accent as an "r g b" triplet (defaults to JARVIS cyan). */
  accent?: string;
  /** Concise tech stack for the /projects list rows. */
  stack?: string[];
  /** Live, embeddable demo URL, if the project has one. */
  demo?: string;
  /** Calm standby loop shown in the hero */
  heroVideo: { src: string; poster: string };
  /** Full power-on sequence shown in the capabilities showcase */
  bootVideo: { src: string; poster: string };
  bootLog: string[];
  steps: Step[];
  showcase: Clip[];
  features: { title: string; desc: string }[];
  tech: { group: string; items: string[] }[];
}

const JARVIS: Project = {
  slug: "jarvis",
  name: "J.A.R.V.I.S",
  full: "Just A Rather Very Intelligent System",
  tagline:
    "A voice-activated personal AI that lives on my Mac, 24/7 — wake it with a word, talk naturally, and a cinematic HUD answers back.",
  summary:
    "A native macOS assistant inspired by Iron Man's JARVIS. It listens for a wake word, transcribes speech, reasons with Claude across 50+ tools, and replies in a custom voice — all behind an always-on-top tactical HUD.",
  year: "2025",
  status: "Running 24/7",
  platform: "macOS · Apple Silicon",
  accent: "34 211 238", // cyan
  stack: ["Python", "Claude", "Deepgram", "ElevenLabs", "Supabase", "PyObjC"],
  // TODO(atishay): replace with the real JARVIS repo URL
  github: "https://github.com/atishayit/jarvis",
  heroVideo: { src: "/jarvis/standby.mp4", poster: "/jarvis/standby-poster.jpg" },
  bootVideo: { src: "/jarvis/boot.mp4", poster: "/jarvis/boot-poster.jpg" },
  bootLog: [
    "[ boot ] J.A.R.V.I.S core ........... online",
    "[  ok  ] neural engine ............. Claude Sonnet",
    "[  ok  ] voice i/o ................. Deepgram · ElevenLabs",
    "[  ok  ] wake word ................. “Hey Jarvis”",
    "[  ok  ] memory ................... Supabase synced",
    "[ live ] all systems nominal.",
  ],
  steps: [
    {
      label: "01 · Wake",
      title: "“Hey Jarvis.”",
      desc: "OpenWakeWord listens on-device and fires only on the wake phrase — no always-on cloud streaming.",
      tech: "OpenWakeWord",
    },
    {
      label: "02 · Listen",
      title: "Speech to text",
      desc: "Deepgram nova-2 transcribes your voice in real time with low latency.",
      tech: "Deepgram nova-2",
    },
    {
      label: "03 · Reason",
      title: "Claude decides",
      desc: "Claude Sonnet interprets intent and picks from 50+ tools, backed by persistent memory.",
      tech: "Claude Sonnet",
    },
    {
      label: "04 · Speak",
      title: "It replies",
      desc: "ElevenLabs renders the answer in a custom JARVIS voice — the loop closes in seconds.",
      tech: "ElevenLabs",
    },
  ],
  showcase: [
    {
      title: "It boots like a scene from the film",
      desc: "A frameless, always-on-top HUD powers on with a cinematic sequence — system stats, neural link, voice and tools all coming online in cyan.",
      command: "Power on",
      src: "/jarvis/boot.mp4",
      poster: "/jarvis/boot-poster.jpg",
      aspect: "square",
    },
    {
      title: "Opens your apps on command",
      desc: "Drives native macOS apps so your hands never have to leave what you're doing.",
      command: "“Open WhatsApp.”",
      src: "",
      aspect: "video",
    },
    {
      title: "Runs the soundtrack",
      desc: "Full Spotify control — play, pause, skip, and the signature “drop the needle.”",
      command: "“Play my focus playlist.”",
      src: "",
      aspect: "video",
    },
    {
      title: "Captures notes and tasks",
      desc: "Dictate a note or spin up a to-do and it lands in your system, instantly.",
      command: "“Add a task — ship the portfolio.”",
      src: "",
      aspect: "video",
    },
    {
      title: "Reads your screen",
      desc: "Ask what you're looking at and JARVIS sees the screen and answers in context.",
      command: "“What am I looking at?”",
      src: "",
      aspect: "video",
    },
    {
      title: "Speaks your language",
      desc: "Switch languages mid-conversation — JARVIS replies in kind, in its own voice.",
      command: "“Reply in Hindi.”",
      src: "",
      aspect: "video",
    },
  ],
  features: [
    { title: "Persistent memory", desc: "Remembers context across conversations via a Supabase Postgres store." },
    { title: "JARVIS & FRIDAY", desc: "Two assistants from one codebase — mine, and my partner's." },
    { title: "50+ tools", desc: "A growing toolbox of commands, always on from the menu bar." },
    { title: "Full Mac control", desc: "Volume, brightness, Wi-Fi and Bluetooth, all by voice." },
    { title: "Calendar & Gmail", desc: "Reads and creates Google Calendar events and Gmail via OAuth." },
    { title: "Initialise sequence", desc: "One command opens every work app and cues a custom track." },
    { title: "Menu-bar status", desc: "A live indicator, always one glance away." },
    { title: "Custom voice", desc: "A bespoke JARVIS voice rendered through ElevenLabs." },
  ],
  tech: [
    { group: "Intelligence", items: ["Claude Sonnet", "50+ tool calls", "Persistent memory"] },
    { group: "Voice I/O", items: ["Deepgram nova-2", "ElevenLabs", "OpenWakeWord"] },
    { group: "Interface", items: ["Python", "pywebview", "Canvas API", "rumps", "PyObjC", "AppleScript"] },
    { group: "Data & APIs", items: ["Supabase / PostgreSQL", "Google Calendar", "Gmail", "OAuth", "Spotify"] },
  ],
};

// Index-card data only — VOLTA's showcase page is driven by src/content/volta.ts.
const VOLTA: Project = {
  slug: "volta",
  name: "VOLTA",
  full: "Energy Forecasting & Anomaly Control Room",
  tagline:
    "A deep-learning control room for the power grid — it forecasts the next 24 hours of energy demand, flags anomalies, and re-forecasts live in your browser as you change the weather.",
  summary:
    "An end-to-end energy-forecasting app on real PJM grid data and weather. A CNN-BiLSTM predicts 24h-ahead demand across three zones, a z-score detector flags anomalies, and a what-if simulator runs the model entirely in-browser via ONNX — no server, $0 hosting.",
  year: "2026",
  status: "Live",
  platform: "Web · Static export",
  accent: "255 176 32", // amber
  stack: ["PyTorch", "CNN-BiLSTM", "ONNX", "Next.js", "Open-Meteo"],
  demo: "https://volta-virid.vercel.app",
  github: "https://github.com/atishayit/volta",
  heroVideo: { src: "", poster: "/volta/hero.png" },
  bootVideo: { src: "", poster: "/volta/hero.png" },
  // Showcase content for /projects/volta lives in src/content/volta.ts.
  bootLog: [],
  steps: [],
  showcase: [],
  features: [],
  tech: [],
};

export const PROJECTS: Project[] = [JARVIS, VOLTA];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
