import { bsDemo, bsSection, stateHint } from '../../lib/bootstrap-ui';
import { demoCard } from '../../lib/ui';

export function renderBsButtons(): string {
  return bsSection(
    'Buttons',
    'Primary, secondary, outline, ghost, link, icon, and button groups — all interaction states.',
    `${renderVariants()}${renderIconButtons()}${renderButtonGroups()}`,
  );
}

function renderVariants(): string {
  return bsDemo(
    'Button variants',
    `<div class="d-flex flex-wrap gap-2 mb-4">
      <button type="button" class="btn btn-primary" data-ds-tokens="--ds-color-primary,--ds-color-text-on-primary">Primary</button>
      <button type="button" class="btn btn-secondary" data-ds-tokens="--ds-color-secondary">Secondary</button>
      <button type="button" class="btn btn-outline-primary">Outline primary</button>
      <button type="button" class="btn btn-outline-secondary">Outline</button>
      <button type="button" class="btn btn-ghost" data-ds-tokens="--ds-color-border-subtle">Ghost</button>
      <button type="button" class="btn btn-link">Link</button>
    </div>
    <div class="d-flex flex-wrap gap-2 mb-4">
      <button type="button" class="btn btn-primary active">Active</button>
      <button type="button" class="btn btn-primary" disabled>Disabled</button>
      <button type="button" class="btn btn-outline-secondary active">Outline active</button>
      <button type="button" class="btn btn-outline-secondary" disabled>Outline disabled</button>
    </div>
    <p class="small text-muted mb-0">Focus any button with Tab to inspect <code>--ds-shadow-focus</code>.</p>`,
    ['--ds-color-primary', '--ds-shadow-focus'],
  );
}

function renderIconButtons(): string {
  return demoCard(
    'Icon buttons',
    `${stateHint()}
    <div class="d-flex flex-wrap gap-2">
      <button type="button" class="btn btn-primary" style="min-width:var(--ps-touch-target);min-height:var(--ps-touch-target)" aria-label="Play" data-ds-tokens="--ps-touch-target">▶</button>
      <button type="button" class="btn btn-outline-secondary" style="min-width:var(--ps-touch-target);min-height:var(--ps-touch-target)" aria-label="Stop">■</button>
      <button type="button" class="btn btn-ghost btn-sm" aria-label="Settings">⚙</button>
    </div>`,
    ['--ps-touch-target'],
  );
}

function renderButtonGroups(): string {
  return demoCard(
    'Button groups',
    `<div class="btn-group mb-3" role="group" aria-label="Transport">
      <button type="button" class="btn btn-outline-secondary">Left</button>
      <button type="button" class="btn btn-outline-secondary active">Middle</button>
      <button type="button" class="btn btn-outline-secondary">Right</button>
    </div>
    <div class="btn-group btn-group-sm" role="group">
      <button type="button" class="btn btn-primary">A</button>
      <button type="button" class="btn btn-primary">B</button>
      <button type="button" class="btn btn-primary" disabled>C</button>
    </div>`,
  );
}
