"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";

interface MediaFrameProps {
  /** Video source under /public */
  src?: string;
  poster?: string;
  /** Image source (used when there's no video) */
  imageSrc?: string;
  alt?: string;
  /** Small monospace label, top-left */
  label?: string;
  aspect?: "square" | "video";
  /** Explicit CSS aspect-ratio (e.g. "900 / 640") — overrides `aspect` */
  ratio?: string;
  /** Fill the parent (h-full) instead of using an aspect ratio — for crossfade stacks */
  fill?: boolean;
  /** Silent looping background clip — hides the unmute control */
  ambient?: boolean;
  className?: string;
}

/**
 * Themable HUD-framed media: a video (autoplays muted in view), an image, or a
 * "coming soon" placeholder. Accent re-themes with the active identity (--j).
 */
export function JarvisVideo({
  src,
  poster,
  imageSrc,
  alt = "",
  label,
  aspect = "video",
  ratio,
  fill = false,
  ambient = false,
  className = "",
}: MediaFrameProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

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
    <div className={`group relative ${fill ? "h-full" : ""} ${className}`}>
      <div
        aria-hidden="true"
        className="jx-glow pointer-events-none absolute -inset-3 rounded-[2rem] blur-2xl"
      />
      <div
        className={`jx-bd relative ${fill ? "h-full" : ratio ? "" : aspectClass} overflow-hidden rounded-2xl border bg-black`}
        style={!fill && ratio ? { aspectRatio: ratio } : undefined}
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
                className="jx-bd jx-accent absolute bottom-3 right-3 grid h-9 w-9 cursor-pointer place-items-center rounded-full border bg-black/50 backdrop-blur transition-colors hover:bg-black/70"
              >
                {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
            )}
          </>
        ) : imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageSrc} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <div className="jarvis-scanlines grid h-full place-items-center">
            <div className="text-center">
              <span className="jx-bd2 jx-accent mx-auto grid h-14 w-14 place-items-center rounded-full border bg-black/40">
                <Play size={20} className="ml-1 fill-current" />
              </span>
              <p className="jx-accent mt-4 font-mono text-xs">Coming soon</p>
              <p className="mt-1 font-mono text-xs text-slate-500">Asset on the way</p>
            </div>
          </div>
        )}
      </div>

      {["left-0 top-0 border-l-2 border-t-2", "right-0 top-0 border-r-2 border-t-2", "bottom-0 left-0 border-b-2 border-l-2", "bottom-0 right-0 border-b-2 border-r-2"].map(
        (c, i) => (
          <span
            key={i}
            aria-hidden="true"
            style={{ borderColor: "rgb(var(--j) / 0.7)" }}
            className={`pointer-events-none absolute h-5 w-5 ${c}`}
          />
        )
      )}

      {label && (
        <span className="jx-bd jx-accent absolute left-3 top-3 rounded-md border bg-black/50 px-2 py-1 font-mono text-[10px] uppercase tracking-widest backdrop-blur">
          {label}
        </span>
      )}
    </div>
  );
}
