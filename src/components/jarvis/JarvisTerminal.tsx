"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useInView, useReducedMotion } from "framer-motion";
import { JARVIS } from "@/content/jarvis";

/**
 * The closing section reimagined as a live AI terminal: a boot transcript types
 * itself out on view, then interactive commands let the visitor "open a channel"
 * — each command echoes, prints a response, and routes.
 */

type Line = { kind: "cmd" | "out" | "ok" | "dim"; text: string };

const SCRIPT: Line[] = [
  { kind: "cmd", text: "boot_status" },
  { kind: "ok", text: `${JARVIS.status} · ${JARVIS.platform}` },
  { kind: "cmd", text: "about" },
  {
    kind: "out",
    text:
      "a personal build — a native macOS app I run on my own machine, packaged as a signed .dmg with a cinematic installer. F.R.I.D.A.Y inbound.",
  },
  { kind: "cmd", text: "requirements" },
  {
    kind: "dim",
    text: JARVIS.requirements.map((r) => `${r.label.toLowerCase()}: ${r.value}`).join("   ·   "),
  },
  { kind: "cmd", text: "open_channel" },
  { kind: "ok", text: "secure channel ready — select a command" },
];

const COMMANDS = [
  { label: "initiate_contact", res: "routing to secure channel…", href: "/#contact" },
  { label: "view_creator", res: "loading operator profile…", href: "/" },
  { label: "back_to_projects", res: "returning to index…", href: "/projects/" },
];

export function JarvisTerminal() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const router = useRouter();

  const [count, setCount] = useState(0);
  const [extra, setExtra] = useState<Line[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setCount(SCRIPT.length);
      return;
    }
    let i = 0;
    const tick = () => {
      i += 1;
      setCount(i);
      if (i < SCRIPT.length) {
        timer = setTimeout(tick, SCRIPT[i].kind === "cmd" ? 520 : 360);
      }
    };
    let timer = setTimeout(tick, 300);
    return () => clearTimeout(timer);
  }, [inView, reduce]);

  const run = (cmd: (typeof COMMANDS)[number]) => {
    if (busy) return;
    setBusy(true);
    setExtra((e) => [...e, { kind: "cmd", text: cmd.label }, { kind: "ok", text: cmd.res }]);
    setTimeout(() => router.push(cmd.href), 650);
  };

  const lines = [...SCRIPT.slice(0, count), ...extra];

  return (
    <section id="about" className="relative px-5 py-28 sm:px-6 sm:py-36">
      <div ref={ref} className="mx-auto max-w-3xl">
        <p className="jx-accent mb-5 text-center font-mono text-xs uppercase tracking-[0.3em]">
          {"// transmission"}
        </p>
        <div className="jx-bd overflow-hidden rounded-2xl border bg-black/60 backdrop-blur">
          {/* terminal chrome */}
          <div className="jx-bd flex items-center gap-2 border-b bg-white/[0.03] px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-white/15" />
            <span className="h-3 w-3 rounded-full bg-white/15" />
            <span className="h-3 w-3 rounded-full bg-white/15" />
            <span className="ml-3 font-mono text-xs text-slate-500">jarvis://secure-channel</span>
            <span className="jx-accent ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest">
              <span className="jx-dot h-1.5 w-1.5 rounded-full" /> online
            </span>
          </div>

          {/* transcript */}
          <div className="min-h-[18rem] space-y-1.5 p-5 font-mono text-sm leading-relaxed sm:p-7">
            {lines.map((l, i) => (
              <Row key={i} line={l} />
            ))}
            <span className="jx-fill inline-block h-4 w-2 animate-pulse align-middle" />

            {/* interactive commands */}
            {count >= SCRIPT.length && (
              <div className="mt-6 flex flex-wrap gap-2.5">
                {COMMANDS.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => run(c)}
                    className="jx-bd jx-accent jx-hov group rounded-lg border bg-white/[0.03] px-3.5 py-2 text-left text-xs transition-colors"
                  >
                    <span className="text-slate-500">{"> "}</span>
                    {c.label}
                    <span className="ml-1 text-slate-600 transition-colors group-hover:text-current">_</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <p className="mt-4 text-center font-mono text-[11px] text-slate-600">
          J.A.R.V.I.S — built by Atishay Jain · type a command above
        </p>
      </div>
    </section>
  );
}

function Row({ line }: { line: Line }) {
  if (line.kind === "cmd") {
    return (
      <div className="text-slate-200">
        <span className="jx-accent">{"> "}</span>
        {line.text}
      </div>
    );
  }
  if (line.kind === "ok") {
    return (
      <div className="text-slate-400">
        <span className="jx-accent">[ ok ]</span> {line.text}
      </div>
    );
  }
  if (line.kind === "dim") {
    return <div className="pl-5 text-slate-500">{line.text}</div>;
  }
  return <div className="pl-5 text-slate-400">{line.text}</div>;
}
