import { bsSection } from '../../lib/bootstrap-ui';
import { demoCard } from '../../lib/ui';

export function renderBsLists(): string {
  return bsSection(
    'Lists',
    'List groups — default, flush, and interactive.',
    `${renderListGroup()}${renderFlush()}${renderInteractive()}`,
  );
}

function renderListGroup(): string {
  return demoCard(
    'List group',
    `<ul class="list-group" style="max-width:20rem">
      <li class="list-group-item">First item</li>
      <li class="list-group-item active" aria-current="true">Active item</li>
      <li class="list-group-item">Third item</li>
      <li class="list-group-item disabled" aria-disabled="true">Disabled</li>
    </ul>`,
    ['--ds-color-surface-raised'],
  );
}

function renderFlush(): string {
  return demoCard(
    'Flush list',
    `<ul class="list-group list-group-flush" style="max-width:20rem">
      <li class="list-group-item">Flush A</li>
      <li class="list-group-item">Flush B</li>
      <li class="list-group-item">Flush C</li>
    </ul>`,
  );
}

function renderInteractive(): string {
  return demoCard(
    'Interactive list',
    `<div class="list-group" style="max-width:20rem">
      <a href="#" class="list-group-item list-group-item-action active">Active action</a>
      <a href="#" class="list-group-item list-group-item-action">Action item</a>
      <button type="button" class="list-group-item list-group-item-action">Button item</button>
    </div>`,
    ['--ds-color-surface-overlay'],
  );
}
