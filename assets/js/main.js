/* ==========================================================================
   Gayatri Devi P — Portfolio interactions
   Nav, cursor, parallax + gyroscope motion scenes, reveal, tilt, forms
   ========================================================================== */
(() => {
  'use strict';

  const root = document.documentElement;
  const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Current year ---------------- */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------------- Active nav link ---------------- */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---------------- Navbar hide-on-scroll + progress bar ---------------- */
  const navbar = document.querySelector('.navbar');
  const progress = document.querySelector('.scroll-progress');
  let lastY = window.scrollY;

  const onScroll = () => {
    const y = window.scrollY;
    if (navbar) {
      if (y > lastY && y > 140) navbar.classList.add('nav-hidden');
      else navbar.classList.remove('nav-hidden');
    }
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = max > 0 ? `${(y / max) * 100}%` : '0%';
    }
    lastY = y;
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Mobile menu ---------------- */
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* ---------------- Custom cursor ---------------- */
  if (!isTouch) {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (dot && ring) {
      let rx = 0, ry = 0, mx = 0, my = 0;
      window.addEventListener('mousemove', e => {
        dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
        mx = e.clientX; my = e.clientY;
      });
      const animateRing = () => {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
        requestAnimationFrame(animateRing);
      };
      animateRing();
      document.querySelectorAll('a, button, .card, .btn, input, textarea').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('active'));
        el.addEventListener('mouseleave', () => ring.classList.remove('active'));
      });
    }
  }

  /* ---------------- Motion Sensor Scene: mouse + gyroscope parallax ---------------- */
  const blobs = document.querySelectorAll('.blob');
  const tiltCards = document.querySelectorAll('[data-tilt]');

  function applyMotion(px, py) {
    // px, py normalized -1..1
    if (!reduceMotion) {
      blobs.forEach((b, i) => {
        const depth = (i + 1) * 14;
        b.style.transform = `translate3d(${px * depth}px, ${py * depth}px, 0)`;
      });
    }
    tiltCards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      const rotY = px * 6;
      const rotX = -py * 6;
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
  }

  if (!isTouch) {
    window.addEventListener('mousemove', e => {
      const px = (e.clientX / window.innerWidth) * 2 - 1;
      const py = (e.clientY / window.innerHeight) * 2 - 1;
      applyMotion(px, py);
    });
  }

  /* Gyroscope / device-orientation driven motion scene for mobile */
  let motionEnabled = false;
  function handleOrientation(e) {
    if (e.beta === null || e.gamma === null) return;
    const px = Math.max(-1, Math.min(1, e.gamma / 30));   // left-right tilt
    const py = Math.max(-1, Math.min(1, (e.beta - 40) / 30)); // front-back tilt
    applyMotion(px, py);
  }

  function enableMotion() {
    if (motionEnabled) return;
    motionEnabled = true;
    window.addEventListener('deviceorientation', handleOrientation);
  }

  const motionBtns = document.querySelectorAll('[data-enable-motion]');
  if (isTouch && typeof DeviceOrientationEvent !== 'undefined') {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS 13+: needs an explicit user gesture
      motionBtns.forEach(btn => {
        btn.hidden = false;
        btn.addEventListener('click', async () => {
          try {
            const res = await DeviceOrientationEvent.requestPermission();
            if (res === 'granted') {
              enableMotion();
              btn.textContent = 'Motion scenes active ✨';
              btn.disabled = true;
            }
          } catch (err) { /* ignored — user declined */ }
        });
      });
    } else {
      // Android / other: no permission gate needed
      enableMotion();
      motionBtns.forEach(btn => { btn.hidden = true; });
    }
  } else {
    motionBtns.forEach(btn => { btn.hidden = true; });
  }

  /* ---------------- Scroll-linked hero parallax ---------------- */
  const heroVideo = document.querySelector('.hero-video-wrap');
  if (heroVideo && !reduceMotion) {
    document.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroVideo.style.transform = `translateY(${y * 0.25}px)`;
    }, { passive: true });
  }

  /* ---------------- Reveal on scroll ---------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------------- Animated stat counters ---------------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const countIo = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();
        function tick(now) {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target % 1 === 0 ? Math.floor(target * eased) : (target * eased).toFixed(1);
          el.textContent = val + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        countIo.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => countIo.observe(el));
  }

  /* ---------------- Skill bar fill ---------------- */
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  if (skillBars.length && 'IntersectionObserver' in window) {
    const skillIo = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.level;
          skillIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    skillBars.forEach(el => skillIo.observe(el));
  }

  /* ---------------- Marquee auto-duplicate for seamless loop ---------------- */
  document.querySelectorAll('.marquee').forEach(m => {
    m.innerHTML += m.innerHTML;
  });

  /* ---------------- Contact form (client-side only) ---------------- */
  const form = document.querySelector('#contact-form');
  if (form) {
    const status = form.querySelector('.form-status');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !emailOk || !message) {
        status.textContent = 'Please fill in your name, a valid email, and a message before sending.';
        status.className = 'form-status show err';
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Sending…';

      setTimeout(() => {
        status.textContent = `Thanks, ${name.split(' ')[0]}! Your message has been queued — I'll reply at ${email} soon.`;
        status.className = 'form-status show ok';
        form.reset();
        btn.disabled = false;
        btn.textContent = 'Send message';
      }, 900);
    });
  }
})();
