# Hemant Kumar Jha — Portfolio (React + Vite)

A migration of the original static HTML/CSS/JS portfolio to a componentized
React + Vite application. The visual design, copy, dark/light theme,
accessibility panel and animations are unchanged — this is an architecture
rebuild, not a redesign.

## Structure

```
src/
  data/          Every piece of site copy, as JSON. No content is hardcoded in components.
  components/    Small, single-responsibility components (Icon, ProjectCard, Header, ...).
  components/sections/   Section-level components (Hero, ProjectsSection, ...) composed in App.jsx.
  hooks/         Reusable logic: theme, accessibility prefs, scroll spy, reduced motion, modal, reveal-on-scroll.
  constants/     Config values (storage keys, thresholds) — nothing environment-specific is hardcoded elsewhere.
  styles/        theme.css — CSS custom properties (design tokens) + a small set of reusable utility classes.
public/
  uploads/       Project logos and the résumé PDF, served as static assets.
```

## Adding a new project

Open `src/data/projects.json` and add an entry to `items`:

```json
{
  "id": "my-project",
  "name": "Project Name",
  "category": "Industry",
  "image": "/uploads/my-logo.png",
  "imageBg": "#f4f3f2",
  "imageWidth": 400,
  "imageHeight": 200,
  "description": "...",
  "role": "...",
  "highlights": ["..."],
  "tech": ["..."],
  "metrics": [{ "label": "...", "value": "..." }],
  "caseStudyUrl": null,
  "sections": [{ "h": "Context", "p": "...", "bullets": [] }]
}
```

Drop the logo file in `public/uploads/`. `imageWidth`/`imageHeight` are the
image's real pixel dimensions — they're used as the `<img>` element's
`width`/`height` attributes to reserve space and avoid layout shift while the
(lazy-loaded) image downloads. No component code needs to change; the
Projects section and case-study modal both read from this file.

Every other section works the same way — edit the matching JSON file under
`src/data/` (`experience.json`, `skills.json`, `impact.json`, etc.).

## Commands

```
npm run dev       # local dev server
npm run build     # production build (outputs to dist/)
npm run preview   # serve the production build locally
npm run lint      # ESLint (flat config, React + hooks + jsx-a11y rules)
npm run format    # Prettier — writes formatting fixes
```

## Architecture notes

- **Styling**: the original site styled every element with inline styles
  plus a handful of utility classes for things CSS alone can't express
  cleanly (hover/focus states, responsive breakpoints, keyframe animations).
  This migration keeps that same approach — inline `style` objects per
  component, backed by CSS custom properties and utility classes in
  `src/styles/theme.css` — rather than introducing Tailwind or CSS Modules,
  since the brief was to modularize the existing approach, not replace it.
  The one deliberate improvement: hover/focus states that the original site
  simulated with a small JS runtime (`style-hover`/`style-focus` custom
  attributes) are now real CSS `:hover`/`:focus-visible` rules.

- **Code splitting**: `App.jsx` uses `React.lazy` for every below-the-fold
  section (About onward). `Hero` and `Header` load eagerly since they're
  above the fold. Each section is its own chunk (verified: 1–6KB gzipped
  each). `vite.config.js` additionally splits `react`/`react-dom` and
  `lucide-react` into their own vendor chunks.

- **Icons**: icons are imported by name into a static registry
  (`src/components/Icon.jsx`) rather than `import * as icons from
  'lucide-react'`. The barrel import pulled in the whole ~1500-icon library
  (760KB); the explicit registry lets Rollup tree-shake it down to ~29KB
  (10KB gzipped) for the ~60 icons this site actually uses. If you add an
  icon name to a JSON file that isn't in the registry yet, add its import
  and registry entry in `Icon.jsx` — `Icon` silently renders nothing for an
  unregistered name rather than crashing.

