import { bsSection } from '../../lib/bootstrap-ui';
import { demoCard } from '../../lib/ui';

export function renderBsDisclosure(): string {
  return bsSection(
    'Disclosure',
    'Accordion, collapse, and offcanvas patterns.',
    `${renderAccordion()}${renderCollapse()}${renderOffcanvas()}`,
  );
}

function renderAccordion(): string {
  return demoCard(
    'Accordion',
    `<div class="accordion" id="bsAccordion">
      <div class="accordion-item">
        <h2 class="accordion-header"><button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#bsA1">Expanded section</button></h2>
        <div id="bsA1" class="accordion-collapse collapse show" data-bs-parent="#bsAccordion"><div class="accordion-body small">Accordion body content.</div></div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#bsA2">Collapsed section</button></h2>
        <div id="bsA2" class="accordion-collapse collapse" data-bs-parent="#bsAccordion"><div class="accordion-body small">Hidden until expanded.</div></div>
      </div>
    </div>`,
    ['--ds-color-surface-card'],
  );
}

function renderCollapse(): string {
  return demoCard(
    'Collapse',
    `<button class="btn btn-outline-secondary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#bsCollapse">Toggle collapse</button>
     <div class="collapse mt-2" id="bsCollapse"><div class="card card-body small">Collapsible region.</div></div>`,
  );
}

function renderOffcanvas(): string {
  return demoCard(
    'Offcanvas',
    `<button class="btn btn-outline-secondary btn-sm" type="button" data-bs-toggle="offcanvas" data-bs-target="#bsOffcanvas">Open offcanvas</button>
     <div class="offcanvas offcanvas-start" tabindex="-1" id="bsOffcanvas" aria-labelledby="bsOffcanvasLabel">
       <div class="offcanvas-header"><h5 class="offcanvas-title" id="bsOffcanvasLabel">Sidebar</h5>
         <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button></div>
       <div class="offcanvas-body small">Offcanvas panel using raised surface tokens.</div>
     </div>`,
    ['--ds-color-overlay-backdrop', '--ps-shadow-sidebar'],
  );
}
