import {
  BOOTSTRAP_VERSION,
  BUILD_TIME,
  CSS_VAR_MAP,
  DS_VERSION,
  GIT_COMMIT,
  NAV,
} from '../data/catalog';
import { FILE_PATHS, TOKEN_COUNTS } from '../lib/meta';
import { countTokens, getAllCssVars } from '../lib/tokens';
import { docBlock, sectionHeader } from '../lib/ui';

export function renderDeveloper(): string {
  const cssVarCount = countTokens();
  const runtimeVars = getAllCssVars().length;

  return `
    ${sectionHeader('Developer', 'Build metadata, file locations, and inspection tools.')}
    ${docBlock({
      purpose: 'Debug and validate design system integration during development.',
      usage: 'Use the right panel Token Inspector while browsing any section. Toggle theme and viewport from the header.',
      bestPractices: ['Compare dev stats with product app build output', 'Verify git commit matches deployed package'],
      dos: ['Inspect elements before copying patterns to product apps', 'Check CSS variable count after token changes'],
      donts: ['Treat showcase as a product application', 'Duplicate token JSON in consuming apps'],
      implementationNotes: [
        'Showcase imports only from plantasonic-design-system package',
        'Token JSON loaded at build time via Vite alias @ds',
      ],
    })}
    <div class="row g-3 mb-4">
      <div class="col-md-6"><div class="card h-100"><div class="card-body">
        <h2 class="h6">Design System</h2>
        <dl class="small mb-0 ds-dev-stats">
          <dt>Version</dt><dd class="font-monospace">${DS_VERSION}</dd>
          <dt>Git commit</dt><dd class="font-monospace">${GIT_COMMIT}</dd>
          <dt>Build timestamp</dt><dd class="font-monospace">${new Date(BUILD_TIME).toLocaleString()}</dd>
          <dt>Bootstrap</dt><dd class="font-monospace">${BOOTSTRAP_VERSION}</dd>
        </dl>
      </div></div></div>
      <div class="col-md-6"><div class="card h-100"><div class="card-body">
        <h2 class="h6">Token counts</h2>
        <dl class="small mb-0 ds-dev-stats">
          <dt>Foundation tokens</dt><dd>${TOKEN_COUNTS.foundation}</dd>
          <dt>Dark theme tokens</dt><dd>${TOKEN_COUNTS.dark}</dd>
          <dt>Light theme tokens</dt><dd>${TOKEN_COUNTS.light}</dd>
          <dt>Mapped CSS variables</dt><dd>${cssVarCount}</dd>
          <dt>Runtime CSS vars</dt><dd>${runtimeVars || cssVarCount}</dd>
          <dt>Catalog paths</dt><dd>${Object.keys(CSS_VAR_MAP).length}</dd>
        </dl>
      </div></div></div>
    </div>
    <div class="card mb-4"><div class="card-header">Generated file locations</div><div class="card-body">
      <ul class="small font-monospace mb-0">
        ${Object.values(FILE_PATHS).map((p) => `<li>${p}</li>`).join('')}
      </ul>
    </div></div>
    <div class="card mb-4"><div class="card-header">Live environment</div><div class="card-body small">
      <dl class="mb-0 ds-dev-stats">
        <dt>Current theme</dt><dd id="dev-page-theme">—</dd>
        <dt>Viewport</dt><dd id="dev-page-viewport">—</dd>
        <dt>Breakpoint</dt><dd id="dev-page-breakpoint">—</dd>
        <dt>Reduced motion</dt><dd id="dev-page-motion">—</dd>
      </dl>
      <p class="text-muted mt-3 mb-0">Token Inspector is in the right panel — click any demo element to inspect tokens, aliases, and computed styles.</p>
    </div></div>
    <div class="card"><div class="card-header">Sections (${NAV.length})</div><div class="card-body">
      <div class="row g-2">${NAV.map((n) => `<div class="col-md-4"><a href="#${n.id}" class="btn btn-outline-secondary btn-sm w-100 ds-nav-link" data-route="${n.id}">${n.label}</a></div>`).join('')}</div>
    </div></div>`;
}
