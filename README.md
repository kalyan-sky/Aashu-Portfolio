# Gayatri Devi P — Ultrafuturistic Portfolio

A premium/cinematic, multi-page portfolio for **Gayatri Devi P**, Senior .NET Full Stack
Developer (ASP.NET Core · Angular · AWS · Microservices), based in Singapore. Every fact
on the site — name, dates, employers, clients, skills, certifications, education, contact
details — is transcribed directly from her resume. Nothing is invented.

## Pages

- `index.html` — Home. Full-screen video hero, animated stats, a profile teaser, two
  featured project engagements, and a core-stack skills teaser.
- `about.html` — Full professional summary, the organizational experience timeline
  (Cognizant, Speridian, LTI), the complete skills grid, and education & certifications.
- `projects.html` — All four client engagements as in-depth case studies (Common Payment
  System, Charity Portal e-Services, CIAM, Insurance Underwriting vNext), including a
  small architecture diagram for CPS built from its own bullet points.
- `contact.html` — Email, phone and LinkedIn only — no invented links.

## Architecture

Static HTML/CSS/JS — no build step, no framework, no bundler.

```
data/resumeData.js        — single source of truth. Every resume fact lives here, once.
assets/js/render.js        — builds each page's sections from data/resumeData.js.
                              Every render function guards on its container existing, so
                              the same script runs unmodified on all four pages — each
                              page only renders the containers it actually has.
assets/js/interactions.js  — nav solid state, mobile menu, active-page highlighting,
                              in-page anchor scroll. Shared across all four pages.
assets/js/animations.js    — GSAP/ScrollTrigger cinematic scroll motion (fully optional
                              layer — page-specific effects like the hero intro/parallax
                              and stat counters no-op on pages without those elements).
assets/css/style.css       — the visual system, shared by all four pages.
assets/video/hero.mp4      — the supplied hero background video, used as-is (Home only).
assets/docs/*.pdf          — the source resume, linked from every "Download CV" button.
index.html / about.html /
projects.html / contact.html — page skeletons: nav, hero (Home only), empty section
                              containers filled by render.js.
```

Content and presentation are deliberately separated: to change a job title, a bullet
point, a certification, or a phone number, edit `data/resumeData.js` once — nothing else
needs to change, and the edit is picked up on every page that shows that data.

## Design system

Sci-fi/HUD visual language with a full light + dark theme, built to feel dynamic without
tipping into the excessive-neon/heavy-3D anti-patterns 2026 write-ups flag (see the
research notes in the previous motion section).

- **Dual theme, no flash-of-wrong-theme.** Light is the CSS default; dark redefines the
  same tokens under `prefers-color-scheme` (so it follows the OS by default) and again
  under `[data-theme="dark"]` so an explicit toggle wins either way. A tiny inline script
  in each page's `<head>` applies a saved `localStorage` choice before first paint. Click
  the sun/moon button in the nav to toggle — the choice persists across pages and visits.
- **Electric cyan (`--accent`) + violet (`--accent-2`)** replace the previous brass/steel
  palette — vivid and glowing in dark, deliberately calmer (darker cyan, same violet) in
  light so nothing looks washed out on a white ground.
- Type: **Space Grotesk** (display, geometric/technical) + **Inter** (body) + **IBM Plex
  Mono** (labels, dates, stats, tags), loaded from Google Fonts.
- **HUD corner brackets** (`.hud`) on key panels — the architecture diagram, credential
  cards, the contact panel, CTA banners — a two-corner cyan/violet accent that's a classic
  sci-fi interface cue without wrapping every element in it.
- **Animated aurora mesh background** — three large blurred cyan/violet blobs drifting
  slowly behind the content (`prefers-reduced-motion` freezes them) — plus a faint
  technical grid backdrop that fades toward the page edges.
- **A scanline sweep** across the Home hero video, and a slow-drifting gradient on the
  hero name and `.gradient-text` headline treatment.
- The hero itself (video + dark scrim) is intentionally theme-**independent** — it always
  renders as a dark cinematic panel, with a fixed dark fallback color if the video never
  loads, and the transparent navbar overlaying it temporarily borrows the hero's fixed
  light text colors (scoped CSS-variable override) so nav/logo/buttons stay legible over
  the video regardless of which site theme is active. Once scrolled past (or on pages with
  no hero, where the nav is solid from the top) everything reverts to normal theme colors.
- Buttons use a clipped bottom-right corner (`clip-path`) instead of rounded corners — a
  small, consistent "technical" shape detail rather than a generic pill button.

## Cinematic motion (GSAP + ScrollTrigger + Lenis, loaded from CDN)

Built around current (2026) motion-UI practice — see the research notes below for sources
— favoring a small set of purposeful, restrained effects over decorative maximalism:

- **Lenis smooth scroll**, synced to GSAP's ticker so every scroll-trigger stays in step.
  This is the single biggest "feel" upgrade: inertia scrolling instead of native scroll-jump.
