/* ==========================================================================
   interactions.js — navigation, mobile menu, scrollspy, anchor scrolling,
   scroll progress bar. No GSAP here; cinematic motion lives in animations.js.
   ========================================================================== */
(() => {
  'use strict';

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) document.body.classList.add('reduced-motion');
  window.REDUCE_MOTION = reduceMotion;

  const navbar = document.getElementById('navbar');
  const progress = document.querySelector('.scroll-progress');
  const navH = 88;

  /* ---------------- Scroll progress + navbar solid state ---------------- */
  const onScroll = () => {
    const y = window.scrollY;
    const heroH = document.getElementById('hero').offsetHeight;
    navbar.classList.toggle('solid', y > heroH * 0.72);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = max > 0 ? `${(y / max) * 100}%` : '0%';
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Smooth anchor scrolling (offset for fixed nav) ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      closeMobileMenu();
      const top = target.getBoundingClientRect().top + window.scrollY - (id === 'top' ? 0 : navH - 8);
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
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

  /* ---------------- Scrollspy: highlight active nav link ---------------- */
  const sections = ['profile', 'experience', 'projects', 'skills', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const navAnchors = document.querySelectorAll('.nav-links a, .mobile-menu a');

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach(s => spy.observe(s));
  }
})();
