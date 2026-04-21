# Apple-Style Scroll Portfolio — Design Spec

**Date:** 2026-04-20
**Author:** Ayush Salunke
**Status:** Approved for planning
**Supersedes:** `2026-04-13-cyber-3d-portfolio-design.md`, `2026-04-14-3d-room-portfolio-design.md`

## Overview

Scrap the existing 3D interactive room portfolio entirely. Rebuild the portfolio as a heavy-motion, tile-based scroll site inspired by Apple.com home — varied section backgrounds, colorful accents per tile, scroll-pinned cinematic reveals. Content is sourced from Ayush Salunke's resume (Senior Software Engineer, 6+ years, JPMorgan / UBS).

## Goals

- Replace the blocky 3D room with a modern, brand-quality single-page portfolio.
- Showcase professional impact with numeric proof (stats counters).
- Use scroll as the primary interaction — pinned sections, horizontal rails, parallax.
- Keep bundle size modest (no Three.js, no physics engine).
- Respect `prefers-reduced-motion` — motion degrades gracefully.

## Non-Goals

- No 3D/WebGL/physics.
- No CMS or backend — resume content is hardcoded in `src/data/resume.ts`.
- No dark/light mode toggle — each tile has a fixed bg; the site alternates.
- No blog, case-study pages, or multi-route navigation (single page, anchor links).

## Content Source

Resume: `Ayush_Salunke_Senior_Software_Engineer_Resume.pdf`

Key data:
- **Name / role:** Ayush Salunke · Senior Software Engineer
- **Contact:** (669) 220-9962 · ayush.salunke250497@gmail.com · linkedin.com/in/ayush-salunke
- **Experience:** JPMorgan Chase (Jun 2022–Present), UBS SWE (Jul 2019–Jun 2021), UBS Intern (Jul–Nov 2018)
- **Education:** MS CSE Santa Clara University (GPA 3.815), B.Tech Computer Engg VIT Pune (GPA 3.64)
- **Projects:** Pothole Detection (MobileNet CNN, ICIAMR 2019 published), ParkSafe (Flask, OpenStreetMap)
- **Hero stats (counters):** `6+ years` · `200+ developers impacted` · `80% latency reduction` · `70% deploy complexity reduction`

Data lives in `src/data/resume.ts` as typed exports.

## Architecture

### Page structure (top → bottom)

1. **Hero** — full-bleed dark, pinned ~1.5vh. Name letters stagger-in, role fades up, tagline typewriter.
2. **Stats grid** — 2×2 light tiles. Counters tween 0→target on in-view.
3. **Now@** — full-bleed gradient. "Leading deployment platform @ JPMorgan" + 3 bullets slide in with scroll %.
4. **Experience timeline** — pinned 3 viewports. Horizontal rail, one panel per role (JPMorgan / UBS SWE / UBS Intern). Year tick-marks advance; achievements fade per panel.
5. **Skills stack** — 5 category tiles (Languages / Backend & Data / Frontend / Cloud & DevOps / Observability). Tech chips marquee horizontally, speed tied to scroll velocity.
6. **Featured project: Pothole Detection** — pinned 2 viewports. 3 scroll phases: problem → CNN architecture → published results.
7. **ParkSafe + Education** — 2-up split. Project card (3D tilt on hover) | dual-school card (SCU + VIT logos spin-in).
8. **Contact** — full-bleed light. Magnetic buttons. Copy-to-clipboard with check-bloom.

### Global chrome

- **Top nav** — sticky, shrinks at 80px scroll. Anchor links to each section.
- **Chapter dots** — right-edge fixed column, one dot per tile. Active dot scales + fills with tile's accent color.
- **Custom cursor** — dot element, scales over interactives. Disabled on touch.
- **Smooth scroll** — Lenis, wired to GSAP ScrollTrigger via `ticker`.
- **Reduced motion** — `@media (prefers-reduced-motion: reduce)` disables pins, marquees, parallax; keeps simple fades.

### Component tree

