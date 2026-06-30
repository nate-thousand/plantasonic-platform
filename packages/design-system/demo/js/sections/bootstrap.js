import { cssVarValue, demoCard, sectionHeader } from '../ui.js';

export function renderBsButtons() {
  return `
    ${sectionHeader('Buttons', 'Primary, secondary, outline, ghost, link, and button groups.')}
    ${demoCard(
      'Button variants',
      `<div class="d-flex flex-wrap gap-2 mb-4">
        <button type="button" class="btn btn-primary">Primary</button>
        <button type="button" class="btn btn-secondary">Secondary</button>
        <button type="button" class="btn btn-outline-primary">Outline primary</button>
        <button type="button" class="btn btn-outline-secondary">Outline</button>
        <button type="button" class="btn btn-ghost">Ghost</button>
        <button type="button" class="btn btn-link">Link</button>
      </div>
      <div class="d-flex flex-wrap gap-2">
        <button type="button" class="btn btn-primary active">Active</button>
        <button type="button" class="btn btn-primary" disabled>Disabled</button>
      </div>`,
      ['--ds-color-primary', '--ds-shadow-focus'],
    )}
    ${demoCard(
      'Button groups',
      `<div class="btn-group mb-3" role="group" aria-label="Segmented">
        <button type="button" class="btn btn-outline-secondary">Left</button>
        <button type="button" class="btn btn-outline-secondary active">Middle</button>
        <button type="button" class="btn btn-outline-secondary">Right</button>
      </div>
      <div class="btn-group btn-group-sm" role="group">
        <button type="button" class="btn btn-primary">A</button>
        <button type="button" class="btn btn-primary">B</button>
        <button type="button" class="btn btn-primary" disabled>C</button>
      </div>`,
    )}`;
}

export function renderBsForms() {
  return `
    ${sectionHeader('Forms', 'Text inputs, textarea, and validation states.')}
    ${demoCard(
      'Input types',
      `<div class="row g-3">
        <div class="col-md-6"><label class="form-label" for="demo-text">Text</label>
          <input id="demo-text" type="text" class="form-control" placeholder="Placeholder text" /></div>
        <div class="col-md-6"><label class="form-label" for="demo-email">Email</label>
          <input id="demo-email" type="email" class="form-control" placeholder="you@plantasonic.dev" /></div>
        <div class="col-md-6"><label class="form-label" for="demo-num">Number</label>
          <input id="demo-num" type="number" class="form-control" value="120" min="40" max="240" /></div>
        <div class="col-md-6"><label class="form-label" for="demo-dis">Disabled</label>
          <input id="demo-dis" type="text" class="form-control" value="Disabled" disabled /></div>
      </div>`,
      ['--ds-color-surface-input', '--ds-shadow-focus'],
    )}
    ${demoCard(
      'Validation',
      `<div class="row g-3">
        <div class="col-md-6"><label class="form-label" for="demo-valid">Valid</label>
          <input id="demo-valid" type="text" class="form-control is-valid" value="OK" />
          <div class="valid-feedback">Looks good.</div></div>
        <div class="col-md-6"><label class="form-label" for="demo-invalid">Invalid</label>
          <input id="demo-invalid" type="text" class="form-control is-invalid" value="" />
          <div class="invalid-feedback">Required field.</div></div>
      </div>`,
    )}`;
}

export function renderBsSelection() {
  return `
    ${sectionHeader('Selection Controls', 'Checkbox, radio, switch, range, and select.')}
    ${demoCard(
      'Checkbox · Radio · Switch',
      `<div class="form-check"><input class="form-check-input" type="checkbox" id="demo-c1" checked />
        <label class="form-check-label" for="demo-c1">Checked</label></div>
       <div class="form-check"><input class="form-check-input" type="radio" name="demo-r" id="demo-r1" checked />
        <label class="form-check-label" for="demo-r1">Radio A</label></div>
       <div class="form-check"><input class="form-check-input" type="radio" name="demo-r" id="demo-r2" />
        <label class="form-check-label" for="demo-r2">Radio B</label></div>
       <div class="form-check form-switch mt-2"><input class="form-check-input" type="checkbox" id="demo-sw" checked />
        <label class="form-check-label" for="demo-sw">Switch on</label></div>`,
      ['--ds-color-primary'],
    )}
    ${demoCard(
      'Range · Select',
      `<label class="form-label" for="demo-range">Tempo</label>
       <input id="demo-range" type="range" class="form-range mb-3" min="0" max="100" value="65" aria-label="Tempo" />
       <label class="form-label" for="demo-sel">Select</label>
       <select id="demo-sel" class="form-select"><option>Option A</option><option>Option B</option></select>`,
      ['--ps-slider-track', '--ps-slider-thumb'],
    )}`;
}

