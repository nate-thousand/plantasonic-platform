import '@ds/css/variables.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../styles/main.scss';
import { NAV, NAV_GROUPS } from './catalog.js';
import { SECTIONS } from './sections/index.js';

const THEME_KEY = 'plantasonic-demo-theme';

function getTheme() {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') {
    setTheme(saved);
    return;
  }
  setTheme(window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
}

function renderNav() {
  return NAV_GROUPS.map((group) => {
    const items = NAV.filter((n) => n.group === group);
    if (!items.length) return '';
    return `<div class="mb-3">
      <div class="ds-type-overline text-muted px-2 mb-1">${group}</div>
      ${items.map((i) => `<a href="#${i.id}" class="ds-nav-item" data-section="${i.id}">${i.label}</a>`).join('')}
    </div>`;
  }).join('');
}

function renderContent() {
  return NAV.map((item) => {
    const render = SECTIONS[item.id];
    if (!render) return '';
    return `<section id="${item.id}" class="ds-demo-section" aria-labelledby="${item.id}-title">
      ${render()}
    </section>`;
  }).join('');
}

function updateActiveNav() {
  const sections = document.querySelectorAll('.ds-demo-section');
  const navItems = document.querySelectorAll('.ds-nav-item');
  let current = NAV[0]?.id ?? '';

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 120) current = section.id;
  });

  navItems.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('data-section') === current);
  });
}

function mountApp() {
  initTheme();
  const root = document.querySelector('#app');
  if (!root) return;

  root.innerHTML = `
    <aside class="ds-demo__nav" aria-label="Demo navigation">
      <div class="ds-demo__brand">
        <div class="fw-semibold"><span style="color:var(--ds-color-text-accent)">Plantasonic</span> DS</div>
        <div class="ds-type-caption text-muted">Component Demo</div>
      </div>
      <nav class="ds-demo__nav-scroll" id="demo-nav">${renderNav()}</nav>
    </aside>
    <div class="ds-demo__main">
      <header class="ds-demo__header">
        <h1 class="h5 mb-0 me-auto">Design System Showcase</h1>
        <label class="ds-type-caption mb-0" for="theme-select">Theme</label>
        <select class="form-select form-select-sm" id="theme-select" style="width:auto">
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
        <label class="form-check form-switch mb-0 ms-2">
          <input class="form-check-input" type="checkbox" id="reduced-motion" />
          <span class="form-check-label ds-type-caption">Reduced motion</span>
        </label>
      </header>
      <main class="ds-demo__content" id="demo-content">${renderContent()}</main>
    </div>`;

  const themeSelect = root.querySelector('#theme-select');
  const reducedMotion = root.querySelector('#reduced-motion');

  themeSelect.value = getTheme();
  themeSelect.addEventListener('change', () => setTheme(themeSelect.value));

  reducedMotion.addEventListener('change', () => {
    document.documentElement.toggleAttribute('data-ds-reduced-motion', reducedMotion.checked);
  });

  root.querySelectorAll('.ds-nav-item').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const id = link.getAttribute('data-section');
      const target = document.getElementById(id);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    target?.scrollIntoView({ block: 'start' });
  }
}

mountApp();
