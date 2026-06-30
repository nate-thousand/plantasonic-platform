import { bsSection } from '../../lib/bootstrap-ui';
import { demoCard } from '../../lib/ui';

export function renderBsFeedback(): string {
  return bsSection(
    'Feedback',
    'Alerts, badges, progress bars, toasts, and spinners — all Bootstrap contextual states.',
    `${renderAlerts()}${renderBadges()}${renderProgress()}${renderToasts()}${renderSpinners()}`,
  );
}

function renderAlerts(): string {
  return demoCard(
    'Alerts',
    `<div class="d-flex flex-column gap-2">
      <div class="alert alert-success mb-0" role="alert">Success — <code>--ds-color-success</code></div>
      <div class="alert alert-info mb-0" role="alert">Info</div>
      <div class="alert alert-warning mb-0" role="alert">Warning — <code>--ds-color-warning</code></div>
      <div class="alert alert-danger mb-0" role="alert">Danger — <code>--ds-color-error</code></div>
    </div>`,
    ['--ds-color-success', '--ds-color-warning', '--ds-color-error'],
  );
}

function renderBadges(): string {
  return demoCard(
    'Badges',
    `<span class="badge bg-primary me-1">Primary</span>
     <span class="badge bg-secondary me-1">Secondary</span>
     <span class="badge bg-success me-1">Success</span>
     <span class="badge bg-warning me-1">Warning</span>
     <span class="badge bg-danger me-1">Danger</span>
     <span class="badge bg-info">Info</span>`,
  );
}

function renderProgress(): string {
  return demoCard(
    'Progress bars',
    `<div class="progress mb-2" style="height:0.5rem"><div class="progress-bar" style="width:65%" role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100"></div></div>
     <div class="progress" style="height:0.5rem"><div class="progress-bar bg-success" style="width:40%"></div></div>`,
    ['--ds-color-primary', '--ds-color-surface-sunken'],
  );
}

function renderToasts(): string {
  return demoCard(
    'Toasts',
    `<div class="toast show w-100" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header"><strong class="me-auto">Plantasonic</strong><small>now</small></div>
      <div class="toast-body">Preset loaded successfully.</div>
    </div>`,
    ['--ds-color-surface-raised'],
  );
}

function renderSpinners(): string {
  return demoCard(
    'Spinners',
    `<div class="spinner-border text-primary me-3" role="status"><span class="visually-hidden">Loading</span></div>
     <div class="spinner-border spinner-border-sm text-success me-3" role="status"></div>
     <div class="spinner-grow text-warning" role="status"></div>`,
    ['--ds-color-primary'],
  );
}
