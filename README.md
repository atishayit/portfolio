# Atishay Jain — Portfolio

A premium, dual-identity personal site that morphs the entire experience between
**Full Stack Software Engineer** and **Data Scientist** via a single toggle.

Built with **Next.js 14 (App Router)** · **TypeScript** · **Tailwind CSS** ·
**Framer Motion**. Statically exported — deploys to any host, loads instantly,
fully responsive, dark + light themes, and respects `prefers-reduced-motion`.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site → ./out
```

`npm run build` produces a fully static site in `out/` (because `next.config.mjs`
sets `output: "export"`). Drop that folder on any static host.

## Deploy

- **Vercel** — import the repo; zero config. (Best fit; matches the stack.)
- **Netlify / Cloudflare Pages** — build command `npm run build`, publish dir `out`.
- **GitHub Pages / S3 / any static host** — upload the contents of `out/`.

## Editing content

**All content lives in one file:** [`src/content/data.ts`](src/content/data.ts).
Change text, skills, experience bullets, education, publications, etc. there — no
component edits needed. Items marked `// TODO(atishay)` are placeholders.

### Things to send / fill in

| What | Where |
|------|-------|
| **Headshot photo** | Drop the image in `public/img/`, then swap the monogram block in [`src/components/Hero.tsx`](src/components/Hero.tsx) (look for the `Replace this block with a real <Image>` comment) for a `next/image`. |
| **GitHub URL** | `PERSON.socials.github` in `data.ts` (currently a guessed placeholder). |
| **Certifications** | `CERTIFICATIONS` array in `data.ts` — replace the 3 placeholder entries with real `{ title, issuer, year }` (drop the `placeholder: true`). |
| **Phone (optional)** | Set `PERSON.showPhone = true` in `data.ts` to display it in Contact. |
| **Publication links** | `PUBLICATIONS[].href` — currently deep-link to IEEE Xplore search; replace with direct DOIs if you have them. |
| **Résumés** | Live in `public/resume/`. Replace the two PDFs to update the downloads. |

## How the toggle works

- **Role** (Full Stack ⇄ Data Science) and **theme** (dark ⇄ light) are stored in
  `localStorage` and applied to `<html>` (`.dark` class + `data-role` attribute).
- The accent color is driven by CSS variables in
  [`src/app/globals.css`](src/app/globals.css) — one block per theme × role combo.
- A pre-hydration script in [`src/app/layout.tsx`](src/app/layout.tsx) sets both
  before paint, so there's no flash on load.

## Structure

```
src/
  app/            layout, home page, /projects placeholder, globals.css
  components/     Header, Hero, About, Skills, Experience, Publications,
                  Education, Certifications, Contact, Footer + toggles/primitives
  content/data.ts single source of truth for all copy
public/
  resume/         downloadable PDFs (per role)
  img/            put your headshot here
```
