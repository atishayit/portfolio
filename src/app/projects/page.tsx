import type { Metadata } from "next";
import { Background } from "@/components/Background";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProjectList } from "@/components/ProjectList";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected things Atishay Jain has built end-to-end.",
};

export default function ProjectsPage() {
  return (
    <>
      <Background />
      <Header />
      <main className="mx-auto min-h-[100svh] max-w-container px-5 pb-24 pt-32 sm:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
          {"// Selected work"}
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl md:text-6xl">
          Projects
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
          A small, growing set of things I&apos;ve built end-to-end — each one shipped,
          deployed and documented. More are in progress.
        </p>

        <div className="mt-12 sm:mt-16">
          <ProjectList />
        </div>

        <div className="mt-8 grid place-items-center rounded-4xl border border-dashed border-hairline p-10 text-center">
          <p className="font-mono text-sm text-ink-faint">
            More projects in progress — building them simultaneously.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
