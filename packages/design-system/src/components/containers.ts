/**
 * Card, Section, ControlGroup (Layer 1).
 *
 * Composition components built on themed Bootstrap `.card` and existing
 * `.ps-section-header` / `.ps-param-group` surfaces. `surface` is re-exported
 * from the layout primitives to avoid duplicating that implementation.
 */
import { classList, escapeHtml } from './types.ts';

export { surface } from '../primitives/index.ts';
export type { SurfaceOptions, SurfaceLevel } from '../primitives/index.ts';

export type CardOptions = {
  title?: string;
  subtitle?: string;
  /** Body HTML. */
  content?: string;
  /** Footer HTML. */
  footer?: string;
  /** Header action HTML (e.g. icon buttons). */
  actions?: string;
  /** Render with a focus ring + cursor affordance for clickable cards. */
  interactive?: boolean;
  ariaLabel?: string;
  id?: string;
  class?: string;
};

export function card(options: CardOptions = {}): string {
  const cls = classList('card', 'ds-c-card', options.interactive && 'ds-c-card--interactive', options.class);
  const idAttr = options.id ? ` id="${escapeHtml(options.id)}"` : '';
  const label = options.ariaLabel ? ` aria-label="${escapeHtml(options.ariaLabel)}"` : '';
  const tabindex = options.interactive ? ' tabindex="0"' : '';

  const header =
    options.title || options.actions
      ? `<div class="card-header ds-c-card__header">
          <div class="ds-c-card__heading">
            ${options.title ? `<span class="ds-c-card__title">${escapeHtml(options.title)}</span>` : ''}
            ${options.subtitle ? `<span class="ds-c-card__subtitle">${escapeHtml(options.subtitle)}</span>` : ''}
          </div>
          ${options.actions ? `<div class="ds-c-card__actions">${options.actions}</div>` : ''}
        </div>`
      : '';
  const body = options.content !== undefined ? `<div class="card-body ds-c-card__body">${options.content}</div>` : '';
  const footer = options.footer ? `<div class="card-footer ds-c-card__footer">${options.footer}</div>` : '';

  return `<div class="${cls}"${idAttr}${label}${tabindex}>${header}${body}${footer}</div>`;
}

export type SectionOptions = {
  title: string;
  description?: string;
  content?: string;
  /** Action HTML rendered at the end of the heading row. */
  actions?: string;
  id?: string;
  class?: string;
};

export function section(options: SectionOptions): string {
  const cls = classList('ds-c-section', options.class);
  const idAttr = options.id ? ` id="${escapeHtml(options.id)}"` : '';
  const titleId = options.id ? `${options.id}-title` : undefined;
  return `<section class="${cls}"${idAttr}${titleId ? ` aria-labelledby="${titleId}"` : ` aria-label="${escapeHtml(options.title)}"`}>
    <div class="ds-c-section__head">
      <div>
        <h2 class="ps-section-header ds-c-section__title"${titleId ? ` id="${titleId}"` : ''}>${escapeHtml(options.title)}</h2>
        ${options.description ? `<p class="ds-c-section__desc">${escapeHtml(options.description)}</p>` : ''}
      </div>
      ${options.actions ? `<div class="ds-c-section__actions">${options.actions}</div>` : ''}
    </div>
    <div class="ds-c-section__body">${options.content ?? ''}</div>
  </section>`;
}

export type ControlGroupOptions = {
  label: string;
  content?: string;
  /** Layout direction of the controls. */
  direction?: 'row' | 'column';
  /** Hide the visible label but keep it accessible. */
  hideLabel?: boolean;
  id?: string;
  class?: string;
};

export function controlGroup(options: ControlGroupOptions): string {
  const cls = classList('ps-param-group', 'ds-c-control-group', `ds-c-control-group--${options.direction ?? 'column'}`, options.class);
  const idAttr = options.id ? ` id="${escapeHtml(options.id)}"` : '';
  const labelCls = classList('ps-section-header', 'ds-c-control-group__label', options.hideLabel && 'visually-hidden');
  return `<div class="${cls}"${idAttr} role="group" aria-label="${escapeHtml(options.label)}">
    <div class="${labelCls}">${escapeHtml(options.label)}</div>
    <div class="ds-c-control-group__controls">${options.content ?? ''}</div>
  </div>`;
}
