import { ArrowUpRight, FileText } from "lucide-react";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { PUBLICATIONS } from "@/content/data";

export function Publications() {
  return (
    <Section
      id="publications"
      index="05 / Research"
      title="Published & peer-reviewed."
      intro="Two papers presented at the 2023 IEEE International Conference on Intelligent Computing and Research Trends (ICRT)."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {PUBLICATIONS.map((pub, i) => (
          <Reveal key={pub.title} delay={i * 0.08}>
            <a
              href={pub.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-3xl border border-hairline bg-surface-raised/40 p-6 transition-colors duration-300 hover:border-accent/50"
            >
              <div className="flex items-center justify-between">
                <span className="accent-morph grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
                  <FileText size={18} />
                </span>
                <span className="font-mono text-xs text-ink-faint">
                  IEEE · {pub.year}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-accent">
                {pub.title}
              </h3>
              <p className="mt-3 text-sm text-ink-muted">{pub.authors}</p>
              <p className="mt-2 text-sm text-ink-faint">{pub.venue}</p>
              <span className="mt-auto pt-5 inline-flex items-center gap-1 text-sm font-medium text-accent">
                View on IEEE Xplore
                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
