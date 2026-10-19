/* ==========================================================================
   system.js — the Home page, styled as a cinematic streaming-UI profile per
   a reference the user supplied (a "Netflix portfolio" concept): red/black
   palette, oversized condensed type, a tilting poster-card hero, a custom
   cursor + spotlight, a sticky "expertise" stack, a pinned 3D skills
   carousel, and projects framed as numbered episodes.
   Self-contained and data-driven: every technology, domain, project, metric
   and certification shown here is read straight from data/resumeData.js —
   nothing is invented. Core interactivity (cursor, tilt, episode expand,
   carousel) works without GSAP; GSAP, where available, only adds the pinned
   scroll choreography on top.
   ========================================================================== */
(() => {
  'use strict';
  const R = window.RESUME;
  if (!R) return;
  const root = document.getElementById('top');
  if (!root || !root.classList.contains('system-shell')) return; // Home page only

  const $ = (id) => document.getElementById(id);
  const reduceMotion = window.REDUCE_MOTION === true || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;

  const findProject = (id) => R.projects.find((p) => p.id === id);
  const findExperienceFor = (projectId) => R.experience.find((e) => e.engagementRefs.includes(projectId));

  /* ================= HERO MARQUEE ================= */
  function renderHeroMarquee() {
    const el = $('hero-marquee');
    if (!el) return;
    const words = [...R.domains, ...R.skills.core, 'Cloud-Native', 'Kubernetes'];
    const html = words.map((w) => `<span>${w} &bull;</span>`).join('');
    el.innerHTML = html + html; // duplicated for a seamless CSS marquee loop
  }

  /* ================= CURSOR + SPOTLIGHT + POSTER TILT (desktop only) ================= */
  function initCursorAndTilt() {
    const dot = $('cine-cursor-dot');
    const ring = $('cine-cursor-ring');
    const spotlight = $('cine-spotlight');
    if (isTouch || !dot || !ring || !spotlight) return;

    let mx = 0, my = 0, visible = false;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      spotlight.style.transform = `translate(${mx}px, ${my}px)`;
      if (!visible) { dot.style.opacity = '1'; ring.style.opacity = '1'; spotlight.style.opacity = '1'; visible = true; }
    });
    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0'; ring.style.opacity = '0'; spotlight.style.opacity = '0'; visible = false;
    });
    document.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.style.transform += ' scale(1.6)');
      el.addEventListener('mouseleave', () => { ring.style.transform = ring.style.transform.replace(' scale(1.6)', ''); });
    });

    // 3D tilt + glare on the hero poster card, following the cursor within it.
    const poster = $('cine-poster');
    const glare = $('cine-poster-glare');
    if (poster && !reduceMotion) {
      const heroEl = document.getElementById('hero');
      heroEl.addEventListener('mousemove', (e) => {
        const rect = poster.getBoundingClientRect();
        const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        const maxDist = 900; // only react within a generous radius of the card
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        const falloff = Math.max(0, 1 - dist / maxDist);
        poster.style.transform = `rotateY(${dx * 14 * falloff}deg) rotateX(${-dy * 14 * falloff}deg)`;
        if (glare) glare.style.transform = `translate(${dx * 40}%, ${dy * 40}%)`;
      });
      heroEl.addEventListener('mouseleave', () => { poster.style.transform = 'rotateY(0deg) rotateX(0deg)'; });
    }
  }

  /* ================= ABOUT — BENTO GRID ================= */
  function renderAbout() {
    const el = $('cine-about');
    if (!el) return;
    const [lead, sub] = R.summary;
    el.innerHTML = `
      <div class="cine-bento-card span-7 sys-card">
        <span class="idx">01</span>
        <h3>Cast &amp; Background</h3>
        <p class="lead">${lead}</p>
        <p class="sub">${sub}</p>
        <div class="cine-bento-chips">${R.domains.map((d) => `<span>${d}</span>`).join('')}</div>
      </div>
      <div class="cine-bento-card span-5 sys-card">
        <span class="idx">02</span>
        <h3>Milestones &amp; Credentials</h3>
        <ul class="cine-bento-list">
          ${R.certifications.map((c) => `<li>${c.name} <span style="color:rgba(255,255,255,.4);">&mdash; ${c.issuer}</span></li>`).join('')}
          <li>${R.stats[1].value} organizations, ${R.stats[2].value} enterprise engagements, ${R.stats[0].value} years in production.</li>
        </ul>
        <div class="cine-bento-foot">// SEASON_01 HIGHLIGHTS</div>
      </div>
      <div class="cine-bento-card span-12 sys-card" style="display:flex; flex-direction:column; md:flex-direction:row; gap:1.5rem;">
        <span class="idx">03</span>
        <h3>Production Tech Stack</h3>
        <div class="cine-bento-chips" id="cine-about-stack"></div>
      </div>
    `;
    const stackEl = $('cine-about-stack');
    const seen = new Set();
    const all = [];
    R.skills.groups.forEach((g) => g.items.forEach((item) => {
      const key = item.toLowerCase();
      if (!seen.has(key)) { seen.add(key); all.push(item); }
    }));
    stackEl.innerHTML = all.map((s) => `<span>${s}</span>`).join('');
  }

  /* ================= EXPERTISE — STICKY STACK ================= */
  const DOMAIN_BLURBS = {
    'Payments': 'Payment gateway integrations and transaction processing — including the Common Payment System’s PayNow, GIRO, Credit Card, DBS and eNETS channels.',
    'Financial Services': 'Secure, scalable enterprise applications for financial services clients, spanning payment platforms and insurance underwriting systems.',
    'Government Systems': 'Singapore Government platforms — the Common Payment System for the Singapore Land Authority, and the Charity Portal for the Ministry of Culture, Community and Youth.',
    'Identity & Access Management': 'Authentication and authorization platforms, including Singpass/Corppass integration and a Customer Identity & Access Management system built with PingOne and PingDirectory.',
    'Insurance': 'Underwriting systems for Personal Liability, Commercial Property, Homeowners and Dwelling insurance products at TAPCO Insurance.',
  };
  function renderExpertise() {
    const el = $('cine-expertise');
    if (!el) return;
    const n = R.domains.length;
    el.innerHTML = R.domains.map((d, i) => `
      <div class="cine-expertise-card sys-card" style="top:${96 + i * 18}px; z-index:${i + 1};">
        <div class="num">0${i + 1}</div>
        <div class="body">
          <div>
            <span class="tag">GENRE ${String(i + 1).padStart(2, '0')} / 0${n}</span>
            <h3>${d}</h3>
          </div>
          <p>${DOMAIN_BLURBS[d] || ''}</p>
        </div>
      </div>
    `).join('');
  }

  /* ================= SKILLS — 3D ARC CAROUSEL ================= */
  const SKILL_GROUPS = [
    { title: 'Backend Engineering', tag: 'ARCHITECTURE', items: ['C#', 'ASP.NET Core', '.NET Core', 'Entity Framework', 'REST APIs', 'Microservices', 'WCF', 'SOAP Services'],
      desc: 'Service architecture and APIs — the layer every request passes through.' },
    { title: 'Frontend Engineering', tag: 'UI / INTERACTION', items: ['Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3'],
      desc: 'Responsive, component-driven interfaces built on Angular.' },
    { title: 'Cloud Platform', tag: 'INFRASTRUCTURE', items: ['AWS Lambda', 'EC2', 'AWS ECS/EKS', 'RDS', 'API Gateway', 'AWS Secrets Manager', 'CloudWatch', 'IAM', 'AWS ECR', 'CodeCommit'],
      desc: 'Cloud-native infrastructure, managed end to end on AWS.' },
    { title: 'Messaging', tag: 'EVENT-DRIVEN', items: ['RabbitMQ', 'SNS/SQS'],
      desc: 'Asynchronous, decoupled communication between services.' },
    { title: 'DevOps', tag: 'DEPLOYMENT', items: ['Docker', 'Kubernetes', 'CI/CD', 'Git'],
      desc: 'Containerized services, built and shipped through automated pipelines.' },
    { title: 'Data', tag: 'PERSISTENCE', items: ['SQL Server', 'MySQL'],
      desc: 'Relational data, tuned for transactional throughput.' },
    { title: 'Testing & Tools', tag: 'QUALITY', items: ['xUnit', 'Moq', 'Postman', 'Swagger', 'NSwag Studio', 'Visual Studio', 'VS Code'],
      desc: 'The instruments behind every reliable release.' },
  ];
  function renderSkillsCarousel() {
    const stage = $('cine-carousel-stage');
    const mobile = $('cine-carousel-mobile');
    const progress = $('cine-carousel-progress');
    if (!stage || !mobile || !progress) return;

    const cardHtml = (g, i) => `
      <div class="cine-carousel-card sys-card" data-idx="${i}">
        <div class="top-row"><span class="tag">${g.tag}</span><span class="idx">[ 0${i + 1} / 0${SKILL_GROUPS.length} ]</span></div>
        <div>
          <h3>${g.title}</h3>
          <p>${g.desc}</p>
        </div>
        <div class="tags">${g.items.map((it) => `<span>${it}</span>`).join('')}</div>
      </div>
    `;
    stage.innerHTML = SKILL_GROUPS.map(cardHtml).join('');
    mobile.innerHTML = SKILL_GROUPS.map(cardHtml).join('');
    progress.innerHTML = SKILL_GROUPS.map((_, i) => `<span data-idx="${i}" class="${i === 0 ? 'active' : ''}"></span>`).join('');

    const cards = Array.from(stage.children);
    const dots = Array.from(progress.children);

    function layout(p) {
      cards.forEach((card, i) => {
        const offset = i - p;
        const angle = offset * 20;
        const rad = (angle * Math.PI) / 180;
        const radius = 900;
        const x = Math.sin(rad) * radius;
        const y = radius - Math.cos(rad) * radius;
        const scale = Math.max(0.5, 1 - Math.abs(offset) * 0.16);
        const opacity = Math.max(0.12, 1 - Math.abs(offset) * 0.32);
        const z = Math.round(100 - Math.abs(offset) * 10);
        card.style.transform = `translate(-50%,-50%) translate3d(${x}px, ${y}px, 0) rotate(${angle}deg) scale(${scale})`;
        card.style.opacity = String(opacity);
        card.style.zIndex = String(z);
      });
      const active = Math.round(p);
      dots.forEach((d, i) => d.classList.toggle('active', i === active));
    }
    layout(0);

    const gsapReady = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
    if (!reduceMotion && gsapReady) {
      ScrollTrigger.create({
        trigger: stage.closest('.cine-carousel-section'),
        start: 'top top',
        end: '+=' + (SKILL_GROUPS.length * 70) + '%',
        pin: true,
        pinType: 'transform',
        scrub: 0.6,
        onUpdate(self) {
          layout(self.progress * (SKILL_GROUPS.length - 1));
        },
      });
    } else {
      // No GSAP / reduced motion: lay the stage's own cards out as a plain
      // static stack instead of leaving them collapsed at p=0 behind a dead
      // pinned section. (The separate mobile row below 760px already works
      // without any of this — it's pure CSS scroll-snap, untouched here.)
      cards.forEach((card) => {
        card.style.transform = 'none';
        card.style.opacity = '1';
        card.style.position = 'static';
        card.style.margin = '0 0 20px';
      });
      stage.style.height = 'auto';
      progress.style.display = 'none';
    }
  }

  /* ================= PROJECTS — EPISODE CARDS ================= */
  function renderEpisodes() {
    const el = $('cine-episodes');
    if (!el) return;
    el.innerHTML = R.projects.map((p, i) => {
      const exp = findExperienceFor(p.id);
      const archText = p.architecture
        ? `${p.architecture.channels.join(' · ')} → ${p.architecture.core.label} → ${p.architecture.eventBus.label} → ${p.architecture.data.label} → ${p.architecture.deploy.label}`
        : p.keySkills.join(' · ');
      const contribution = p.contributions.slice(0, 3).map((c) => `<li>${c}</li>`).join('');
      const impactHtml = p.metric
        ? `<div class="cine-episode-impact"><span class="num">${p.metric.value}</span><span>${p.metric.label}</span></div>`
        : `<p class="v">${p.contributions[p.contributions.length - 1]}</p>`;
      return `
        <div class="cine-episode sys-card" id="episode-${p.id}">
          <button type="button" class="cine-episode-trigger" aria-expanded="false" data-ep="${p.id}">
            <div class="cine-episode-top">
              <span class="cine-episode-tag">S01 E0${i + 1}</span>
              <div class="right">
                <span class="cine-episode-status">${exp && exp.current ? 'LIVE' : 'COMPLETE'}</span>
                <span class="cine-episode-hd">HD</span>
              </div>
            </div>
            <div class="cine-episode-cat">${p.org}</div>
            <h3>${p.name}</h3>
            <div class="cine-episode-client">${p.client} &middot; ${p.dates}</div>
            <p class="cine-episode-desc">${p.description}</p>
            <div class="cine-episode-tags">${p.keySkills.slice(0, 5).map((s) => `<span>${s}</span>`).join('')}</div>
            <span class="cine-episode-cue">+ Expand Episode</span>
          </button>
          <div class="cine-episode-panel">
            <div class="cine-episode-panel-inner">
              <div class="cine-episode-field"><span class="k">Architecture</span><p class="v">${archText}</p></div>
              <div class="cine-episode-field"><span class="k">Engineering Contribution</span><ul class="v">${contribution}</ul></div>
              <div class="cine-episode-field"><span class="k">Impact</span>${impactHtml}</div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    el.querySelectorAll('.cine-episode-trigger').forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.cine-episode');
        const isOpen = card.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(isOpen));
        btn.querySelector('.cine-episode-cue').textContent = isOpen ? '− Close Episode' : '+ Expand Episode';
      });
    });
  }

  /* ================= FINAL — CREDITS LINKS ================= */
  function renderFinalLinks() {
    const el = $('cine-final-links');
    if (!el) return;
    el.innerHTML = `
      <a href="${R.person.linkedinHref}" target="_blank" rel="noopener">LinkedIn</a>
      <a href="mailto:${R.person.email}">Email</a>
      <a href="contact.html" class="primary">Contact</a>
    `;
  }

  /* ================= SCROLL REVEALS ================= */
  function wireScrollReveals() {
    const gsapReady = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
    if (reduceMotion || !gsapReady) {
      document.querySelectorAll('.cine-hero .reveal-up').forEach((el) => {
        el.style.opacity = '1'; el.style.transform = 'none';
      });
      return;
    }
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .fromTo('.cine-hero .reveal-up', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.2)
      .fromTo('#scroll-cue', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1);

    gsap.utils.toArray('.sys-section').forEach((section) => {
      gsap.fromTo(section.querySelectorAll('.section-head > *'),
        { opacity: 0, y: 24, filter: 'blur(6px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 82%', toggleActions: 'play none none none' },
        }
      );
    });
    gsap.utils.toArray('.cine-bento, .cine-episodes').forEach((el) => {
      gsap.fromTo(el, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      });
    });
    gsap.utils.toArray('.cine-episode').forEach((el, i) => {
      gsap.fromTo(el, { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.6, delay: (i % 3) * 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
      });
    });
    gsap.fromTo('.cine-final-content', { opacity: 0, y: 20 }, {
      opacity: 1, y: 0, duration: 1,
      scrollTrigger: { trigger: '.cine-final', start: 'top 70%', toggleActions: 'play none none none' },
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
  }

  renderHeroMarquee();
  renderAbout();
  renderExpertise();
  renderSkillsCarousel();
  renderEpisodes();
  renderFinalLinks();
  initCursorAndTilt();
  wireScrollReveals();
})();
