import type { NotificationConfig } from './types';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function renderNotification(n: NotificationConfig): string {
  const variantClass =
    n.variant === 'success' ? ' ps-app-notification--success'
    : n.variant === 'warning' ? ' ps-app-notification--warning'
    : n.variant === 'error' ? ' ps-app-notification--error'
    : n.variant === 'banner' ? ' ps-app-notification--banner'
    : n.variant === 'progress' ? ' ps-app-notification--progress'
    : n.variant === 'background' ? ' ps-app-notification--background'
    : '';

  const progress = n.variant === 'progress' && n.progress != null
    ? `<div class="ps-app-notification__progress" role="progressbar" aria-valuenow="${n.progress}" aria-valuemin="0" aria-valuemax="100"><div style="width:${n.progress}%"></div></div>`
    : '';

  return `
    <div class="ps-app-notification${variantClass}" data-ps-notification="${escapeHtml(n.id)}" role="${n.variant === 'error' ? 'alert' : 'status'}">
      <div class="ps-app-notification__body">
        <strong class="ps-app-notification__title">${escapeHtml(n.title)}</strong>
        ${n.message ? `<span class="ps-app-notification__message">${escapeHtml(n.message)}</span>` : ''}
        ${progress}
      </div>
      ${n.dismissible !== false ? `<button type="button" class="ps-app-notification__dismiss" aria-label="Dismiss" data-ps-notification-dismiss>×</button>` : ''}
    </div>`;
}

export function renderNotificationHost(): string {
  return `<div class="ps-app-notification-host" data-ps-notification-host aria-live="polite"></div>`;
}

export class NotificationSystem {
  private host: HTMLElement | null = null;
  private queue: NotificationConfig[] = [];

  attach(root: HTMLElement): void {
    this.host = root.querySelector('[data-ps-notification-host]');
  }

  push(n: NotificationConfig): void {
    this.queue.push(n);
    this.host?.insertAdjacentHTML('beforeend', renderNotification(n));
    const el = this.host?.querySelector(`[data-ps-notification="${n.id}"]`);
    el?.querySelector('[data-ps-notification-dismiss]')?.addEventListener('click', () => this.dismiss(n.id));
    if (n.variant === 'toast') {
      setTimeout(() => this.dismiss(n.id), 4000);
    }
  }

  dismiss(id: string): void {
    this.queue = this.queue.filter((n) => n.id !== id);
    this.host?.querySelector(`[data-ps-notification="${id}"]`)?.remove();
  }

  clear(): void {
    this.queue = [];
    this.host?.replaceChildren();
  }
}

export const globalNotificationSystem = new NotificationSystem();
