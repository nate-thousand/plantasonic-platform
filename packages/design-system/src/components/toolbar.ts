/**
 * Toolbar + ToolbarGroup (Layer 1).
 *
 * Reuses the existing themed `.ps-toolbar` surface and adds accessible
 * grouping semantics (role="toolbar" / role="group").
 */
import { classList, escapeHtml } from './types.ts';

export type ToolbarOptions = {
  /** Accessible label for the toolbar landmark. */
  label: string;
  /** Pre-rendered group/control HTML. */
  content?: string;
  /** Orientation hint for arrow-key navigation. */
  orientation?: 'horizontal' | 'vertical';
  class?: string;
  id?: string;
};

export function toolbar(options: ToolbarOptions): string {
  const orientation = options.orientation ?? 'horizontal';
  const cls = classList('ps-toolbar', 'ds-c-toolbar', orientation === 'vertical' && 'ds-c-toolbar--vertical', options.class);
  const idAttr = options.id ? ` id="${escapeHtml(options.id)}"` : '';
  return `<div class="${cls}"${idAttr} role="toolbar" aria-orientation="${orientation}" aria-label="${escapeHtml(
    options.label,
  )}">${options.content ?? ''}</div>`;
}

export type ToolbarGroupOptions = {
  content?: string;
  /** Optional accessible label for the group. */
  label?: string;
  /** Render a divider before the group. */
  divider?: boolean;
  class?: string;
};

export function toolbarGroup(options: ToolbarGroupOptions = {}): string {
  const cls = classList('ds-c-toolbar-group', options.divider && 'ds-c-toolbar-group--divider', options.class);
  const label = options.label ? ` aria-label="${escapeHtml(options.label)}"` : '';
  return `<div class="${cls}" role="group"${label}>${options.content ?? ''}</div>`;
}
