import { ArrowUpRight } from "lucide-react";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { AutoSheen } from "./AutoSheen";
import { IssuerMark } from "./IssuerMark";
import { CERTIFICATIONS } from "@/content/data";

export function Certifications() {
  return (
    <Section
      id="certifications"
      index="08 / Credentials"
      title="Certifications."
      intro="Professional certificates from Meta, Google, IBM and more — tap any tile to open the original."
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CERTIFICATIONS.map((cert, i) => (
          <Reveal
            key={`${cert.title}-${i}`}
            delay={i * 0.06}
            className={cert.wide ? "col-span-2" : "col-span-1"}
          >
            <a
              href={cert.href ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-hairline bg-surface-raised/40 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 [@media(hover:none)]:border-accent/30"
            >
              <AutoSheen delay={i * 0.06} />
              <span
                aria-hidden="true"
                className="accent-morph pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
              />

              <div className="relative flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-hairline bg-surface">
                  <IssuerMark issuer={cert.issuer} size={cert.wide ? 28 : 24} />
                </span>
                <ArrowUpRight
                  size={16}
                  className="shrink-0 text-ink-faint transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                />
              </div>

              <div className="relative mt-6">
                <h3
                  className={`font-display font-semibold leading-snug text-ink transition-colors group-hover:text-accent ${
                    cert.wide ? "text-lg sm:text-xl" : "text-base"
                  }`}
                >
                  {cert.title}
                </h3>
                <p className="mt-1.5 text-sm font-medium text-ink-muted">
                  {cert.issuer} · {cert.year}
                </p>
                {cert.platform && (
                  <p className="mt-0.5 font-mono text-xs text-ink-faint">
                    {cert.platform}
                  </p>
                )}
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
