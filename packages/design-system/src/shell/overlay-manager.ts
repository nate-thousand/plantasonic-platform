import type { OverlayRequest } from './types';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function renderOverlayLayer(): string {
  return `<div class="ps-app-overlay-layer" data-ps-overlay-layer aria-live="polite"></div>`;
}

export function renderOverlayMarkup(req: OverlayRequest): string {
  const { type, title, message, position = 'center' } = req;

  switch (type) {
    case 'modal':
      return `
        <div class="ps-app-overlay ps-app-overlay--modal ps-app-overlay--open" data-ps-overlay="${escapeHtml(req.id)}" role="dialog" aria-modal="true" aria-label="${escapeHtml(title ?? 'Dialog')}">
          <div class="ps-app-overlay__backdrop" data-ps-overlay-close></div>
          <div class="ps-app-overlay__dialog">
            ${title ? `<h3 class="ps-app-overlay__title">${escapeHtml(title)}</h3>` : ''}
            ${message ? `<p class="ps-app-overlay__message">${escapeHtml(message)}</p>` : ''}
            <div class="ps-app-overlay__actions">
              <button type="button" class="btn btn-sm btn-primary" data-ps-overlay-close>OK</button>
            </div>
          </div>
        </div>`;
    case 'drawer':
      return `
        <div class="ps-app-overlay ps-app-overlay--drawer ps-app-overlay--${escapeHtml(position)} ps-app-overlay--open" data-ps-overlay="${escapeHtml(req.id)}" role="dialog" aria-modal="true">
          <div class="ps-app-overlay__backdrop" data-ps-overlay-close></div>
          <div class="ps-app-overlay__drawer">
            ${title ? `<h3 class="ps-app-overlay__title">${escapeHtml(title)}</h3>` : ''}
            ${message ? `<p class="ps-app-overlay__message">${escapeHtml(message)}</p>` : ''}
          </div>
        </div>`;
    case 'loading':
      return `
        <div class="ps-app-overlay ps-app-overlay--loading ps-app-overlay--open" data-ps-overlay="${escapeHtml(req.id)}" role="status" aria-live="polite">
          <div class="ps-app-overlay__backdrop"></div>
          <div class="ps-loading-overlay ps-loading-overlay--active"><span class="ps-spinner"></span><span>${escapeHtml(message ?? 'Loading…')}</span></div>
        </div>`;
    case 'error':
      return `
        <div class="ps-app-overlay ps-app-overlay--error ps-app-overlay--open" data-ps-overlay="${escapeHtml(req.id)}" role="alertdialog" aria-modal="true">
          <div class="ps-app-overlay__backdrop" data-ps-overlay-close></div>
          <div class="ps-app-overlay__dialog">
            <h3 class="ps-app-overlay__title">${escapeHtml(title ?? 'Error')}</h3>
            <p class="ps-app-overlay__message">${escapeHtml(message ?? 'Something went wrong.')}</p>
            <button type="button" class="btn btn-sm btn-outline-secondary" data-ps-overlay-close>Dismiss</button>
          </div>
        </div>`;
    case 'popover':
      return `
        <div class="ps-app-overlay ps-app-overlay--popover ps-app-overlay--open" data-ps-overlay="${escapeHtml(req.id)}" role="tooltip">
          <div class="ps-app-overlay__popover">${escapeHtml(message ?? title ?? '')}</div>
        </div>`;
    case 'context-menu':
      return `
        <div class="ps-app-overlay ps-app-overlay--context ps-app-overlay--open" data-ps-overlay="${escapeHtml(req.id)}" role="menu">
          <div class="ps-app-overlay__menu">
            <button type="button" class="ps-app-overlay__menu-item" role="menuitem">Copy</button>
            <button type="button" class="ps-app-overlay__menu-item" role="menuitem">Paste</button>
            <button type="button" class="ps-app-overlay__menu-item" role="menuitem" data-ps-overlay-close>Close</button>
          </div>
        </div>`;
    default:
      return `
        <div class="ps-app-overlay ps-app-overlay--tooltip ps-app-overlay--open" data-ps-overlay="${escapeHtml(req.id)}" role="tooltip">
          ${escapeHtml(message ?? title ?? '')}
        </div>`;
  }
}

export class OverlayManager {
  private layer: HTMLElement | null = null;

  attach(root: HTMLElement): void {
    this.layer = root.querySelector('[data-ps-overlay-layer]');
  }

  show(req: OverlayRequest): void {
    if (!this.layer) return;
    this.layer.insertAdjacentHTML('beforeend', renderOverlayMarkup(req));
    this.bindClose(this.layer.querySelector(`[data-ps-overlay="${req.id}"]`) as HTMLElement);
  }

  hide(id: string): void {
    this.layer?.querySelector(`[data-ps-overlay="${id}"]`)?.remove();
  }

  hideAll(): void {
    this.layer?.querySelectorAll('[data-ps-overlay]').forEach((el) => el.remove());
  }

  private bindClose(el: HTMLElement | null): void {
    if (!el) return;
    el.querySelectorAll('[data-ps-overlay-close]').forEach((btn) => {
      btn.addEventListener('click', () => el.remove());
    });
    el.querySelector('.ps-app-overlay__backdrop')?.addEventListener('click', () => el.remove());
  }
}

export const globalOverlayManager = new OverlayManager();
