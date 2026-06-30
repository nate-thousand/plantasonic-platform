import { bsSection } from '../../lib/bootstrap-ui';
import { demoCard } from '../../lib/ui';

export function renderBsFloating(): string {
  return bsSection(
    'Floating UI',
    'Tooltips, popovers, and dropdowns — positioning and accessibility.',
    `${renderDropdowns()}${renderTooltipsPopovers()}`,
  );
}

function renderDropdowns(): string {
  return demoCard(
    'Dropdowns',
    `<div class="dropdown">
      <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Actions</button>
      <ul class="dropdown-menu">
        <li><a class="dropdown-item" href="#">Export</a></li>
        <li><a class="dropdown-item active" href="#">Active item</a></li>
        <li><a class="dropdown-item disabled" href="#" tabindex="-1">Disabled</a></li>
        <li><hr class="dropdown-divider" /></li>
        <li><a class="dropdown-item" href="#">Settings</a></li>
      </ul>
    </div>
    <p class="small text-muted mt-3 mb-0">Keyboard: activate with Enter/Space, navigate with arrows.</p>`,
    ['--ds-color-surface-raised'],
  );
}

function renderTooltipsPopovers(): string {
  return demoCard(
    'Tooltips · Popovers',
    `<button type="button" class="btn btn-sm btn-outline-secondary me-2" data-bs-toggle="tooltip" data-bs-placement="top" title="Sync tempo" data-ds-tokens="--ds-color-surface-overlay">Tooltip</button>
     <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="popover" data-bs-placement="right"
       data-bs-title="Performance" data-bs-content="Controls stage energy mapping.">Popover</button>`,
    ['--ds-color-surface-overlay'],
  );
}
