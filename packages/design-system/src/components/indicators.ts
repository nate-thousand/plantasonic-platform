/**
 * Badge + StatusIndicator (Layer 1).
 *
 * Badge reuses the themed Bootstrap `.badge`; StatusIndicator reuses the
 * existing `.ps-status-dot` shape and maps status to status color tokens.
 */
import { classList, escapeHtml } from './types.ts';

export type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'error' | 'info';

export type BadgeOptions = {
  label: string;
  variant?: BadgeVariant;
  /** Pill (fully rounded) shape. */
  pill?: boolean;
  /** Render a small leading dot. */
  dot?: boolean;
  class?: string;
};

export function badge(options: BadgeOptions): string {
  const variant = options.variant ?? 'default';
  const cls = classList('badge', 'ds-c-badge', `ds-c-badge--${variant}`, options.pill && 'rounded-pill', options.class);
  const dot = options.dot ? '<span class="ds-c-badge__dot" aria-hidden="true"></span>' : '';
  return `<span class="${cls}">${dot}${escapeHtml(options.label)}</span>`;
}

export type StatusKind = 'online' | 'active' | 'idle' | 'busy' | 'error' | 'offline';

export type StatusIndicatorOptions = {
  status: StatusKind;
  /** Visible label text. */
  label: string;
  /** Hide the label visually but keep it for screen readers. */
  hideLabel?: boolean;
  /** Animate the dot (e.g. for live/active states). */
  pulse?: boolean;
  class?: string;
};

export function statusIndicator(options: StatusIndicatorOptions): string {
  const cls = classList('ds-c-status', `ds-c-status--${options.status}`, options.class);
  const dotCls = classList('ps-status-dot', 'ds-c-status__dot', options.pulse && 'ds-c-status__dot--pulse');
  const labelCls = classList('ds-c-status__label', options.hideLabel && 'visually-hidden');
  return `<span class="${cls}" role="status">
    <span class="${dotCls}" aria-hidden="true"></span>
    <span class="${labelCls}">${escapeHtml(options.label)}</span>
  </span>`;
}
