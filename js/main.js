/* =====================================================================
   FC DISHWASHER — Main script
   1. Render content from js/data.js
   2. Smooth scroll (Lenis) + GSAP ScrollTrigger
   3. Preloader → Hero intro
   4. Navigation, menu, cursor, magnetic buttons
   5. Scroll effects: reveals, word scrub, counters, marquee,
      horizontal squad, theme switch, formation, parallax
   ===================================================================== */
(function () {
  'use strict';

  const D = window.FCD || {};
  const club = D.club || {};
  const links = D.links || {};
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  const hasST = hasGSAP && typeof window.ScrollTrigger !== 'undefined';
  const hasSplit = hasGSAP && typeof window.SplitText !== 'undefined';
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

  if (hasST) gsap.registerPlugin(ScrollTrigger);
  if (hasSplit) gsap.registerPlugin(SplitText);
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  /* =====================================================================
     1. CONTENT
     ===================================================================== */
  const POS_GROUPS = [
    { label: 'Torhüter', pos: ['TW'] },
    { label: 'Abwehr', pos: ['IV', 'LV', 'RV'] },
    { label: 'Mittelfeld', pos: ['ZDM', 'ZM', 'ZOM', 'LM', 'RM'] },
    { label: 'Sturm', pos: ['LA', 'RA', 'ST'] }
  ];
  const ATTR_NAMES = ['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY'];

  function renderStats() {
    const ul = $('#stats');
    if (!ul || !D.stats) return;
    ul.innerHTML = D.stats.map((s) => `
      <li class="stat" data-reveal>
        <span class="stat__value" data-count="${Number(s.value) || 0}">0</span>
        <span class="stat__label mono">${esc(s.label)}</span>
      </li>`).join('');
  }

  function renderSquad() {
    const track = $('#squad-track');
    if (!track || !D.squad) return;
    const frag = document.createDocumentFragment();
    POS_GROUPS.forEach((group) => {
      const players = D.squad.filter((p) => group.pos.includes(p.pos));
      if (!players.length) return;
      const g = document.createElement('div');
      g.className = 'kader__group';
      g.innerHTML = `<span class="kader__group-label mono">${esc(group.label)} <i>·</i> ${players.length}</span>
        <div class="kader__cards">${players.map(cardHTML).join('')}</div>`;
      frag.appendChild(g);
    });
    track.appendChild(frag);
  }

  function cardHTML(p) {
    const attrs = (p.attrs || []).slice(0, 6).map((v, i) => `
      <div class="card__attr" style="--v:${Math.max(0, Math.min(99, Number(v) || 0)) / 99}">
        <b>${esc(v)}</b><span>${ATTR_NAMES[i]}</span><i></i>
      </div>`).join('');
    return `
      <article class="card" data-pos="${esc(p.pos)}" aria-label="${esc(p.name)}, ${esc(p.pos)}, Gesamtwertung ${esc(p.rating)}">
        <span class="card__number" aria-hidden="true">${esc(p.number)}</span>
        <div class="card__top">
          <span class="card__rating">${esc(p.rating)}</span>
          <span class="card__pos mono">${esc(p.pos)}</span>
        </div>
        <svg class="card__jersey" viewBox="0 0 24 24" aria-hidden="true">
          <use href="#icon-jersey"/><text x="12" y="17" text-anchor="middle" font-size="8">${esc(p.number)}</text>
        </svg>
        <h3 class="card__name">${esc(p.name)}${p.captain ? '<span class="card__captain" title="Kapitän">C</span>' : ''}</h3>
        <div class="card__attrs">${attrs}</div>
      </article>`;
  }

  function fmtDate(d, withTime) {
    try {
      const day = new Intl.DateTimeFormat('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' }).format(d);
      if (!withTime) return day;
      const time = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' }).format(d);
      return `${day} · ${time} Uhr`;
    } catch (e) { return ''; }
  }

  function renderMatches() {
    const nm = D.nextMatch;
    if (nm) {
      const d = new Date(nm.date);
      const valid = !isNaN(d.getTime());
      const setText = (id, v) => { const el = $(id); if (el) el.textContent = v; };
      setText('#nm-opponent', nm.opponent || '—');
      setText('#nm-competition', nm.competition || '—');
      setText('#nm-date', valid ? fmtDate(d, true) : 'Termin folgt');
      setText('#nm-venue', nm.venue || '');
      setText('#hero-next-opp', `vs. ${nm.opponent || '—'}`);
      setText('#hero-next-date', valid ? `${fmtDate(d, true)} · ${nm.competition || ''}`.replace(/ · $/, '') : 'Termin folgt');
      if (valid) startCountdown(d);
    }
    const list = $('#results');
    const form = $('#form');
    if (list && D.results) {
      list.innerHTML = D.results.map((r) => `
        <li class="result" data-reveal>
          <span class="result__date mono">${esc(r.date)}</span>
          <div>
            <span class="result__opp">${esc(r.opponent)}</span>
            <span class="result__comp mono">${esc(r.competition)}${r.venue ? ' · ' + esc(r.venue) : ''}</span>
          </div>
          <span class="result__score">${esc(r.home)}:${esc(r.away)}${r.note ? `<small>${esc(r.note)}</small>` : ''}</span>
          <span class="result__badge" data-r="${esc(r.result)}" title="${{ S: 'Sieg', U: 'Unentschieden', N: 'Niederlage' }[r.result] || ''}">${esc(r.result)}</span>
        </li>`).join('');
      if (form) form.innerHTML = D.results.slice(0, 5).reverse().map((r) => `<span data-r="${esc(r.result)}"></span>`).join('');
    }
  }

  function startCountdown(target) {
    const box = $('#countdown');
    if (!box) return;
    const cells = {};
    $$('[data-cd]', box).forEach((el) => { cells[el.dataset.cd] = el; });
    const pad = (n) => String(Math.max(0, n)).padStart(2, '0');
    const tick = () => {
      let diff = target.getTime() - Date.now();
      if (diff <= 0) {
        if (diff > -3 * 3600 * 1000) { box.innerHTML = '<div class="countdown__unit countdown__unit--live"><span class="countdown__value">LIVE</span><span class="mono">Spiel läuft</span></div>'; }
        else { box.innerHTML = '<div class="countdown__unit"><span class="countdown__value">—</span><span class="mono">Termin folgt</span></div>'; }
        box.style.gridTemplateColumns = '1fr';
        return;
      }
      diff = Math.floor(diff / 1000);
      const dd = Math.floor(diff / 86400), hh = Math.floor((diff % 86400) / 3600), mm = Math.floor((diff % 3600) / 60), ss = diff % 60;
      cells.d.textContent = pad(dd); cells.h.textContent = pad(hh); cells.m.textContent = pad(mm); cells.s.textContent = pad(ss);
      setTimeout(tick, 1000 - (Date.now() % 1000));
    };
    tick();
  }

  function renderPositions() {
    const ul = $('#open-positions');
    if (!ul || !D.openPositions) return;
    ul.innerHTML = D.openPositions.map((p) => `<li class="chip">${esc(p)}</li>`).join('');
  }

  function renderSocial() {
    const box = $('#footer-social');
    if (!box) return;
    const names = { twitch: 'Twitch', youtube: 'YouTube', instagram: 'Instagram', tiktok: 'TikTok', x: 'X' };
    Object.keys(names).forEach((k) => {
      if (!links[k]) return;
      const a = document.createElement('a');
      a.href = links[k]; a.target = '_blank'; a.rel = 'noopener'; a.textContent = names[k];
      box.appendChild(a);
    });
  }

  function renderFacts() {
    const set = (id, v) => { const el = $(id); if (el && v) el.textContent = v; };
    set('#fact-league', club.league);
    set('#fact-training', club.training);
    set('#fact-matchdays', club.matchdays);
    const y = $('#year'); if (y) y.textContent = String(new Date().getFullYear());
  }

  /* Formation graphic (SVG pitch) */
  const FORMATIONS = {
    '4-3-3': [[340, 925], [110, 760], [255, 785], [425, 785], [570, 760], [190, 585], [340, 615], [490, 585], [120, 340], [340, 295], [560, 340]],
    '4-2-3-1': [[340, 925], [110, 760], [255, 785], [425, 785], [570, 760], [250, 640], [430, 640], [130, 430], [340, 450], [550, 430], [340, 270]],
    '4-4-2': [[340, 925], [110, 760], [255, 785], [425, 785], [570, 760], [110, 560], [255, 590], [425, 590], [570, 560], [250, 320], [430, 320]],
    '3-5-2': [[340, 925], [170, 780], [340, 800], [510, 780], [80, 560], [230, 600], [340, 640], [450, 600], [600, 560], [250, 320], [430, 320]],
    '3-4-3': [[340, 925], [170, 780], [340, 800], [510, 780], [110, 570], [250, 610], [430, 610], [570, 570], [130, 340], [340, 290], [550, 340]]
  };
  let pitchPlayers = [];

  function renderPitch() {
    const svg = $('#pitch');
    if (!svg || !D.squad) return;
    const ns = 'http://www.w3.org/2000/svg';
    const el = (tag, attrs, parent) => {
      const e = document.createElementNS(ns, tag);
      Object.keys(attrs).forEach((k) => e.setAttribute(k, attrs[k]));
      (parent || svg).appendChild(e);
      return e;
    };
    el('rect', { class: 'pitch__grass', x: 20, y: 20, width: 640, height: 960, rx: 4 });
    const g = el('g', {});
    const line = (attrs, tag) => el(tag || 'path', Object.assign({ class: 'pitch__line' }, attrs), g);
    line({ x: 20, y: 20, width: 640, height: 960, rx: 4 }, 'rect');
    line({ d: 'M20 500H660' });
    line({ cx: 340, cy: 500, r: 90 }, 'circle');
    line({ cx: 340, cy: 500, r: 3 }, 'circle');
    line({ x: 140, y: 20, width: 400, height: 160 }, 'rect');
    line({ x: 140, y: 820, width: 400, height: 160 }, 'rect');
    line({ x: 250, y: 20, width: 180, height: 55 }, 'rect');
    line({ x: 250, y: 925, width: 180, height: 55 }, 'rect');
    line({ cx: 340, cy: 130, r: 3 }, 'circle');
    line({ cx: 340, cy: 870, r: 3 }, 'circle');
    line({ d: 'M265 180A90 90 0 0 0 415 180' });
    line({ d: 'M265 820A90 90 0 0 1 415 820' });
    line({ d: 'M20 40A20 20 0 0 0 40 20M640 20A20 20 0 0 0 660 40M660 960A20 20 0 0 0 640 980M40 980A20 20 0 0 0 20 960' });

    const formation = D.formation || {};
    const spots = FORMATIONS[formation.name] || FORMATIONS['4-3-3'];
    const nameEl = $('#formation-name'); if (nameEl) nameEl.textContent = formation.name || '4-3-3';
    const byNumber = {}; D.squad.forEach((p) => { byNumber[p.number] = p; });
    const lineup = (formation.lineup || []).slice(0, 11);
    pitchPlayers = lineup.map((num, i) => {
      const p = byNumber[num] || { number: num, name: '' };
      const pg = el('g', { class: 'pitch__player' + (p.captain ? ' is-captain' : '') });
      el('circle', { r: 26, cx: 0, cy: 0 }, pg);
      const t = el('text', { x: 0, y: 8, 'font-size': 24 }, pg); t.textContent = p.number;
      const n = el('text', { class: 'pitch__name', x: 0, y: 52 }, pg); n.textContent = p.name;
      const [tx, ty] = spots[i] || [340, 500];
      const sx = 80 + (i / 10) * 520, sy = 1010;
      return { el: pg, sx, sy, tx, ty };
    });
    /* Without GSAP: place players in formation immediately */
    pitchPlayers.forEach((p) => p.el.setAttribute('transform', `translate(${hasST ? p.sx : p.tx} ${hasST ? p.sy : p.ty})`));
  }

  function wrapLines() {
    $$('[data-split-lines]').forEach((el) => {
      const parts = el.innerHTML.split(/<br\s*\/?>/i).map((s) => s.trim()).filter(Boolean);
      el.innerHTML = parts.map((t) => `<span class="t-line"><span class="t-line__inner">${t}</span></span>`).join('');
    });
  }

  renderStats();
  renderSquad();
  renderMatches();
  renderPositions();
  renderSocial();
  renderFacts();
  renderPitch();
  wrapLines();

  /* =====================================================================
     2. SMOOTH SCROLL
     ===================================================================== */
  let lenis = null;
  if (typeof window.Lenis !== 'undefined' && hasGSAP && !reduced) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true, syncTouch: false });
    lenis.on('scroll', () => { if (hasST) ScrollTrigger.update(); });
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  function scrollToTarget(target) {
    const el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const el = $(id);
    if (!el) return;
    e.preventDefault();
    closeMenu();
    scrollToTarget(el);
    history.replaceState(null, '', id);
  });

  /* =====================================================================
     3. NAVIGATION + MENU
     ===================================================================== */
  const nav = $('#nav');
  const burger = $('#burger');
  const menu = $('#menu');
  let menuOpen = false;
  let lastY = 0;

  function onScrollNav() {
    const y = window.scrollY;
    if (!nav) return;
    nav.classList.toggle('nav--scrolled', y > 40);
    if (!menuOpen) {
      if (y > lastY + 8 && y > 180) nav.classList.add('nav--hidden');
      else if (y < lastY - 8) nav.classList.remove('nav--hidden');
    }
    lastY = y;
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });

  function openMenu() {
    if (!menu || menuOpen) return;
    menuOpen = true;
    menu.classList.add('menu--open');
    menu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Menü schließen');
    nav.classList.remove('nav--hidden');
    if (lenis) lenis.stop(); else document.documentElement.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (!menu || !menuOpen) return;
    menuOpen = false;
    menu.classList.remove('menu--open');
    menu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Menü öffnen');
    if (lenis) lenis.start(); else document.documentElement.style.overflow = '';
  }
  if (burger) burger.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); }, { passive: true });

  /* =====================================================================
     4. CURSOR + MAGNETIC + CARD TILT
     ===================================================================== */
  const cursor = $('#cursor');
  if (cursor && fine && !reduced && hasGSAP) {
    document.body.classList.add('has-cursor');
    const dot = $('.cursor__dot', cursor), ring = $('.cursor__ring', cursor), label = $('#cursor-label');
    const dx = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
    const dy = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
    const rx = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' });
    const ry = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });
    cursor.classList.add('cursor--hidden');
    window.addEventListener('pointermove', (e) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      cursor.classList.remove('cursor--hidden');
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => cursor.classList.add('cursor--hidden'));
    document.addEventListener('mouseover', (e) => {
      const t = e.target.closest('a, button, .card, .result, .principle');
      const l = e.target.closest('[data-cursor]');
      cursor.classList.toggle('cursor--hover', !!t);
      if (l && !t) { label.textContent = l.dataset.cursor; cursor.classList.add('cursor--label'); }
      else cursor.classList.remove('cursor--label');
    });
  }

  if (fine && !reduced && hasGSAP) {
    $$('.magnetic').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.35);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
      });
      el.addEventListener('mouseleave', () => { gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.4)' }); });
    });
  }

  if (fine && !reduced) {
    $$('.card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--ty', `${(px - 0.5) * 16}deg`);
        card.style.setProperty('--tx', `${(0.5 - py) * 16}deg`);
        card.style.setProperty('--gx', `${px * 100}%`);
        card.style.setProperty('--gy', `${py * 100}%`);
      });
      card.addEventListener('mouseleave', () => { card.style.setProperty('--tx', '0deg'); card.style.setProperty('--ty', '0deg'); });
    });
  }

  /* Attribute bars fill when a card becomes visible (works for pinned and native horizontal scroll) */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-inview'); io.unobserve(en.target); } });
    }, { threshold: 0.35 });
    $$('.card').forEach((c) => io.observe(c));
  } else {
    $$('.card').forEach((c) => c.classList.add('is-inview'));
  }

  /* =====================================================================
     5. PRELOADER + HERO INTRO
     ===================================================================== */
  const fontsReady = (document.fonts && document.fonts.ready) ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]) : Promise.resolve();
  fontsReady.then(initMotion);

  function initMotion() {
  const pre = $('#preloader');
  const heroChars = { outline: [], solid: [] };

  if (hasSplit) {
    try {
      const so = new SplitText('.hero__outline', { type: 'chars', charsClass: 'char', tag: 'span' });
      const ss = new SplitText('.hero__solid', { type: 'chars', charsClass: 'char', tag: 'span' });
      heroChars.outline = so.chars; heroChars.solid = ss.chars;
    } catch (e) { /* keep unsplit text */ }
  }
  const allChars = heroChars.outline.concat(heroChars.solid);

  const introEls = ['.hero__motto', '.hero__cta', '.hero__next'];
  function heroIntro() {
    if (!hasGSAP) return null;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from(['.nav__brand', '.nav__links a', '.nav__actions'], { y: -24, opacity: 0, duration: 1.1, stagger: 0.05 }, 0);
    if (allChars.length) {
      tl.to(allChars, { yPercent: 0, rotate: 0, duration: 1.4, stagger: { each: 0.035, from: 'start' } }, 0.05);
    } else {
      tl.from('.hero__title', { y: 60, opacity: 0, duration: 1.2 }, 0.05);
    }
    tl.to('.hero__meta', { y: 0, opacity: 1, duration: 1, stagger: 0.1 }, 0.5);
    tl.to(introEls, { y: 0, opacity: 1, duration: 1.2, stagger: 0.1 }, 0.7);
    tl.to('.hero__scroll', { opacity: 1, duration: 1 }, 1.2);
    return tl;
  }

  if (hasGSAP && pre && !reduced) {
    if (allChars.length) gsap.set(allChars, { yPercent: 115, rotate: 4 });
    gsap.set('.hero__meta', { opacity: 0, y: 14 });
    gsap.set(introEls, { opacity: 0, y: 30 });
    gsap.set('.hero__scroll', { opacity: 0 });
    if (lenis) lenis.stop();
    const count = $('#preloader-count'), bar = $('#preloader-bar');
    const state = { v: 0 };
    const tl = gsap.timeline({ delay: 0.15 });
    tl.from('.preloader__crest', { scale: 0.85, opacity: 0, duration: 1, ease: 'expo.out' }, 0)
      .from('.preloader__label', { y: 10, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.2)
      .to(state, {
        v: 100, duration: 1.7, ease: 'power2.inOut',
        onUpdate: () => { count.textContent = String(Math.round(state.v)).padStart(2, '0'); bar.style.width = state.v + '%'; }
      }, 0.1)
      .to(['.preloader__inner', '.preloader__count'], { yPercent: -30, opacity: 0, duration: 0.55, ease: 'power3.in', stagger: 0.04 }, '-=0.05')
      .to(pre, { yPercent: -100, duration: 1.05, ease: 'expo.inOut' }, '-=0.3')
      .add(() => { if (lenis) lenis.start(); pre.remove(); if (hasST) ScrollTrigger.refresh(); }, '-=0.3')
      .add(heroIntro(), '-=0.75');
  } else {
    if (pre) pre.remove();
    if (allChars.length) gsap && gsap.set(allChars, { yPercent: 0 });
  }

  /* =====================================================================
     6. SCROLL EFFECTS
     ===================================================================== */
  if (hasST && !reduced) {
    /* Hero parallax + fade */
    gsap.to('.hero__content', { yPercent: 30, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__bottom', { yPercent: 12, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: '70% top', scrub: true } });
    gsap.to('.hero__canvas', { scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    /* Section heads: line + label */
    $$('.section__head').forEach((h) => {
      ScrollTrigger.create({ trigger: h, start: 'top 88%', once: true, onEnter: () => h.classList.add('is-in') });
    });

    /* Line reveals for titles */
    $$('[data-split-lines]').forEach((el) => {
      const inner = $$('.t-line__inner', el);
      gsap.set(inner, { yPercent: 110, rotate: 2 });
      gsap.to(inner, { yPercent: 0, rotate: 0, duration: 1.3, ease: 'expo.out', stagger: 0.09, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    });

    /* Generic reveals in batches */
    const revealEls = $$('[data-reveal]');
    gsap.set(revealEls, { y: 34, opacity: 0 });
    ScrollTrigger.batch(revealEls, {
      start: 'top 90%', once: true,
      onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: 1.15, ease: 'expo.out', stagger: 0.09, overwrite: true })
    });

    /* Statement: word-by-word scrub */
    $$('[data-scrub-words]').forEach((el) => {
      let words = [];
      if (hasSplit) {
        try { words = new SplitText(el, { type: 'words', wordsClass: 'word', tag: 'span' }).words; } catch (e) { words = []; }
      }
      if (!words.length) return;
      gsap.fromTo(words, { opacity: 0.12 }, { opacity: 1, ease: 'none', stagger: 0.04, scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 45%', scrub: 0.6 } });
    });

    /* Counters */
    $$('[data-count]').forEach((el) => {
      const target = Number(el.dataset.count) || 0;
      const state = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: 'top 88%', once: true,
        onEnter: () => gsap.to(state, { v: target, duration: 2.2, ease: 'expo.out', onUpdate: () => { el.textContent = Math.round(state.v).toLocaleString('de-DE'); } })
      });
    });

    /* Parallax watermarks */
    $$('[data-parallax]').forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.15;
      gsap.fromTo(el, { yPercent: 25 * speed * 4 }, { yPercent: -25 * speed * 4, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    /* Marquee: infinite loop, speed follows scroll velocity */
    const track = $('#marquee-track');
    if (track) {
      const group = $('.marquee__group', track);
      for (let i = 0; i < 3; i++) track.appendChild(group.cloneNode(true));
      const loop = gsap.to(track, { xPercent: -25, ease: 'none', duration: 28, repeat: -1 });
      let velocity = 0, current = 1;
      const src = lenis ? (cb) => lenis.on('scroll', (l) => cb(l.velocity)) : (cb) => window.addEventListener('scroll', () => cb(0), { passive: true });
      src((v) => { velocity = v; });
      gsap.ticker.add(() => {
        const targetScale = 1 + Math.min(Math.abs(velocity) / 40, 5);
        const dir = velocity < -0.5 ? -1 : 1;
        current += ((targetScale * dir) - current) * 0.06;
        loop.timeScale(current);
        velocity *= 0.9;
      });
    }

    /* Horizontal squad (desktop) */
    ScrollTrigger.matchMedia({
      '(min-width: 1024px)': () => {
        const sTrack = $('#squad-track');
        const kader = $('#kader');
        if (!sTrack || !kader) return;
        const amount = () => Math.max(0, sTrack.scrollWidth - window.innerWidth);
        gsap.to(sTrack, {
          x: () => -amount(), ease: 'none',
          scrollTrigger: { trigger: kader, start: 'top top', end: () => '+=' + amount(), pin: true, scrub: 0.9, invalidateOnRefresh: true, anticipatePin: 1 }
        });
        sTrack.setAttribute('data-cursor', 'Scrollen');
      }
    });

    /* Theme: light for the philosophy chapter */
    const meta = $('meta[name="theme-color"]');
    const setTheme = (t) => { document.body.dataset.theme = t; if (meta) meta.content = t === 'light' ? '#f1f0eb' : '#08090b'; };
    ScrollTrigger.create({
      trigger: '#philosophie', start: 'top 60%', end: 'bottom 40%',
      onEnter: () => setTheme('light'), onEnterBack: () => setTheme('light'),
      onLeave: () => setTheme('dark'), onLeaveBack: () => setTheme('dark')
    });

    /* Formation: players walk into position while scrolling */
    if (pitchPlayers.length) {
      const tl = gsap.timeline({ scrollTrigger: { trigger: '#pitch-wrap', start: 'top 85%', end: 'top 20%', scrub: 1.2 } });
      pitchPlayers.forEach((p, i) => {
        tl.fromTo(p.el, { x: p.sx, y: p.sy, opacity: 0.4 }, { x: p.tx, y: p.ty, opacity: 1, ease: 'power2.inOut', duration: 1 }, i * 0.06);
      });
    }

    /* Active nav link */
    $$('main section[id]').forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec, start: 'top 50%', end: 'bottom 50%',
        onToggle: (self) => { if (self.isActive) $$('[data-nav]').forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + sec.id)); }
      });
    });

    /* CTA title scale-in */
    gsap.from('.cta__inner', { scale: 0.92, opacity: 0, ease: 'power2.out', scrollTrigger: { trigger: '#discord', start: 'top 80%', end: 'top 20%', scrub: true } });

    /* Refresh after fonts + images settle */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener('load', () => ScrollTrigger.refresh());
  } else {
    /* No animation: make sure everything is visible and the formation is set */
    $$('.section__head').forEach((h) => h.classList.add('is-in'));
    $$('[data-count]').forEach((el) => { el.textContent = (Number(el.dataset.count) || 0).toLocaleString('de-DE'); });
    $$('.card').forEach((c) => c.classList.add('is-inview'));
    pitchPlayers.forEach((p) => p.el.setAttribute('transform', `translate(${p.tx} ${p.ty})`));
    const track = $('#marquee-track');
    if (track) { const group = $('.marquee__group', track); for (let i = 0; i < 3; i++) track.appendChild(group.cloneNode(true)); track.style.animation = 'marqueeFallback 40s linear infinite'; }
  }
  } /* initMotion */
})();
