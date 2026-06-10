import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { Preloader } from "@/components/Preloader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { PERSON } from "@/content/data";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://atishayjain.dev"),
  title: {
    default: `${PERSON.name} — Full Stack Engineer & Data Scientist`,
    template: `%s — ${PERSON.name}`,
  },
  description: PERSON.blurb,
  keywords: [
    "Atishay Jain",
    "Full Stack Engineer",
    "Data Scientist",
    "React",
    "TypeScript",
    "Machine Learning",
    "Melbourne",
  ],
  authors: [{ name: PERSON.name }],
  openGraph: {
    title: `${PERSON.name} — Full Stack Engineer & Data Scientist`,
    description: PERSON.blurb,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafb" },
    { media: "(prefers-color-scheme: dark)", color: "#08090d" },
  ],
  width: "device-width",
  initialScale: 1,
};

/** Runs before hydration to set theme + role and prevent a flash of the wrong palette. */
const noFlashScript = `
(function () {
  try {
    var t = localStorage.getItem('aj-theme');
    var r = localStorage.getItem('aj-role');
    if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    if (!r) r = 'data';
    var el = document.documentElement;
    el.classList.toggle('dark', t === 'dark');
    el.dataset.role = r;
    el.style.colorScheme = t;
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-role="data" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} grain font-sans antialiased`}
      >
        <Providers>
          <SmoothScroll />
          <Preloader />
          {children}
          <Cursor />
        </Providers>
      </body>
    </html>
  );
}
