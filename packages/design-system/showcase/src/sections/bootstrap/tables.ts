import { bsSection } from '../../lib/bootstrap-ui';
import { demoCard } from '../../lib/ui';

export function renderBsTables(): string {
  return bsSection(
    'Tables',
    'Standard, hover, striped, compact, and responsive table variants.',
    `${renderStandard()}${renderVariants()}${renderResponsive()}`,
  );
}

function renderStandard(): string {
  return demoCard(
    'Standard table',
    `<table class="table"><thead><tr><th scope="col">Parameter</th><th scope="col">Value</th></tr></thead>
    <tbody><tr><td>Tempo</td><td class="font-monospace">120</td></tr><tr><td>Density</td><td>0.72</td></tr></tbody></table>`,
    ['--ds-color-text-primary', '--ds-color-border-subtle'],
  );
}

function renderVariants(): string {
  return demoCard(
    'Hover · Striped · Compact',
    `<table class="table table-hover table-striped table-sm mb-0">
      <thead><tr><th>Col A</th><th>Col B</th></tr></thead>
      <tbody>
        <tr><td>Row 1</td><td>Data</td></tr>
        <tr><td>Row 2</td><td>Data</td></tr>
        <tr><td>Row 3</td><td>Data</td></tr>
      </tbody>
    </table>`,
    ['--ds-color-overlay-scrim-light', '--ds-color-overlay-scrim-strong'],
  );
}

function renderResponsive(): string {
  return demoCard(
    'Responsive table',
    `<div class="table-responsive"><table class="table table-sm mb-0">
      <thead><tr><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th></tr></thead>
      <tbody><tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr></tbody>
    </table></div>
    <p class="small text-muted mt-2 mb-0">Shrink viewport to test horizontal scroll.</p>`,
  );
}
