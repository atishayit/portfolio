/**
 * Content for the VOLTA product showcase at /projects/volta.
 * VOLTA is chart/data-centric (vs JARVIS's video HUD), and — crucially — it can
 * be embedded live, so the showcase iframes the real Vercel deployment.
 */

export const VOLTA = {
  name: "VOLTA",
  full: "Energy Forecasting & Anomaly Control Room",
  year: "2026",
  status: "Live",
  platform: "Web · Next.js static export",
  // Identity — amber control-room, deliberately distinct from JARVIS cyan.
  accent: "255 176 32", // amber
  accent2: "45 212 255", // electric blue
  demo: "https://volta-virid.vercel.app",
  github: "https://github.com/atishayit/volta",

  tagline:
    "A deep-learning control room for the power grid — it forecasts the next 24 hours of energy demand, flags anomalies, and re-forecasts live in your browser as you change the weather.",
  summary:
    "An end-to-end energy-forecasting app built on real PJM grid data and real weather. A CNN→Bi-LSTM predicts 24h-ahead demand across three zones, a residual z-score detector flags anomalies, and a what-if simulator runs the trained model entirely in-browser via ONNX — trained offline, shipped as a static site with $0 hosting.",

  shots: {
    hero: "/volta/hero.png",
    dashboard: "/volta/dashboard-full.png",
  },

  bootLog: [
    "[ boot ] VOLTA core .............. online",
    "[  ok  ] dataset ................. PJM · 3 zones · 2015–2017",
    "[  ok  ] weather ................. Open-Meteo (real hourly temp)",
    "[  ok  ] forecaster ............. CNN-BiLSTM → ONNX",
    "[  ok  ] inference .............. onnxruntime-web (in-browser)",
    "[ live ] all systems nominal.",
  ],

  // Headline stat cards.
  metrics: [
    { value: "−10%", label: "1h-ahead MAE vs XGBoost" },
    { value: "5.35%", label: "24h MAPE · PJM East" },
    { value: "3 zones", label: "PJM East · ComEd · Dayton" },
    { value: "$0", label: "hosting · runs in-browser" },
  ],

  // User-facing pipeline.
  steps: [
    {
      label: "01 · Ingest",
      title: "Real grid + weather",
      desc: "PJM hourly demand joined with real hourly temperature from Open-Meteo — assembled by one key-less script.",
      tech: "pandas · Open-Meteo",
    },
    {
      label: "02 · Forecast",
      title: "CNN → Bi-LSTM",
      desc: "A one-week window of demand, weather and calendar features predicts the next 24 hours in a single shot.",
      tech: "PyTorch",
    },
    {
      label: "03 · Detect",
      title: "Anomalies",
      desc: "Forecast residuals are z-scored to flag demand that deviates sharply from the prediction.",
      tech: "Residual z-score",
    },
    {
      label: "04 · Serve",
      title: "Runs in your browser",
      desc: "Model exported to ONNX, results to static JSON — the what-if simulator runs inference client-side, no backend.",
      tech: "onnxruntime-web",
    },
  ],

  // The model.
  model: {
    blurb:
      "A 168-hour window of 8 channels (load, temperature, cyclical hour & day-of-week, weekend, holiday) feeds a 1-D CNN feature extractor, a bidirectional LSTM, and a last⊕mean⊕max read-out that emits all 24 steps at once. The head predicts a correction to “same hour yesterday”, so it learns deviations from the daily rhythm rather than the raw level. One model is pooled across all three zones in normalised space, then exported to a single-file ONNX that runs in WASM.",
    scorecard: {
      caption: "PJM East · held-out test window",
      headers: ["Model", "MAE (MW)", "RMSE (MW)", "MAPE", "R²"],
      rows: [
        { cells: ["CNN-BiLSTM", "1701", "2451", "5.35%", "0.861"], highlight: true },
        { cells: ["XGBoost", "1355", "1947", "4.21%", "0.912"], highlight: false },
        { cells: ["Seasonal-Naive", "3757", "5028", "11.61%", "0.416"], highlight: false },
      ],
    },
    story:
      "The CNN-BiLSTM wins the dispatch-critical near-term horizon — −10% MAE at 1-hour-ahead on PJM East, beating XGBoost at h+1 across all three zones and leading through h+2. Beyond a few hours, gradient-boosted trees edge the 24-hour average — a documented strength of trees on regular hourly load. VOLTA reports this transparently, with a per-horizon chart showing exactly where the models cross. Knowing where a model wins — and saying so — beats a cherry-picked number.",
  },

  features: [
    { title: "In-browser inference", desc: "The CNN-BiLSTM runs client-side via onnxruntime-web — no inference server, no cost." },
    { title: "Real, reproducible data", desc: "Real PJM demand + real Open-Meteo weather, assembled with no API keys." },
    { title: "Honest benchmarking", desc: "Per-horizon metrics show exactly where the model wins against a strong XGBoost baseline." },
    { title: "Anomaly detection", desc: "A residual z-score flags abnormal demand against the forecast." },
    { title: "Multi-zone", desc: "PJM East, Commonwealth Edison and Dayton, switchable live." },
    { title: "$0 hosting", desc: "Pure static export on Vercel's free tier — no backend, no GPU." },
  ],

  tech: [
    { group: "Modelling", items: ["PyTorch CNN-BiLSTM", "XGBoost", "ONNX export"] },
    { group: "Data", items: ["PJM hourly load", "Open-Meteo weather", "pandas / numpy"] },
    { group: "Web", items: ["Next.js 14", "TypeScript", "Tailwind", "Recharts"] },
    { group: "Inference & infra", items: ["onnxruntime-web (WASM)", "Vercel static", "$0 hosting"] },
  ],
};
