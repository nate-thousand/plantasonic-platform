import { DS_VERSION, GIT_COMMIT } from '../data/catalog';
import { contrastRow } from '../lib/a11y';
import { getComputedVar } from '../lib/tokens';
import { demoCard, docBlock, sectionHeader } from '../lib/ui';

export function renderLayouts(): string {
  return `
    ${sectionHeader('Layouts', 'Instrument shell and responsive grid.')}
    ${docBlock({
      purpose: 'Stage-first layout with nav, optional sidebar, and dock.',
      usage: 'Use --ps-nav-height, --ps-dock-height, --ps-sidebar-width in product shell CSS.',
      bestPractices: ['Sidebar collapses to offcanvas on mobile'],
      dos: ['Keep stage full-bleed', 'Use sidebar overlay on mobile'],
      donts: ['Let chrome compete with stage for attention'],
      implementationNotes: ['Layout classes (ps-*) defined in consuming apps'],
    })}
    ${demoCard(
      'Shell grid',
      `<pre class="small mb-0 font-monospace text-secondary">┌ TopNav (--ps-nav-height) ─┐
│ Sidebar │ Stage            │
├─────────┴──────────────────┤
│ ControlDock (--ps-dock-height) │
└────────────────────────────┘</pre>`,
      ['--ps-nav-height', '--ps-dock-height'],
    )}`;
}

export function renderUtilities(): string {
  return `
    ${sectionHeader('Utilities', 'Bootstrap utilities with Plantasonic theme.')}
    ${docBlock({
      purpose: 'Spacing, display, and flex helpers from Bootstrap.',
      usage: 'Prefer design tokens for colors. Use Bootstrap utilities for layout.',
      dos: ['Combine utilities with token-based custom classes'],
      donts: ['Use utility colors that bypass tokens'],
      implementationNotes: ['Bootstrap $spacer maps to --ds-space-3'],
    })}
    <div class="d-flex gap-3 flex-wrap mb-3"><span class="p-2 rounded bg-dark">.bg-dark</span><span class="p-2 rounded border">.border</span><span class="p-2 rounded text-muted">.text-muted</span></div>
    <div class="ds-overline">Touch target minimum: ${getComputedVar('--ps-touch-target')}</div>`;
}

export function renderAccessibility(): string {
  const pairs = [
    ['Primary on app', '--ds-color-text-primary', '--ds-color-surface-app'],
    ['Primary on raised', '--ds-color-text-primary', '--ds-color-surface-raised'],
    ['Secondary on raised', '--ds-color-text-secondary', '--ds-color-surface-raised'],
    ['Accent on stage', '--ds-color-text-accent', '--ds-color-surface-stage'],
    ['On primary button', '--ds-color-text-on-primary', '--ds-color-primary'],
  ] as const;

  return `
    ${sectionHeader('Accessibility', 'Contrast, focus, keyboard, ARIA, and reduced motion.')}
    ${docBlock({
      purpose: 'WCAG 2.1 AA baseline for instrument UI.',
      usage: 'Verify every product screen against these patterns before shipping.',
      bestPractices: ['Run contrast check for both dark and light themes'],
      dos: ['Use :focus-visible rings', 'Provide keyboard paths', 'Respect prefers-reduced-motion'],
      donts: ['Remove focus outlines', 'Use muted text for essential content'],
      implementationNotes: ['Contrast ratios computed from resolved CSS variables at runtime'],
    })}
    ${demoCard(
      'Contrast audit',
      `<div class="table-responsive"><table class="table table-sm">
        <thead><tr><th>Pair</th><th>Foreground</th><th>Background</th><th>Ratio</th><th>WCAG</th><th>Preview</th></tr></thead>
        <tbody>${pairs.map(([label, fg, bg]) => contrastRow(label, fg, bg, getComputedVar)).join('')}</tbody>
      </table></div>`,
    )}
    ${demoCard(
      'Focus · keyboard',
      `<button type="button" class="btn btn-primary me-2">Tab to focus</button>
       <input class="form-control d-inline-block w-auto" placeholder="Focus me" aria-label="Focus example" />
       <nav class="mt-3" aria-label="Focus order demo"><ol class="small mb-0"><li>Header controls</li><li>Main content</li><li>Dock transport</li></ol></nav>`,
      ['--ds-shadow-focus', '--ds-color-border-focus'],
    )}
    ${demoCard(
      'ARIA examples',
      `<button type="button" class="btn btn-primary btn-sm" aria-pressed="true">Play (aria-pressed)</button>
       <div class="form-range mt-3" role="group" aria-label="Tempo"><input type="range" class="form-range" min="40" max="240" value="120" aria-valuemin="40" aria-valuemax="240" aria-valuenow="120" aria-label="Tempo" /></div>`,
    )}
    ${demoCard(
      'Reduced motion',
      `<p class="small">Toggle reduced motion in the header. Animations respect <code>prefers-reduced-motion</code> and <code>data-ds-reduced-motion</code>.</p>
       <button type="button" class="btn btn-outline-secondary btn-sm ds-motion-demo">Animated control</button>`,
    )}`;
}