export function renderBsNavigation() {
  return `
    ${sectionHeader('Navigation', 'Navbar, tabs, pills, breadcrumbs, and pagination.')}
    ${demoCard(
      'Navbar',
      `<nav class="navbar navbar-dark rounded px-3 mb-0" style="background:var(--ds-color-surface-nav);min-height:var(--ps-nav-height)">
        <span class="navbar-brand mb-0 h1 fs-6">Plantasonic</span>
        <div class="navbar-nav flex-row gap-2 ms-auto">
          <a class="nav-link active" href="#" aria-current="page">Active</a>
          <a class="nav-link" href="#">Link</a>
          <span class="nav-link disabled">Disabled</span>
        </div>
      </nav>`,
    )}
    ${demoCard(
      'Tabs · Pills · Breadcrumbs',
      `<ul class="nav nav-tabs mb-3"><li class="nav-item"><a class="nav-link active" href="#">Active tab</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Tab</a></li></ul>
       <ul class="nav nav-pills mb-3"><li class="nav-item"><a class="nav-link active" href="#">Active pill</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Pill</a></li></ul>
       <nav aria-label="breadcrumb"><ol class="breadcrumb mb-0">
         <li class="breadcrumb-item"><a href="#">Home</a></li>
         <li class="breadcrumb-item active" aria-current="page">Navigation</li>
       </ol></nav>`,
    )}`;
}

export function renderBsCards() {
  return `
    ${sectionHeader('Cards', 'Default, interactive, and selected card patterns.')}
    ${demoCard(
      'Default card',
      `<div class="card" style="max-width:18rem">
        <div class="card-header">Header</div>
        <div class="card-body">
          <h5 class="card-title h6">Card title</h5>
          <p class="card-text small text-secondary">Body using semantic surface tokens.</p>
          <button type="button" class="btn btn-primary btn-sm">Action</button>
        </div>
        <div class="card-footer small text-muted">Footer</div>
      </div>`,
    )}
    ${demoCard(
      'Interactive · Selected',
      `<div class="row g-3">
        <div class="col-md-6"><div class="card ds-bs-card-interactive"><div class="card-body small"><strong>Interactive</strong></div></div></div>
        <div class="col-md-6"><div class="card ds-bs-card-selected border"><div class="card-body small"><strong>Selected</strong></div></div></div>
      </div>`,
    )}`;
}

export function renderBsLists() {
  return `
    ${sectionHeader('Lists', 'List groups — default, flush, and interactive.')}
    ${demoCard(
      'List group',
      `<ul class="list-group" style="max-width:20rem">
        <li class="list-group-item">First item</li>
        <li class="list-group-item active">Active item</li>
        <li class="list-group-item disabled">Disabled</li>
      </ul>`,
    )}
    ${demoCard(
      'Interactive list',
      `<div class="list-group" style="max-width:20rem">
        <a href="#" class="list-group-item list-group-item-action active">Active action</a>
        <a href="#" class="list-group-item list-group-item-action">Action item</a>
      </div>`,
    )}`;
}

export function renderBsTables() {
  return `
    ${sectionHeader('Tables', 'Standard, hover, striped, and responsive variants.')}
    ${demoCard(
      'Standard table',
      `<table class="table table-hover table-striped table-sm mb-0">
        <thead><tr><th>Parameter</th><th>Value</th></tr></thead>
        <tbody><tr><td>Tempo</td><td class="font-monospace">120</td></tr><tr><td>Density</td><td>0.72</td></tr></tbody>
      </table>`,
    )}`;
}

