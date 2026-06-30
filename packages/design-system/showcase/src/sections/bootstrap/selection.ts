import { bsSection } from '../../lib/bootstrap-ui';
import { demoCard } from '../../lib/ui';

export function renderBsSelection(): string {
  return bsSection(
    'Selection Controls',
    'Checkbox, radio, switch, range slider, select, and multi-select.',
    `${renderChecks()}${renderRange()}${renderSelects()}`,
  );
}

function renderChecks(): string {
  return demoCard(
    'Checkbox · Radio · Switch',
    `<div class="form-check"><input class="form-check-input" type="checkbox" id="bs-c1" checked data-ds-tokens="--ds-color-primary" />
      <label class="form-check-label" for="bs-c1">Checked</label></div>
     <div class="form-check"><input class="form-check-input" type="checkbox" id="bs-c2" disabled />
      <label class="form-check-label" for="bs-c2">Disabled</label></div>
     <div class="form-check"><input class="form-check-input" type="radio" name="bs-r" id="bs-r1" checked />
      <label class="form-check-label" for="bs-r1">Radio A</label></div>
     <div class="form-check"><input class="form-check-input" type="radio" name="bs-r" id="bs-r2" />
      <label class="form-check-label" for="bs-r2">Radio B</label></div>
     <div class="form-check form-switch mt-2"><input class="form-check-input" type="checkbox" id="bs-sw" checked />
      <label class="form-check-label" for="bs-sw">Switch on</label></div>
     <div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="bs-sw2" disabled />
      <label class="form-check-label" for="bs-sw2">Switch disabled</label></div>`,
    ['--ds-color-primary', '--ps-slider-thumb'],
  );
}

function renderRange(): string {
  return demoCard(
    'Range slider',
    `<label class="form-label" for="bs-range">Tempo</label>
     <input id="bs-range" type="range" class="form-range" min="0" max="100" value="65"
       aria-valuemin="0" aria-valuemax="100" aria-valuenow="65" aria-label="Tempo"
       data-ds-tokens="--ps-slider-track,--ps-slider-thumb" />`,
    ['--ps-slider-track', '--ps-slider-thumb'],
  );
}

function renderSelects(): string {
  return demoCard(
    'Select · Multi-select',
    `<div class="row g-3">
      <div class="col-md-6"><label class="form-label" for="bs-sel">Select</label>
        <select id="bs-sel" class="form-select"><option>Option A</option><option>Option B</option><option disabled>Disabled</option></select></div>
      <div class="col-md-6"><label class="form-label" for="bs-multi">Multi-select</label>
        <select id="bs-multi" class="form-select" multiple size="3"><option selected>Alpha</option><option>Beta</option><option>Gamma</option></select></div>
      <div class="col-md-6"><label class="form-label" for="bs-sel-dis">Disabled select</label>
        <select id="bs-sel-dis" class="form-select" disabled><option>Locked</option></select></div>
    </div>`,
    ['--ds-color-surface-input'],
  );
}
