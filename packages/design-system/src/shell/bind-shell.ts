import { mergeShellConfig } from './config';
import type { ApplicationShellConfig, PanelState, ShellCommand, WorkspaceMode } from './types';
import { globalCommandRegistry } from './command-registry';
import { globalNotificationSystem } from './notification-system';
import { globalOverlayManager } from './overlay-manager';
import { filterCommands, fuzzyMatch } from './internal/navigation';
import { collectRouteSearchItems, mergeRoutesIntoNavigation } from './routes';
import { cycleShellTheme, initShellTheme } from './theme-provider';
import { applyWorkspaceMode, loadWindowState, saveWindowState, updatePanelState } from './window-state';

type ShortcutBinding = {
  key: string;
  mod?: boolean;
  shift?: boolean;
  handler: () => void;
  when?: () => boolean;
};

const RECENT_SEARCH_KEY = 'ps-nav-recent-searches';
const shortcuts: ShortcutBinding[] = [];
const boundRoots = new WeakSet<HTMLElement>();
let globalInitialized = false;
let activeConfig: ApplicationShellConfig | null = null;

function getRecentSearches(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCH_KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
}

function pushRecentSearch(q: string): void {
  if (!q.trim()) return;
  const recent = [q, ...getRecentSearches().filter((r) => r !== q)].slice(0, 5);
  localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(recent));
}

function findShellRoot(el: HTMLElement): HTMLElement {
  return el.closest('[data-ps-app-shell-demo], [data-ps-demo-shell], [data-ps-app-shell]') as HTMLElement ?? el;
}

function openPalette(root: HTMLElement): void {
  const palette = root.querySelector<HTMLElement>('[data-ps-command-palette]');
  const input = root.querySelector<HTMLInputElement>('[data-ps-command-input]');
  if (!palette) return;
  palette.hidden = false;
  palette.classList.add('ps-command-palette--open');
  input?.focus();
}

function closePalette(root: HTMLElement): void {
  const palette = root.querySelector<HTMLElement>('[data-ps-command-palette]');
  if (!palette) return;
  palette.classList.remove('ps-command-palette--open');
  palette.hidden = true;
}

function executeCommand(id: string, root: HTMLElement): void {
  const executed = globalCommandRegistry.execute(id);
  if (!executed && id.startsWith('route:')) {
    const routeId = id.slice('route:'.length);
    document.dispatchEvent(new CustomEvent('ps-shell-navigate', { detail: { routeId } }));
  }
  closePalette(root);
}

function bindPaletteItems(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>('[data-ps-command-palette] .ps-command-palette__item').forEach((btn) => {
    if (btn.dataset.psBound) return;
    btn.dataset.psBound = '1';
    btn.addEventListener('click', () => {
      const id = btn.dataset.commandId;
      if (id) executeCommand(id, root);
    });
  });
}

function updatePaletteFilter(root: HTMLElement, query: string): void {
  const results = root.querySelector('[data-ps-command-palette] .ps-command-palette__results');
  if (!results) return;
  const commands = globalCommandRegistry.list();
  const filtered = filterCommands(commands, query);
  const grouped = filtered.reduce<Record<string, typeof commands>>((acc, c) => {
    (acc[c.group] ??= []).push(c);
    return acc;
  }, {});

  results.innerHTML = Object.entries(grouped)
    .map(
      ([group, cmds]) => `
        <div class="ps-command-palette__group-label">${group}</div>
        ${cmds
          .map(
            (c, i) =>
              `<button type="button" class="ps-command-palette__item${i === 0 && !query ? ' ps-command-palette__item--active' : ''}" data-command-id="${c.id}" role="option"><span>${c.label}</span>${c.shortcut ? `<kbd>${c.shortcut}</kbd>` : ''}</button>`,
          )
          .join('')}`,
    )
    .join('') || '<div class="p-3 text-muted small">No matching commands</div>';

  bindPaletteItems(root);
}

