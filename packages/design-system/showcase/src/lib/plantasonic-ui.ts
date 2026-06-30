import { docBlock, demoCard, sectionHeader, type DocMeta } from './ui';

export type PsComponentMeta = {
  name: string;
  purpose: string;
  description: string;
  usage: string;
  variants?: string[];
  states?: string[];
  tokens: string[];
  bootstrap?: string[];
  a11y: string[];
  dos?: string[];
  donts?: string[];
  notes?: string[];
};

export const PS_M3_DOC: DocMeta = {
  purpose: 'Canonical Plantasonic component library — instrument UI building blocks for every application.',
  usage: 'Import markup patterns and ps-* classes from this showcase. Consume tokens and Bootstrap theme only.',
  bestPractices: [
    'Use data-ds-tokens on components for inspector debugging',
    'Support keyboard and touch via native roles and min touch targets',
    'Respect data-ds-reduced-motion for animations',
  ],
  dos: [
    'Reuse ps-* components from the design system',
    'Compose with Bootstrap layout utilities',
    'Wire application logic in apps — not in these reference implementations',
  ],
  donts: [
    'Import from Plantasonic application repos',
    'Hardcode colors, spacing, or radius',
    'Implement audio, MIDI, or rendering engine logic here',
  ],
  implementationNotes: [
    'Styles: scss/plantasonic-components.scss',
    'All components use CSS custom properties for theme switching',
  ],
};

export function psSection(title: string, subtitle: string, body: string): string {
  return `${sectionHeader(title, subtitle)}${docBlock(PS_M3_DOC)}${body}`;
}

export function stateLabels(): string {
  return `<p class="small text-muted mb-3"><strong>States:</strong>
    ${['default', 'hover', 'focus', 'active', 'selected', 'disabled', 'loading'].map((s) => `<span class="bs-state-label">${s}</span>`).join(' ')}
    <span class="text-muted ms-1">— Tab · pointer · theme toggle in header</span></p>`;
}

export function variantRow(variants: string[]): string {
  return `<div class="d-flex flex-wrap gap-1 mb-3">${variants.map((v) => `<span class="badge bg-secondary">${v}</span>`).join('')}</div>`;
}

export function psComponent(meta: PsComponentMeta, html: string): string {
  const doc: DocMeta = {
    purpose: meta.purpose,
    usage: meta.usage,
    dos: meta.dos ?? PS_M3_DOC.dos,
    donts: meta.donts ?? PS_M3_DOC.donts,
    implementationNotes: [
      meta.description,
      ...(meta.variants?.length ? [`Variants: ${meta.variants.join(', ')}`] : []),
      ...(meta.states?.length ? [`States: ${meta.states.join(', ')}`] : []),
      ...(meta.bootstrap?.length ? [`Bootstrap: ${meta.bootstrap.join(', ')}`] : []),
      `Accessibility: ${meta.a11y.join('; ')}`,
      ...(meta.notes ?? []),
    ],
  };

  return `
    <article class="ps-component-doc mb-4" id="ps-${meta.name.toLowerCase().replace(/\s+/g, '-')}">
      <div class="card ds-demo-card" data-ds-tokens="${meta.tokens.join(',')}">
        <div class="card-header py-2 d-flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="small fw-semibold">${meta.name}</span>
          <code class="small text-muted">${meta.tokens.slice(0, 3).join(', ')}${meta.tokens.length > 3 ? '…' : ''}</code>
        </div>
        <div class="card-body">
          ${docBlock(doc)}
          ${meta.variants?.length ? variantRow(meta.variants) : ''}
          ${stateLabels()}
          <div class="ps-component-demo" data-ds-inspect>${html}</div>
        </div>
      </div>
    </article>`;
}

export function psDemoGrid(items: string): string {
  return `<div class="row g-3">${items}</div>`;
}

export function psDemoCol(content: string, cols = 'col-md-6 col-xl-4'): string {
  return `<div class="${cols}">${content}</div>`;
}
