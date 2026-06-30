import type { ShellWindowState, ThemeMode, WorkspaceMode, PanelState } from './types';

const STORAGE_PREFIX = 'ps-shell-state';

function storageKey(id: string): string {
  return `${STORAGE_PREFIX}:${id}`;
}

export const DEFAULT_WINDOW_STATE: ShellWindowState = {
  sidebarCollapsed: false,
  inspectorWidth: 280,
  dockVisible: true,
  theme: 'dark',
  workspaceMode: 'single',
  panelStates: {},
};

export function loadWindowState(shellId: string): ShellWindowState {
  try {
    const raw = localStorage.getItem(storageKey(shellId));
    if (!raw) return { ...DEFAULT_WINDOW_STATE };
    return { ...DEFAULT_WINDOW_STATE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_WINDOW_STATE };
  }
}

export function saveWindowState(shellId: string, state: Partial<ShellWindowState>): ShellWindowState {
  const current = loadWindowState(shellId);
  const next = { ...current, ...state };
  localStorage.setItem(storageKey(shellId), JSON.stringify(next));
  return next;
}

export function updatePanelState(shellId: string, panelId: string, state: PanelState): ShellWindowState {
  const current = loadWindowState(shellId);
  return saveWindowState(shellId, {
    panelStates: { ...current.panelStates, [panelId]: state },
  });
}

export function resolveTheme(mode: ThemeMode): 'dark' | 'light' {
  if (mode === 'auto') {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return mode;
}

export function applyWorkspaceMode(root: HTMLElement, mode: WorkspaceMode): void {
  root.dataset.psWorkspace = mode;
  root.classList.toggle('ps-app-shell--fullscreen', mode === 'fullscreen' || mode === 'focus');
  root.classList.toggle('ps-app-shell--focus', mode === 'focus');
}
