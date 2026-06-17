import type { Metadata } from "next";
import { JarvisShowcase } from "@/components/jarvis/JarvisShowcase";

export const metadata: Metadata = {
  title: "J.A.R.V.I.S — Voice-activated AI assistant for macOS",
  description:
    "A native macOS AI assistant with an Iron-Man-style holographic HUD — wake it by voice, talk naturally, and let it run your Mac, calendar and email. Comes as Jarvis or Friday.",
};

export default function JarvisPage() {
  return <JarvisShowcase />;
}