function bindSearchInput(_root: HTMLElement, input: HTMLInputElement, dropdown: HTMLElement): void {
  if (input.dataset.psBound) return;
  input.dataset.psBound = '1';

  const commands = globalCommandRegistry.list();
  const routeItems = collectRouteSearchItems(activeConfig?.routes);
  const searchItems = [...commands.map((c) => c.label), ...routeItems, 'Settings', 'Theme'];
  let activeIndex = -1;

  function renderResults(q: string): void {
    const recent = getRecentSearches();
    const matches = q
      ? searchItems.filter((i) => fuzzyMatch(q, i)).slice(0, 8)
      : recent.map((r) => `Recent: ${r}`);

    if (!matches.length) {
      dropdown.classList.remove('ps-search__dropdown--open');
      dropdown.innerHTML = '';
      return;
    }

    dropdown.classList.add('ps-search__dropdown--open');
    dropdown.innerHTML = matches
      .map(
        (m, i) =>
          `<button type="button" class="ps-search__result${m.startsWith('Recent:') ? ' ps-search__result--recent' : ''}${i === activeIndex ? ' ps-search__result--active' : ''}" role="option">${m.replace(/^Recent: /, '')}</button>`,
      )
      .join('');
  }

  input.addEventListener('input', () => {
    activeIndex = -1;
    renderResults(input.value);
  });
  input.addEventListener('focus', () => renderResults(input.value));
  input.addEventListener('blur', () => {
    setTimeout(() => dropdown.classList.remove('ps-search__dropdown--open'), 150);
  });
  input.addEventListener('keydown', (e) => {
    const options = dropdown.querySelectorAll<HTMLElement>('.ps-search__result');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, options.length - 1);
      renderResults(input.value);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      renderResults(input.value);
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      pushRecentSearch(input.value);
      dropdown.classList.remove('ps-search__dropdown--open');
    } else if (e.key === 'Escape') {
      dropdown.classList.remove('ps-search__dropdown--open');
    }
  });
}

export function registerShortcut(binding: ShortcutBinding): void {
  shortcuts.push(binding);
}

export function registerShellCommands(commands: ShellCommand[]): void {
  globalCommandRegistry.registerAll(commands);
  commands.forEach((cmd) => {
    if (!cmd.shortcut || !cmd.action) return;
    const parts = cmd.shortcut.toLowerCase();
    registerShortcut({
      key: parts.replace(/[⌘ctrl⇧shift]/g, '').trim() || parts,
      mod: parts.includes('⌘') || parts.includes('ctrl'),
      shift: parts.includes('⇧') || parts.includes('shift'),
      handler: () => cmd.action?.(),
    });
  });
}

function buildCommands(config: ApplicationShellConfig): ShellCommand[] {
  const { navigation, routeCommands } = mergeRoutesIntoNavigation(config.navigation, config.routes);
  const base = config.commands ?? navigation.commands ?? [];
  const merged = [...base];
  for (const rc of routeCommands) {
    if (!merged.some((c) => c.id === rc.id)) merged.push(rc);
  }
  return merged;
}

function applyPersistedDomState(root: HTMLElement, shellId: string): void {
  const state = loadWindowState(shellId);
  const innerShell = root.querySelector<HTMLElement>('[data-ps-shell]');
  if (innerShell) {
    if (state.sidebarCollapsed) innerShell.classList.add('ps-shell--sidebar-collapsed');
    if (!state.dockVisible) innerShell.classList.add('ps-shell--no-dock');
    innerShell.style.setProperty('--ps-shell-inspector-width', `${state.inspectorWidth}px`);
  }
  applyWorkspaceMode(root.querySelector<HTMLElement>('[data-ps-app-shell]') ?? root, state.workspaceMode);

  root.querySelectorAll<HTMLElement>('[data-ps-panel]').forEach((panel) => {
    const id = panel.dataset.psPanel;
    if (!id || !state.panelStates[id]) return;
    applyPanelDomState(panel, state.panelStates[id]);
  });
}

function applyPanelDomState(panel: HTMLElement, state: PanelState): void {
  panel.dataset.psPanelState = state;
  panel.classList.toggle('ps-panel--collapsed', state === 'collapsed');
  panel.classList.toggle('ps-panel--detached', state === 'floating');
  panel.classList.toggle('ps-app-panel--pinned', state === 'pinned');
  panel.classList.toggle('ps-app-panel--hidden', state === 'hidden');
}

