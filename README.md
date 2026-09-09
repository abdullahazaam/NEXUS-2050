# NEXUS 2050

### Interactive Smart City Intelligence Platform

**Intelligence for the Cities of Tomorrow.**

An original, responsive urban intelligence experience by **Abdullah Azam**. Explore a procedural 3D metropolis, inspect six connected city systems, and adjust a transparent simulation to understand how mobility, energy, industry, and emergency readiness influence each other.

This is a frontend portfolio project, not an operational city management system. Every city statistic, alert, comparison, and projection is **simulated demo data**. The clock alone uses the visitor's local system time.

## Experience

- Short first-visit boot sequence with a session-storage bypass.
- Original SVG identity, fixed navigation, active-section tracking, scroll progress, and keyboard-accessible mobile menu.
- Procedural city with a central intelligence tower, coordinated district blocks, emissive windows, traffic trails, data nodes, and communication links.
- Six-system network explorer with selectable operational detail panels.
- Urban pulse with animated metrics and compact trend visualizations.
- Command center with energy distribution, mobility and environmental trends, district comparison, alert timeline, and four deterministic time ranges.
- Simulation lab with five accessible sliders, four animated presets, reset, six computed outcomes, and a responsive city-state illustration.
- Interactive technology pipeline and a speculative 2030�2050 milestone narrative.

## Technology

| Layer              | Tools                                               |
| ------------------ | --------------------------------------------------- |
| Application        | React 19, TypeScript strict mode, Vite              |
| 3D                 | Three.js, React Three Fiber 9, Drei                 |
| Motion             | GSAP + ScrollTrigger, Framer Motion                 |
| Interface          | Tailwind CSS 4, custom responsive CSS, Lucide React |
| Data visualization | Recharts                                            |
| Verification       | TypeScript, ESLint, Vitest, Playwright              |

Compatible package resolutions are pinned in `package-lock.json`. No backend, API keys, external data requests, downloaded models, or stock images are required.

## 3D and animation

The city is generated from a seeded layout around an intentionally open central plaza. Repeated building bodies, roof details, windows, and traffic use instanced geometry. A stepped intelligence tower anchors the skyline. Thin roads, communication lines, low-density particles, fog, and restrained lighting provide depth without post-processing or per-object shadows.

The hero uses a native sticky viewport for a reversible, scroll-driven city fly-through. The desktop camera descends from the skyline into a clear street corridor beside the central intelligence tower; mobile uses a shorter rooftop route. Smooth camera paths, restrained desktop pointer parallax, district labels, and dawn-to-night lighting follow the journey before blending into the urban pulse section. A persistent skip link moves keyboard focus to that section. Reduced motion keeps a stable aerial view without the extended sticky scroll. Later sections use subtle atmospheric background transitions and reveal animations. The simulation's lightweight city illustration changes color with the calculated efficiency state.

## Simulation model

`src/lib/simulation.ts` contains the complete pure calculation model. All five controls range from 0 to 100. Results are recomputed locally without network requests.

- Congestion = `clamp(25 + traffic � 0.85 - transport � 0.55)`.
- Carbon output = `max(5, 40 + traffic � 0.8 + industry � 1.1 - renewable � 0.6 - transport � 0.25)`.
- Air quality = `clamp(12 + carbon � 0.55 + congestion � 0.16, 5, 200)`.
- Energy stability = `clamp(100 - industry � 0.22 - traffic � 0.1 + renewable � 0.09)`.
- Response time = `max(1.2, 9 - readiness � 0.07 + congestion � 0.025)`.
- Efficiency combines congestion, emissions, stability, readiness, and renewables with documented weights in the source.

`clamp` defaults to 0�100. Outputs are rounded for presentation. These coefficients are illustrative design choices, not scientifically calibrated estimates. Carbon units and response times are explanatory demo quantities. The model does not predict an actual city's behavior.

Presets: **Normal Day**, **Peak-Hour Pressure**, **Emergency Mode**, and **Sustainable Future**. Changes interpolate smoothly; direct keyboard or pointer input interrupts a preset transition immediately.

Dashboard time-series data is seeded by the selected range and sample index. It remains identical across rerenders and revisits. Overview metrics and dashboard period aggregates represent distinct illustrative summaries.

## Performance

