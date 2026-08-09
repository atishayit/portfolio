import type { Metadata } from "next";
import { TempoShowcase } from "@/components/tempo/TempoShowcase";

export const metadata: Metadata = {
  title: "Tempo — Work, study & money in one local-first Android app",
  description:
    "Tempo: a local-first Android life manager for students who work. Award pay to the cent, PAYG withholding shown with its working, assignments synced from OnTrack, and shift alarms. Flutter, offline-first, no servers.",
};

export default function TempoPage() {
  return <TempoShowcase />;
}