export function renderThemes(): string {
  return `
    ${sectionHeader('Themes', 'Dark (default) and light — instant switch, no reload.')}
    ${docBlock({
      purpose: 'Runtime theme switching via CSS custom properties.',
      usage: 'Set data-theme on &lt;html&gt;. All --ds-* variables update instantly.',
      bestPractices: ['Verify Bootstrap components via css-theme-bridge.scss'],
      dos: ['Test both themes before shipping', 'Use semantic tokens that adapt per theme'],
      donts: ['Maintain separate stylesheets per theme'],
      implementationNotes: ['Sources: theme.dark.tokens.json + theme.light.tokens.json → css/variables.css'],
    })}
    <div class="row g-3">
      <div class="col-md-6"><div class="card p-4" style="background:var(--ds-color-surface-app);color:var(--ds-color-text-primary)"><strong>Current theme</strong><div id="theme-preview-label" class="font-monospace mt-2">dark</div></div></div>
      <div class="col-md-6"><div class="card p-4"><div class="ds-type-label mb-2">Sample tokens</div>
        <dl class="small mb-0"><dt>--ds-color-surface-app</dt><dd>${getComputedVar('--ds-color-surface-app')}</dd>
        <dt>--ds-color-text-primary</dt><dd>${getComputedVar('--ds-color-text-primary')}</dd></dl></div></div>
    </div>`;
}

export function renderChangelog(): string {
  return `
    ${sectionHeader('Changelog', `Design system v${DS_VERSION}`)}
    ${docBlock({
      purpose: 'Track design system releases and showcase updates.',
      usage: 'Compare showcase version and git commit with consuming apps.',
      dos: ['Pin design system version in product apps'],
      donts: ['Silently drift token values without changelog entry'],
      implementationNotes: [`Showcase built from commit ${GIT_COMMIT}`],
    })}
    <div class="card mb-3"><div class="card-body small">
      <h2 class="h6">Unreleased</h2>
      <ul><li>Vision and Scope documentation</li><li>Foundation reference docs (COLORS, TYPOGRAPHY, SPACING, PATTERNS)</li><li>Text color semantics fix · css-theme-bridge</li><li>Showcase enhancements — developer section, contrast audit, 15 Plantasonic refs</li></ul>
    </div></div>
    <div class="card mb-3"><div class="card-body small">
      <h2 class="h6">1.1.0 — 2026-06-28</h2>
      <ul><li>Design System Showcase — token browser, Bootstrap catalog, theme switcher</li></ul>
    </div></div>
    <div class="card"><div class="card-body small">
      <h2 class="h6">1.0.0 — 2026-06-28</h2>
      <ul class="mb-0"><li>Foundation + dark/light theme tokens</li><li>CSS variable pipeline</li><li>Bootstrap theme overrides</li></ul>
    </div></div>`;
}
