"use client";

import { motion } from "framer-motion";
import { useSite } from "./providers";
import { ROLES, type RoleId } from "@/content/data";

const ORDER: RoleId[] = ["fullstack", "data"];

interface RoleToggleProps {
  /** Compact variant for the header; full variant for the hero */
  size?: "sm" | "lg";
  className?: string;
}

export function RoleToggle({ size = "sm", className = "" }: RoleToggleProps) {
  const { role, setRole } = useSite();
  const lg = size === "lg";

  return (
    <div
      role="group"
      aria-label="Switch professional focus"
      className={`accent-morph relative inline-flex items-center rounded-full border border-hairline bg-surface-raised/70 backdrop-blur ${
        lg ? "p-1.5 text-sm" : "p-1 text-xs"
      } ${className}`}
    >
      {ORDER.map((id) => {
        const active = role === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setRole(id)}
            aria-pressed={active}
            className={`relative z-10 cursor-pointer rounded-full font-medium transition-colors duration-300 ${
              lg ? "px-5 py-2.5" : "px-3.5 py-1.5"
            } ${active ? "text-accent-contrast" : "text-ink-muted hover:text-ink"}`}
          >
            {active && (
              <motion.span
                layoutId={`role-pill-${size}`}
                className="absolute inset-0 -z-10 rounded-full bg-accent shadow-lg shadow-accent/30"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="whitespace-nowrap">{ROLES[id].short}</span>
          </button>
        );
      })}
    </div>
  );
}