```
App
├── CustomCursor
├── ChapterDots
├── TopNav
└── <main>
    ├── HeroTile              (pinned, GSAP)
    ├── StatsTile             (Framer Motion in-view counters)
    ├── NowTile               (GSAP scrub bullets)
    ├── ExperienceTile        (GSAP pinned horizontal rail)
    ├── SkillsTile            (5 category sub-tiles, marquees)
    ├── PotholeTile           (GSAP scrub phases)
    ├── ProjectEduTile        (2-up split, Framer Motion hover tilt)
    └── ContactTile
```

Each tile is a self-contained component in `src/components/tiles/`. Shared animation primitives live in `src/lib/motion.ts` (Lenis init, ScrollTrigger helpers, reduced-motion guard).

### File layout

```
src/
├── App.tsx                         ← renders all tiles in order
├── main.tsx
├── index.css                       ← Tailwind + global CSS vars
├── data/
│   └── resume.ts                   ← typed resume content
├── lib/
│   ├── motion.ts                   ← Lenis + ScrollTrigger setup
│   ├── cursor.ts                   ← custom cursor logic
│   └── useReducedMotion.ts
├── components/
│   ├── chrome/
│   │   ├── TopNav.tsx
│   │   ├── ChapterDots.tsx
│   │   └── CustomCursor.tsx
│   └── tiles/
│       ├── HeroTile.tsx
│       ├── StatsTile.tsx
│       ├── NowTile.tsx
│       ├── ExperienceTile.tsx
│       ├── SkillsTile.tsx
│       ├── PotholeTile.tsx
│       ├── ProjectEduTile.tsx
│       └── ContactTile.tsx
```

## Motion Spec

### Global

- **Lenis** smooth scroll, duration 1.2, easing `t => Math.min(1, 1.001 - 2 ** (-10 * t))`.
- **ScrollTrigger** driven by `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add(time => lenis.raf(time * 1000))`.
- **TopNav** — `scrollY > 80` shrinks height 64→48px, adds blur backdrop.
- **ChapterDots** — each dot is a `<ScrollTrigger>` with `onEnter`/`onLeave` that sets active index.
- **CustomCursor** — div follows `mousemove` with 0.15 lerp. Scales to 2.5× on `[data-cursor="hover"]` elements.
- **Reduced motion** — single `useReducedMotion()` hook short-circuits every scroll-scrubbed animation. Tiles still render, just without scrub/pin.

### Per tile

| Tile | Motion | Primary tech |
|------|--------|--------------|
| Hero | Pin 1.5vh. Letters stagger-in Y 40→0 opacity 0→1 (80ms stagger). Role fade-up at 40% scroll. Tagline typewriter at 70%. | GSAP pin + timeline |
| Stats | In-view trigger. Tiles scale 0.9→1 stagger 100ms. Counters tween 0→target over 1.2s, `snap: 1`. | Framer Motion `useInView` + GSAP tween |
| Now@ | Parallax bg gradient (translateY scrub). Bullets opacity 0→1 + x -20→0 at scroll % 30/50/70. | GSAP scrub |
| Experience | Pin 300vh. Horizontal rail `x: 0 → -200vw` on scrub. Year ticks snap-advance. Per-panel achievement fades at rail offset thresholds. | GSAP pin + scrub |
| Skills | Each sub-tile pins ~40vh. Chip rows marquee at differing speeds; scroll velocity modulates base speed. | GSAP marquee + ScrollTrigger.velocity |
| Pothole | Pin 200vh. 3 phases toggled by `progress` 0–0.33 / 0.33–0.66 / 0.66–1. Image crossfade. | GSAP scrub + clip-path |
| ProjectEdu | In-view fade-up. 3D tilt on pointer move (rotateX/Y based on cursor position within card, spring-damped). | Framer Motion |
| Contact | Magnetic buttons (translate toward cursor within ~40px). Copy success → check icon bloom scale 0→1.4→1. | Framer Motion springs |

## Palette

Base alternating tiles: `#0a0a0a` dark, `#fbfbfd` light.

