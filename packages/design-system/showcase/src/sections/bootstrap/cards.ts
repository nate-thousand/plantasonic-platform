import { bsSection } from '../../lib/bootstrap-ui';
import { demoCard } from '../../lib/ui';

export function renderBsCards(): string {
  return bsSection(
    'Cards',
    'Default, interactive, selected, and disabled card patterns with elevation and borders.',
    `${renderDefault()}${renderInteractive()}${renderElevation()}`,
  );
}

function renderDefault(): string {
  return demoCard(
    'Default card',
    `<div class="card" style="max-width:18rem" data-ds-tokens="--ds-color-surface-card,--ds-radius-lg,--ds-color-border-default">
      <div class="card-header">Header</div>
      <div class="card-body">
        <h5 class="card-title h6">Card title</h5>
        <p class="card-text small text-secondary">Body using semantic surface and border tokens.</p>
        <button type="button" class="btn btn-primary btn-sm">Action</button>
      </div>
      <div class="card-footer small text-muted">Footer</div>
    </div>`,
    ['--ds-color-surface-card', '--ds-radius-lg'],
  );
}

function renderInteractive(): string {
  return demoCard(
    'Interactive · Selected · Disabled',
    `<div class="row g-3">
      <div class="col-md-4"><div class="card ds-bs-card-interactive"><div class="card-body small"><strong>Interactive</strong><p class="text-muted mb-0">Hover for raised surface</p></div></div></div>
      <div class="col-md-4"><div class="card ds-bs-card-selected border"><div class="card-body small"><strong>Selected</strong><p class="text-muted mb-0">Accent border + glow</p></div></div></div>
      <div class="col-md-4"><div class="card opacity-50 pe-none"><div class="card-body small"><strong>Disabled</strong><p class="text-muted mb-0">Reduced opacity</p></div></div></div>
    </div>`,
    ['--ds-shadow-glow-accent', '--ds-color-border-focus'],
  );
}

function renderElevation(): string {
  return demoCard(
    'Elevation · borders',
    `<div class="d-flex flex-wrap gap-3">
      <div class="card p-3" style="box-shadow:var(--ds-shadow-sm)"><code>shadow-sm</code></div>
      <div class="card p-3" style="box-shadow:var(--ds-shadow-md)"><code>shadow-md</code></div>
      <div class="card p-3 border border-2" style="border-color:var(--ds-color-border-interactive)!important"><code>border-interactive</code></div>
    </div>`,
    ['--ds-shadow-sm', '--ds-shadow-md'],
  );
}
