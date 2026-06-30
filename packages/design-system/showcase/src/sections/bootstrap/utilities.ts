import { bsSection } from '../../lib/bootstrap-ui';
import { getComputedVar } from '../../lib/tokens';
import { demoCard } from '../../lib/ui';

export function renderBsUtilities(): string {
  return bsSection(
    'Bootstrap Utilities',
    'Spacing, flex, grid, visibility, display, and alignment — backed by Plantasonic tokens.',
    `${renderSpacing()}${renderFlexGrid()}${renderDisplay()}`,
  );
}

function renderSpacing(): string {
  return demoCard(
    'Spacing',
    `<div class="d-flex gap-3 flex-wrap mb-2">
      <div class="p-1 border rounded"><code>p-1</code></div>
      <div class="p-2 border rounded"><code>p-2</code></div>
      <div class="p-3 border rounded"><code>p-3</code></div>
      <div class="p-4 border rounded"><code>p-4</code></div>
    </div>
    <p class="small text-muted mb-0">Bootstrap spacer = <code>--ds-space-3</code> (${getComputedVar('--ds-space-3')})</p>`,
    ['--ds-space-3'],
  );
}

function renderFlexGrid(): string {
  return demoCard(
    'Flex · Grid',
    `<div class="d-flex justify-content-between align-items-center p-3 rounded mb-3" style="background:var(--ds-color-surface-raised)">
      <span class="small">justify-between</span><span class="small">align-center</span>
    </div>
    <div class="row g-2">
      <div class="col-md-4"><div class="p-2 border rounded small text-center">col-md-4</div></div>
      <div class="col-md-4"><div class="p-2 border rounded small text-center">col-md-4</div></div>
      <div class="col-md-4"><div class="p-2 border rounded small text-center">col-md-4</div></div>
    </div>`,
    ['--ds-color-surface-raised'],
  );
}

function renderDisplay(): string {
  return demoCard(
    'Display · Visibility · Alignment',
    `<div class="d-flex flex-wrap gap-2 mb-3">
      <span class="badge bg-secondary">d-flex</span>
      <span class="badge bg-secondary">text-muted</span>
      <span class="badge bg-secondary">text-center</span>
      <span class="visually-hidden">Screen reader only</span>
    </div>
    <p class="text-start text-md-center text-secondary small mb-0">Responsive text alignment · colors from theme tokens, not Bootstrap defaults.</p>`,
    ['--ds-color-text-muted'],
  );
}
