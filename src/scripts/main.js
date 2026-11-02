// Motion and interactions. Rules live in DESIGN.md section 10.
// Only transform, opacity and clip-path are animated. Reduced motion never creates the heavy animations.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* Split a heading into line masks. Real text stays in the DOM; the parent carries an aria-label. */
function splitLines(el) {
  const label = el.textContent.replace(/\s+/g, ' ').trim();
  const words = [];
  let glue = false;
  el.childNodes.forEach((node) => {
    const em = node.nodeType === 1 && node.tagName === 'EM';
    (node.textContent.match(/\S+|\s+/g) || []).forEach((t) => {
      if (/^\s+$/.test(t)) { glue = false; words.push(null); return; }
      if (glue && words.length) words[words.length - 1].push({ t, em });
      else words.push([{ t, em }]);
      glue = true;
    });
  });
  const make = (parts) => {
    const w = document.createElement('span');
    w.className = 'w';
    w.style.display = 'inline-block';
    parts.forEach(({ t, em }) => {
      if (em) { const e = document.createElement('em'); e.textContent = t; w.append(e); }
      else w.append(t);
    });
    return w;
  };
  el.textContent = '';
  const nodes = words.map((p) => (p ? make(p) : document.createTextNode(' ')));
  nodes.forEach((n) => el.append(n));
  const rows = [];
  nodes.forEach((n) => {
    if (n.nodeType !== 1) return;
    const top = n.offsetTop;
    const last = rows[rows.length - 1];
    if (last && Math.abs(last.top - top) < 4) last.nodes.push(n);
    else rows.push({ top, nodes: [n] });
  });
  el.textContent = '';
  el.setAttribute('aria-label', label);
  return rows.map(({ nodes: ns }) => {
    const ln = document.createElement('span');
    ln.className = 'ln';
    ln.setAttribute('aria-hidden', 'true');
    const inner = document.createElement('span');
    inner.className = 'ln__in';
    ns.forEach((n, i) => { if (i) inner.append(' '); inner.append(n); });
    ln.append(inner);
    el.append(ln);
    return inner;
  });
}

function splitWords(el) {
  const label = el.textContent.replace(/\s+/g, ' ').trim();
  el.textContent = '';
  el.setAttribute('aria-label', label);
  return label.split(' ').map((word, i, all) => {
    const w = document.createElement('span');
    w.className = 'w';
    w.setAttribute('aria-hidden', 'true');
    w.textContent = word;
    el.append(w);
    if (i < all.length - 1) el.append(' ');
    return w;
  });
}

function runLoader() {
  const loader = $('.loader');
  if (!loader || !root.classList.contains('has-loader')) return Promise.resolve();
  return new Promise((resolve) => {
    const letters = $$('[data-loader-letter]', loader);
    const done = () => { loader.remove(); root.classList.remove('has-loader'); resolve(); };
    const tl = gsap.timeline({ onComplete: done });
    tl.set(letters, { yPercent: 110 })
      .to(letters, { yPercent: 0, duration: 0.45, stagger: 0.03, ease: 'power4.out' })
      .fromTo($('[data-loader-line]', loader), { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: 'power2.inOut' }, 0.1)
      .addLabel('wipe', '+=0.02')
      .to(loader, { yPercent: -100, duration: 0.5, ease: 'expo.inOut' }, 'wipe')
      .call(resolve, null, 'wipe+=0.25');
    const skip = () => tl.timeScale(6);
    addEventListener('pointerdown', skip, { once: true });
    addEventListener('keydown', skip, { once: true });
    setTimeout(done, 4000);
  });
}

function heroIntro(lines) {
  const media = $('[data-hero-media]');
  const img = $('.hero__pic img');
  const h1 = $('[data-hero-title]');
  const fades = $$('[data-hero-fade]');
  const tl = gsap.timeline();
  tl.to(media, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut' }, 0)
    .fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, 0)
    .set(h1, { visibility: 'visible' }, 0.35)
    .fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.08, ease: 'power4.out' }, 0.35)
    .fromTo(fades, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, 0.85)
    .call(() => $('[data-fab]')?.classList.add('is-ready'), null, 1.2);
  return tl;
}

