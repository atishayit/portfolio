import type { Metadata } from "next";
import { VoltaShowcase } from "@/components/volta/VoltaShowcase";

export const metadata: Metadata = {
  title: "VOLTA — Energy forecasting & anomaly control room",
  description:
    "VOLTA: deep-learning hourly energy-demand forecasting (CNN-BiLSTM) with anomaly detection and a live in-browser what-if simulator. Real PJM data, $0 static hosting.",
};

export default function VoltaPage() {
  return <VoltaShowcase />;
}
