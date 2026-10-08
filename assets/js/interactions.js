/* ==========================================================================
   interactions.js — navigation, mobile menu, active-page nav highlighting,
   in-page anchor scrolling, scroll progress bar. Shared across all pages.
   No GSAP here; cinematic motion lives in animations.js.
   ========================================================================== */
(() => {
  'use strict';

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) document.body.classList.add('reduced-motion');
  window.REDUCE_MOTION = reduceMotion;

  const navbar = document.getElementById('navbar');
  const progress = document.querySelector('.scroll-progress');
  const navH = 88;
  // 'system-trace' is the Home page's pinned, scroll-scrubbed intro — GSAP
  // stretches its outer section to the full multi-screen scroll distance of
  // the pin, so using ITS height (not the fixed-viewport-sized stage inside
  // it) keeps the navbar transparent for the whole dark sequence and only
  // flips it solid once the lighter content below has actually scrolled
  // into view. Falls back to the plain '#hero' some other layout might use.
  const hero = document.getElementById('system-trace') || document.getElementById('hero');
  // The pinned sequence should stay transparent-over-dark right up until it
  // releases; a plain 1-viewport hero flips solid a bit earlier, anticipating
  // the lighter content right behind it.
  const heroThresholdRatio = document.getElementById('system-trace') ? 0.95 : 0.72;

  /* ---------------- Scroll progress + navbar solid state ---------------- */
  const onScroll = () => {
    const y = window.scrollY;
    const threshold = hero ? hero.offsetHeight * heroThresholdRatio : -1; // no hero on this page: navbar stays solid from the top
    navbar.classList.toggle('solid', y > threshold);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = max > 0 ? `${(y / max) * 100}%` : '0%';
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Smooth in-page anchor scrolling (offset for fixed nav) ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    a.addEventListener('click', (e) => {
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      closeMobileMenu();
      const top = target.getBoundingClientRect().top + window.scrollY - (id === 'top' ? 0 : navH - 8);
      if (window.__lenis && !reduceMotion) {
        window.__lenis.scrollTo(top, { duration: 1.1 });
      } else {
        window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
      history.pushState(null, '', `#${id}`);
    });
  });

  /* ---------------- Mobile menu ---------------- */
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');

  function openMobileMenu() {
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileMenu() {
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }
  toggle.addEventListener('click', () => {
    menu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  /* ---------------- Active-page nav highlighting ---------------- */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const hrefPage = a.getAttribute('href').split('#')[0] || 'index.html';
    if (hrefPage === currentPage) a.classList.add('active');
  });

  /* ---------------- Theme toggle (light / dark, persisted) ---------------- */
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const systemDark = matchMedia('(prefers-color-scheme: dark)').matches;
      const current = document.documentElement.dataset.theme || (systemDark ? 'dark' : 'light');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }
})();