function setupNav() {
  const nav = $('[data-nav]');
  ScrollTrigger.create({ start: 80, end: 'max', toggleClass: { targets: nav, className: 'nav--solid' } });

  const toggle = $('[data-menu-toggle]');
  const menu = $('[data-menu]');
  const fab = $('[data-fab]');
  $$('[data-menu-link]').forEach((a, i) => a.style.setProperty('--i', i));
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('is-open', open);
    menu.inert = !open;
    document.body.classList.toggle('menu-open', open);
    nav.classList.toggle('nav--solid', open || scrollY > 80);
    fab?.classList.toggle('is-hidden', open);
    if (open) $('a', menu)?.focus();
    else if (document.activeElement && menu.contains(document.activeElement)) toggle.focus();
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false); });
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  matchMedia('(min-width: 900px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  // Highlight the header link for the section crossing the upper part of the viewport.
  const spy = $$('[data-nav-links] a').map((a) => ({ a, sec: $(a.getAttribute('href')) })).filter((x) => x.sec);
  if (spy.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        spy.forEach(({ a, sec }) => (sec === en.target ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
      });
      if (scrollY < 200) spy.forEach(({ a }) => a.removeAttribute('aria-current'));
    }, { rootMargin: '-30% 0px -60% 0px' });
    spy.forEach(({ sec }) => io.observe(sec));
  }

  // Floating WhatsApp button steps aside when the contact section (with its own CTA) is on screen.
  const contact = $('[data-contact]');
  if (fab && contact && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => fab.classList.toggle('is-hidden', entry.isIntersecting), { threshold: 0.25 }).observe(contact);
  }
}

function setupReveals() {
  $$('[data-reveal], .process:not(.process--pinned) .step').forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 16 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}

function setupLineReveals(skipHero = true) {
  $$('[data-split]').forEach((el) => {
    if (skipHero && el.hasAttribute('data-hero-title')) return;
    const lines = splitLines(el);
    gsap.from(lines, {
      yPercent: 110, duration: 1, stagger: 0.08, ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });
}

function setupMotion() {
  const mm = gsap.matchMedia();

  // Full motion
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const veil = document.createElement('div');
    veil.style.cssText = 'position:absolute;inset:0;background:var(--ink-950);opacity:0;pointer-events:none';
    $('[data-hero-media]').append(veil);

    gsap.to($('.hero__pic'), { scale: 1.12, yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to(veil, { opacity: 0.65, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('[data-hero-content]', { yPercent: -14, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 30%', scrub: true } });


    $$('[data-scrub-words]').forEach((el) => {
      const words = splitWords(el);
      gsap.fromTo(words, { opacity: 0.18 }, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } });
    });

    // Pinned process: desktop and tall viewports only; stacked cards elsewhere.
    const pin = gsap.matchMedia();
    pin.add('(min-width: 900px) and (min-height: 620px)', () => {
      const section = $('[data-process]');
      section.classList.add('process--pinned');
      const photos = $$('[data-process-photo]');
      const steps = $$('[data-step]');
      const texts = steps.map((s) => $('p', s));
      const imgs = photos.map((p) => $('img', p));
      let active = -1;
      // Text opens and closes with eased tweens; photos are tied to scroll position (below) so a fast
      // scroll can never jump past a step without it being shown.
      const setActive = (i, instant = false) => {
        if (i === active) return;
        active = i;
        steps.forEach((s, n) => s.classList.toggle('is-active', n === i));
        texts.forEach((t, n) => {
          const on = n === i;
          gsap.to(t, { height: on ? 'auto' : 0, opacity: on ? 1 : 0, y: on ? 0 : -6, duration: instant ? 0 : on ? 0.7 : 0.35, delay: instant ? 0 : on ? 0.12 : 0, ease: 'power3.out', overwrite: 'auto' });
        });
      };
      setActive(0, true);
      const n = steps.length;
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section, start: 'top top', end: '+=400%', pin: true, scrub: 1, anticipatePin: 1,
          // Rest on the middle of each step (and the pin's end) so every step gets its moment.
          snap: { snapTo: [...Array.from({ length: n }, (_, k) => (k + 0.5) / n), 1], directional: true, duration: { min: 0.3, max: 0.9 }, delay: 0.08, ease: 'power2.inOut' },
          onUpdate: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * n))),
        },
      });
      tl.to('[data-rail]', { scaleY: 1, duration: n }, 0);
      photos.forEach((p, i) => {
        if (i === 0) return;
        tl.fromTo(p, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.8, ease: 'power2.inOut' }, i - 0.4);
        tl.fromTo(imgs[i], { scale: 1.18, yPercent: 5 }, { scale: 1, yPercent: 0, duration: 1, ease: 'power2.out' }, i - 0.4);
        tl.to(imgs[i - 1], { yPercent: -4, duration: 1, ease: 'power1.out' }, i - 0.4);
      });
      return () => {
        section.classList.remove('process--pinned');
        gsap.killTweensOf([...photos, ...imgs, ...texts]);
        gsap.set([...photos, ...imgs, ...texts], { clearProps: 'all' });
        steps.forEach((s) => s.classList.remove('is-active'));
      };
    });

    // Parallax: desktop only
    mm.add('(min-width: 900px)', () => {
      $$('[data-parallax]').forEach((frame) => {
        const pic = $('picture', frame);
        gsap.fromTo(pic, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    });

    setupLineReveals();
    setupReveals();
    return () => pin.revert();
  });

  // Reduced motion: simple fades only
  mm.add('(prefers-reduced-motion: reduce)', () => {
    $$('[data-reveal], .step').forEach((el) => {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
    $('[data-fab]')?.classList.add('is-ready');
  });

  // Desktop pointer extras: smooth scroll
  mm.add('(min-width: 900px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -80 } });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.destroy();
      gsap.ticker.remove(tick);
    };
  });

  return mm;
}

