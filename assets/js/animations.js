/* ==========================================================================
   animations.js — cinematic scroll motion (GSAP + ScrollTrigger).
   Every effect here is presentational only; it never touches resume content.
   Fully disabled under prefers-reduced-motion, and degrades gracefully if the
   GSAP CDN failed to load (content stays visible either way).
   ========================================================================== */
(() => {
  'use strict';

  const reduceMotion = window.REDUCE_MOTION === true;
  const gsapReady = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  // Fallback: no GSAP or reduced motion requested — just show everything, no motion.
  if (reduceMotion || !gsapReady) {
    document.querySelectorAll('.reveal-up, .split-inner, .stat-value, .word').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.filter = 'none';
    });
    document.querySelectorAll('[data-stat-target]').forEach(el => {
      el.textContent = el.dataset.statTarget;
    });
    document.querySelectorAll('.diagram-connector').forEach(el => { el.style.transform = 'scaleY(1)'; });
    const fill = document.getElementById('timeline-fill');
    if (fill) fill.style.height = '100%';
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out' });
  const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ================= LENIS SMOOTH SCROLL ================= */
  // Buttery inertia scrolling, synced to GSAP's own ticker so ScrollTrigger
  // stays perfectly in step. Purely a feel upgrade — native scroll still
  // works identically if the CDN doesn't load.
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({ duration: 1.05, wheelMultiplier: 1, touchMultiplier: 1.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;
  }

  /* ---------------- Helper: fade-up + blur-to-sharp reveal ---------------- */
  function revealBatch(selector, opts = {}) {
    const els = gsap.utils.toArray(selector);
    els.forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: opts.y ?? 28, filter: 'blur(6px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: opts.duration ?? 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    });
  }

  /* ================= HERO (Home page only) ================= */
  const heroEl = document.getElementById('hero');
  if (heroEl) {
    // Intro — plays once on load.
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    heroTl
      .fromTo('.split-inner', { yPercent: 115 }, { yPercent: 0, duration: 1.2 })
      .fromTo('.hero-kicker', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .7 }, 0.15)
      .fromTo('.hero-title', { opacity: 0, y: 18, filter: 'blur(5px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .8 }, 0.55)
      .fromTo('#hero-content .hero-actions', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .7 }, 0.72)
      .fromTo('.hero-foot', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .7 }, 0.86)
      .fromTo('.scroll-cue', { opacity: 0 }, { opacity: 1, duration: .6 }, 1.1);

    // Scroll-out — scrubbed parallax as the hero leaves the viewport.
    gsap.to('.hero-video-wrap video', {
      scale: 1.22,
      y: 40,
      ease: 'none',
      scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: 0.6 },
    });
    gsap.to('#hero-content', {
      opacity: 0.08,
      y: -70,
      ease: 'none',
      scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: 0.6 },
    });
    gsap.to('#scroll-cue', {
      opacity: 0,
      ease: 'none',
      scrollTrigger: { trigger: heroEl, start: 'top top', end: '30% top', scrub: 0.4 },
    });
  }

  /* ================= STAT COUNTERS (Home only) ================= */
  const statStrip = document.querySelector('.stat-strip');
  if (statStrip) {
    document.querySelectorAll('[data-stat-target]').forEach((el) => {
      const raw = el.dataset.statTarget;
      const numeric = parseFloat(raw.replace(/[^\d.]/g, ''));
      const suffix = raw.replace(/[\d.]/g, '');
      const counter = { val: 0 };
      gsap.to(counter, {
        val: numeric,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: statStrip, start: 'top 85%', toggleActions: 'play none none none' },
        onUpdate: () => { el.textContent = Math.round(counter.val) + suffix; },
      });
    });
  }

  /* ================= PAGE HERO (About / Projects / Contact / Home CTA) ================= */
  revealBatch('.page-hero .eyebrow, .page-hero h1, .page-hero p, .page-hero .breadcrumb, .page-hero .hero-actions', { y: 22 });

  /* ================= SECTION HEADS ================= */
  document.querySelectorAll('.section-head').forEach((head) => {
    gsap.fromTo(head.querySelectorAll('.eyebrow, h2, p'),
      { opacity: 0, y: 26, filter: 'blur(6px)' },
      {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 0.85, stagger: 0.12,
        scrollTrigger: { trigger: head, start: 'top 85%', toggleActions: 'play none none none' },
      }
    );
  });

  /* ================= GENERIC reveal-up ELEMENTS ================= */
  // Profile, credentials, contact, skills groups, timeline entries — anything
  // simply marked .reveal-up that wasn't already handled above.
  revealBatch('.profile-body p, .domain-pill, .case-toggle.reveal-up');
  revealBatch('.skill-group.reveal-up, .skills-teaser .skill-tag', { y: 22 });
  revealBatch('.cred-card.reveal-up', { y: 22 });
  revealBatch('.contact-panel-left .eyebrow, .contact-panel-left h2, .contact-panel-left p, .contact-panel-left .hero-actions, .contact-link');

  /* ================= TIMELINE ================= */
  const fillEl = document.getElementById('timeline-fill');
  if (fillEl) {
    gsap.fromTo(fillEl, { height: '0%' }, {
      height: '100%', ease: 'none',
      scrollTrigger: { trigger: '.timeline', start: 'top 65%', end: 'bottom 75%', scrub: 0.5 },
    });
  }
  document.querySelectorAll('.timeline-entry').forEach((entry) => {
    gsap.fromTo(entry,
      { opacity: 0, x: -24, filter: 'blur(5px)' },
      {
        opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.9,
        scrollTrigger: { trigger: entry, start: 'top 85%', toggleActions: 'play none none none' },
      }
    );
    const chips = entry.querySelectorAll('.engagement-chip');
    gsap.fromTo(chips,
      { opacity: 0, x: -14 },
      {
        opacity: 1, x: 0, duration: 0.6, stagger: 0.1,
        scrollTrigger: { trigger: entry, start: 'top 78%', toggleActions: 'play none none none' },
      }
    );
  });

  /* ================= CASE STUDIES ================= */
  document.querySelectorAll('.case-study').forEach((study) => {
    const flip = study.classList.contains('flip');
    const textEls = study.querySelectorAll('.case-text > *');
    const visual = study.querySelector('.case-visual');

    gsap.fromTo(textEls,
      { opacity: 0, x: flip ? 30 : -30 },
      {
        opacity: 1, x: 0, duration: 0.8, stagger: 0.08,
        scrollTrigger: { trigger: study, start: 'top 78%', toggleActions: 'play none none none' },
      }
    );
    gsap.fromTo(visual,
      { opacity: 0, x: flip ? -30 : 30, scale: 0.96 },
      {
        opacity: 1, x: 0, scale: 1, duration: 0.9,
        scrollTrigger: { trigger: study, start: 'top 75%', toggleActions: 'play none none none' },
      }
    );
    // subtle parallax depth: visual drifts slower than scroll
    gsap.to(visual, {
      y: -22, ease: 'none',
      scrollTrigger: { trigger: study, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
    });

    // architecture diagram connectors draw progressively
    const connectors = study.querySelectorAll('.diagram-connector');
    if (connectors.length) {
      gsap.fromTo(connectors, { scaleY: 0 }, {
        scaleY: 1, duration: 0.5, stagger: 0.15, transformOrigin: 'top',
        scrollTrigger: { trigger: visual, start: 'top 70%', toggleActions: 'play none none none' },
      });
    }
  });

  /* ================= WORD ILLUMINATION (profile lead line only) ================= */
  // Used sparingly, on exactly one line per page (the pull-quote-style intro
  // sentence): words brighten one by one as the paragraph crosses the middle
  // of the viewport. Real text throughout — no layout shift, nothing hidden
  // from screen readers or crawlers, just a dim-to-bright opacity tween.
  document.querySelectorAll('.profile-lead p').forEach((p) => {
    const words = p.querySelectorAll('.word');
    if (!words.length) return;
    gsap.to(words, {
      opacity: 1,
      stagger: 0.08,
      ease: 'none',
      scrollTrigger: {
        trigger: p,
        start: 'top 78%',
        end: 'bottom 45%',
        scrub: 0.4,
      },
    });
  });

  /* ================= MARQUEE (Home only) ================= */
  // Content is rendered twice back-to-back by render.js; looping the track
  // exactly one copy's width makes the reset invisible.
  const marqueeTrack = document.getElementById('marquee-track');
  if (marqueeTrack) {
    const marqueeTween = gsap.to(marqueeTrack, {
      x: () => -marqueeTrack.scrollWidth / 2,
      duration: 32,
      ease: 'none',
      repeat: -1,
    });
    const marqueeSection = marqueeTrack.closest('.marquee-section');
    if (marqueeSection && !isTouch) {
      marqueeSection.addEventListener('mouseenter', () => marqueeTween.timeScale(0.3));
      marqueeSection.addEventListener('mouseleave', () => marqueeTween.timeScale(1));
    }
  }

  /* ================= HORIZONTAL PINNED SHOWCASE (Home only) ================= */
  // Classic motion-site device: pin the section and translate the card row
  // horizontally as the user scrolls vertically. Desktop + hover-capable
  // only — touch devices (even wide tablets) get the safe native swipeable
  // row instead (.h-scroll's CSS default), since scroll-jacking fights
  // touch-scroll gestures. ScrollTrigger.matchMedia handles resize cleanly.
  const hPinWrap = document.getElementById('h-pin-wrap');
  const hScroll = document.querySelector('.h-scroll');
  const hTrack = document.getElementById('featured-projects');
  const hProgress = document.querySelector('.h-progress');
  const hProgressFill = document.querySelector('.h-progress-fill');
  if (hPinWrap && hScroll && hTrack) {
    ScrollTrigger.matchMedia({
      '(min-width: 900px) and (hover: hover)': function () {
        hScroll.classList.add('pin-active');
        if (hProgress) hProgress.classList.add('active');
        const getDistance = () => Math.max(0, hTrack.scrollWidth - hScroll.clientWidth);
        const tween = gsap.to(hTrack, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: hPinWrap,
            start: 'top top',
            end: () => '+=' + getDistance(),
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => { if (hProgressFill) hProgressFill.style.width = (self.progress * 100) + '%'; },
          },
        });
        // Cleanup when leaving this breakpoint (matchMedia requirement).
        return () => {
          tween.scrollTrigger && tween.scrollTrigger.kill();
          tween.kill();
          hScroll.classList.remove('pin-active');
          if (hProgress) hProgress.classList.remove('active');
          gsap.set(hTrack, { x: 0 });
        };
      },
    });
  }

  /* ================= PAGE TRANSITION (click-triggered exit wipe) ================= */
  // Parked fully off-screen by default (see style.css) — only ever brought
  // into view in direct response to a click, right before navigating away.
  // Never intercepts reduced-motion, modified clicks, downloads, external
  // links, or anchors/mailto/tel — those all behave as plain navigation.
  const transitionPanel = document.getElementById('page-transition');
  if (transitionPanel) {
    const transitionMark = transitionPanel.querySelector('.pt-mark');
    document.querySelectorAll('a[href]').forEach((a) => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (a.target === '_blank' || a.hasAttribute('download') || /^https?:\/\//i.test(href)) return;
      a.addEventListener('click', (e) => {
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        gsap.timeline({ onComplete: () => { window.location.href = href; } })
          .fromTo(transitionPanel, { yPercent: 100 }, { yPercent: 0, duration: 0.55, ease: 'power4.inOut' }, 0)
          .fromTo(transitionMark, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.2);
      });
    });
  }

  /* ================= CURSOR COMPANION + MAGNETIC BUTTONS (desktop only) ================= */
  if (!isTouch) {
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(ring);

    let rx = 0, ry = 0, mx = 0, my = 0;
    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    gsap.ticker.add(() => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    });

    document.querySelectorAll('a, button, input, textarea').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('active'));
    });

    // Magnetic pull: buttons lean toward the cursor within a small radius,
    // then spring back. A "felt, not seen" detail — restrained on purpose.
    document.querySelectorAll('.btn').forEach((btn) => {
      const move = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
      const moveY = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        move(relX * 0.25);
        moveY(relY * 0.35);
      });
      btn.addEventListener('mouseleave', () => { move(0); moveY(0); });
    });
  }

  /* Refresh ScrollTrigger once webfonts / late layout settle */
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