- Lazy-loaded WebGL code with an immediate CSS skyline fallback.
- Low-poly geometry and instanced repeated objects.
- Pixel ratio capped at 1.4 on desktop and 1 on small screens.
- PerformanceMonitor reduces the rendering pixel ratio when sustained performance drops.
- Fewer particles, no antialiasing, and stable touch-camera behavior on small screens.
- Rendering switches to demand mode when offscreen, hidden, or reduced motion is enabled.
- No heavy post-processing, textures, downloaded 3D assets, or realtime shadows.
- Error boundary, missing-WebGL fallback, and context-loss fallback.
- Animation, observer, timer, and event-listener cleanup.
- Separate motion, chart, and lazy 3D bundles.

The lazy 3D bundle contains a full renderer and remains the largest asset. Vite may report its advisory 500 kB chunk warning; it is loaded separately and compressed by production hosts. The page remains usable while it loads.

## Accessibility

Semantic landmarks and headings; skip link; visible focus rings; labeled native range controls with numeric outputs; keyboard-operable presets and tabs; mobile focus containment and Escape dismissal; textual descriptions of charts and the decorative city; reduced-motion alternatives; and explicit demo-data disclosures.

## Run locally

Requires Node.js **22.12+** and npm.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

On Windows PowerShell with script execution restricted, use `npm.cmd` in place of `npm`.

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

The production output is `dist/`. Format source with `npm run format`.

### Browser verification

Start the development server on port 5173, then run:

```bash
npm run test:browser
npm run test:journey
```

The test uses installed Google Chrome in headless mode. It checks 390, 768, 1024, and 1440px layouts, overflow, chart ranges, all system selections, presets, keyboard sliders, reset, anchors, mobile navigation, console errors, and context-loss fallback. It writes genuine QA screenshots and a JSON report to ignored `test-results/`.

The journey check additionally samples actual camera movement at seven scroll positions on desktop, tablet, and mobile, checks sticky release, skip focus, reverse navigation, responsive route changes, and the reduced-motion camera. Vitest samples both camera paths against the shared city geometry for clearance and continuous viewing direction.

If Chrome is unavailable, install it from its official source or change the Playwright channel in `scripts/browser-check.mjs` to a locally available supported browser. Software-rendered test results do not establish a performance guarantee for every physical GPU.

## Structure

```text
public/
  favicon.svg
  screenshots/README.md
scripts/
  browser-check.mjs
src/
  components/
    Navigation.tsx
    Preloader.tsx
    sections/          # Hero, metrics, explorer, dashboard, lab, story
    three/             # Procedural scene and resilient loader boundary
    ui/                # Shared identity, buttons, reveals, counters
  data/city.ts         # System content and deterministic chart series
  hooks/useCityMotion.ts
  lib/
    config.ts          # Author and GitHub repository URLs
    simulation.ts      # Pure, typed calculation model
    simulation.test.ts
  styles/index.css
  App.tsx
  main.tsx
```

## GitHub and deployment

Set the eventual project repository URL in **`src/lib/config.ts`**. It currently points to the requested author profile: https://github.com/abdullahazaam.

To deploy with Vercel after publishing your repository:

1. Import the repository into Vercel.
2. Select the Vite framework preset and Node.js 22 or newer.
3. Use `npm run build` and output directory `dist` (also configured in `vercel.json`).
4. Deploy. No environment variables or backend services are needed.

This is a single-page anchor-based experience, so no route rewrites are required. Nothing has been pushed or deployed automatically.

## Screenshots and social metadata

See `public/screenshots/README.md` for capture guidelines and social-preview setup. Add real screenshots with these names:

- `nexus-hero.png`
- `nexus-command-center.png`
- `nexus-simulation.png`
- `nexus-mobile.png`

Screenshot links are deliberately not embedded until the files exist. Set the canonical production URL and an absolute Open Graph image URL after deployment. The existing page title, description, theme color, favicon, and Open Graph text metadata work without an invented domain.

## Future improvements

- A calibrated model with published assumptions and uncertainty intervals.
- District-level scenario comparison and shareable scenario URLs.
- Localization and automated assistive-technology audits.
- Additional physical-device GPU profiling and quality tiers.
- Scenario export for education and urban-systems workshops.

## Author and license

**Abdullah Azam** � [GitHub](https://github.com/abdullahazaam)

Designed and developed by Abdullah Azam. Released under the [MIT License](LICENSE).