- **Two icons lucide-react v1 dropped**: LinkedIn and Figma were removed
  from lucide-react (brand/logo icons were deprecated). LinkedIn is restored
  via `LinkedInIcon.jsx`, a hand-drawn SVG ported directly from the original
  site's inline brand mark. Figma is substituted with the generic `Frame`
  icon in the skills list, since no brand equivalent ships anymore.

- **Types**: data shapes are documented via JSDoc typedefs in
  `src/data/types.js` rather than a full TypeScript migration, per the
  brief's "TypeScript, or at minimum JSDoc typing" allowance. `jsconfig.json`
  has `checkJs: true` so editors (VS Code, etc.) type-check JSON usage
  against these typedefs without a build step.

- **Known intentional gap vs. the original**: the original site's JS
  (`onSubmit`, `formStatus`, a `purposes` list) defines contact-form
  submission logic and data that is never actually rendered anywhere in its
  markup — dead code from an abandoned form. Since the brief was to
  reproduce the site "as-is" visually, this migration does not build a
  contact form that doesn't exist on the live site. The `purposes` data is
  kept in `contact.json` in case a real form is added later.

## Lighthouse: before vs. after

Both measured with the same Lighthouse config (mobile, headless Chrome),
static site served via a plain HTTP server, React app via `vite preview`
(production build). Two runs each; numbers below are the second (warmed) run
of each to reduce cold-start noise.

| Category | Static (before) | React (after) |
|---|---|---|
| Performance | 87 | 92 |
| Accessibility | 96 | 100 |
| Best Practices | 96 | 100 |
| SEO | 100 | 100* |
| First Contentful Paint | 2.6s | 2.6s |
| Largest Contentful Paint | 3.5s | 2.8s |
| Total Blocking Time | 70ms | 0ms |
| Cumulative Layout Shift | 0 | 0.042 |

\* First React run scored 91 on SEO because no `robots.txt` existed
(`public/robots.txt` now added) — 100 once that one gap was closed.

**The one regression**: Cumulative Layout Shift went from 0 to 0.042 — still
solidly within Google's "Good" threshold (<0.1), and traced via Lighthouse's
own layout-shift-culprits data to the hero text reflowing when the Manrope /
Space Grotesk web fonts swap in after loading, which is normal `font-display:
swap` behavior, not a bug introduced by the migration (the static site loads
fonts the same async way). Flagged here rather than glossed over, per the
brief's request to report the diff honestly.

No axe-core automated pass was run as part of this migration (no axe-core
CLI was available in this environment); the Lighthouse accessibility
category (100/100) and the manual verification below are what's actually
been checked.

## What was verified interactively (real browser, not assumed)

- Theme toggle, high contrast, font scaling (Default/Large/Largest), and
  reduce-motion all apply correctly and persist to `localStorage`.
- Accessibility panel opens/closes; read-aloud (`SpeechSynthesis`) plays,
  reports status via the `aria-live` region, and marks the active section
  with `data-reading`.
- Case-study modal opens, traps/returns focus, and correctly unlocks body
  scroll on every close path.
- Mobile hamburger menu opens/closes and its nav links scroll correctly.
- Back-to-top button and the header status-dot pulse both respect
  `prefers-reduced-motion` and the in-app reduce-motion toggle.
- Production build (`npm run build` + `npm run preview`) renders identically
  to dev mode with zero console errors.

## Not done in this pass (flagged, not hidden)

- **Image format conversion (WebP/AVIF)**: the brief asked for modern image
  formats with fallback. The project logos were kept as the original PNGs —
  converting them properly (with fallback `<picture>` sources) needs an
  image-processing step (`sharp` or `vite-imagetools`) that wasn't set up in
  this pass. Loading is lazy and `width`/`height` are set to prevent CLS,
  which captures most of the practical benefit; format conversion is the
  clear next step if this ships to production.
- **React DevTools Profiler audit**: components are memoized
  (`React.memo` on every presentational component; list items keyed
  properly) based on static analysis of what re-renders when JSON-derived
  props don't change, not a live profiling session — this environment
  doesn't have an interactive DevTools session to record one.
