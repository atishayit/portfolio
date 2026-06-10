import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FolderGit2 } from "lucide-react";
import { Background } from "@/components/Background";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected projects by Atishay Jain — coming soon.",
};

export default function ProjectsPage() {
  return (
    <>
      <Background />
      <Header />
      <main className="grid min-h-[100svh] place-items-center px-5 py-32 text-center">
        <div className="mx-auto max-w-xl">
          <span className="accent-morph mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-accent/10 text-accent">
            <FolderGit2 size={30} />
          </span>
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-accent">
            Projects
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Something worth showing is on the way.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-ink-muted sm:text-lg">
            A curated selection of full-stack builds and data science work is
            being assembled. Check back soon — or reach out and I&apos;ll walk you
            through what I&apos;m building.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-raised/60 px-5 py-3 text-sm font-semibold text-ink backdrop-blur transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              <ArrowLeft
                size={16}
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              />
              Back home
            </Link>
            <Link
              href="/#contact"
              className="accent-morph inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-contrast shadow-lg shadow-accent/30 transition-transform duration-200 hover:-translate-y-0.5"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
