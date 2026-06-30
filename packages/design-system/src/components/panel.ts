/**
 * Panel + PanelHeader (Layer 1).
 *
 * Reuses the shell's themed `.ps-panel` structure so panels are visually
 * identical whether rendered by the shell or composed directly by an app.
 */
import { classList, escapeHtml } from './types.ts';

export type PanelHeaderOptions = {
  title: string;
  /** Pre-rendered action HTML (e.g. icon buttons), placed at the end. */
  actions?: string;
  /** When set, renders the header as a collapse toggle. */
  collapsible?: boolean;
  collapsed?: boolean;
  id?: string;
  class?: string;
};

export function panelHeader(options: PanelHeaderOptions): string {
  const cls = classList('ps-panel__header', 'ds-c-panel__header', options.class);
  const idAttr = options.id ? ` id="${escapeHtml(options.id)}"` : '';
  if (options.collapsible) {
    const expanded = options.collapsed ? 'false' : 'true';
    return `<div class="${cls}"${idAttr} role="button" tabindex="0" aria-expanded="${expanded}" data-ds-panel-toggle>
      <span class="ds-c-panel__title">${escapeHtml(options.title)}</span>
      ${options.actions ? `<span class="ds-c-panel__actions">${options.actions}</span>` : ''}
    </div>`;
  }
  return `<div class="${cls}"${idAttr}>
    <span class="ds-c-panel__title">${escapeHtml(options.title)}</span>
    ${options.actions ? `<span class="ds-c-panel__actions">${options.actions}</span>` : ''}
  </div>`;
}

export type PanelOptions = {
  title: string;
  content?: string;
  actions?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  /** Accessible label (defaults to title). */
  ariaLabel?: string;
  id?: string;
  class?: string;
};

export function panel(options: PanelOptions): string {
  const cls = classList(
    'ps-panel',
    'ds-c-panel',
    options.collapsed && 'ps-panel--collapsed',
    options.class,
  );
  const idAttr = options.id ? ` id="${escapeHtml(options.id)}"` : '';
  const header = panelHeader({
    title: options.title,
    actions: options.actions,
    collapsible: options.collapsible,
    collapsed: options.collapsed,
  });
  return `<section class="${cls}"${idAttr} aria-label="${escapeHtml(options.ariaLabel ?? options.title)}"${
    options.collapsed ? ' data-ds-panel-state="collapsed"' : ''
  }>
    ${header}
    <div class="ps-panel__body ds-c-panel__body">${options.content ?? ''}</div>
  </section>`;
}
