import type { PanelConfig, PanelState, ShellWindowState, WorkspaceMode } from './types';
import { renderNavigationFrame, renderCommandPalette } from './internal/navigation';
import type { DockConfig, DockItemConfig } from './types';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function renderDockItems(items: DockItemConfig[]): string {
  return items
    .map(
      (item) =>
        `<button type="button" class="ps-app-dock__item${item.active ? ' ps-app-dock__item--active' : ''}" data-ps-dock-item="${escapeHtml(item.id)}" aria-label="${escapeHtml(item.label)}"${item.icon ? ` title="${escapeHtml(item.label)}"` : ''}>
          ${item.icon ? `<span aria-hidden="true">${item.icon}</span>` : escapeHtml(item.label)}
          ${item.badge ? `<span class="ps-app-dock__badge">${escapeHtml(item.badge)}</span>` : ''}
        </button>`,
    )
    .join('');
}

export function renderDock(dock: DockConfig): string {
  if (dock.visible === false) return '';
  const pos = dock.position;
  return `
    <aside class="ps-app-dock ps-app-dock--${escapeHtml(pos)}" data-ps-dock="${escapeHtml(pos)}" aria-label="${escapeHtml(pos)} dock">
      ${renderDockItems(dock.items)}
    </aside>`;
}

export function renderDocks(docks: DockConfig[]): string {
  return docks.map(renderDock).join('');
}

export function renderPanel(panel: PanelConfig): string {
  const state = panel.state ?? 'expanded';
  const cls = [
    'ps-panel',
    state === 'collapsed' ? 'ps-panel--collapsed' : '',
    state === 'floating' ? 'ps-panel--detached' : '',
    state === 'pinned' ? 'ps-app-panel--pinned' : '',
    state === 'hidden' ? 'ps-app-panel--hidden' : '',
  ].filter(Boolean).join(' ');

  return `
    <div class="${cls}" data-ps-panel="${escapeHtml(panel.id)}" data-ps-panel-state="${state}">
      <div class="ps-panel__header" tabindex="0" data-ps-panel-toggle role="button" aria-expanded="${state !== 'collapsed'}">
        <span>${escapeHtml(panel.title)}</span>
        <span class="ps-app-panel__actions">
          <button type="button" class="ps-app-panel__action" data-ps-panel-pin aria-label="Pin panel" title="Pin">📌</button>
          <button type="button" class="ps-app-panel__action" data-ps-panel-float aria-label="Float panel" title="Float">⧉</button>
        </span>
      </div>
      <div class="ps-panel__body">${panel.content ?? `<p class="small text-muted mb-0">${escapeHtml(panel.title)} content slot</p>`}</div>
      ${panel.resizable ? '<div class="ps-panel__resize" aria-hidden="true"></div>' : ''}
    </div>`;
}

export function renderPanelStack(panels: PanelConfig[]): string {
  return `<div class="ps-panel-stack ps-app-panel-stack">${panels.map(renderPanel).join('')}</div>`;
}

export function renderWorkspace(mode: WorkspaceMode, content?: string): string {
  const inner = content ?? defaultWorkspaceContent(mode);
  const cls = [
    'ps-workspace',
    'ps-app-workspace',
    mode === 'split' ? 'ps-workspace--split' : '',
    mode === 'floating' ? 'ps-workspace--floating' : '',
    mode === 'focus' ? 'ps-app-workspace--focus' : '',
  ].filter(Boolean).join(' ');

  return `<div class="${cls}" data-ps-workspace-mode="${mode}">${inner}</div>`;
}

function defaultWorkspaceContent(mode: WorkspaceMode): string {
  switch (mode) {
    case 'split':
      return '<div>Primary view</div><div>Secondary view</div>';
    case 'floating':
      return '<p class="text-muted small">Main workspace</p><div class="ps-workspace__float ps-floating-panel"><strong>Floating panel</strong><p class="small text-muted mb-0">Detachable content</p></div>';
    case 'inspector':
      return '<p class="text-muted small">Workspace with inspector layout — inspector renders in shell region.</p>';
    case 'fullscreen':
    case 'focus':
      return '<p class="text-muted small mb-0">Immersive workspace — chrome hidden in focus mode.</p>';
    default:
      return '<p class="text-muted small mb-0">Single view workspace content slot.</p>';
  }
}

export function renderAppFrame(options: {
  shellHtml: string;
  docksHtml: string;
  overlayHtml: string;
  notificationHtml: string;
  shellId: string;
}): string {
  return `
    <div class="ps-app-shell" data-ps-app-shell data-shell-id="${escapeHtml(options.shellId)}">
      ${options.docksHtml}
      ${options.shellHtml}
      ${options.overlayHtml}
      ${options.notificationHtml}
    </div>`;
}

export function applyPanelStates(panels: PanelConfig[], panelStates: Record<string, PanelState>): PanelConfig[] {
  return panels.map((p) => {
    const nextState = panelStates[p.id] ?? p.state;
    if (nextState !== undefined) return { ...p, state: nextState };
    return { ...p };
  });
}

export function resolveLayoutFromState(state: ShellWindowState | null): string[] {
  const mods: string[] = [];
  if (state?.sidebarCollapsed) mods.push('sidebar-collapsed');
  if (state?.dockVisible === false) mods.push('no-dock');
  return mods;
}

export { renderNavigationFrame, renderCommandPalette };