function persistPanelState(shellId: string, panel: HTMLElement): void {
  const id = panel.dataset.psPanel;
  if (!id) return;
  const state = (panel.dataset.psPanelState ?? 'expanded') as PanelState;
  updatePanelState(shellId, id, state);
}

function bindRoot(root: HTMLElement, config: ApplicationShellConfig): void {
  if (boundRoots.has(root)) {
    applyPersistedDomState(root, config.id ?? 'default');
    return;
  }
  boundRoots.add(root);

  const shellId = config.id ?? root.dataset.psAppShellDemo ?? root.dataset.shellId ?? 'default';
  globalOverlayManager.attach(root);
  globalNotificationSystem.attach(root);
  applyPersistedDomState(root, shellId);

  root.querySelector('[data-ps-command-trigger]')?.addEventListener('click', () => openPalette(root));
  root.querySelector('[data-ps-sidebar-toggle]')?.addEventListener('click', () => {
    root.querySelector('[data-ps-shell]')?.classList.toggle('ps-shell--sidebar-floating-open');
  });
  root.querySelector('[data-ps-inspector-toggle]')?.addEventListener('click', () => {
    const inner = root.querySelector('[data-ps-shell]');
    inner?.classList.toggle('ps-shell--inspector-hidden');
    if (config.persistState) {
      saveWindowState(shellId, { inspectorWidth: loadWindowState(shellId).inspectorWidth });
    }
  });

  const cmdInput = root.querySelector<HTMLInputElement>('[data-ps-command-input]');
  cmdInput?.addEventListener('input', () => updatePaletteFilter(root, cmdInput.value));
  root.querySelector('[data-ps-command-palette]')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closePalette(root);
  });

  const searchInput = root.querySelector<HTMLInputElement>('[data-ps-search-input]');
  const dropdown = root.querySelector<HTMLElement>('[data-ps-search-dropdown]');
  if (searchInput && dropdown) bindSearchInput(root, searchInput, dropdown);

  bindPaletteItems(root);
  updatePaletteFilter(root, '');

  root.querySelectorAll<HTMLElement>('[data-ps-nav-id], [data-ps-route-id]').forEach((el) => {
    el.addEventListener('click', () => {
      const routeId = (el as HTMLElement).dataset.psRouteId;
      if (routeId) {
        document.dispatchEvent(new CustomEvent('ps-shell-navigate', { detail: { routeId } }));
      }
    });
  });
}

