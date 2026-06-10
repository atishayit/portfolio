"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Section } from "./Section";
import { useSite } from "./providers";
import { BrandIcon } from "./brands";
import { ROLES } from "@/content/data";

export function Skills() {
  const { role } = useSite();
  const profile = ROLES[role];

  return (
    <Section
      id="skills"
      index="02 / Toolkit"
      title="The stack behind the work."
      intro="Tailored to the focus you've selected — flip the toggle in the header to see the other discipline."
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={profile.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {profile.skills.map((group, i) => (
            <motion.div
              key={group.group}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-3xl border border-hairline bg-surface-raised/40 p-5 transition-colors duration-300 hover:border-accent/40"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-ink">
                  {group.group}
                </h3>
                <span className="accent-morph font-mono text-xs text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="accent-morph flex items-center gap-1.5 rounded-lg border border-hairline bg-surface px-2.5 py-1 text-sm text-ink-muted transition-colors duration-200 hover:border-accent/50 hover:text-ink"
                  >
                    <BrandIcon name={item} size={15} className="shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}
