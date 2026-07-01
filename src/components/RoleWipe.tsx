"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSite } from "./providers";

const EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Full-screen circular wipe played when the identity toggle switches roles.
 * A disc of the incoming accent expands from the click point to cover the
 * screen; the provider swaps the theme underneath, then this fades to reveal it.
 */
export function RoleWipe() {
  const { wipe } = useSite();
  return (
    <AnimatePresence>
      {wipe && (
        <motion.div
          key={`${wipe.role}-${wipe.x}-${wipe.y}`}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[150]"
          style={{ background: `rgb(${wipe.color})` }}
          initial={{ clipPath: `circle(0% at ${wipe.x}px ${wipe.y}px)` }}
          animate={{ clipPath: `circle(160% at ${wipe.x}px ${wipe.y}px)` }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: EASE } }}
          transition={{ duration: 0.5, ease: EASE }}
        />
      )}
    </AnimatePresence>
  );
}
