/**
 * Content for the JARVIS product landing at /projects/jarvis.
 * Dual identity: Jarvis (cyan) and Friday (amber). Friday is "in progress".
 * Media marked `src: ""` renders a premium "coming soon" slot until assets land.
 */

export type Identity = "jarvis" | "friday";

export interface IdentityProfile {
  id: Identity;
  name: string; // "J.A.R.V.I.S"
  short: string; // "Jarvis"
  wake: string; // "Hey Jarvis"
  /** accent as "r g b" triplet */
  accent: string;
  honorific: string; // "sir" / "ma'am"
  blurb: string;
  available: boolean;
}

export const IDENTITIES: Record<Identity, IdentityProfile> = {
  jarvis: {
    id: "jarvis",
    name: "J.A.R.V.I.S",
    short: "Jarvis",
    wake: "Hey Jarvis",
    accent: "34 211 238", // cyan-400
    honorific: "sir",
    blurb: "Just A Rather Very Intelligent System. Cyan core, the original.",
    available: true,
  },
  friday: {
    id: "friday",
    name: "F.R.I.D.A.Y",
    short: "Friday",
    wake: "Hey Friday",
    accent: "245 158 11", // amber-500
    honorific: "ma'am",
    blurb: "Same brain, different voice and identity — an amber-themed HUD.",
    available: false,
  },
};

export const JARVIS = {
  year: "2025",
  platform: "macOS · Apple Silicon",
  status: "Running 24/7",
  github: "https://github.com/atishayit/jarvis", // TODO(atishay): real repo
  pitch:
    "A native macOS AI assistant with an Iron-Man-style holographic HUD — wake it by voice, talk naturally, and let it run your Mac, calendar and email. Comes as Jarvis or Friday, with an installer as cinematic as the assistant itself.",

  // Media — swap src/poster as real assets arrive.
  media: {
    // Hero orb: looping standby HUD (temporary — replace with the NEW startup HUD)
    standby: { src: "/jarvis/standby.mp4", poster: "/jarvis/standby-poster.jpg" },
    // Boot / power-up sequence
    boot: { src: "/jarvis/boot.mp4", poster: "/jarvis/boot-poster.jpg" },
    // Cinematic power-up sequence (with sound)
    startup: { src: "/jarvis/startup.mp4", poster: "/jarvis/startup-poster.jpg" },
  },

  bootLog: [
    "[ boot ] J.A.R.V.I.S core ........... online",
    "[  ok  ] neural engine ............. Claude",
    "[  ok  ] voice i/o ................. Deepgram · ElevenLabs",
    "[  ok  ] wake word ................. neural · on-device",
    "[ live ] all systems nominal.",
  ],

  features: [
    { icon: "mic", title: "Voice-first", desc: "Wake it by name — custom neural wake words, no clicking. It listens, you talk." },
    { icon: "sliders", title: "Runs your Mac", desc: "Brightness, volume, Wi-Fi, Bluetooth, dark mode, sleep, DND, empty trash, open apps." },
    { icon: "calendar", title: "Calendar", desc: "“What's on my calendar?” across personal + work Google accounts. Creates events too." },
    { icon: "mail", title: "Email", desc: "Reads your Primary inbox, searches, sends and marks read — across multiple accounts." },
    { icon: "alarm", title: "Reminders & timers", desc: "“Remind me in 10 minutes.” Persistent across restarts, fires right on time." },
    { icon: "music", title: "Music", desc: "Spotify playback — plus a signature “drop the needle” track." },
    { icon: "sparkles", title: "Knowledge & chat", desc: "Powered by Claude — answers, summaries and real back-and-forth conversation." },
    { icon: "rocket", title: "Startup ritual", desc: "An “initialise sequence” that launches your chosen apps on command." },
    { icon: "fingerprint", title: "Speaker recognition", desc: "Optionally knows who's talking by voice, for the right honorific." },
  ],

  // Reactive HUD states — the scroll-pinned moment cycles through these.
  hudStates: [
    { key: "standby", label: "Standby", color: "34 211 238", video: "/jarvis/standby.mp4", desc: "Idle and listening for its name. The core breathes a calm cyan." },
    { key: "listening", label: "Listening", color: "56 189 248", video: "/jarvis/listening.mp4", desc: "It hears you — capturing every word as you speak." },
    { key: "thinking", label: "Thinking", color: "168 85 247", video: "/jarvis/processing.mp4", desc: "Reasoning with Claude and picking the right tools. The core turns purple." },
    { key: "speaking", label: "Speaking", color: "16 185 129", video: "/jarvis/speaking.mp4", desc: "Replies in a cinematic voice — the HUD pulses green." },
  ],

  installer: {
    intro:
      "The installer is the experience too — a frameless dark-glass app with a glowing accent, a live diagnostics panel and a deploy sequence with a progress ring. It feels like booting a system, not filling out a form.",
    shots: [
      { video: "/jarvis/installer-1.mp4", title: "Pick your identity", desc: "Choose Jarvis or Friday — the whole installer re-themes, cyan or amber." },
      { video: "/jarvis/installer-2.mp4", title: "Keys & permissions", desc: "Enter API keys (auto-detected from existing installs) and grant macOS permissions, guided." },
      { video: "/jarvis/installer-3.mp4", title: "Personalise", desc: "Set your startup apps and signature track." },
      { video: "/jarvis/installer-4.mp4", title: "Deploy", desc: "A progress-ring deploy sequence, then one-click “Connect Google” for personal + work." },
    ],
  },

  tech: [
    { group: "Shell", items: ["Native macOS", "PyWebView + AppKit", "PyInstaller → signed .dmg"] },
    { group: "Brain", items: ["Claude (Anthropic)", "context memory", "tool calling"] },
    { group: "Ears", items: ["OpenWakeWord", "Silero VAD + adaptive gain", "Deepgram STT", "ECAPA speaker ID"] },
    { group: "Voice & APIs", items: ["ElevenLabs TTS", "Google Calendar / Gmail", "Spotify"] },
  ],

  requirements: [
    { label: "Platform", value: "macOS · Apple Silicon" },
    { label: "Delivery", value: "Signed .dmg installer" },
    { label: "Keys", value: "Anthropic · ElevenLabs · Deepgram" },
  ],
};
