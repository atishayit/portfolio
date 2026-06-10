"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { RoleId } from "@/content/data";

type Theme = "light" | "dark";

interface SiteState {
  theme: Theme;
  role: RoleId;
  toggleTheme: () => void;
  setRole: (role: RoleId) => void;
  /** True once the intro preloader has finished (or was skipped). Hero entrance waits on this. */
  intro: boolean;
  completeIntro: () => void;
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

  const setRole = useCallback((next: RoleId) => {
    setRoleState((prev) => {
      if (prev === next) return prev;
      localStorage.setItem("aj-role", next);
      const theme = document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
      applyToDocument(theme, next);
      return next;
    });
  }, []);

  return (
    <SiteContext.Provider
      value={{ theme, role, toggleTheme, setRole, intro, completeIntro }}
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
