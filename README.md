# Gayatri Devi P — Cinematic Portfolio

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

- Dark, single-theme cinematic palette: near-black ground, a muted brass/gold accent, a
  cool steel-blue secondary accent.
- Type: **Fraunces** (serif display) + **Inter** (body) + **IBM Plex Mono** (labels, dates,
  stats, tags), loaded from Google Fonts.
- Editorial hero (video background, bottom-aligned headline) on Home; a shorter
  text-driven "page hero" banner introduces About/Projects/Contact. Thin-line dividers,
  restrained glass/blur only on the navbar, no neon, no particle effects.

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

## Content source

All content is transcribed from Gayatri Devi P's resume (experience at Cognizant
Technology Solutions, Speridian Technologies, and Larsen & Toubro Infotech). The original
PDF is included at `assets/docs/Gayatri-Devi-P-Resume.pdf` and linked from the "Download
CV" button on every page.
