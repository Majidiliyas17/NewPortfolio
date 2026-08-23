/* ---------- Scroll reveal ---------- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

/* ---------- Cursor glow ---------- */
const glow = document.querySelector('.cursor-glow');
if (window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  });
} else {
  glow.style.display = 'none';
}

/* ---------- Nav: scrolled border + progress bar ---------- */
const nav = document.querySelector('.nav');
const progress = document.getElementById('progress');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 12);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
}, { passive: true });

/* ---------- Mobile menu ---------- */
const toggle = document.getElementById('nav-toggle');
const links = document.getElementById('nav-links');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
});
links.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  })
);

/* ---------- Active section highlighting ---------- */
const sections = [...document.querySelectorAll('section[id]')];
const linkFor = (id) => document.querySelector(`.nav-links a[href="#${id}"]`);
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 140) current = section.id;
  });
  sections.forEach((section) => {
    const link = linkFor(section.id);
    if (link) link.classList.toggle('active', section.id === current);
  });
}, { passive: true });

/* ---------- Subtle portrait tilt ---------- */
const portrait = document.querySelector('.portrait-card');
if (portrait && window.matchMedia('(pointer: fine)').matches) {
  const hero = document.querySelector('.hero');
  hero.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 6;
    const y = (event.clientY / window.innerHeight - 0.5) * -6;
    portrait.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg)`;
  });
  hero.addEventListener('pointerleave', () => {
    portrait.style.transform = 'none';
  });
}

/* ---------- Theme toggle (dark / light aurora) ---------- */
const rootEl = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  const syncLabel = () =>
    themeToggle.setAttribute(
      'aria-label',
      rootEl.dataset.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
    );
  themeToggle.addEventListener('click', () => {
    const next = rootEl.dataset.theme === 'light' ? 'dark' : 'light';
    rootEl.dataset.theme = next;
    try {
      localStorage.setItem('portfolio-theme', next);
    } catch (e) {}
    syncLabel();
  });
  syncLabel();
}

/* ---------- Mobile: swap embedded PDF for open/download actions ---------- */
const resumeFrame = document.getElementById('resume-frame');
const resumeNote = document.getElementById('resume-mobile-note');
if (resumeFrame && resumeNote) {
  const canEmbedPdf =
    !window.matchMedia('(pointer: coarse)').matches &&
    !/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  if (!canEmbedPdf) {
    resumeFrame.classList.add('pdf-no-embed');
    resumeNote.hidden = false;
  }
}

/* ---------- Work gallery lightbox ---------- */
const shots = [...document.querySelectorAll('.gallery-grid .shot')];
const lightbox = document.getElementById('lightbox');
if (lightbox && shots.length) {
  const img = document.getElementById('lightbox-img');
  const num = document.getElementById('lightbox-num');
  const title = document.getElementById('lightbox-title');
  const sub = document.getElementById('lightbox-sub');
  let index = 0;

  const show = (i) => {
    index = (i + shots.length) % shots.length;
    const shot = shots[index];
    const frameImg = shot.querySelector('.shot-frame img');
    const caption = shot.querySelector('figcaption');
    img.src = frameImg.src;
    img.alt = frameImg.alt;
    num.textContent = `SHOT ${shot.querySelector('.shot-num').textContent}`;
    title.textContent = caption.querySelector('b').textContent;
    sub.textContent = caption.querySelector('span').textContent;
  };

  const open = (i) => {
    show(i);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
  };

  const close = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
  };

  shots.forEach((shot, i) => {
    shot.querySelector('.shot-frame').addEventListener('click', () => open(i));
  });

  document.getElementById('lightbox-close').addEventListener('click', close);
  document.getElementById('lightbox-prev').addEventListener('click', (e) => { e.stopPropagation(); show(index - 1); });
  document.getElementById('lightbox-next').addEventListener('click', (e) => { e.stopPropagation(); show(index + 1); });
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
}