/* FAQ accordion: animates the native <details>. Height is the one layout property animated here
   (content must push the page); the answer also fades and rises. Interruptible: reversing mid-way
   continues from the current height. */
function setupFaq() {
  const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  $$('.faq details').forEach((d) => {
    const summary = $('summary', d);
    const answer = $('p', d);
    let anim = null;
    let answerAnim = null;

    const run = (opening) => {
      const from = d.offsetHeight;
      anim?.cancel();
      answerAnim?.cancel();
      d.open = true;
      d.style.overflow = 'hidden';
      const closedH = summary.offsetHeight;
      const to = opening ? d.scrollHeight : closedH;
      d.classList.toggle('is-open', opening);
      anim = d.animate(
        { height: [`${from}px`, `${to}px`] },
        { duration: opening ? 320 : 220, easing: ease },
      );
      answerAnim = answer.animate(
        opening
          ? [{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }]
          : [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-4px)' }],
        { duration: opening ? 260 : 140, delay: opening ? 60 : 0, easing: ease, fill: 'both' },
      );
      anim.onfinish = () => {
        d.open = opening;
        d.style.overflow = '';
        anim = answerAnim = null;
        answer.getAnimations().forEach((a) => a.cancel());
        ScrollTrigger.refresh();
      };
      anim.oncancel = () => { d.style.overflow = ''; };
    };

    summary.addEventListener('click', (e) => {
      if (reduced.matches) return;
      e.preventDefault();
      const opening = anim ? !d.classList.contains('is-open') : !d.open;
      run(opening);
    });
  });
}

async function init() {
  setupNav();
  setupFaq();
  const reduce = root.classList.contains('rm');
  const h1 = $('[data-hero-title]');
  if (!reduce) {
    if (document.fonts?.ready) await document.fonts.ready;
    const lines = splitLines(h1);
    gsap.set(lines, { yPercent: 110 });
    setupMotion();
    ScrollTrigger.sort();
    await runLoader();
    heroIntro(lines);
    addEventListener('load', () => ScrollTrigger.refresh());
  } else {
    setupMotion();
  }
  ScrollTrigger.refresh();
}

try {
  init().catch(fail);
} catch (e) {
  fail(e);
}

function fail(e) {
  console.error(e);
  root.classList.remove('js', 'has-loader');
  $('.loader')?.remove();
}
