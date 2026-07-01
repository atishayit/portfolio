"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { RoleId } from "@/content/data";

type Theme = "light" | "dark";

/** Active full-screen circular wipe when switching identity (null when idle). */
export type RoleWipeState = { role: RoleId; x: number; y: number; color: string };

/** Mirror of the role accents in globals.css ("r g b") — colours the wipe disc. */
const ROLE_ACCENTS: Record<Theme, Record<RoleId, string>> = {
  light: { fullstack: "37 99 235", data: "13 148 136" },
  dark: { fullstack: "110 145 255", data: "45 212 191" },
};

interface SiteState {
  theme: Theme;
  role: RoleId;
  toggleTheme: () => void;
  /** Switch role; pass the click origin to play the circular wipe from there. */
  setRole: (role: RoleId, origin?: { x: number; y: number }) => void;
  /** True once the intro preloader has finished (or was skipped). Hero entrance waits on this. */
  intro: boolean;
  completeIntro: () => void;
  wipe: RoleWipeState | null;
}

/** Whether the cinematic preloader should be skipped (return visit or reduced motion). */
function shouldSkipIntro(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (sessionStorage.getItem("aj-intro")) return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

const SiteContext = createContext<SiteState | null>(null);

/** Applies the current theme + role to the <html> element. */
function applyToDocument(theme: Theme, role: RoleId) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.role = role;
  root.style.colorScheme = theme;
}

export function Providers({ children }: { children: ReactNode }) {
  // Initialised from the pre-hydration inline script (see layout.tsx) to avoid flashes.
  const [theme, setTheme] = useState<Theme>("dark");
  const [role, setRoleState] = useState<RoleId>("data");
  const roleRef = useRef<RoleId>(role);
  roleRef.current = role;
  const [wipe, setWipe] = useState<RoleWipeState | null>(null);
  // Lazy init so return visitors / reduced-motion users start with the hero already revealed.
  const [intro, setIntro] = useState<boolean>(() => shouldSkipIntro());

  const completeIntro = useCallback(() => {
    try {
      sessionStorage.setItem("aj-intro", "1");
    } catch {
      /* ignore */
    }
    setIntro(true);
  }, []);

  useEffect(() => {
    const storedTheme = (localStorage.getItem("aj-theme") as Theme | null) ?? null;
    const storedRole = (localStorage.getItem("aj-role") as RoleId | null) ?? null;
    const prefersDark =
      window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true;
    const nextTheme: Theme = storedTheme ?? (prefersDark ? "dark" : "light");
    const nextRole: RoleId = storedRole ?? "data";
    setTheme(nextTheme);
    setRoleState(nextRole);
    applyToDocument(nextTheme, nextRole);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("aj-theme", next);
      applyToDocument(next, document.documentElement.dataset.role as RoleId);
      return next;
    });
  }, []);

  const setRole = useCallback(
    (next: RoleId, origin?: { x: number; y: number }) => {
      if (next === roleRef.current) return;
      const html = document.documentElement;
      const theme: Theme = html.classList.contains("dark") ? "dark" : "light";
      const reduce =
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
      try {
        localStorage.setItem("aj-role", next);
      } catch {
        /* ignore */
      }

      // No origin or reduced motion → instant swap, no wipe.
      if (!origin || reduce) {
        setRoleState(next);
        applyToDocument(theme, next);
        return;
      }

      // Expand the circle in the incoming accent, swap the theme once it's
      // covered, then fade to reveal.
      setWipe({ role: next, x: origin.x, y: origin.y, color: ROLE_ACCENTS[theme][next] });
      window.setTimeout(() => {
        setRoleState(next);
        applyToDocument(theme, next);
      }, 500);
      window.setTimeout(() => setWipe(null), 700);
    },
    []
  );

  return (
    <SiteContext.Provider
      value={{ theme, role, toggleTheme, setRole, intro, completeIntro, wipe }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite(): SiteState {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within <Providers>");
  return ctx;
}
