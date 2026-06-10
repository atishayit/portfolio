"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons";
import { PERSON } from "@/content/data";

export function Footer() {
  return (
    <footer className="border-t border-hairline px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-container flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-3">
          <span className="accent-morph grid h-9 w-9 place-items-center rounded-xl bg-accent font-display text-sm font-bold text-accent-contrast">
            {PERSON.initials}
          </span>
          <div>
            <p className="font-display text-sm font-semibold text-ink">
              {PERSON.name}
            </p>
            <p className="font-mono text-xs text-ink-faint">
              Full Stack Engineer · Data Scientist
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={PERSON.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="grid h-10 w-10 place-items-center rounded-full border border-hairline text-ink-muted transition-colors hover:border-accent hover:text-accent"
          >
            <GithubIcon className="h-[18px] w-[18px]" />
          </a>
          <a
            href={PERSON.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="grid h-10 w-10 place-items-center rounded-full border border-hairline text-ink-muted transition-colors hover:border-accent hover:text-accent"
          >
            <LinkedinIcon className="h-[18px] w-[18px]" />
          </a>
          <Link
            href="/#top"
            scroll
            aria-label="Back to top"
            className="grid h-10 w-10 place-items-center rounded-full border border-hairline text-ink-muted transition-colors hover:border-accent hover:text-accent"
          >
            <ArrowUp size={18} />
          </Link>
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-container text-center font-mono text-xs text-ink-faint sm:text-left">
        © {new Date().getFullYear()} {PERSON.name}. Built with Next.js, Tailwind &
        Framer Motion.
      </p>
    </footer>
  );
}
