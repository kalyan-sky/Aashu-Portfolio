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

## Cinematic motion (GSAP + ScrollTrigger, loaded from cdnjs)

- Home hero: staggered load-in (masked name reveal, fade/blur-up kicker, subtitle, CTAs),
  then a scrubbed scroll-out — video scales/parallaxes, content fades, scroll cue disappears.
- Every page hero and section heading: fade-up + blur-to-sharp on scroll-in.
- About's experience timeline: a vertical line draws progressively as you scroll; entries
  slide/fade in; engagement chips (linking to their Projects case study) stagger in under
  each employer.
- Projects' case studies: alternating left/right layout with slide-in text, a scale/parallax
  visual panel, and (for the CPS engagement) an architecture diagram whose connecting
  lines draw in on scroll.
- All motion is driven by CSS transforms/opacity/filter (GPU-friendly), and **fully
  disabled** under `prefers-reduced-motion: reduce` — content simply appears in its final
  state, no parallax, no scrub. If the GSAP CDN fails to load for any reason, the same
  fallback kicks in automatically on every page so nothing is ever left blank or
  half-animated.

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
