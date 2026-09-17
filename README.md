# Gayatri Devi P — Cinematic Portfolio

A single-page, premium/cinematic portfolio for **Gayatri Devi P**, Senior .NET Full Stack
Developer (ASP.NET Core · Angular · AWS · Microservices), based in Singapore. Every fact
on the page — name, dates, employers, clients, skills, certifications, education, contact
details — is transcribed directly from her resume. Nothing is invented.

## Architecture

Static HTML/CSS/JS — no build step, no framework, no bundler.

```
data/resumeData.js        — single source of truth. Every resume fact lives here, once.
assets/js/render.js        — builds the DOM for every section from data/resumeData.js.
assets/js/interactions.js  — nav solid/transparent state, mobile menu, scrollspy, anchor scroll.
assets/js/animations.js    — GSAP/ScrollTrigger cinematic scroll motion (fully optional layer).
assets/css/style.css       — the visual system.
assets/video/hero.mp4      — the supplied hero background video, used as-is.
assets/docs/*.pdf          — the source resume, linked from the "Download CV" button.
index.html                 — page skeleton: nav, hero video, empty section containers.
```

Content and presentation are deliberately separated: to change a job title, a bullet
point, a certification, or a phone number, edit `data/resumeData.js` — nothing else needs
to change. `render.js` re-renders every section from that one object on page load.

## Sections (all resume-derived)

Hero → Stats strip (7+ yrs / 3 orgs / 4 engagements / 30% latency reduced / 3 certs,
all directly counted or quoted from the resume) → Profile (professional summary) →
Experience (organizational timeline: CTS, Speridian, LTI) → Projects (case studies for
the four client engagements — CPS, Charity Portal e-Services, CIAM, Insurance
Underwriting vNext — including a small architecture diagram for CPS built from its own
bullet points) → Skills (grouped exactly as the resume's Core Competencies section) →
Education & Certifications → Contact (email, phone, LinkedIn only — no invented links).

## Design system

- Dark, single-theme cinematic palette: near-black ground, a muted brass/gold accent, a
  cool steel-blue secondary accent.
- Type: **Fraunces** (serif display) + **Inter** (body) + **IBM Plex Mono** (labels, dates,
  stats, tags), loaded from Google Fonts.
- Editorial hero (video background, bottom-aligned headline), thin-line dividers, restrained
  glass/blur only on the navbar, no neon, no particle effects.

## Cinematic motion (GSAP + ScrollTrigger, loaded from cdnjs)

- Hero: staggered load-in (masked name reveal, fade/blur-up kicker, subtitle, CTAs), then a
  scrubbed scroll-out — video scales/parallaxes, content fades, scroll cue disappears.
- Section headings and every content block: fade-up + blur-to-sharp on scroll-in.
- Experience: a vertical line draws progressively as you scroll the timeline; entries
  slide/fade in; engagement chips stagger in under each employer.
- Projects: alternating left/right case-study layout with slide-in text, a scale/parallax
  visual panel, and (for the CPS engagement) an architecture diagram whose connecting
  lines draw in on scroll.
- All motion is driven by CSS transforms/opacity/filter (GPU-friendly), and **fully
  disabled** under `prefers-reduced-motion: reduce` — content simply appears in its final
  state, no parallax, no scrub. If the GSAP CDN fails to load for any reason, the same
  fallback kicks in automatically so the page is never left blank or half-animated.

## Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Content source

All content is transcribed from Gayatri Devi P's resume (experience at Cognizant
Technology Solutions, Speridian Technologies, and Larsen & Toubro Infotech). The original
PDF is included at `assets/docs/Gayatri-Devi-P-Resume.pdf` and linked from the "Download
CV" button.
