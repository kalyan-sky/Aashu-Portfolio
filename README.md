# Gayatri Devi P — Portfolio

An ultramodern, Gen-Z styled personal portfolio for **Gayatri Devi P**, Senior .NET Full
Stack Developer (ASP.NET Core · Angular · AWS · Microservices), based in Singapore.

## Pages

- `index.html` — Home, with a full-bleed autoplaying video hero, animated stats, and a "what I do" overview.
- `about.html` — Bio, career timeline, skills, certifications and education.
- `projects.html` — Detailed case studies for four enterprise engagements.
- `contact.html` — Contact details and a client-side validated message form.

## Design system

- Pure HTML/CSS/JS — no build step, no dependencies. Just open `index.html` or serve
  the folder with any static server.
- Dark, glassmorphic theme with a violet → pink → cyan gradient system, animated grid
  backdrop, floating blurred blobs, grain overlay, custom cursor and a scroll progress bar.
- Fonts: Space Grotesk (display) + Inter (body), loaded from Google Fonts.

## Motion & interaction ("motion sensor scenes")

- **Desktop:** mouse-position parallax drives the background blobs and gives project/skill
  cards a subtle 3D tilt.
- **Mobile:** the same scene reacts to the device's gyroscope via the `deviceorientation`
  API (tilt your phone to move the blobs/cards). On iOS 13+, a "Enable motion scenes"
  button appears to request the required motion-sensor permission.
- Scroll-linked hero parallax, `IntersectionObserver`-driven reveal animations, animated
  stat counters and skill-bar fills, and a paused-on-hover marquee strip.

## Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Content source

Copy is derived from Gayatri Devi P's resume (experience at Cognizant, Speridian
Technologies and Larsen & Toubro Infotech).
