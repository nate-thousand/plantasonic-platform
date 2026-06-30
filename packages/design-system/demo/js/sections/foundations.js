import { colorSwatch, cssVarValue, demoCard, sectionHeader } from '../ui.js';

export function renderOverview() {
  return `
    ${sectionHeader('Overview', 'Vanilla HTML reference for Plantasonic tokens, components, and Bootstrap patterns.')}
    <div class="alert alert-info mb-4">
      <strong>How to use:</strong> Browse sections in the sidebar, switch themes in the header, and copy markup directly into your application.
    </div>
    <div class="row g-3 mb-4">
      <div class="col-sm-6 col-md-4">
        <div class="card h-100"><div class="card-body">
          <div class="ds-overline text-muted mb-1">Foundations</div>
          <div class="h5 mb-0">Colors · Type · Space</div>
        </div></div>
      </div>
      <div class="col-sm-6 col-md-4">
        <div class="card h-100"><div class="card-body">
          <div class="ds-overline text-muted mb-1">Platform</div>
          <div class="h5 mb-0">Component library</div>
        </div></div>
      </div>
      <div class="col-sm-6 col-md-4">
        <div class="card h-100"><div class="card-body">
          <div class="ds-overline text-muted mb-1">Bootstrap 5.0.2</div>
          <div class="h5 mb-0">Themed controls</div>
        </div></div>
      </div>
    </div>
    <p class="text-secondary small mb-0">
      For the full interactive showcase (navigation framework, application shell, token inspector), run
      <code>npm run showcase:dev</code> from the repository root.
    </p>`;
}

export function renderColors() {
  const groups = [
    {
      name: 'Primary & Accent',
      vars: ['--ds-color-primary', '--ds-color-primary-hover', '--ds-color-accent', '--ds-color-secondary'],
    },
    {
      name: 'Surfaces',
      vars: [
        '--ds-color-surface-app',
        '--ds-color-surface-stage',
        '--ds-color-surface-nav',
        '--ds-color-surface-dock',
        '--ds-color-surface-card',
        '--ds-color-surface-raised',
        '--ds-color-surface-input',
      ],
    },
    {
      name: 'Text',
      vars: ['--ds-color-text-primary', '--ds-color-text-secondary', '--ds-color-text-muted', '--ds-color-text-accent'],
    },
    {
      name: 'Status',
      vars: ['--ds-color-success', '--ds-color-warning', '--ds-color-error', '--ds-color-info'],
    },
  ];

  const groupsHtml = groups
    .map(
      (g) => `
      <h3 class="h5 mt-4 mb-3">${g.name}</h3>
      <div class="row g-3">${g.vars.map((v) => colorSwatch(v)).join('')}</div>`,
    )
    .join('');

  return `${sectionHeader('Colors', 'Semantic color tokens — use CSS variables, never hardcoded hex.')}${groupsHtml}`;
}

export function renderTypography() {
  const samples = [
    { label: 'Display', cls: 'ds-type-display' },
    { label: 'H1', cls: 'ds-type-h1' },
    { label: 'H2', cls: 'ds-type-h2' },
    { label: 'H3', cls: 'ds-type-h3' },
    { label: 'Body', cls: 'ds-type-body' },
    { label: 'Body SM', cls: 'ds-type-body-sm' },
    { label: 'Caption', cls: 'ds-type-caption' },
    { label: 'Label', cls: 'ds-type-label' },
    { label: 'Overline', cls: 'ds-type-overline' },
    { label: 'Monospace', cls: 'font-monospace' },
  ];

  return `
    ${sectionHeader('Typography', 'Inter for UI chrome, JetBrains Mono for technical values.')}
    ${samples.map((s) => demoCard(s.label, `<p class="${s.cls} mb-0">The quick brown fox — 120 BPM</p>`)).join('')}`;
}

export function renderSpacing() {
  const spaces = ['0', '1', '2', '3', '4', '5', '6', '8'];
  const ruler = spaces
    .map((s) => {
      const v = `--ds-space-${s}`;
      return `<div class="mb-3">
        <div class="d-flex align-items-center gap-3">
          <code class="small" style="min-width:7rem">${v}</code>
          <div style="width:var(${v});height:var(--ds-space-3);background:var(--ds-color-primary)"></div>
          <span class="small text-muted">${cssVarValue(v)}</span>
        </div>
      </div>`;
    })
    .join('');

  return `${sectionHeader('Spacing', '4px-based spacing scale.')}
    ${demoCard('Spacing scale', ruler, ['--ds-space-3'])}
    ${demoCard(
      'Padding examples',
      `<div class="row g-3">
        ${['2', '3', '4']
          .map(
            (s) => `<div class="col-md-4"><div class="rounded border" style="padding:var(--ds-space-${s})">
              <div class="small">padding: --ds-space-${s}</div>
              <div style="background:var(--ds-color-surface-raised);height:2rem;border-radius:var(--ds-radius-sm)"></div>
            </div></div>`,
          )
          .join('')}
      </div>`,
    )}`;
}

export function renderRadius() {
  const radii = ['xs', 'sm', 'default', 'lg', 'xl', 'pill'];
  const samples = radii
    .map((r) => {
      const v = `--ds-radius-${r}`;
      return `<div class="col-lg-6 mb-4">
        <div class="small fw-semibold mb-2"><code>${v}</code></div>
        <div class="d-flex flex-wrap gap-3 align-items-center">
          <div class="card px-3 py-2" style="border-radius:var(${v})">Card</div>
          <button type="button" class="btn btn-outline-secondary btn-sm" style="border-radius:var(${v})">Button</button>
          <input class="form-control form-control-sm" style="width:6rem;border-radius:var(${v})" placeholder="Input" />
        </div>
      </div>`;
    })
    .join('');

  return `${sectionHeader('Radius', 'Border radius tokens on cards, buttons, and inputs.')}<div class="row">${samples}</div>`;
}

export function renderShadows() {
  const shadows = ['sm', 'md', 'lg', 'focus', 'glow-accent', 'stage-inset'];
  return `
    ${sectionHeader('Shadows', 'Elevation and focus shadows.')}
    <div class="row g-4">
      ${shadows
        .map(
          (s) => {
            const v = `--ds-shadow-${s}`;
            return `<div class="col-md-4">
              <div class="ds-shadow-demo p-4 rounded ds-shadow-hover" style="box-shadow:var(${v});background:var(--ds-color-surface-raised)">
                <code>${v}</code>
              </div>
            </div>`;
          },
        )
        .join('')}
    </div>`;
}

export function renderMotion() {
  return `
    ${sectionHeader('Motion', 'Durations, easing, and interaction feedback.')}
    ${demoCard(
      'Transition durations',
      `<div class="row g-3">
        ${['fast', 'base', 'slow']
          .map(
            (d) => `<div class="col-md-4">
              <button type="button" class="btn btn-primary w-100 ds-motion-demo ds-motion-press">--ds-transition-${d}</button>
            </div>`,
          )
          .join('')}
      </div>`,
      ['--ds-transition-base'],
    )}
    ${demoCard(
      'Easing curves',
      `<div class="row g-2">
        ${['out', 'in', 'in-out']
          .map(
            (e) => `<div class="col-md-4"><div class="ds-ease-bar" style="transition:width 1s var(--ds-ease-${e})"><span>--ds-ease-${e}</span></div></div>`,
          )
          .join('')}
      </div>`,
    )}`;
}