- **Native cross-document View Transitions** (`@view-transition { navigation: auto; }` in
  `style.css`) — a soft cross-fade between Home/About/Projects/Contact in browsers that
  support it (Chrome/Edge), zero JavaScript, and a plain instant navigation everywhere else.
- Home hero: staggered load-in (masked name reveal, fade/blur-up kicker, subtitle, 2 focused
  CTAs — trimmed from 3 to avoid an overloaded hero), then a scrubbed scroll-out — video
  scales/parallaxes, content fades, scroll cue disappears.
- **Scroll-linked word illumination** on the profile lead line only (Home + About) — words
  brighten one by one as the sentence crosses the viewport, Linear/Apple-style. Applied to
  exactly one line per page, deliberately: real text throughout (no layout shift, nothing
  hidden from screen readers or crawlers), just an opacity tween from dim to bright.
- **Magnetic buttons + a soft cursor ring** (desktop only) — buttons lean toward the pointer
  within a small radius and spring back; the ring scales up over links/buttons. Restrained
  on purpose — "felt, not seen."
- **A GSAP-driven marquee** (Home only) — every deduplicated skill from the resume's Core
  Competencies, looping edge-to-edge, slowing to a crawl on hover. Distinct in content from
  the "Core stack" teaser lower on the page (that one's just the 5 most-repeated skills).
- **A pinned horizontal-scroll showcase** (Home's "Four engagements") — the classic
  motion-site device: the section pins and all four client engagements translate
  horizontally as you scroll vertically, `ScrollTrigger.matchMedia`-gated to desktop +
  hover-capable viewports only. Touch devices (even wide tablets) get a plain native
  swipeable row instead — `.h-scroll` is `overflow-x: auto` by *default*, and JS only
  upgrades it to the pinned/scrubbed experience once that media query actually matches;
  with no GSAP or on a narrow/touch viewport, all four cards stay reachable by scrolling,
  never clipped or hidden.
- **A click-triggered page-transition wipe** between Home/About/Projects/Contact — a
  branded panel slides up to cover the screen right before navigating, then the
  destination page's own entrance animations (hero/page-hero reveal) take over. The panel
  is parked fully off-screen by default in CSS; JS only ever brings it into view in direct
  response to a real, unmodified click on an internal link (external links, `mailto:`,
  `tel:`, anchors, downloads, and modifier-key clicks all pass through untouched), so a
  no-JS or reduced-motion visitor never sees it do anything — links just navigate normally.
- Every page hero and section heading: fade-up + blur-to-sharp on scroll-in.
- About's experience timeline: a vertical line draws progressively as you scroll; entries
  slide/fade in; engagement chips (linking to their Projects case study) stagger in under
  each employer.
- Projects' case studies: alternating left/right layout with slide-in text, a scale/parallax
  visual panel, and (for the CPS engagement) an architecture diagram whose connecting
  lines draw in on scroll.
- All motion is driven by CSS transforms/opacity/filter (GPU-friendly), and **fully
  disabled** under `prefers-reduced-motion: reduce` — content simply appears in its final
  state, no parallax, no scrub, no cursor ring, no magnetic pull, words at full opacity.
  If the GSAP/Lenis CDNs fail to load for any reason, the same fallback kicks in
  automatically on every page so nothing is ever left blank, dim, or half-animated.

### Research notes

Chosen deliberately from what's actually holding up in 2026 motion-UI writeups, not
whatever looked flashiest: restraint over kinetic maximalism (Awwwards juror interviews
note that "a simple fade and translate often communicates more than a complex staggered
timeline"), cursor/magnetic micro-interactions as a cheap way to feel premium, Lenis as
the current standard smooth-scroll layer, native View Transitions as the zero-cost way to
soften multi-page navigation, and text-illumination effects used on a single sentence
rather than as blanket "kinetic typography" (which multiple 2026 sources flag as an
Awwwards-demo effect that rarely ships in production because it fights screen readers,
crawlers and Core Web Vitals when overused). Overloaded hero sections, heavy 3D, and
glassmorphism-on-everything were treated as the explicit anti-patterns to avoid.

## Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploying to Cloud Run

`Dockerfile` builds a minimal `nginx:alpine` image that serves these static files —
no build step, no app server. `nginx.conf` listens on 8080 (Cloud Run's default
`$PORT`; update it if you deploy with a custom `--port`).

```bash
gcloud run deploy aashu-portfolio --source . --region <your-region>
```

or, if you already have a Cloud Build trigger pointed at this repo, it will now find
the `Dockerfile` at the repo root and build successfully.

Note: `COPY` in the Dockerfile preserves source file permissions, and nginx's worker
process runs as a non-root user — the Dockerfile runs `chmod -R a+rX` after copying to
guard against any file (e.g. a binary asset checked out with a restrictive mode) being
unreadable to it; this was hit and fixed while verifying the image locally.

## Content source

All content is transcribed from Gayatri Devi P's resume (experience at Cognizant
Technology Solutions, Speridian Technologies, and Larsen & Toubro Infotech). The original
PDF is included at `assets/docs/Gayatri-Devi-P-Resume.pdf` and linked from the "Download
CV" button on every page.
