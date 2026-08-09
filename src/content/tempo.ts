/**
 * TEMPO — content for the bespoke showcase at /projects/tempo.
 * The /projects index card is driven separately by src/content/projects.ts.
 *
 * Every number here is verified against the repo (see `facts`). Tempo is a
 * single-user app: there are no user counts, uptime or performance figures.
 */

export const TEMPO = {
  name: "Tempo",
  full: "Work, Study & Money — One Life Manager",
  year: "2026",
  status: "v1.10.0",
  platform: "Android · Flutter · Local-first",
  // Violet signature keeps Tempo distinct from VOLTA's amber on the index;
  // the gold secondary ties the page to the app's own accent in the shots.
  accent: "167 139 250", // violet
  accent2: "232 176 75", // the app's gold
  /**
   * Public APK / release URL. The `lifeos` repo is PRIVATE, so its Releases
   * page 404s for visitors — leave this empty and the download CTA is hidden
   * entirely rather than shipping a dead link.
   */
  apk: "",

  kicker: "// ANDROID · FLUTTER · LOCAL-FIRST",
  headline: "Two jobs, four units, one brain.",
  tagline:
    "A local-first Android app for students who work: award pay calculated to the cent, PAYG withholding worked out, assignments synced live from OnTrack, and alarms that actually get you to your shift.",
  summary:
    "A personal life manager for students who work. Tempo turns a casual retail roster, ABN freelance work and a full trimester of assignments into one picture — pay calculated against the actual award, tax withholding worked out the way an employer does it, and deadlines synced live from OnTrack. It runs entirely on the phone. No account, no server, nothing leaves the device.",

  metrics: [
    { value: "324", label: "tests, green on every release" },
    { value: "18", label: "schema migrations, zero data loss" },
    { value: "26", label: "releases, shipped from daily use" },
    { value: "0", label: "servers, accounts or trackers" },
  ],

  /** Device screens — each has a dark + light capture under /public/tempo. */
  screens: [
    {
      id: "home",
      file: "tempo-home.png",
      label: "Home",
      caption:
        "The dashboard — money, workload and today, with a booking clash caught automatically",
    },
    {
      id: "tax",
      file: "tempo-tax-working.png",
      label: "Tax",
      caption: "Tax that shows its working, instead of asserting a number",
    },
    {
      id: "money",
      file: "tempo-money.png",
      label: "Money",
      caption: "Take-home pay, not just gross",
    },
    {
      id: "shifts",
      file: "tempo-shifts.png",
      label: "Shifts",
      caption: "Shifts split by how they're taxed, filterable by period",
    },
    {
      id: "study",
      file: "tempo-study-all.png",
      label: "Study",
      caption: "Study, grouped by unit — with OnTrack's own statuses carried through",
    },
    {
      id: "unit",
      file: "tempo-study-unit.png",
      label: "Unit",
      caption: "A single unit's work, in the order it needs doing",
    },
    {
      id: "calendar",
      file: "tempo-calendar.png",
      label: "Calendar",
      caption: "Shifts, classes and deadlines in one calendar",
    },
    {
      id: "log",
      file: "tempo-log-shift.png",
      label: "Log shift",
      caption: "Logging a shift — one date, two times, four alarms",
    },
    {
      id: "task",
      file: "tempo-task-detail.png",
      label: "Task",
      caption: "Assignment detail, mirroring OnTrack's state",
    },
  ],

  problem: {
    kicker: "// WHY IT EXISTS",
    title: "One app, because it's one life.",
    body: [
      "A student working casual retail lives across four systems that don't talk: a roster app, a payslip portal, a university LMS, and a calendar. None of them knows the others exist — so a shift gets booked over a seminar, an assignment moves and nobody notices, and the only way to know what a week actually paid is to wait for the payslip.",
      "Tempo is the join. One database, one calendar, one set of numbers.",
    ],
  },

  steps: [
    {
      label: "01",
      title: "Log",
      lead: "One date, two times",
      desc: "Start, end, meal break.",
      tech: "one screen",
    },
    {
      label: "02",
      title: "Cost",
      lead: "Against the award",
      desc: "Penalties, loadings and effective-dated rates.",
      tech: "integer cents",
    },
    {
      label: "03",
      title: "Withhold",
      lead: "PAYG, the employer's way",
      desc: "Annualise → tax → de-annualise.",
      tech: "AU brackets",
    },
    {
      label: "04",
      title: "Alarm",
      lead: "Four, at alarm volume",
      desc: "Start, end, and both ends of the break.",
      tech: "exact alarms",
    },
  ],

  money: {
    kicker: "// THE MONEY ENGINE",
    title: "Money maths that survives an audit.",
    body: [
      "Every amount is integer cents end to end — no floating point anywhere in the money path, one rounding step, at the end. Pay is costed against effective-dated rule sets, so a shift worked in June is priced at June's rate even after July's rise; a “recalculate” pass re-prices history when you backfill old rates, and skips anything you typed in by hand.",
      "Withholding follows the same method an employer uses: annualise the pay period, tax the annual figure against the 2024-25 resident brackets plus the Medicare levy phase-in, then take one period's share back out. That shape is why a heavy week is withheld harder than a quiet one — and why the app shows its working rather than asserting a number.",
    ],
  },

  ontrack: {
    kicker: "// STUDY",
    title: "OnTrack, without the tab.",
    body: [
      "Tempo speaks to Deakin's OnTrack (Doubtfire) directly — pulling every task for the units you're actually enrolled in this trimester, filtered by teaching period so a decade of finished units stays out.",
      "Sync is one-directional and opinionated: it creates what's new, updates due dates that moved, and closes what OnTrack marks complete. It never reopens something you've ticked off, and never writes back. Each task wears OnTrack's own status — submitted, fix and resubmit, submitted late — in OnTrack's own colour language.",
      "Connecting is a one-time act. Doubtfire access tokens expire in two hours, so Tempo holds a refresh token instead and renews itself in the background, capturing each rotation so the connection never lapses.",
    ],
  },

  features: [
    {
      title: "Award interpreter",
      desc: "Saturday, Sunday, evening, overnight and overnight-Saturday penalties, casual loading and super — effective-dated, so rates can change.",
      tags: ["integer cents", "decimal/rational"],
    },
    {
      title: "PAYG withholding",
      desc: "Per-employer pay cycle and tax-free threshold, withholding derived per period and shown with its working.",
      tags: ["AU tax brackets", "Medicare levy"],
    },
    {
      title: "Four shift alarms",
      desc: "Start, end and both ends of the meal break, on a dedicated channel using the system alarm tone at alarm volume.",
      tags: ["exact alarms", "full-screen intent"],
    },
    {
      title: "Live OnTrack sync",
      desc: "Automatic on open, manual on demand, with statuses and units carried through.",
      tags: ["Doubtfire API", "refresh tokens"],
    },
    {
      title: "Conflict radar",
      desc: "Catches a shift booked over a class before it happens.",
      tags: ["pure domain", "unit-tested"],
    },
    {
      title: "Encrypted backup",
      desc: "AES-256-GCM with PBKDF2, exported to a file you hold. Biometric app lock.",
      tags: ["cryptography", "local_auth"],
    },
  ],

  tech: [
    { group: "App", items: ["Flutter 3.44", "Dart 3.12", "Material 3"] },
    { group: "State & routing", items: ["Riverpod 3 (codegen)", "go_router 17"] },
    { group: "Data", items: ["drift / SQLite", "18 migrations"] },
    { group: "Money", items: ["decimal", "rational", "integer cents"] },
    {
      group: "Platform",
      items: [
        "flutter_local_notifications 22",
        "home_widget",
        "local_auth",
        "speech_to_text",
        "flutter_secure_storage",
      ],
    },
    { group: "Quality", items: ["very_good_analysis (strict)", "324 tests", "0 analyzer issues"] },
  ],

  closing: {
    title: "Built for one person. Held to production standards.",
    body: "15,700 lines of hand-written Dart across 145 files, 324 tests, 18 schema migrations applied in place without losing a row, and 26 releases cut from real daily use — every bug on this page was found by living with the app, not by testing it.",
  },

  /** Verified against the repo — safe to quote, nothing inferred. */
  facts: {
    tests: 324,
    analyzerIssues: 0,
    dartLines: 15771,
    dartFiles: 145,
    testLines: 6156,
    testFiles: 66,
    schemaVersion: 18,
    releases: 26,
    commits: 64,
    flutter: "3.44.4",
    dart: "3.12",
    version: "1.10.0",
  },
} as const;
