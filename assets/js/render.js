/* ==========================================================================
   render.js — builds every section's DOM from data/resumeData.js (window.RESUME).
   Presentation only: no facts are introduced here that aren't already in the data.
   ========================================================================== */
(() => {
  'use strict';
  const R = window.RESUME;
  if (!R) return;

  document.body.classList.remove('no-js');

  const $ = (id) => document.getElementById(id);
  const isCore = (skill) => R.skills.core.some(c => c.toLowerCase() === skill.toLowerCase());

  /* ---------------- HERO ---------------- */
  (function renderHero() {
    const el = $('hero-content');
    const nameParts = R.person.name.split(' ');
    // Italicize the final two tokens for names with 3+ parts (e.g. "Gayatri" + "Devi P"),
    // otherwise just the last word — keeps the italic fragment visually substantial.
    const italicCount = nameParts.length > 2 ? 2 : 1;
    const last = nameParts.splice(-italicCount).join(' ');
    const first = nameParts.join(' ');
    el.innerHTML = `
      <p class="hero-kicker reveal-up"><span class="dot"></span>${R.person.title} · ${R.person.location}</p>
      <h1 class="hero-name"><span class="split-line"><span class="split-inner">${first} <em>${last}</em></span></span></h1>
      <p class="hero-title reveal-up">${R.person.subtitle} — 7+ years delivering enterprise-scale applications across ${R.domains.join(', ')}.</p>
      <div class="hero-actions reveal-up">
        <a href="#experience" class="btn btn-primary">View Experience</a>
        <a href="#projects" class="btn btn-ghost">See Case Studies</a>
        <a href="assets/docs/Gayatri-Devi-P-Resume.pdf" class="btn btn-ghost" download>Download CV</a>
      </div>
      <div class="hero-foot reveal-up">
        <span class="mono-label" style="color:var(--ink-faint);">Based in ${R.person.location}</span>
        <div class="hero-foot-links">
          <a href="mailto:${R.person.email}">${R.person.email}</a>
          <a href="tel:${R.person.phoneHref}">${R.person.phone}</a>
          <a href="${R.person.linkedinHref}" target="_blank" rel="noopener">${R.person.linkedinLabel}</a>
        </div>
      </div>
    `;
  })();

  /* ---------------- STATS ---------------- */
  (function renderStats() {
    const el = $('stats-strip');
    el.innerHTML = R.stats.map(s => `
      <div class="stat">
        <div class="stat-value" data-stat-target="${s.value}">0</div>
        <div class="stat-label">${s.label}</div>
      </div>
    `).join('');
  })();

  /* ---------------- PROFILE ---------------- */
  (function renderProfile() {
    const el = $('profile-content');
    const [lead, ...rest] = R.summary;
    el.innerHTML = `
      <div class="profile-lead"><p class="reveal-up">${lead}</p></div>
      <div class="profile-body">
        ${rest.map(p => `<p class="reveal-up">${p}</p>`).join('')}
        <div class="domain-list">
          ${R.domains.map(d => `<span class="domain-pill reveal-up">${d}</span>`).join('')}
        </div>
      </div>
    `;
  })();

  /* ---------------- EXPERIENCE TIMELINE ---------------- */
  (function renderTimeline() {
    const el = $('timeline');
    el.innerHTML = `
      <div class="timeline-track"><div class="timeline-track-fill" id="timeline-fill"></div></div>
      ${R.experience.map(job => `
        <div class="timeline-entry reveal-up ${job.current ? 'current' : ''}">
          <div class="timeline-dot"></div>
          <span class="timeline-dates">${job.dates}</span>
          <h3>${job.role}</h3>
          <span class="timeline-org">${job.org} — ${job.location}</span>
          <div class="timeline-engagements">
            ${job.engagementRefs.map(ref => {
              const proj = R.projects.find(p => p.id === ref);
              if (!proj) return '';
              return `
                <a class="engagement-chip" href="#project-${proj.id}">
                  <span>
                    <span class="name">${proj.name}</span><br>
                    <span class="client">${proj.client} · ${proj.dates}</span>
                  </span>
                  <span class="arrow">View case study →</span>
                </a>
              `;
            }).join('')}
          </div>
        </div>
      `).join('')}
    `;
  })();

  /* ---------------- PROJECTS / CASE STUDIES ---------------- */
  (function renderCaseStudies() {
    const el = $('case-studies');
    el.innerHTML = R.projects.map((p, i) => {
      const num = String(i + 1).padStart(2, '0');
      const flip = i % 2 === 1 ? 'flip' : '';
      const visibleList = p.contributions.slice(0, 4);
      const hiddenList = p.contributions.slice(4);
      const hasMore = hiddenList.length > 0;

      const tags = p.keySkills.map(s => `<span class="case-tag ${isCore(s) ? 'core' : ''}">${s}</span>`).join('');

      const metricHtml = p.metric ? `
        <div class="case-metric reveal-up">
          <span class="num">${p.metric.value}</span>
          <span class="desc">${p.metric.label}</span>
        </div>` : '';

      const visualHtml = p.architecture ? buildDiagram(p.architecture) : buildQuoteVisual(p);

      return `
        <article class="case-study ${flip}" id="project-${p.id}">
          <div class="case-text">
            <span class="case-index reveal-up">${num} / ${String(R.projects.length).padStart(2, '0')}</span>
            <h3 class="reveal-up">${p.name}</h3>
            <span class="case-meta reveal-up">${p.client} · ${p.org} · ${p.dates}</span>
            <p class="case-desc reveal-up">${p.description}</p>
            <div class="case-tags reveal-up">${tags}</div>
            ${metricHtml}
            <ul class="case-list ${hasMore ? 'collapsed' : ''} reveal-up" data-project="${p.id}">
              ${visibleList.map(c => `<li>${c}</li>`).join('')}
              ${hiddenList.map(c => `<li>${c}</li>`).join('')}
            </ul>
            ${hasMore ? `<button class="case-toggle" data-toggle="${p.id}">Show all ${p.contributions.length} contributions +</button>` : ''}
          </div>
          <div class="case-visual reveal-up">${visualHtml}</div>
        </article>
      `;
    }).join('');

    // wire up "show all contributions" toggles
    el.querySelectorAll('[data-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.toggle;
        const list = el.querySelector(`.case-list[data-project="${id}"]`);
        const collapsed = list.classList.toggle('collapsed');
        const total = R.projects.find(p => p.id === id).contributions.length;
        btn.textContent = collapsed ? `Show all ${total} contributions +` : 'Show fewer −';
      });
    });
  })();

  function buildDiagram(a) {
    return `
      <div class="diagram">
        <div class="diagram-caption">${a.caption}</div>
        <div class="diagram-row">
          ${a.channels.map(c => `<div class="diagram-node">${c}</div>`).join('')}
        </div>
        <div class="diagram-connector"></div>
        <div class="diagram-core">
          <div class="label">${a.core.label}</div>
          <div class="sub">${a.core.sub}</div>
        </div>
        <div class="diagram-connector"></div>
        <div class="diagram-secondary">
          <div class="label">${a.eventBus.label}</div>
          <div class="sub">${a.eventBus.sub}</div>
        </div>
        <div class="diagram-connector"></div>
        <div class="diagram-row" style="margin-bottom:1.2rem;">
          <div class="diagram-node">${a.data.label} — ${a.data.sub}</div>
        </div>
        <div class="diagram-foot">${a.deploy.label} — ${a.deploy.sub}</div>
      </div>
    `;
  }

  function buildQuoteVisual(p) {
    return `
      <div class="diagram">
        <div class="diagram-caption">Key skills applied</div>
        <div class="diagram-row" style="justify-content:flex-start;">
          ${p.keySkills.map(s => `<div class="diagram-node">${s}</div>`).join('')}
        </div>
        <div style="margin-top:1.6rem; padding-top:1.4rem; border-top:1px solid var(--line); font-family:var(--font-mono); font-size:.72rem; color:var(--ink-faint); text-transform:uppercase; letter-spacing:.08em;">
          ${p.org}
        </div>
      </div>
    `;
  }

  /* ---------------- SKILLS ---------------- */
  (function renderSkills() {
    $('skills-intro').textContent = R.skills.intro;
    const el = $('skills-grid');
    el.innerHTML = R.skills.groups.map(g => `
      <div class="skill-group reveal-up">
        <h3>${g.title}</h3>
        <div class="skill-tags">
          ${g.items.map(item => `<span class="skill-tag ${isCore(item) ? 'core' : ''}">${item}</span>`).join('')}
        </div>
      </div>
    `).join('');
  })();

  /* ---------------- CREDENTIALS ---------------- */
  (function renderCredentials() {
    const el = $('credentials-grid');
    el.innerHTML = `
      <div class="cred-card reveal-up">
        <h3 class="mono-label" style="display:block;margin-bottom:1.4rem;">Education</h3>
        <div class="cred-list">
          ${R.education.map(e => `
            <div class="cred-item">
              <div class="cred-mark">${e.year}</div>
              <div>
                <h4>${e.degree}</h4>
                <span>${e.institution}</span>
                <span>${e.location}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="cred-card reveal-up">
        <h3 class="mono-label" style="display:block;margin-bottom:1.4rem;">Certifications</h3>
        <div class="cred-list">
          ${R.certifications.map(c => `
            <div class="cred-item">
              <div class="cred-mark">✓</div>
              <div>
                <h4>${c.name}</h4>
                <span>${c.issuer}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  })();

  /* ---------------- CONTACT ---------------- */
  (function renderContact() {
    const el = $('contact-panel');
    el.innerHTML = `
      <div class="contact-panel-left">
        <span class="eyebrow reveal-up">Contact</span>
        <h2 class="reveal-up">Let's build the next<br>mission-critical platform.</h2>
        <p class="reveal-up">Open to Senior / Lead .NET Full Stack opportunities. Based in ${R.person.location} — reachable directly by email, phone, or LinkedIn.</p>
        <div class="hero-actions reveal-up">
          <a href="mailto:${R.person.email}" class="btn btn-primary">Email me</a>
          <a href="${R.person.linkedinHref}" target="_blank" rel="noopener" class="btn btn-ghost">Connect on LinkedIn</a>
        </div>
      </div>
      <div class="contact-panel-right">
        <a class="contact-link reveal-up" href="mailto:${R.person.email}">
          <span class="k">Email</span><span class="v">${R.person.email}</span>
        </a>
        <a class="contact-link reveal-up" href="tel:${R.person.phoneHref}">
          <span class="k">Phone</span><span class="v">${R.person.phone}</span>
        </a>
        <a class="contact-link reveal-up" href="${R.person.linkedinHref}" target="_blank" rel="noopener">
          <span class="k">LinkedIn</span><span class="v">${R.person.linkedinLabel}</span>
        </a>
        <div class="contact-link" style="border-bottom:none;">
          <span class="k">Location</span><span class="v">${R.person.location}</span>
        </div>
      </div>
    `;
  })();

  /* ---------------- FOOTER ---------------- */
  (function renderFooter() {
    $('footer-name').textContent = `© ${new Date().getFullYear()} ${R.person.name}`;
    $('footer-links').innerHTML = `
      <a href="mailto:${R.person.email}">${R.person.email}</a> ·
      <a href="${R.person.linkedinHref}" target="_blank" rel="noopener">LinkedIn</a>
    `;
  })();
})();