export function renderBsFeedback() {
  return `
    ${sectionHeader('Feedback', 'Alerts, badges, progress bars, toasts, and spinners.')}
    ${demoCard(
      'Alerts',
      `<div class="d-flex flex-column gap-2">
        <div class="alert alert-success mb-0" role="alert">Success alert</div>
        <div class="alert alert-info mb-0" role="alert">Info alert</div>
        <div class="alert alert-warning mb-0" role="alert">Warning alert</div>
        <div class="alert alert-danger mb-0" role="alert">Danger alert</div>
      </div>`,
    )}
    ${demoCard(
      'Badges · Progress · Spinner',
      `<span class="badge bg-primary me-1">Primary</span>
       <span class="badge bg-success me-1">Success</span>
       <span class="badge bg-warning me-1">Warning</span>
       <div class="progress my-3" style="height:0.5rem"><div class="progress-bar" style="width:65%"></div></div>
       <div class="spinner-border spinner-border-sm text-primary" role="status"><span class="visually-hidden">Loading</span></div>`,
    )}`;
}

export function renderBsDisclosure() {
  return `
    ${sectionHeader('Disclosure', 'Accordion, collapse, and offcanvas.')}
    ${demoCard(
      'Accordion',
      `<div class="accordion" id="demoAccordion">
        <div class="accordion-item">
          <h2 class="accordion-header"><button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#demoA1">Expanded</button></h2>
          <div id="demoA1" class="accordion-collapse collapse show" data-bs-parent="#demoAccordion"><div class="accordion-body small">Accordion body.</div></div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#demoA2">Collapsed</button></h2>
          <div id="demoA2" class="accordion-collapse collapse" data-bs-parent="#demoAccordion"><div class="accordion-body small">Hidden until expanded.</div></div>
        </div>
      </div>`,
    )}
    ${demoCard(
      'Offcanvas',
      `<button class="btn btn-outline-secondary btn-sm" type="button" data-bs-toggle="offcanvas" data-bs-target="#demoOffcanvas">Open offcanvas</button>
       <div class="offcanvas offcanvas-start" tabindex="-1" id="demoOffcanvas">
         <div class="offcanvas-header"><h5 class="offcanvas-title">Sidebar</h5>
           <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button></div>
         <div class="offcanvas-body small">Offcanvas panel.</div>
       </div>`,
    )}`;
}

export function renderBsDialogs() {
  return `
    ${sectionHeader('Dialogs', 'Modal and confirmation patterns.')}
    ${demoCard(
      'Modal',
      `<button type="button" class="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#demoModal">Open modal</button>
       <div class="modal fade" id="demoModal" tabindex="-1" aria-hidden="true">
         <div class="modal-dialog"><div class="modal-content">
           <div class="modal-header"><h5 class="modal-title">Modal title</h5>
             <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
           <div class="modal-body small">Themed modal using raised surface and backdrop tokens.</div>
           <div class="modal-footer">
             <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
             <button type="button" class="btn btn-primary btn-sm">Save</button>
           </div>
         </div></div>
       </div>`,
      ['--ds-color-overlay-backdrop'],
    )}`;
}

export function renderBsUtilities() {
  return `
    ${sectionHeader('Utilities', 'Spacing, flex, grid, and display helpers.')}
    ${demoCard(
      'Spacing',
      `<div class="d-flex gap-3 flex-wrap mb-2">
        <div class="p-1 border rounded"><code>p-1</code></div>
        <div class="p-2 border rounded"><code>p-2</code></div>
        <div class="p-3 border rounded"><code>p-3</code></div>
      </div>
      <p class="small text-muted mb-0">Bootstrap spacer = <code>--ds-space-3</code> (${cssVarValue('--ds-space-3')})</p>`,
    )}
    ${demoCard(
      'Flex · Grid',
      `<div class="d-flex justify-content-between align-items-center p-3 rounded mb-3" style="background:var(--ds-color-surface-raised)">
        <span class="small">justify-between</span><span class="small">align-center</span>
      </div>
      <div class="row g-2">
        <div class="col-md-4"><div class="p-2 border rounded small text-center">col-md-4</div></div>
        <div class="col-md-4"><div class="p-2 border rounded small text-center">col-md-4</div></div>
        <div class="col-md-4"><div class="p-2 border rounded small text-center">col-md-4</div></div>
      </div>`,
    )}`;
}
