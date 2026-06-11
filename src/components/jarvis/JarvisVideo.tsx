"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";

interface JarvisVideoProps {
  src: string;
  poster?: string;
  /** Small monospace label, top-left */
  label?: string;
  aspect?: "square" | "video";
  /** Silent looping background clip — hides the unmute control */
  ambient?: boolean;
  className?: string;
}

/** Premium framed video: autoplays muted when scrolled into view, with an unmute toggle. */
export function JarvisVideo({
  src,
  poster,
  label,
  aspect = "video",
  ambient = false,
  className = "",
}: JarvisVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  // Play only while in view (perf + don't blast audio off-screen).
  useEffect(() => {
    const v = ref.current;
    if (!v || !src) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.3 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  const toggleMute = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) v.play().catch(() => {});
  };

  const aspectClass = aspect === "square" ? "aspect-square" : "aspect-video";

  return (
    <div className={`group relative ${className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-cyan-500/10 blur-2xl"
      />
      <div
        className={`relative ${aspectClass} overflow-hidden rounded-2xl border border-cyan-400/25 bg-black`}
      >
        {src ? (
          <>
            <video
              ref={ref}
              src={src}
              poster={poster}
              muted={muted}
              loop
              autoPlay
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
            {!ambient && (
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Unmute" : "Mute"}
                className="absolute bottom-3 right-3 grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-cyan-400/30 bg-black/50 text-cyan-300 backdrop-blur transition-colors hover:bg-black/70"
              >
                {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
            )}
          </>
        ) : (
          <div className="jarvis-scanlines grid h-full place-items-center">
            <div className="text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-cyan-400/40 bg-cyan-400/10 text-cyan-300">
                <Play size={20} className="ml-1 fill-current" />
              </span>
              <p className="mt-4 font-mono text-xs text-cyan-300/80">Demo coming soon</p>
            </div>
          </div>
        )}
      </div>

      {["left-0 top-0 border-l-2 border-t-2", "right-0 top-0 border-r-2 border-t-2", "bottom-0 left-0 border-b-2 border-l-2", "bottom-0 right-0 border-b-2 border-r-2"].map(
        (c, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`pointer-events-none absolute h-5 w-5 border-cyan-400/70 ${c}`}
          />
        )
      )}

      {label && (
        <span className="absolute left-3 top-3 rounded-md border border-cyan-400/20 bg-black/50 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-cyan-300/80 backdrop-blur">
          {label}
        </span>
      )}
    </div>
  );
}
