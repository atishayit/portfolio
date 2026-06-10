"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, PERSON } from "@/content/data";
import { RoleToggle } from "./RoleToggle";
import { ThemeToggle } from "./ThemeToggle";

/** Section links become "/#id" so they resolve from any route. */
function hrefFor(href: string) {
  return href.startsWith("#") ? `/${href}` : href;
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy for in-page section links.
  useEffect(() => {
    const ids = NAV_LINKS.filter((l) => l.href.startsWith("#")).map((l) =>
      l.href.slice(1)
    );
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Lock body scroll when the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
      <div
        className={`accent-morph mx-auto flex max-w-container items-center justify-between gap-4 rounded-2xl border px-3 py-2.5 transition-all duration-300 sm:px-4 ${
          scrolled
            ? "glass border-hairline shadow-lg shadow-black/5"
            : "border-transparent bg-transparent"
        }`}
      >
        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label={`${PERSON.name} — home`}
        >
          <span className="accent-morph grid h-9 w-9 place-items-center rounded-xl bg-accent font-display text-sm font-bold text-accent-contrast shadow-md shadow-accent/30 transition-transform duration-300 group-hover:scale-105">
            {PERSON.initials}
          </span>
          <span className="hidden font-display text-sm font-semibold tracking-tight text-ink sm:block">
            {PERSON.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href;
            return (
              <Link
                key={link.href}
                href={hrefFor(link.href)}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 hover:text-ink ${
                  isActive ? "text-ink" : "text-ink-muted"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <RoleToggle className="hidden sm:inline-flex" />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-hairline bg-surface-raised/70 text-ink backdrop-blur lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="glass mx-auto mt-2 max-w-container overflow-hidden rounded-2xl border border-hairline p-3 lg:hidden"
          >
            <nav className="flex flex-col" aria-label="Mobile">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={hrefFor(link.href)}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium text-ink-muted transition-colors hover:bg-accent/10 hover:text-ink"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 flex items-center justify-between border-t border-hairline px-1 pt-3">
              <span className="font-mono text-xs uppercase tracking-widest text-ink-faint">
                Focus
              </span>
              <RoleToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