| Role | Hex |
|------|-----|
| Text on light | `#1d1d1f` |
| Text on dark | `#f5f5f7` |
| Muted | `#86868b` |
| Hero accent | `#0a84ff` (electric blue) |
| Stats accent | `#30d158` (neon green) |
| Now@ accent | `#5e5ce6` (deep violet) |
| Experience — JPMorgan | `#0b2545` (navy) |
| Experience — UBS | `#ec0016` (red) |
| Skills accent | `#ff375f` (magenta) |
| Pothole accent | `#ff9f0a` (amber) |
| ParkSafe + Edu accent | `#64d2ff` (teal) |
| Contact CTA | `#0a84ff` |

Tailwind config extends `theme.colors` with these as semantic tokens (`ink`, `paper`, `mute`, `accent-hero`, etc.).

## Typography

- **Display / UI:** `Inter Variable` via `@fontsource-variable/inter`. Weights 400–800. Tight letter-spacing on display (-0.03em).
- **Mono / counters:** `JetBrains Mono` via `@fontsource-variable/jetbrains-mono`. Used on stats, company years, code-ish labels.
- All numeric counters use `font-variant-numeric: tabular-nums` to prevent width jitter during count-up.

## Tech Stack Changes

**Keep**
- Vite, React 18, TypeScript, Tailwind CSS, Framer Motion.

**Add**
- `lenis` — smooth scroll
- `gsap` — ScrollTrigger, timeline, scrub
- `@fontsource-variable/inter`, `@fontsource-variable/jetbrains-mono`

**Remove** (frees ~1.5MB of bundle per prior graphify findings)
- `@react-three/fiber`
- `@react-three/drei` (if present)
- `three`
- `@dimforge/rapier3d` + `-compat`
- All files under `src/components/room/`
- Legacy `src/*.js` vanilla files (`character.js`, `camera.js`, `objects.js`, `content.js`)
- `components/ui/portfolio-hero.tsx`
- Any Three.js/room references in `src/App.tsx` and `src/main.tsx`

## Accessibility

- Semantic landmarks: `<nav>`, `<main>`, `<section>` per tile.
- Each tile has an `<h2>` heading; hero uses `<h1>`.
- Chapter dots are `<button>`s that scroll-to on click; `aria-current="true"` on active.
- `prefers-reduced-motion: reduce` disables all scroll-scrubbed pins, marquees, parallax, and cursor follow. Counters snap to final value on mount. Fades shortened to 150ms.
- Color contrast: all body text ≥ 4.5:1 against its tile bg. Accent colors used only for decoration or large text.
- Custom cursor is purely additive; native cursor remains visible in reduced-motion and on touch.

## Performance

- Bundle target: < 500KB gzipped JS (down from current ~1.5MB with Three.js).
- Lenis + GSAP together ~60KB gzipped.
- Images (if any company/school logos added): SVG inline where possible; `<img loading="lazy">` otherwise.
- Fonts self-hosted via fontsource, `font-display: swap`.
- ScrollTrigger `onRefresh` debounced on resize.

## Deployment

- GitHub Pages via existing workflow `.github/workflows/deploy.yml`.
- Vite `base` path already set to `/ayushsalunke.github.io/` — preserved.
- No env vars, no secrets.

## Testing Strategy

- Manual: full scroll pass at 1920×1080, 1440×900, 768×1024, 390×844. Verify every pin releases cleanly.
- Reduced-motion pass with OS setting enabled.
- Lighthouse: aim for ≥ 95 Performance, 100 Accessibility.
- No unit tests for motion (visual regression impractical).

## Risks

- **Lenis + R3F conflict** — not applicable since R3F is removed.
- **ScrollTrigger pin glitches** on rapid resize — mitigated with `ScrollTrigger.refresh()` on debounced resize.
- **iOS Safari scroll quirks** — Lenis handles with `syncTouch: false` default; confirm during testing.
- **Heavy-motion fatigue** — chapter dots let users skip; reduced-motion path is first-class.

## Out of Scope / Future

- Case-study deep dives per project.
- Blog section.
- i18n.
- Server-side rendering.
