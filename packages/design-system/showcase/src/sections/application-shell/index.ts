import { demoAppShell, renderPanelStack, shellModule, shellOverview } from '../../lib/shell-ui';
import { EXAMPLE_SHELL } from '@ds/shell';

export function renderShellOverview(): string {
  return shellOverview();
}

export function renderShellAppFrame(): string {
  return shellModule(
    {
      name: 'App Frame',
      purpose: 'Primary application frame with configurable regions.',
      description: 'Header, sidebar, workspace, inspector, bottom dock, and overlay layer. Each region can be disabled via regions config.',
      usage: 'regions: { header, sidebar, workspace, inspector, dock, overlay }',
      config: 'ApplicationShellConfig.regions',
      a11y: ['Landmark roles on all regions', 'Overlay layer aria-live'],
    },
    demoAppShell({ regions: { header: true, sidebar: true, workspace: true, inspector: true, dock: true, overlay: true } }),
  );
}

export function renderShellWorkspace(): string {
  return shellModule(
    {
      name: 'Workspace Manager',
      purpose: 'Reusable workspace engine — apps select layout, shell renders.',
      description: 'Switch workspace modes below. State persists when persistState is enabled.',
      usage: 'workspace: single | split | inspector | fullscreen | floating | focus',
      config: 'ApplicationShellConfig.workspace',
      motion: ['Workspace transitions respect reduced-motion'],
    },
    `
    <div data-ps-app-shell-demo="workspace">
      <div class="btn-group btn-group-sm mb-2 flex-wrap" role="group" aria-label="Workspace modes">
        <button type="button" class="btn btn-outline-secondary active" data-ps-workspace-mode="single">Single</button>
        <button type="button" class="btn btn-outline-secondary" data-ps-workspace-mode="split">Split</button>
        <button type="button" class="btn btn-outline-secondary" data-ps-workspace-mode="floating">Floating</button>
        <button type="button" class="btn btn-outline-secondary" data-ps-workspace-mode="focus">Focus</button>
        <button type="button" class="btn btn-outline-secondary" data-ps-workspace-mode="fullscreen">Fullscreen</button>
      </div>
      ${demoAppShell({ workspace: 'single' }, '20rem')}
    </div>`,
  );
}

export function renderShellDocks(): string {
  return shellModule(
    {
      name: 'Dock Framework',
      purpose: 'Left, right, bottom, and floating docks — apps register items.',
      description: 'Left dock renders beside the frame. Bottom transport dock is part of the navigation shell.',
      usage: 'docks: [{ position, items: [{ id, label, icon }] }]',
      config: 'ApplicationShellConfig.docks',
      a11y: ['Dock items have aria-label', 'Active state visible'],
    },
    `
    <div class="row g-3">
      <div class="col-md-4">
        <div class="small text-muted mb-1">Left dock</div>
        <aside class="ps-app-dock ps-app-dock--left" style="min-height:10rem" aria-label="left dock">
          <button type="button" class="ps-app-dock__item ps-app-dock__item--active" data-ps-dock-item="tools">⚒</button>
          <button type="button" class="ps-app-dock__item" data-ps-dock-item="layers">▦</button>
        </aside>
      </div>
      <div class="col-md-8">
        <div class="small text-muted mb-1">Floating dock</div>
        <div style="position:relative;height:6rem;background:var(--ds-color-surface-app);border-radius:var(--ds-radius-lg)">
          <aside class="ps-app-dock ps-app-dock--floating" aria-label="floating dock">
            <button type="button" class="ps-app-dock__item">▶</button>
            <button type="button" class="ps-app-dock__item">■</button>
            <button type="button" class="ps-app-dock__item">●</button>
          </aside>
        </div>
      </div>
    </div>`,
  );
}

export function renderShellPanels(): string {
  return shellModule(
    {
      name: 'Panel System',
      purpose: 'Collapsible, resizable, pinnable, floatable panels.',
      description: 'Click headers to collapse. Use pin and float actions on panel headers.',
      usage: 'panels: [{ id, title, state, resizable }]',
      config: 'ApplicationShellConfig.panels',
      a11y: ['aria-expanded on headers', 'Focus-visible on panel actions'],
    },
    `<div data-ps-app-shell-demo="panels">${renderPanelStack(EXAMPLE_SHELL.panels ?? [])}</div>`,
  );
}

export function renderShellOverlays(): string {
  return shellModule(
    {
      name: 'Overlay Manager',
      purpose: 'Modal, drawer, loading, error, popover, context menu — shell manages lifecycle.',
      description: 'Applications request overlays; shell renders and dismisses them.',
      usage: 'globalOverlayManager.show({ id, type, title, message })',
      a11y: ['role="dialog" aria-modal on modals', 'Escape and backdrop dismiss'],
      motion: ['Dialog scale + fade', 'Drawer slide'],
    },
    `
    <div data-ps-app-shell-demo="overlays" style="position:relative;height:14rem;border:1px solid var(--ds-color-border-subtle);border-radius:var(--ds-radius-lg)">
      <div class="p-3 d-flex flex-wrap gap-2">
        <button type="button" class="btn btn-sm btn-outline-secondary" data-ps-show-modal>Modal</button>
        <button type="button" class="btn btn-sm btn-outline-secondary" data-ps-show-drawer>Drawer</button>
        <button type="button" class="btn btn-sm btn-outline-secondary" data-ps-show-loading>Loading</button>
        <button type="button" class="btn btn-sm btn-outline-secondary" data-ps-show-error>Error</button>
      </div>
      <div class="ps-app-overlay-layer" data-ps-overlay-layer></div>
    </div>`,
  );
}

