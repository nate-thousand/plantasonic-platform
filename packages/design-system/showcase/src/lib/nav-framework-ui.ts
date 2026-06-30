import { docBlock, demoCard, sectionHeader, type DocMeta } from './ui';
import {
  EXAMPLE_SHELL,
  renderApplicationShell,
  type ApplicationShellConfig,
} from '@ds/shell';

export type NavFrameworkMeta = {
  name: string;
  purpose: string;
  description: string;
  usage: string;
  variants?: string[];
  a11y: string[];
  responsive?: string[];
  motion?: string[];
  dos?: string[];
  donts?: string[];
  notes?: string[];
};

export const NAV_M35_DOC: DocMeta = {
  purpose: 'Internal navigation infrastructure — consumed by Application Shell only.',
  usage: 'Applications use renderApplicationShell() from plantasonic-design-system/shell. Do not call navigation renderers directly.',
  bestPractices: [
    'Configure navigation via ApplicationShellConfig',
    'Use routes[] to wire pages into sidebar and command palette',
  ],
  dos: ['Use the public Application Shell API'],
  donts: ['Import internal navigation modules', 'Build sidebar markup manually'],
  implementationNotes: [
    'Internal: src/shell/internal/navigation.ts',
    'Styles: scss/navigation-framework.scss + scss/application-shell.scss',
  ],
};

export function navComponent(meta: NavFrameworkMeta, demoHtml: string, code?: string): string {
  const doc: DocMeta = {
    purpose: meta.purpose,
    usage: meta.usage,
    bestPractices: meta.notes ?? [],
    dos: meta.dos ?? [],
    donts: meta.donts ?? [],
    implementationNotes: [
      ...(meta.variants ? [`Variants: ${meta.variants.join(', ')}`] : []),
      ...(meta.responsive ? [`Responsive: ${meta.responsive.join('; ')}`] : []),
      ...(meta.motion ? [`Motion: ${meta.motion.join('; ')}`] : []),
      ...meta.a11y.map((a) => `A11y: ${a}`),
    ],
  };

  return `
    ${sectionHeader(meta.name, meta.description)}
    ${docBlock(doc)}
    ${demoCard(demoHtml, code)}
  `;
}

export function demoShell(
  config: Partial<ApplicationShellConfig> = {},
  workspaceHtml = '<div class="ps-workspace"><p class="text-muted small mb-0">Workspace content slot</p></div>',
  height = '22rem',
  wrap = true,
): string {
  const inner = renderApplicationShell(config, workspaceHtml);
  if (!wrap) return inner;
  return `
    <div style="height:${height};position:relative" data-ps-demo-shell>
      ${inner}
    </div>`;
}

export function navSection(title: string, intro: string, body: string): string {
  return `
    ${sectionHeader(title, intro)}
    ${docBlock(NAV_M35_DOC)}
    ${body}
  `;
}

export { EXAMPLE_SHELL };
