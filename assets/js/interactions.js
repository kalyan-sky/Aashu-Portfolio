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
  const hero = document.getElementById('hero');

  /* ---------------- Scroll progress + navbar solid state ---------------- */
  const onScroll = () => {
    const y = window.scrollY;
    const threshold = hero ? hero.offsetHeight * 0.72 : -1; // no hero on this page: navbar stays solid from the top
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

  /* ---------------- Active-page nav highlighting ---------------- */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const hrefPage = a.getAttribute('href').split('#')[0] || 'index.html';
    if (hrefPage === currentPage) a.classList.add('active');
  });
})();
