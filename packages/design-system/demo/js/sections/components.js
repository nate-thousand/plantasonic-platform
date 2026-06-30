import { demoCard, sectionHeader } from '../ui.js';

export function renderComponents() {
  return `
    ${sectionHeader('Component Library', 'Token-driven UI components — copy markup or import from plantasonic-design-system/components.')}
    ${demoCard(
      'Button variants',
      `<div class="d-flex flex-wrap gap-2">
        <button type="button" class="btn ds-c-btn ds-c-btn--primary"><span class="ds-c-btn__label">Primary</span></button>
        <button type="button" class="btn ds-c-btn ds-c-btn--secondary"><span class="ds-c-btn__label">Secondary</span></button>
        <button type="button" class="btn ds-c-btn ds-c-btn--ghost"><span class="ds-c-btn__label">Ghost</span></button>
        <button type="button" class="btn ds-c-btn ds-c-btn--subtle"><span class="ds-c-btn__label">Subtle</span></button>
        <button type="button" class="btn ds-c-btn ds-c-btn--danger"><span class="ds-c-btn__label">Danger</span></button>
        <button type="button" class="btn ds-c-btn ds-c-btn--primary ds-c-btn--loading" disabled aria-busy="true">
          <span class="ds-c-btn__spinner" aria-hidden="true"></span><span class="ds-c-btn__label">Loading</span>
        </button>
        <button type="button" class="btn ds-c-btn ds-c-btn--secondary" disabled><span class="ds-c-btn__label">Disabled</span></button>
      </div>`,
      ['--ds-color-primary'],
    )}
    ${demoCard(
      'Icon buttons',
      `<div class="d-flex flex-wrap gap-2">
        <button type="button" class="btn ds-c-btn ds-c-icon-btn ds-c-btn--primary" aria-label="Play"><span aria-hidden="true">▶</span></button>
        <button type="button" class="btn ds-c-btn ds-c-icon-btn ds-c-btn--secondary" aria-label="Pause"><span aria-hidden="true">⏸</span></button>
        <button type="button" class="btn ds-c-btn ds-c-icon-btn ds-c-btn--ghost" aria-label="Stop"><span aria-hidden="true">⏹</span></button>
      </div>`,
      ['--ps-touch-target'],
    )}
    ${demoCard(
      'Toolbar',
      `<div class="ps-toolbar d-flex align-items-center gap-2 p-2 rounded" role="toolbar" aria-label="Transport" style="background:var(--ds-color-surface-nav)">
        <div class="btn-group btn-group-sm" role="group">
          <button type="button" class="btn btn-outline-secondary" aria-label="Previous">⏮</button>
          <button type="button" class="btn btn-primary" aria-label="Play">▶</button>
          <button type="button" class="btn btn-outline-secondary" aria-label="Next">⏭</button>
        </div>
        <div class="vr mx-1"></div>
        <button type="button" class="btn btn-ghost btn-sm">Mixer</button>
        <button type="button" class="btn btn-ghost btn-sm">Stage</button>
      </div>`,
    )}
    ${demoCard(
      'Badges',
      `<div class="d-flex flex-wrap gap-2">
        <span class="badge ds-c-badge ds-c-badge--default">Default</span>
        <span class="badge ds-c-badge ds-c-badge--accent">Accent</span>
        <span class="badge ds-c-badge ds-c-badge--success"><span class="ds-c-badge__dot" aria-hidden="true"></span>Success</span>
        <span class="badge ds-c-badge ds-c-badge--warning">Warning</span>
        <span class="badge ds-c-badge ds-c-badge--error">Error</span>
        <span class="badge ds-c-badge ds-c-badge--info rounded-pill">Info</span>
      </div>`,
    )}
    ${demoCard(
      'Status indicators',
      `<div class="d-flex flex-column gap-2">
        <span class="ds-c-status ds-c-status--online" role="status">
          <span class="ps-status-dot ds-c-status__dot ds-c-status__dot--pulse" aria-hidden="true"></span>
          <span class="ds-c-status__label">Engine online</span>
        </span>
        <span class="ds-c-status ds-c-status--busy" role="status">
          <span class="ps-status-dot ds-c-status__dot" aria-hidden="true"></span>
          <span class="ds-c-status__label">Rendering</span>
        </span>
        <span class="ds-c-status ds-c-status--error" role="status">
          <span class="ps-status-dot ds-c-status__dot" aria-hidden="true"></span>
          <span class="ds-c-status__label">Audio device error</span>
        </span>
      </div>`,
    )}
    ${demoCard(
      'Card',
      `<div class="card" style="max-width:20rem">
        <div class="card-body">
          <h5 class="card-title h6">Bloom</h5>
          <p class="card-subtitle small text-muted">Generative preset</p>
          <p class="card-text small text-secondary">A living patch that grows over time.</p>
          <button type="button" class="btn btn-primary btn-sm">Load preset</button>
        </div>
      </div>`,
      ['--ds-color-surface-card'],
    )}
    ${demoCard(
      'Panel',
      `<div class="ps-panel border rounded">
        <div class="ps-panel__header d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
          <span class="small fw-semibold">Inspector</span>
          <button type="button" class="btn btn-ghost btn-sm" aria-label="Float panel">⧉</button>
        </div>
        <div class="ps-panel__body p-3"><p class="small text-muted mb-0">Panel body content slot.</p></div>
      </div>`,
      ['--ds-color-surface-raised'],
    )}`;
}
