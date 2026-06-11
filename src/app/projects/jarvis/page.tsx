import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JarvisShowcase } from "@/components/jarvis/JarvisShowcase";
import { getProject } from "@/content/projects";

const project = getProject("jarvis");

export const metadata: Metadata = {
  title: "J.A.R.V.I.S — Voice-activated AI assistant",
  description:
    "A native macOS personal AI inspired by Iron Man's JARVIS — wake word, Claude reasoning across 50+ tools, custom voice, and an animated sci-fi HUD.",
};

export default function JarvisPage() {
  if (!project) notFound();
  return <JarvisShowcase project={project} />;
}