function bindDemoControls(config: ApplicationShellConfig): void {
  document.querySelectorAll<HTMLElement>('[data-ps-app-shell-demo]').forEach((demo) => bindRoot(demo, config));
  document.querySelectorAll<HTMLElement>('[data-ps-demo-shell]').forEach((demo) => bindRoot(demo, config));

  document.querySelectorAll<HTMLElement>('[data-ps-app-shell-demo]').forEach((demo) => {
    if (demo.dataset.psDemoBound) return;
    demo.dataset.psDemoBound = '1';
    const shellId = demo.dataset.psAppShellDemo ?? config.id ?? 'demo';
    const innerShell = demo.querySelector<HTMLElement>('[data-ps-shell]');

    demo.querySelector('[data-ps-show-modal]')?.addEventListener('click', () => {
      globalOverlayManager.show({ id: 'demo-modal', type: 'modal', title: 'Shell Modal', message: 'Applications request overlays; the shell manages them.' });
    });
    demo.querySelector('[data-ps-show-drawer]')?.addEventListener('click', () => {
      globalOverlayManager.show({ id: 'demo-drawer', type: 'drawer', title: 'Drawer', message: 'Side panel overlay.', position: 'right' });
    });
    demo.querySelector('[data-ps-show-loading]')?.addEventListener('click', () => {
      globalOverlayManager.show({ id: 'demo-loading', type: 'loading', message: 'Processing…' });
      setTimeout(() => globalOverlayManager.hide('demo-loading'), 2000);
    });
    demo.querySelector('[data-ps-show-error]')?.addEventListener('click', () => {
      globalOverlayManager.show({ id: 'demo-error', type: 'error', title: 'Connection lost', message: 'Unable to reach engine.' });
    });
    demo.querySelector('[data-ps-notify-toast]')?.addEventListener('click', () => {
      globalNotificationSystem.push({ id: `toast-${Date.now()}`, variant: 'toast', title: 'Preset saved', message: 'My Lead Pad' });
    });
    demo.querySelector('[data-ps-notify-success]')?.addEventListener('click', () => {
      globalNotificationSystem.push({ id: `ok-${Date.now()}`, variant: 'success', title: 'Export complete' });
    });
    demo.querySelector('[data-ps-notify-warning]')?.addEventListener('click', () => {
      globalNotificationSystem.push({ id: `warn-${Date.now()}`, variant: 'warning', title: 'CPU load high', message: 'Consider reducing voices.' });
    });
    demo.querySelector('[data-ps-notify-progress]')?.addEventListener('click', () => {
      globalNotificationSystem.push({ id: `prog-${Date.now()}`, variant: 'progress', title: 'Rendering', progress: 45 });
    });
    demo.querySelectorAll<HTMLElement>('[data-ps-workspace-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.psWorkspaceMode as WorkspaceMode;
        const shell = demo.querySelector<HTMLElement>('[data-ps-app-shell]');
        if (shell) applyWorkspaceMode(shell, mode);
        demo.querySelectorAll('[data-ps-workspace-mode]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        if (config.persistState) saveWindowState(shellId, { workspaceMode: mode });
      });
    });
    demo.querySelector('[data-ps-sidebar-collapse]')?.addEventListener('click', () => {
      innerShell?.classList.toggle('ps-shell--sidebar-collapsed');
      if (config.persistState) {
        saveWindowState(shellId, { sidebarCollapsed: innerShell?.classList.contains('ps-shell--sidebar-collapsed') ?? false });
      }
    });
    demo.querySelector('[data-ps-dock-toggle]')?.addEventListener('click', () => {
      innerShell?.classList.toggle('ps-shell--no-dock');
      if (config.persistState) {
        saveWindowState(shellId, { dockVisible: !innerShell?.classList.contains('ps-shell--no-dock') });
      }
    });
    demo.querySelector('[data-ps-restore-state]')?.addEventListener('click', () => {
      alert(`Saved state:\n${JSON.stringify(loadWindowState(shellId), null, 2)}`);
    });
  });

  document.querySelectorAll<HTMLElement>('[data-ps-layout-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const demo = btn.closest('[data-ps-demo-shell]');
      const shell = demo?.querySelector<HTMLElement>('[data-ps-shell]');
      if (!shell) return;
      const mode = btn.dataset.psLayoutToggle;
      shell.className = 'ps-shell';
      if (mode && mode !== 'default') shell.classList.add(`ps-shell--${mode}`);
      demo?.querySelectorAll('[data-ps-layout-toggle]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  document.querySelectorAll<HTMLElement>('[data-ps-rail-item]').forEach((item, _, all) => {
    item.addEventListener('click', () => {
      all.forEach((el) => el.classList.remove('ps-nav-rail__item--active'));
      item.classList.add('ps-nav-rail__item--active');
    });
  });

  document.querySelectorAll<HTMLElement>('[data-ps-panel-toggle]').forEach((header) => {
    header.addEventListener('click', () => {
      const panel = header.closest('.ps-panel') as HTMLElement | null;
      if (!panel) return;
      panel.classList.toggle('ps-panel--collapsed');
      const state: PanelState = panel.classList.contains('ps-panel--collapsed') ? 'collapsed' : 'expanded';
      panel.dataset.psPanelState = state;
      const shellRoot = findShellRoot(header);
      const sid = shellRoot?.dataset.psAppShellDemo ?? config.id ?? 'default';
      if (config.persistState) persistPanelState(sid, panel);
    });
  });

  document.querySelectorAll<HTMLElement>('[data-ps-panel-pin]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const panel = btn.closest('.ps-panel') as HTMLElement | null;
      if (!panel) return;
      panel.classList.toggle('ps-app-panel--pinned');
      panel.dataset.psPanelState = panel.classList.contains('ps-app-panel--pinned') ? 'pinned' : 'expanded';
    });
  });

  document.querySelectorAll<HTMLElement>('[data-ps-panel-float]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const panel = btn.closest('.ps-panel') as HTMLElement | null;
      if (!panel) return;
      panel.classList.toggle('ps-panel--detached');
      panel.dataset.psPanelState = panel.classList.contains('ps-panel--detached') ? 'floating' : 'expanded';
    });
  });

  document.querySelectorAll<HTMLElement>('[data-ps-dock-item]').forEach((item) => {
    item.addEventListener('click', () => {
      item.parentElement?.querySelectorAll('.ps-app-dock__item').forEach((el) => el.classList.remove('ps-app-dock__item--active'));
      item.classList.add('ps-app-dock__item--active');
    });
  });

  document.querySelectorAll('[data-ps-theme-cycle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = cycleShellTheme();
      document.querySelectorAll('[data-ps-theme-label]').forEach((el) => { el.textContent = mode; });
      if (config.persistState && config.id) saveWindowState(config.id, { theme: mode });
    });
  });
}

