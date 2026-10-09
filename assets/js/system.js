/* ==========================================================================
   system.js — the Home page, rebuilt as an interactive visualization of a
   production system ("one request, an entire engineering system") instead
   of a conventional resume layout. Self-contained: builds the hero canvas,
   the interactive architecture diagram, and every section below it from
   data/resumeData.js. Every technology/engagement shown here is read
   straight out of that file — nothing is invented.
   Works without GSAP (plain CSS/JS interactivity); GSAP, where available,
   only adds scroll-reveal polish on top.
   ========================================================================== */
(() => {
  'use strict';
  const R = window.RESUME;
  if (!R) return;
  const root = document.getElementById('top');
  if (!root || !root.classList.contains('system-shell')) return; // Home page only

  const $ = (id) => document.getElementById(id);
  const reduceMotion = window.REDUCE_MOTION === true || matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- data helpers (read-only views over resumeData.js) ---------------- */
  const findProject = (id) => R.projects.find((p) => p.id === id);
  const findExperienceFor = (projectId) =>
    R.experience.find((e) => e.engagementRefs.includes(projectId));

  // Matches a technology label against a project's keySkills, contributions
  // and description — loosely enough to bridge version-qualified resume
  // strings ("Angular 8" vs "Angular") and an "AWS X" label against prose
  // that mentions "X" without repeating "AWS" every time, but only ever
  // against text that's already in resumeData.js.
  const bare = (s) => s.toLowerCase().replace(/^aws\s+/, '').trim();
  function projectsUsing(tech) {
    const t = tech.toLowerCase();
    const tBare = bare(tech);
    return R.projects.filter((p) => {
      const inSkills = p.keySkills.some((s) => {
        const sl = s.toLowerCase();
        return sl === t || sl.includes(t) || t.includes(sl);
      });
      const text = (p.description + ' ' + p.contributions.join(' ')).toLowerCase();
      return inSkills || text.includes(t) || (tBare !== t && text.includes(tBare));
    });
  }

  /* ---------------- ARCHITECTURE NODES ---------------- */
  // Positions are percentage coordinates in a 100 x 50 space, shared 1:1 by
  // the SVG viewBox and the HTML node buttons laid on top of it.
  const NODES = [
    {
      id: 'client', tag: 'CLIENT', label: 'Client', x: 8, y: 15,
      blurb: 'Every request starts in the browser — the Angular front-ends end users actually touch.',
      tech: ['Angular', 'TypeScript', 'HTML5', 'CSS3', 'REST APIs'],
      projectId: 'charity',
    },
    {
      id: 'api', tag: 'API', label: 'API', x: 26, y: 15,
      blurb: 'ASP.NET Core REST APIs authenticate and route every request into the system.',
      tech: ['ASP.NET Core', 'C#', 'REST APIs', 'Authentication', 'Authorization'],
      projectId: 'ciam',
    },
    {
      id: 'microservices', tag: 'MICROSERVICES', label: 'Microservices', x: 44, y: 15,
      blurb: 'Business logic runs as independently deployable services — distributed systems, not a monolith.',
      tech: ['Microservices', 'ASP.NET Core', 'C#', 'Entity Framework', 'Distributed Systems'],
      projectId: 'cps',
    },
    {
      id: 'events', tag: 'EVENTS', label: 'Events', x: 62, y: 15,
      blurb: 'Services communicate asynchronously through queues and topics — decoupled and resilient by design.',
      tech: ['SNS/SQS', 'RabbitMQ', 'Event-Driven Architecture'],
      projectId: 'cps',
    },
    {
      id: 'payment', tag: 'PAYMENT', label: 'Payment', x: 80, y: 15,
      blurb: 'The Common Payment System processes transactions across every major Singapore payment rail.',
      tech: ['PayNow', 'GIRO', 'Credit Card', 'DBS', 'eNETS', 'Transaction Processing', 'Reconciliation'],
      projectId: 'cps',
      metric: { value: '30%', label: 'reduction in payment transaction processing latency' },
    },
    {
      id: 'aws', tag: 'AWS', label: 'AWS', x: 80, y: 38,
      blurb: 'Cloud-native infrastructure — compute, storage and secrets, managed end to end on AWS.',
      tech: ['AWS Lambda', 'EC2', 'API Gateway', 'S3', 'RDS', 'AWS Secrets Manager'],
      projectId: 'cps',
    },
    {
      id: 'kubernetes', tag: 'KUBERNETES', label: 'Kubernetes', x: 62, y: 38,
      blurb: 'Containerized services, built with Docker and orchestrated across ECS and EKS.',
      tech: ['Docker', 'Kubernetes', 'AWS ECS/EKS', 'CI/CD'],
      projectId: 'cps',
    },
    {
      id: 'database', tag: 'DATABASE', label: 'Database', x: 44, y: 38,
      blurb: 'Relational data — transactions, user state — persisted and tuned for throughput.',
      tech: ['SQL Server', 'MySQL', 'Entity Framework'],
      projectId: 'underwriting',
    },
    {
      id: 'observability', tag: 'OBSERVABILITY', label: 'Observability', x: 26, y: 38,
      blurb: 'CloudWatch and production support close the loop — every request stays traceable end to end.',
      tech: ['CloudWatch', 'AWS Secrets Manager', 'Production Support'],
      projectId: 'cps',
    },
  ];
  const CONNECTIONS = [
    ['client', 'api'], ['api', 'microservices'], ['microservices', 'events'],
    ['events', 'payment'], ['payment', 'aws'], ['aws', 'kubernetes'],
    ['kubernetes', 'database'], ['database', 'observability'],
  ];

  /* ================= INTERACTIVE ARCHITECTURE ================= */
  function renderArchitecture() {
    const linesEl = $('arch-lines');
    const nodesEl = $('arch-nodes');
    const detailEl = $('arch-detail');
    if (!linesEl || !nodesEl || !detailEl) return;

    const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
    const svgNS = 'http://www.w3.org/2000/svg';

    CONNECTIONS.forEach(([fromId, toId], i) => {
      const a = byId[fromId], b = byId[toId];
      const path = document.createElementNS(svgNS, 'path');
      const d = `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
      path.setAttribute('d', d);
      path.setAttribute('id', `arch-path-${i}`);
      linesEl.appendChild(path);

      if (!reduceMotion) {
        const dot = document.createElementNS(svgNS, 'circle');
        dot.setAttribute('r', '.9');
        dot.setAttribute('class', 'flow-dot');
        const motion = document.createElementNS(svgNS, 'animateMotion');
        motion.setAttribute('dur', '2.6s');
        motion.setAttribute('begin', `${i * 0.35}s`);
        motion.setAttribute('repeatCount', 'indefinite');
        motion.setAttribute('keyPoints', '0;1');
        motion.setAttribute('keyTimes', '0;1');
        const mpath = document.createElementNS(svgNS, 'mpath');
        mpath.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#arch-path-${i}`);
        mpath.setAttribute('href', `#arch-path-${i}`);
        motion.appendChild(mpath);
        dot.appendChild(motion);
        linesEl.appendChild(dot);
      }
    });

    nodesEl.innerHTML = NODES.map((n) => `
      <button type="button" class="arch-node" id="arch-node-${n.id}" style="left:${n.x}%; top:${n.y}%;" aria-expanded="false">
        <span class="arch-node-dot"></span>
        <span class="arch-node-label">${n.label}</span>
      </button>
    `).join('');

    function showIdle() {
      detailEl.innerHTML = `<p class="arch-detail-idle">Hover or tap a node above to trace the request through that part of the system.</p>`;
    }
    function showNode(n) {
      const proj = findProject(n.projectId);
      const exp = proj ? findExperienceFor(proj.id) : null;
      const metricHtml = n.metric
        ? `<div class="arch-detail-metric"><span class="num">${n.metric.value}</span><span class="label">${n.metric.label}</span></div>`
        : '';
      const engagementHtml = proj
        ? `<a class="arch-detail-link" href="#experience">Seen in: ${proj.name}${exp ? ' · ' + exp.org : ''} →</a>`
        : '';
      detailEl.innerHTML = `
        <div class="arch-detail-head">
          <h3>${n.label}</h3>
          <span class="sub">${n.tag}</span>
        </div>
        <p class="arch-detail-blurb">${n.blurb}</p>
        <div class="arch-detail-tech">${n.tech.map((t) => `<span>${t}</span>`).join('')}</div>
        ${metricHtml}
        ${engagementHtml}
      `;
    }
    showIdle();

    let active = null;
    function setActive(id) {
      if (active) {
        $(`arch-node-${active}`)?.classList.remove('active');
        $(`arch-node-${active}`)?.setAttribute('aria-expanded', 'false');
      }
      active = id;
      if (id) {
        $(`arch-node-${id}`)?.classList.add('active');
        $(`arch-node-${id}`)?.setAttribute('aria-expanded', 'true');
        showNode(byId[id]);
      } else {
        showIdle();
      }
    }

    NODES.forEach((n) => {
      const btn = $(`arch-node-${n.id}`);
      if (!btn) return;
      btn.addEventListener('mouseenter', () => setActive(n.id));
      btn.addEventListener('focus', () => setActive(n.id));
      btn.addEventListener('click', () => setActive(active === n.id ? null : n.id));
      btn.addEventListener('mouseleave', () => { if (active === n.id) setActive(null); });
    });
  }

  /* ================= ABOUT — ENGINEER BEHIND THE SYSTEM ================= */
  function renderAbout() {
    const el = $('sys-about');
    if (!el) return;
    const coreEngineering = [...R.skills.core, 'Kubernetes', 'SQL Server'];
    el.innerHTML = `
      <div class="sys-about-card sys-card">
        <h3>Experience</h3>
        <div class="big">${R.stats[0].value}</div>
        <p>${R.stats[0].label} across ${R.stats[1].value} organizations and ${R.stats[2].value} enterprise engagements.</p>
      </div>
      <div class="sys-about-card sys-card">
        <h3>Domains</h3>
        <div class="sys-about-chips">${R.domains.map((d) => `<span>${d}</span>`).join('')}</div>
      </div>
      <div class="sys-about-card sys-card">
        <h3>Core Engineering</h3>
        <div class="sys-about-chips">${coreEngineering.map((s) => `<span>${s}</span>`).join('')}</div>
      </div>
    `;
  }

  /* ================= EXPERIENCE — SYSTEM MODULES ================= */
  function renderModules() {
    const el = $('sys-modules');
    if (!el) return;
    el.innerHTML = R.projects.map((p) => {
      const exp = findExperienceFor(p.id);
      const metricHtml = p.metric
        ? `<div class="sys-module-metric"><span class="num">${p.metric.value}</span><span class="label">${p.metric.label}</span></div>`
        : '';
      return `
        <article class="sys-module sys-card">
          <div class="sys-module-meta">
            <span class="status"><span class="dot"></span>${exp && exp.current ? 'Current' : 'Completed'}</span>
            <h3>${exp ? exp.role : ''}</h3>
            <span class="role">${p.org}</span>
            <span class="org">${p.client}</span>
            <span class="dates">${p.dates}</span>
          </div>
          <div class="sys-module-body">
            <div class="project">Project — ${p.name}</div>
            <p>${p.description}</p>
            <div class="sys-module-stack">
              ${p.keySkills.map((s) => `<span class="${R.skills.core.some((c) => c.toLowerCase() === s.toLowerCase()) ? 'core' : ''}">${s}</span>`).join('')}
            </div>
            ${metricHtml}
          </div>
        </article>
      `;
    }).join('');
  }

  /* ================= PROJECTS — INTERACTIVE CASE STUDIES ================= */
  function renderProjects() {
    const el = $('sys-projects');
    if (!el) return;
    el.innerHTML = R.projects.map((p, i) => {
      const num = String(i + 1).padStart(2, '0');
      const archText = p.architecture
        ? `${p.architecture.channels.join(' · ')} → ${p.architecture.core.label} → ${p.architecture.eventBus.label} → ${p.architecture.data.label} → ${p.architecture.deploy.label}`
        : `${p.keySkills.join(' · ')}`;
      const contribution = p.contributions.slice(0, 3).map((c) => `<li>${c}</li>`).join('');
      const impactHtml = p.metric
        ? `<div class="sys-project-impact"><span class="num">${p.metric.value}</span><span>${p.metric.label}</span></div>`
        : `<p>${p.contributions[p.contributions.length - 1]}</p>`;
      return `
        <div class="sys-project sys-card" id="sys-project-${p.id}">
          <button type="button" class="sys-project-trigger" aria-expanded="false" data-project="${p.id}">
            <span class="index">${num} / ${String(R.projects.length).padStart(2, '0')}</span>
            <h3>${p.name}</h3>
            <span class="client">${p.client} · ${p.dates}</span>
            <span class="toggle-cue">+ Open architecture</span>
          </button>
          <div class="sys-project-panel">
            <div class="sys-project-panel-inner">
              <div class="sys-project-field">
                <span class="k">Problem</span>
                <p class="v">${p.description}</p>
              </div>
              <div class="sys-project-field">
                <span class="k">Architecture</span>
                <p class="v">${archText}</p>
              </div>
              <div class="sys-project-field">
                <span class="k">Technologies</span>
                <div class="sys-project-tech">${p.keySkills.map((s) => `<span>${s}</span>`).join('')}</div>
              </div>
              <div class="sys-project-field">
                <span class="k">Engineering Contribution</span>
                <ul class="v">${contribution}</ul>
              </div>
              <div class="sys-project-field">
                <span class="k">Impact</span>
                ${impactHtml}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    el.querySelectorAll('.sys-project-trigger').forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.sys-project');
        const isOpen = card.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(isOpen));
        btn.querySelector('.toggle-cue').textContent = isOpen ? '− Close architecture' : '+ Open architecture';
      });
    });
  }

  /* ================= SKILLS — TECHNOLOGY CONSTELLATION ================= */
  function renderConstellation() {
    const el = $('sys-constellation');
    const detailEl = $('sys-constellation-detail');
    if (!el || !detailEl) return;

    const GROUPS = [
      { title: 'Backend', items: ['C#', 'ASP.NET Core', '.NET Core', 'Entity Framework', 'REST APIs', 'Microservices', 'WCF', 'SOAP Services'] },
      { title: 'Frontend', items: ['Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3'] },
      { title: 'Cloud', items: ['AWS Lambda', 'EC2', 'AWS ECS/EKS', 'RDS', 'API Gateway', 'AWS Secrets Manager', 'CloudWatch', 'IAM', 'AWS ECR', 'CodeCommit'] },
      { title: 'Messaging', items: ['RabbitMQ', 'SNS/SQS'] },
      { title: 'DevOps', items: ['Docker', 'Kubernetes', 'CI/CD', 'Git'] },
      { title: 'Data', items: ['SQL Server', 'MySQL'] },
      { title: 'Testing', items: ['xUnit', 'Moq', 'Postman', 'Swagger', 'NSwag Studio', 'Visual Studio', 'VS Code'] },
    ];

    el.innerHTML = GROUPS.map((g) => `
      <div class="sys-constellation-group">
        <h4>${g.title}</h4>
        <div class="sys-constellation-items">
          ${g.items.map((t) => `<button type="button" class="sys-tech" data-tech="${t}">${t}</button>`).join('')}
        </div>
      </div>
    `).join('');

    let activeTech = null;
    el.querySelectorAll('.sys-tech').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tech = btn.dataset.tech;
        if (activeTech === tech) {
          activeTech = null;
          el.querySelectorAll('.sys-tech.active').forEach((b) => b.classList.remove('active'));
          detailEl.classList.remove('visible');
          return;
        }
        activeTech = tech;
        el.querySelectorAll('.sys-tech.active').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const matches = projectsUsing(tech);
        detailEl.classList.add('visible');
        if (matches.length === 0) {
          detailEl.innerHTML = `<div class="label">${tech}</div><p>Part of Gayatri's core toolkit, applied across engagements alongside the stack above.</p>`;
        } else {
          detailEl.innerHTML = `
            <div class="label">${tech} — used on</div>
            ${matches.map((p) => {
              const exp = findExperienceFor(p.id);
              return `
                <div class="engagement">
                  <span class="name">${p.name}</span>
                  <span class="org">${p.client}${exp ? ' · ' + exp.org : ''}</span>
                </div>
              `;
            }).join('')}
          `;
        }
      });
    });
  }

  /* ================= CERTIFICATIONS — SYSTEM BADGES ================= */
  function renderBadges() {
    const el = $('sys-badges');
    if (!el) return;
    el.innerHTML = R.certifications.map((c) => `
      <div class="sys-badge sys-card">
        <span class="sys-badge-mark"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 12.5 9.5 18 20 6"/></svg></span>
        <div>
          <h3>${c.name}</h3>
          <span>${c.issuer}</span>
        </div>
      </div>
    `).join('');
  }

  /* ================= FINAL — CONTACT LINKS ================= */
  function renderFinalLinks() {
    const el = $('sys-final-links');
    if (!el) return;
    el.innerHTML = `
      <a href="${R.person.linkedinHref}" target="_blank" rel="noopener">LinkedIn</a>
      <a href="mailto:${R.person.email}">${R.person.email}</a>
      <a href="contact.html">Full Contact Page →</a>
    `;
  }

  /* ================= HERO CANVAS — node network + one traveling request ================= */
  function initHeroCanvas() {
    const canvas = $('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, DPR, nodes, pulses, requestDot, gridT = 0, frame = 0, raf;

    function build() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      nodes = Array.from({ length: 36 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.14, vy: (Math.random() - 0.5) * 0.14,
        r: 1.3 + Math.random() * 1.5,
      }));
      pulses = [];
      requestDot = { t: 0, speed: 0.0028 };
    }
    build();
    let resizeTimer;
    window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(build, 200); });

    // A perspective grid floor converging to a vanishing point on the
    // horizon — the "flying through a live cloud architecture" read the
    // reference video established, rather than a flat field of dots.
    function drawGridFloor(t) {
      const horizonY = H * 0.56;
      const vanishX = W * 0.5;
      ctx.save();
      ctx.strokeStyle = 'rgba(124,241,255,1)';
      ctx.lineWidth = 1;
      const spread = 16;
      for (let i = -spread; i <= spread; i++) {
        const xBottom = vanishX + i * (W / spread) * 1.15;
        ctx.globalAlpha = 0.07 + 0.03 * (1 - Math.abs(i) / spread);
        ctx.beginPath();
        ctx.moveTo(vanishX, horizonY);
        ctx.lineTo(xBottom, H + 60);
        ctx.stroke();
      }
      const rows = 9;
      for (let j = 0; j < rows; j++) {
        const f = (j + (t % 1)) / rows;
        const y = horizonY + Math.pow(f, 2.3) * (H - horizonY + 80);
        if (y > H + 10) continue;
        ctx.globalAlpha = Math.max(0, 0.16 * (1 - f * 0.6));
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      const glow = ctx.createLinearGradient(vanishX - 340, 0, vanishX + 340, 0);
      glow.addColorStop(0, 'rgba(34,229,255,0)');
      glow.addColorStop(0.5, 'rgba(124,241,255,.4)');
      glow.addColorStop(1, 'rgba(34,229,255,0)');
      ctx.globalAlpha = 1;
      ctx.fillStyle = glow;
      ctx.fillRect(vanishX - 340, horizonY - 1, 680, 1.5);
      ctx.restore();
    }

    function drawStatic() {
      ctx.clearRect(0, 0, W, H);
      drawGridFloor(0.4);
      const maxDist = 170;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < maxDist) {
            ctx.strokeStyle = `rgba(34,229,255,${(1 - d / maxDist) * 0.16})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      nodes.forEach((n) => {
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34,229,255,0.55)'; ctx.fill();
      });
    }

    if (reduceMotion) { drawStatic(); return; }

    // A single bright "request" loops along a gentle path across the hero,
    // visually distinct (brighter, with a trailing glow) from the ambient
    // node network behind it — "one request, one system."
    function requestPos(t) {
      const x = W * (0.08 + 0.84 * t);
      const y = H * (0.5 + 0.14 * Math.sin(t * Math.PI * 2.2));
      return { x, y };
    }

    function tick() {
      frame++;
      ctx.clearRect(0, 0, W, H);
      gridT += 0.0016;
      drawGridFloor(gridT);
      const maxDist = 170;
      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < maxDist) {
            ctx.strokeStyle = `rgba(34,229,255,${(1 - d / maxDist) * 0.16})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            if (frame % 260 === (i * 7 + j) % 260) pulses.push({ a, b, t: 0 });
          }
        }
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]; p.t += 0.018;
        if (p.t >= 1) { pulses.splice(i, 1); continue; }
        const px = p.a.x + (p.b.x - p.a.x) * p.t, py = p.a.y + (p.b.y - p.a.y) * p.t;
        ctx.beginPath(); ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(124,241,255,0.8)'; ctx.fill();
      }
      nodes.forEach((n) => {
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34,229,255,0.55)'; ctx.fill();
      });

      requestDot.t += requestDot.speed;
      if (requestDot.t > 1) requestDot.t = 0;
      const pos = requestPos(requestDot.t);
      const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 34);
      grad.addColorStop(0, 'rgba(124,241,255,.55)');
      grad.addColorStop(1, 'rgba(124,241,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(pos.x, pos.y, 34, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(pos.x, pos.y, 3.4, 0, Math.PI * 2);
      ctx.fillStyle = '#eaffff'; ctx.fill();

      raf = requestAnimationFrame(tick);
    }
    tick();
  }

  /* ================= FINAL CANVAS — the system collapsing back to one point ================= */
  function initFinalCanvas() {
    const canvas = $('finalCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, DPR, particles, raf;

    function build() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      particles = Array.from({ length: 70 }, () => spawnParticle());
    }
    function spawnParticle() {
      const angle = Math.random() * Math.PI * 2;
      const dist = 0.38 + Math.random() * 0.22;
      return {
        angle, dist, t: Math.random(),
        speed: 0.0016 + Math.random() * 0.0014,
        r: 0.8 + Math.random() * 1.2,
      };
    }
    build();
    let resizeTimer;
    window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(build, 200); });

    function drawStatic() {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#7cf1ff'; ctx.fill();
    }
    if (reduceMotion) { drawStatic(); return; }

    function tick() {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      const maxR = Math.min(W, H) * 0.55;
      particles.forEach((p) => {
        p.t += p.speed;
        if (p.t >= 1) Object.assign(p, spawnParticle(), { t: 0 });
        const r = maxR * p.dist * (1 - p.t);
        const x = cx + Math.cos(p.angle) * r, y = cy + Math.sin(p.angle) * r;
        ctx.beginPath(); ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124,241,255,${0.15 + 0.55 * p.t})`;
        ctx.fill();
      });
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 26);
      grad.addColorStop(0, 'rgba(124,241,255,.7)');
      grad.addColorStop(1, 'rgba(124,241,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(cx, cy, 26, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#eaffff'; ctx.fill();
      raf = requestAnimationFrame(tick);
    }
    tick();
  }

  /* ================= SCROLL REVEALS (progressive enhancement over GSAP) ================= */
  function wireScrollReveals() {
    const gsapReady = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
    if (reduceMotion || !gsapReady) {
      // animations.js's own fallback already forces every .reveal-up to
      // opacity:1 in this case; this is just a defensive second pass in
      // case this file ever runs standalone.
      document.querySelectorAll('.sys-hero .reveal-up').forEach((el) => {
        el.style.opacity = '1'; el.style.transform = 'none';
      });
      return;
    }
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .fromTo('.sys-hero .reveal-up', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.2)
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
    gsap.utils.toArray('.arch-diagram, .sys-about, .sys-modules, .sys-projects, .sys-constellation, .sys-badges').forEach((el) => {
      gsap.fromTo(el, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      });
    });
    gsap.fromTo('.sys-final-content', { opacity: 0, y: 20 }, {
      opacity: 1, y: 0, duration: 1,
      scrollTrigger: { trigger: '.sys-final', start: 'top 70%', toggleActions: 'play none none none' },
    });
  }

  renderArchitecture();
  renderAbout();
  renderModules();
  renderProjects();
  renderConstellation();
  renderBadges();
  renderFinalLinks();
  initHeroCanvas();
  initFinalCanvas();
  wireScrollReveals();
})();