export function renderShellNotifications(): string {
  return shellModule(
    {
      name: 'Notification System',
      purpose: 'Toast, banner, success, warning, error, progress notifications with queueing.',
      description: 'Click buttons to push notifications. Toasts auto-dismiss.',
      usage: 'globalNotificationSystem.push({ id, variant, title, message })',
      a11y: ['role="alert" for errors', 'role="status" for toasts', 'Dismiss buttons labeled'],
      motion: ['Slide-in animation on push'],
    },
    `
    <div data-ps-app-shell-demo="notifications" style="position:relative;height:12rem;border:1px solid var(--ds-color-border-subtle);border-radius:var(--ds-radius-lg)">
      <div class="p-3 d-flex flex-wrap gap-2">
        <button type="button" class="btn btn-sm btn-outline-secondary" data-ps-notify-toast>Toast</button>
        <button type="button" class="btn btn-sm btn-outline-secondary" data-ps-notify-success>Success</button>
        <button type="button" class="btn btn-sm btn-outline-secondary" data-ps-notify-warning>Warning</button>
        <button type="button" class="btn btn-sm btn-outline-secondary" data-ps-notify-progress>Progress</button>
      </div>
      <div class="ps-app-notification-host" data-ps-notification-host></div>
    </div>`,
  );
}

export function renderShellTheme(): string {
  return shellModule(
    {
      name: 'Theme Provider',
      purpose: 'Dark, light, and auto themes with runtime switching — no page refresh.',
      description: 'Cycle through dark → light → auto. Auto follows system preference.',
      usage: 'initShellTheme(); setShellTheme(mode); cycleShellTheme()',
      config: 'ApplicationShellConfig.theme',
    },
    `
    <div class="d-flex align-items-center gap-3">
      <button type="button" class="btn btn-outline-secondary" data-ps-theme-cycle>Cycle theme</button>
      <span class="small text-muted">Current: <strong data-ps-theme-label>dark</strong></span>
    </div>
    <p class="small text-muted mt-2 mb-0">Theme applies via data-theme on documentElement — same token system as the rest of the design system.</p>`,
  );
}

export function renderShellKeyboard(): string {
  return shellModule(
    {
      name: 'Keyboard Framework',
      purpose: 'Global shortcuts, command palette, context shortcuts, focus management.',
      description: 'Applications register commands with shortcuts; shell binds and executes them.',
      usage: 'registerShellCommands(commands, root); bindKeyboardFramework()',
      a11y: ['Shortcuts do not fire when typing in inputs', 'Escape closes overlays'],
    },
    `
    <table class="table table-sm">
      <thead><tr><th>Shortcut</th><th>Action</th></tr></thead>
      <tbody>
        <tr><td><kbd>⌘K</kbd></td><td>Command palette</td></tr>
        <tr><td><kbd>/</kbd></td><td>Focus search</td></tr>
        <tr><td><kbd>F</kbd></td><td>Focus mode workspace</td></tr>
        <tr><td><kbd>⌘⇧T</kbd></td><td>Toggle theme (when registered)</td></tr>
        <tr><td><kbd>Escape</kbd></td><td>Close overlay / palette</td></tr>
      </tbody>
    </table>
    ${demoAppShell({}, '14rem')}`,
  );
}

export function renderShellResponsive(): string {
  return shellModule(
    {
      name: 'Layout Engine',
      purpose: 'Responsive behavior for desktop, tablet, mobile, touch, ultra-wide.',
      description: 'Resize the showcase viewport — side docks hide on tablet, inspector collapses, touch targets preserved.',
      usage: 'Automatic via application-shell.scss breakpoints (992px, 1600px)',
      responsive: ['Tablet: side docks hidden', 'Ultra-wide: wider inspector', 'Mobile: compact chrome'],
    },
    demoAppShell(),
  );
}

export function renderShellWindowState(): string {
  return shellModule(
    {
      name: 'Window State',
      purpose: 'Persist sidebar, panel, inspector, dock, theme, and workspace layout.',
      description: 'Toggle sidebar or dock, switch workspace — state saves to localStorage.',
      usage: 'persistState: true; loadWindowState(shellId); saveWindowState(shellId, partial)',
      config: 'ApplicationShellConfig.persistState',
    },
    `
    <div data-ps-app-shell-demo="state">
      <div class="btn-group btn-group-sm mb-2">
        <button type="button" class="btn btn-outline-secondary" data-ps-sidebar-collapse>Toggle sidebar</button>
        <button type="button" class="btn btn-outline-secondary" data-ps-dock-toggle>Toggle dock</button>
        <button type="button" class="btn btn-outline-secondary" data-ps-restore-state>Show saved state</button>
      </div>
      ${demoAppShell({ persistState: true, id: 'state-demo' }, '18rem')}
    </div>`,
  );
}
