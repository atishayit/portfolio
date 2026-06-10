import { Asterisk } from "lucide-react";
import { BrandIcon } from "./brands";

const ITEMS = [
  "Full Stack Engineer",
  "Data Scientist",
  "React",
  "TypeScript",
  "Next.js",
  "Python",
  "PyTorch",
  "TensorFlow",
  "Supabase",
  "AWS",
  "Azure",
  "PostgreSQL",
  "Docker",
  "Machine Learning",
  ".NET",
];

function Row() {
  return (
    <>
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center" aria-hidden="true">
          <span className="flex items-center gap-3 px-6">
            <BrandIcon name={item} size={26} className="shrink-0" />
            <span className="font-display text-2xl font-medium text-ink/90 sm:text-4xl">
              {item}
            </span>
          </span>
          <Asterisk className="accent-morph h-5 w-5 shrink-0 text-accent sm:h-6 sm:w-6" />
        </span>
      ))}
    </>
  );
}

/** Infinite horizontal marquee of disciplines + tech. Pure CSS animation. */
export function Marquee() {
  return (
    <div
      className="relative overflow-hidden border-y border-hairline bg-surface-raised/30 py-5 sm:py-7"
      role="marquee"
      aria-label="Disciplines and technologies: Full Stack Engineer, Data Scientist, React, TypeScript, Next.js, Python, PyTorch, TensorFlow, Supabase, AWS, Azure, PostgreSQL, Docker, Machine Learning, .NET"
    >
      <div className="flex w-max animate-marquee items-center">
        <Row />
        <Row />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface to-transparent sm:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface to-transparent sm:w-40" />
    </div>
  );
}
