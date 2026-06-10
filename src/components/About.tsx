import { GraduationCap, MapPin } from "lucide-react";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { PERSON } from "@/content/data";

export function About() {
  return (
    <Section
      id="about"
      index="01 / About"
      title="One engineer, two disciplines."
    >
      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        {/* Narrative */}
        <div className="space-y-5 text-base leading-relaxed text-ink-muted sm:text-lg">
          <Reveal>
            <p>
              I&apos;m a Melbourne-based engineer who lives in two worlds and
              refuses to choose. As a{" "}
              <span className="font-medium text-ink">full-stack engineer</span> I
              ship entire products on my own — from Figma files to a production
              platform running on React, Supabase, Stripe and CI/CD, as I&apos;ve
              done as the sole engineer behind HostyNest.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <p>
              As a{" "}
              <span className="font-medium text-ink">data scientist</span> I build
              hybrid LSTM/CNN models and ETL pipelines that leave the notebook and
              go to work — a disease-prediction model deployed in US hospitals, an
              energy-forecasting model recognised for its accuracy, and two
              peer-reviewed IEEE papers.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p>
              The thread tying it together: I turn ambiguous problems into things
              that actually ship and create measurable value. Currently deepening
              the science with a Master of Data Science at Deakin University while
              building full-stack products in the wild.
            </p>
          </Reveal>
        </div>

        {/* Quick facts */}
        <div className="space-y-4">
          <Reveal className="accent-morph glass rounded-3xl p-6">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
              <MapPin size={14} /> Based in
            </div>
            <p className="mt-3 text-lg font-medium text-ink">{PERSON.location}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">
              Open to full-stack and data science roles — remote or on-site. Two
              disciplines, delivered with equal care.
            </p>
          </Reveal>

          <Reveal className="rounded-3xl border border-hairline bg-surface-raised/40 p-6">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink-faint">
              <GraduationCap size={14} /> Now
            </div>
            <p className="mt-3 text-ink">
              M.S. Data Science (Professional) — Deakin University
            </p>
            <p className="text-sm text-ink-faint">86% · Melbourne · Expected Nov 2026</p>
            <a
              href={PERSON.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
            >
              Connect on LinkedIn →
            </a>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
