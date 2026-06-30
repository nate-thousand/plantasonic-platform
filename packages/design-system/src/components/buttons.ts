/**
 * Button + IconButton (Layer 1).
 *
 * Token-driven `.ds-c-btn` markup. Pairs with scss/components.scss. The base
 * `.btn` reset from Bootstrap is reused for consistency, while all color,
 * spacing, radius, and motion come from design tokens.
 */
import { classList, escapeHtml, type Size } from './types.ts';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'subtle' | 'danger';

export type ButtonOptions = {
  label: string;
  variant?: ButtonVariant;
  size?: Size;
  /** Leading icon glyph or inline SVG string. */
  icon?: string;
  /** Trailing icon glyph or inline SVG string. */
  iconEnd?: string;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  /** Toggle button pressed state (sets aria-pressed). */
  pressed?: boolean;
  type?: 'button' | 'submit' | 'reset';
  id?: string;
  /** Override the accessible name (else uses label). */
  ariaLabel?: string;
  class?: string;
  /** Extra attributes string, e.g. `data-action="play"`. */
  attrs?: string;
};

export function button(options: ButtonOptions): string {
  const variant = options.variant ?? 'primary';
  const size = options.size ?? 'md';
  const cls = classList(
    'btn',
    'ds-c-btn',
    `ds-c-btn--${variant}`,
    size !== 'md' && `ds-c-btn--${size}`,
    options.fullWidth && 'ds-c-btn--block',
    options.loading && 'ds-c-btn--loading',
    options.class,
  );
  const aria = options.ariaLabel ? ` aria-label="${escapeHtml(options.ariaLabel)}"` : '';
  const pressed = options.pressed !== undefined ? ` aria-pressed="${options.pressed}"` : '';
  const busy = options.loading ? ' aria-busy="true"' : '';
  const disabled = options.disabled || options.loading ? ' disabled' : '';
  const idAttr = options.id ? ` id="${escapeHtml(options.id)}"` : '';
  const spinner = options.loading ? '<span class="ds-c-btn__spinner" aria-hidden="true"></span>' : '';
  const lead = options.icon ? `<span class="ds-c-btn__icon" aria-hidden="true">${options.icon}</span>` : '';
  const trail = options.iconEnd ? `<span class="ds-c-btn__icon" aria-hidden="true">${options.iconEnd}</span>` : '';

  return `<button type="${options.type ?? 'button'}" class="${cls}"${idAttr}${aria}${pressed}${busy}${disabled}${
    options.attrs ? ` ${options.attrs}` : ''
  }>${spinner}${lead}<span class="ds-c-btn__label">${escapeHtml(options.label)}</span>${trail}</button>`;
}

export type IconButtonOptions = {
  /** Icon glyph or inline SVG string. */
  icon: string;
  /** Required accessible name. */
  ariaLabel: string;
  variant?: ButtonVariant;
  size?: Size;
  disabled?: boolean;
  pressed?: boolean;
  /** Tooltip text (title attribute). */
  title?: string;
  type?: 'button' | 'submit' | 'reset';
  id?: string;
  class?: string;
  attrs?: string;
};

export function iconButton(options: IconButtonOptions): string {
  const variant = options.variant ?? 'ghost';
  const size = options.size ?? 'md';
  const cls = classList(
    'btn',
    'ds-c-btn',
    'ds-c-icon-btn',
    `ds-c-btn--${variant}`,
    size !== 'md' && `ds-c-btn--${size}`,
    options.class,
  );
  const pressed = options.pressed !== undefined ? ` aria-pressed="${options.pressed}"` : '';
  const disabled = options.disabled ? ' disabled' : '';
  const idAttr = options.id ? ` id="${escapeHtml(options.id)}"` : '';
  const title = options.title ? ` title="${escapeHtml(options.title)}"` : '';

  return `<button type="${options.type ?? 'button'}" class="${cls}"${idAttr} aria-label="${escapeHtml(
    options.ariaLabel,
  )}"${title}${pressed}${disabled}${options.attrs ? ` ${options.attrs}` : ''}><span aria-hidden="true">${
    options.icon
  }</span></button>`;
}
