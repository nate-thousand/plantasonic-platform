import { docBlock, demoCard, sectionHeader, type DocMeta } from './ui';
import {
  renderApplicationShell,
  EXAMPLE_SHELL,
  SHOWCASE_SHELL,
  renderPanelStack,
  type ApplicationShellConfig,
} from '@ds/shell';

export const SHELL_M4_DOC: DocMeta = {
  purpose: 'Application Shell — the operating system layer between the Design System and every Plantasonic application.',
  usage: 'import { renderApplicationShell, bindApplicationShell } from "plantasonic-design-system/shell"',
  bestPractices: [
    'Configure shell with ApplicationShellConfig',
    'Register commands with action handlers',
    'Use routes[] to wire navigation and command palette',
  ],
  dos: [
    'Inherit the shell from the design system package',
    'Call bindApplicationShell() after renderApplicationShell()',
  ],
  donts: [
    'Import from Plantasonic application or engine repos',
    'Use renderAppShell — removed; use renderApplicationShell only',
  ],
  implementationNotes: [
    'Package API: plantasonic-design-system/shell',
    'Styles: scss/application-shell.scss',
  ],
};

export type ShellModuleMeta = {
  name: string;
  purpose: string;
  description: string;
  usage: string;
  config?: string;
  a11y?: string[];
  responsive?: string[];
  motion?: string[];
};

export function shellModule(meta: ShellModuleMeta, demoHtml: string, code?: string): string {
  const doc: DocMeta = {
    purpose: meta.purpose,
    usage: meta.usage,
    bestPractices: meta.config ? [`Configuration: ${meta.config}`] : [],
    dos: meta.a11y?.map((a) => `A11y: ${a}`) ?? [],
    donts: [],
    implementationNotes: [...(meta.responsive ?? []), ...(meta.motion ?? [])],
  };
  return `${sectionHeader(meta.name, meta.description)}${docBlock(doc)}${demoCard(demoHtml, code)}`;
}

export function demoAppShell(
  config: Partial<ApplicationShellConfig> = {},
  height = '32rem',
  workspaceContent?: string,
): string {
  const shellConfig = { ...SHOWCASE_SHELL, ...config };
  return `
    <div style="height:${height};min-height:28rem;position:relative;border-radius:var(--ds-radius-lg);overflow:hidden;border:1px solid var(--ds-color-border-subtle)" data-ps-app-shell-demo="${shellConfig.id ?? 'demo'}">
      ${renderApplicationShell(shellConfig, workspaceContent)}
    </div>`;
}

export function shellOverview(): string {
  return `
    ${sectionHeader('Application Shell Framework', 'The reusable operating system for every Plantasonic experience.')}
    ${docBlock(SHELL_M4_DOC)}
    <div class="row g-3 mb-4">
      <div class="col-md-3"><div class="card h-100"><div class="card-body"><h3 class="h6">App Frame</h3><p class="small text-muted mb-0">Header, sidebar, workspace, inspector, dock, overlay layer.</p></div></div></div>
      <div class="col-md-3"><div class="card h-100"><div class="card-body"><h3 class="h6">Workspace Manager</h3><p class="small text-muted mb-0">Single, split, inspector, fullscreen, floating, focus.</p></div></div></div>
      <div class="col-md-3"><div class="card h-100"><div class="card-body"><h3 class="h6">Command Registry</h3><p class="small text-muted mb-0">Register commands; shell executes via palette and shortcuts.</p></div></div></div>
      <div class="col-md-3"><div class="card h-100"><div class="card-body"><h3 class="h6">Window State</h3><p class="small text-muted mb-0">Persist sidebar, dock, theme, workspace, panels.</p></div></div></div>
    </div>
    ${shellModule(
      { name: 'Live Application Shell', purpose: 'Complete configured shell demo.', description: 'Interactive — try ⌘K, workspace modes, overlays, notifications.', usage: 'renderApplicationShell(EXAMPLE_SHELL)' },
      demoAppShell(SHOWCASE_SHELL),
      `import { renderApplicationShell, bindApplicationShell, SHOWCASE_SHELL } from 'plantasonic-design-system/shell';

root.innerHTML = renderApplicationShell(SHOWCASE_SHELL);
bindApplicationShell(SHOWCASE_SHELL);`,
    )}
  `;
}

export { EXAMPLE_SHELL, SHOWCASE_SHELL, renderPanelStack };
