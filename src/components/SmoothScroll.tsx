"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";
import { useSite } from "./providers";

// Height of the fixed header to offset anchor scrolling.
const HEADER_OFFSET = -96;

/**
 * Momentum smooth-scrolling via Lenis.
 * - Disabled for prefers-reduced-motion (native scroll).
 * - Paused while the intro preloader is on screen.
 * - Intercepts in-page hash links (capture phase) so they ease to target.
 */
export function SmoothScroll() {
  const { intro } = useSite();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    // Expose for the intro-pause effect below.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Smoothly handle in-page hash links (Next <Link> + plain <a>).
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const anchor = (e.target as HTMLElement)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;

      let id: string | null = null;
      if (href.startsWith("#")) id = href.slice(1);
      else if (href.startsWith("/#")) id = href.slice(2);
      else return; // route or external link — let Next/browser handle it

      const target = id ? document.getElementById(id) : null;
      // Only hijack when the target exists on the current page.
      if (id === "top" || target) {
        e.preventDefault();
        e.stopPropagation();
        lenis.scrollTo(target ?? 0, { offset: HEADER_OFFSET, duration: 1.3 });
        history.replaceState(null, "", target && id !== "top" ? `/#${id}` : "/");
      }
    };
    document.addEventListener("click", onClick, true);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick, true);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, [reduce]);

  // Lock/unlock momentum scroll in sync with the preloader.
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (!lenis) return;
    if (intro) lenis.start();
    else lenis.stop();
  }, [intro]);

  return null;
}
