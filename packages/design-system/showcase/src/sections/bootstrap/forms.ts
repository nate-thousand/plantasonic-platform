import { bsSection } from '../../lib/bootstrap-ui';
import { demoCard } from '../../lib/ui';

export function renderBsForms(): string {
  return bsSection(
    'Forms',
    'Text inputs with placeholder, focus, validation, disabled, and readonly states.',
    `${renderInputs()}${renderTextarea()}${renderValidation()}`,
  );
}

function renderInputs(): string {
  return demoCard(
    'Input types',
    `<div class="row g-3">
      <div class="col-md-6"><label class="form-label" for="bs-text">Text</label>
        <input id="bs-text" type="text" class="form-control" placeholder="Placeholder text" data-ds-tokens="--ds-color-surface-input,--ds-color-border-default" /></div>
      <div class="col-md-6"><label class="form-label" for="bs-pass">Password</label>
        <input id="bs-pass" type="password" class="form-control" value="secret" autocomplete="off" /></div>
      <div class="col-md-6"><label class="form-label" for="bs-email">Email</label>
        <input id="bs-email" type="email" class="form-control" placeholder="you@plantasonic.dev" /></div>
      <div class="col-md-6"><label class="form-label" for="bs-num">Number</label>
        <input id="bs-num" type="number" class="form-control" value="120" min="40" max="240" /></div>
      <div class="col-md-6"><label class="form-label" for="bs-search">Search</label>
        <input id="bs-search" type="search" class="form-control" placeholder="Search tokens…" /></div>
      <div class="col-md-6"><label class="form-label" for="bs-dis">Disabled</label>
        <input id="bs-dis" type="text" class="form-control" value="Disabled" disabled /></div>
      <div class="col-md-6"><label class="form-label" for="bs-ro">Readonly</label>
        <input id="bs-ro" type="text" class="form-control" value="Read only" readonly /></div>
    </div>`,
    ['--ds-color-surface-input', '--ds-shadow-focus'],
  );
}

function renderTextarea(): string {
  return demoCard(
    'Textarea',
    `<label class="form-label" for="bs-area">Notes</label>
     <textarea id="bs-area" class="form-control" rows="3" placeholder="Multiline input…"></textarea>`,
  );
}

function renderValidation(): string {
  return demoCard(
    'Validation states',
    `<div class="row g-3">
      <div class="col-md-6"><label class="form-label" for="bs-valid">Valid</label>
        <input id="bs-valid" type="text" class="form-control is-valid" value="OK" />
        <div class="valid-feedback">Looks good.</div></div>
      <div class="col-md-6"><label class="form-label" for="bs-invalid">Invalid</label>
        <input id="bs-invalid" type="text" class="form-control is-invalid" value="" />
        <div class="invalid-feedback">Required field.</div></div>
    </div>`,
    ['--ds-color-border-focus', '--ds-color-error'],
  );
}
