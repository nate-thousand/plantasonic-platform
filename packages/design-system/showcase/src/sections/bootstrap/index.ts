import { BOOTSTRAP_CATEGORIES, BOOTSTRAP_VERSION } from '../../data/catalog';
import { docBlock, sectionHeader } from '../../lib/ui';
import { BS_M2_DOC } from '../../lib/bootstrap-ui';
import { renderBsButtons } from './buttons';
import { renderBsCards } from './cards';
import { renderBsDialogs } from './dialogs';
import { renderBsDisclosure } from './disclosure';
import { renderBsFeedback } from './feedback';
import { renderBsFloating } from './floating';
import { renderBsForms } from './forms';
import { renderBsLists } from './lists';
import { renderBsNavigation } from './navigation';
import { renderBsSelection } from './selection';
import { renderBsTables } from './tables';
import { renderBsUtilities } from './utilities';

export function renderBootstrap(): string {
  const complete = BOOTSTRAP_CATEGORIES.filter((c) => c.complete).length;
  const total = BOOTSTRAP_CATEGORIES.length;

  return `
    ${sectionHeader('Bootstrap Reference', `Milestone 2B — complete Bootstrap ${BOOTSTRAP_VERSION} styling layer for Plantasonic.`)}
    ${docBlock({
      ...BS_M2_DOC,
      purpose: 'Canonical Bootstrap reference — every component fully restyled with Plantasonic tokens. No default Bootstrap appearance.',
      implementationNotes: [
        'Coverage: ' + `${complete}/${total} categories complete`,
        'SCSS layer: bootstrap-theme → bootstrap → bootstrap-components → bootstrap-utilities',
        'Plantasonic-specific components are Milestone 3 — not included here',
        'Theme switch (header) validates dark and light without reload',
      ],
    })}
    <div class="alert alert-success mb-4"><strong>Milestone 2B</strong> — Bootstrap styling layer complete. Every component uses Plantasonic tokens only.</div>
    <div class="card mb-4"><div class="card-header">Coverage checklist</div><div class="card-body">
      <div class="row g-2">${BOOTSTRAP_CATEGORIES.map((c) => `
        <div class="col-md-6 col-lg-4">
          <a href="#${c.id}" class="btn btn-outline-secondary btn-sm w-100 text-start ds-nav-link" data-route="${c.id}">
            ${c.complete ? '✓' : '○'} ${c.label}
          </a>
        </div>`).join('')}
      </div>
    </div></div>
    <div class="card mb-4"><div class="card-header">Validation</div><ul class="small mb-0 card-body">
      <li>All components consume foundation + semantic tokens via CSS variables</li>
      <li>Dark and light themes switch instantly (header theme selector)</li>
      <li>Token inspector (right panel) shows classes, variables, computed styles</li>
      <li>Test responsive layout with viewport controls in header</li>
      <li>Remaining for Milestone 3: Plantasonic instrument components (knob, dock, stage, etc.)</li>
    </ul></div>`;
}

export {
  renderBsButtons,
  renderBsForms,
  renderBsSelection,
  renderBsNavigation,
  renderBsCards,
  renderBsLists,
  renderBsTables,
  renderBsFeedback,
  renderBsDisclosure,
  renderBsFloating,
  renderBsDialogs,
  renderBsUtilities,
};
