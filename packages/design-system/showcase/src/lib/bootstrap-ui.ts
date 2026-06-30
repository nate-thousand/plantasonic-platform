import { docBlock, demoCard, sectionHeader, type DocMeta } from './ui';

export const BS_M2_DOC: DocMeta = {
  purpose: 'Prove Bootstrap 5.0.2 is fully transformed into the Plantasonic visual language.',
  usage: 'Reference before building any product UI. Every component consumes centralized design tokens only.',
  bestPractices: [
    'Switch dark and light themes to verify token resolution',
    'Use token inspector on any component during development',
    'Tab through interactive demos to verify focus visibility',
  ],
  dos: [
    'Use Bootstrap classes with Plantasonic theme imports',
    'Override appearance via tokens and css-theme-bridge only',
  ],
  donts: [
    'Hardcode colors, spacing, or radius in component code',
    'Edit Bootstrap source in node_modules',
    'Import styles from the Plantasonic application',
  ],
  implementationNotes: [
    'Import order: bootstrap-theme → bootstrap → bootstrap-components → bootstrap-utilities',
    'css-theme-bridge.scss re-exports components + utilities for backward compatibility',
    'Runtime theming via css/variables.css and data-theme attribute',
  ],
};

export function bsSection(title: string, subtitle: string, body: string): string {
  return `${sectionHeader(title, subtitle)}${docBlock(BS_M2_DOC)}${body}`;
}

export function stateHint(): string {
  return `<p class="small text-muted mb-3"><strong>States:</strong>
    <span class="bs-state-label">default</span>
    <span class="bs-state-label">hover</span>
    <span class="bs-state-label">focus</span>
    <span class="bs-state-label">active</span>
    <span class="bs-state-label">selected</span>
    <span class="bs-state-label">disabled</span>
    <span class="text-muted ms-1">— Tab to inspect focus; switch themes in header</span></p>`;
}

export function bsDemo(title: string, body: string, tokens: string[] = [], classes = ''): string {
  return demoCard(title, `${stateHint()}${body}`, tokens);
}