function initGlobalKeyboard(_config: ApplicationShellConfig): void {
  if (globalInitialized) return;
  globalInitialized = true;

  registerShortcut({
    key: 'k',
    mod: true,
    handler: () => {
      const demo =
        document.querySelector<HTMLElement>('[data-ps-demo-shell]') ??
        document.querySelector<HTMLElement>('[data-ps-app-shell-demo]') ??
        document.querySelector<HTMLElement>('[data-ps-app-shell]');
      if (demo) openPalette(demo);
    },
  });

  registerShortcut({
    key: 'f',
    handler: () => {
      document.querySelectorAll<HTMLElement>('[data-ps-app-shell]').forEach((s) => applyWorkspaceMode(s, 'focus'));
    },
  });

  document.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      if (e.key !== 'Escape') return;
    }
    if (e.key === '/' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
      const searchInput =
        document.activeElement?.closest('[data-ps-app-shell-demo], [data-ps-demo-shell], [data-ps-app-shell]')
          ?.querySelector<HTMLInputElement>('[data-ps-search-input]') ??
        document.querySelector<HTMLInputElement>('[data-ps-search-input]');
      if (!searchInput) return;
      e.preventDefault();
      searchInput.focus();
      return;
    }
    if (e.key === 'Escape') {
      document.querySelectorAll<HTMLElement>('[data-ps-demo-shell], [data-ps-app-shell-demo], [data-ps-app-shell]').forEach(closePalette);
      globalOverlayManager.hideAll();
      return;
    }
    const mod = e.metaKey || e.ctrlKey;
    for (const s of shortcuts) {
      const modOk = s.mod ? mod : !mod;
      const shiftOk = s.shift ? e.shiftKey : !e.shiftKey || s.key.length > 1;
      if (!modOk || !shiftOk) continue;
      if (e.key.toLowerCase() === s.key.toLowerCase()) {
        e.preventDefault();
        s.handler();
        return;
      }
    }
  });
}

export type BindShellOptions = {
  /** When false, do not call initShellTheme — host app owns data-theme. */
  manageTheme?: boolean;
  /** When false, skip document-level ⌘K, /, F shortcuts. */
  globalKeyboard?: boolean;
};

/** Bind shell interactions. Call after renderApplicationShell(). Safe to call on route changes. */
export function bindApplicationShell(
  config: Partial<ApplicationShellConfig> = {},
  options: BindShellOptions = {},
): void {
  const merged = mergeShellConfig(config);
  activeConfig = merged;
  const { manageTheme = true, globalKeyboard = true } = options;

  if (manageTheme) {
    initShellTheme(merged.theme ?? loadWindowState(merged.id ?? 'default').theme);
  }
  registerShellCommands(buildCommands(merged));
  if (globalKeyboard) initGlobalKeyboard(merged);
  bindDemoControls(merged);

  document.querySelectorAll<HTMLElement>('[data-ps-app-shell][data-shell-id]').forEach((root) => {
    if (!root.closest('[data-ps-app-shell-demo]') && !root.closest('[data-ps-demo-shell]')) {
      bindRoot(root, merged);
    }
  });
}
