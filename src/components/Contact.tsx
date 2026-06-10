"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Mail, MapPin } from "lucide-react";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { Magnetic } from "./Magnetic";
import { GithubIcon, LinkedinIcon } from "./icons";
import { PERSON } from "@/content/data";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PERSON.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the mailto link still works */
    }
  };

  return (
    <Section
      id="contact"
      index="07 / Contact"
      title="Let's build something."
      intro="Open to full-stack and data science roles, collaborations, and interesting problems. The fastest way to reach me is email."
    >
      <Reveal className="accent-morph glass overflow-hidden rounded-4xl p-8 sm:p-12">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <a
              href={PERSON.socials.email}
              className="group inline-flex items-center gap-3 font-display text-2xl font-semibold tracking-tight text-ink transition-colors hover:text-accent sm:text-3xl md:text-4xl"
            >
              <Mail className="accent-morph shrink-0 text-accent" size={28} />
              <span className="break-all">{PERSON.email}</span>
            </a>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Magnetic>
                <a
                  href={PERSON.socials.email}
                  className="accent-morph inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-contrast shadow-lg shadow-accent/30 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <Mail size={16} /> Send an email
                </a>
              </Magnetic>
              <Magnetic>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-raised/60 px-5 py-3 text-sm font-semibold text-ink backdrop-blur transition-colors duration-200 hover:border-accent hover:text-accent"
                >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? "done" : "copy"}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.18 }}
                    className="inline-flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check size={16} /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={16} /> Copy address
                      </>
                    )}
                  </motion.span>
                </AnimatePresence>
                </button>
              </Magnetic>
            </div>

            <p className="mt-6 flex items-center gap-2 text-sm text-ink-faint">
              <MapPin size={14} /> {PERSON.location}
              {PERSON.showPhone && <span> · {PERSON.phone}</span>}
            </p>
          </div>

          {/* Social cards */}
          <div className="grid gap-3">
            <SocialCard
              href={PERSON.socials.linkedin}
              label="LinkedIn"
              handle="/in/atishayjain25"
            >
              <LinkedinIcon className="h-5 w-5" />
            </SocialCard>
            <SocialCard
              href={PERSON.socials.github}
              label="GitHub"
              handle="@atishayit"
            >
              <GithubIcon className="h-5 w-5" />
            </SocialCard>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function SocialCard({
  href,
  label,
  handle,
  children,
}: {
  href: string;
  label: string;
  handle: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-2xl border border-hairline bg-surface-raised/40 p-4 transition-colors duration-200 hover:border-accent/50"
    >
      <span className="accent-morph grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-contrast">
        {children}
      </span>
      <div>
        <p className="font-medium text-ink">{label}</p>
        <p className="font-mono text-xs text-ink-faint">{handle}</p>
      </div>
    </a>
  );
}
