import { demoShell, navComponent, navSection } from '../../lib/nav-framework-ui';

export function renderNavOverview(): string {
  return navSection(
    'Navigation & Workspace Framework',
    'Reusable app shell, navigation, and workspace architecture — the control surface every Plantasonic application inherits.',
    `
    <div class="row g-3 mb-4">
      <div class="col-md-4"><div class="card h-100"><div class="card-body"><h3 class="h6">App Shell</h3><p class="small text-muted mb-0">Header, sidebar, workspace, dock, inspector, status.</p></div></div></div>
      <div class="col-md-4"><div class="card h-100"><div class="card-body"><h3 class="h6">Command Palette</h3><p class="small text-muted mb-0">⌘K universal command surface with fuzzy search.</p></div></div></div>
      <div class="col-md-4"><div class="card h-100"><div class="card-body"><h3 class="h6">Developer API</h3><p class="small text-muted mb-0">Configure navigation with data — never build nav manually.</p></div></div></div>
    </div>
    ${navComponent(
      {
        name: 'Live App Shell',
        purpose: 'Complete application frame demonstrating all shell regions.',
        description: 'Interactive demo — try ⌘K, / to focus search, sidebar toggle on narrow viewports.',
        usage: 'renderApplicationShell(config) from plantasonic-design-system/shell',
        variants: ['default', 'sidebar-collapsed', 'sidebar-floating', 'inspector-hidden', 'fullscreen'],
        a11y: ['Landmark roles (banner, main, nav, contentinfo)', 'Keyboard shortcuts with visible focus', 'ARIA labels on toggles'],
        responsive: ['Sidebar overlays on tablet/mobile', 'Dock persists on mobile'],
        motion: ['Sidebar slide', 'Command palette fade + translate', 'Inspector slide'],
        dos: ['Provide config only from applications'],
        donts: ['Copy shell HTML into apps — use renderAppShell'],
      },
      demoShell(),
      `import { renderApplicationShell, EXAMPLE_SHELL } from 'plantasonic-design-system/shell';

const html = renderApplicationShell(EXAMPLE_SHELL, workspaceContent);`,
    )}
    `,
  );
}

export function renderNavAppShell(): string {
  return `
    ${navComponent(
      {
        name: 'Layout Modes',
        purpose: 'Shell supports multiple layout modifiers without changing identity.',
        description: 'Toggle layout modes below the shell updates grid areas and visibility.',
        usage: 'Add ps-shell--{modifier} classes or set config.layout',
        variants: ['sidebar-collapsed', 'sidebar-hidden', 'sidebar-floating', 'inspector-left', 'no-dock', 'fullscreen'],
        a11y: ['Focus remains in workspace when regions hide', 'Toggle buttons labeled'],
        responsive: ['Floating sidebar on tablet', 'Hidden inspector on small screens'],
      },
      `
      <div data-ps-demo-shell>
        <div class="btn-group btn-group-sm mb-2 flex-wrap" role="group" aria-label="Layout modes">
          <button type="button" class="btn btn-outline-secondary active" data-ps-layout-toggle="default">Default</button>
          <button type="button" class="btn btn-outline-secondary" data-ps-layout-toggle="sidebar-collapsed">Collapsed</button>
          <button type="button" class="btn btn-outline-secondary" data-ps-layout-toggle="sidebar-floating">Floating</button>
          <button type="button" class="btn btn-outline-secondary" data-ps-layout-toggle="inspector-hidden">No Inspector</button>
          <button type="button" class="btn btn-outline-secondary" data-ps-layout-toggle="no-dock">No Dock</button>
          <button type="button" class="btn btn-outline-secondary" data-ps-layout-toggle="fullscreen">Fullscreen</button>
        </div>
        <div style="height:22rem;position:relative">
          ${demoShell({}, '<div class="ps-workspace ps-workspace--split"><div>Panel A</div><div>Panel B</div></div>', '22rem', false)}
        </div>
      </div>
      `,
    )}
  `;
}

export function renderNavSidebar(): string {
  return navComponent(
    {
      name: 'Sidebar',
      purpose: 'Primary navigation with groups, nesting, badges, and favorites.',
      description: 'Expanded sidebar with nested items under Routing.',
      usage: 'Define groups[] and items[] in NavigationConfig',
      variants: ['expanded', 'collapsed', 'floating', 'hidden'],
      a11y: ['role="group" on sections', 'Active state on current item', 'Min touch target 44px'],
    },
    `
    <div style="max-width:16rem;border:1px solid var(--ds-color-border-subtle);border-radius:var(--ds-radius-lg);padding:var(--ds-space-2);background:var(--ds-color-surface-nav)">
      <div class="ps-nav-group"><div class="ps-nav-group__label">Perform</div>
        <button type="button" class="ps-nav-item ps-nav-item--active ps-nav-item--favorite"><span class="ps-nav-item__icon">◉</span>Stage</button>
        <button type="button" class="ps-nav-item"><span class="ps-nav-item__icon">▤</span>Mixer</button>
        <button type="button" class="ps-nav-item ps-nav-item--nested">Inputs</button>
        <button type="button" class="ps-nav-item ps-nav-item--nested">Outputs</button>
      </div>
      <div class="ps-nav-group"><div class="ps-nav-group__label">Create</div>
        <button type="button" class="ps-nav-item"><span class="ps-nav-item__icon">▦</span>Presets<span class="ps-nav-item__badge">12</span></button>
      </div>
    </div>`,
  );
}

export function renderNavRail(): string {
  return navComponent(
    {
      name: 'Navigation Rail',
      purpose: 'Compact icon-only navigation with hover tooltips.',
      description: 'Use on narrow layouts or as collapsed sidebar replacement.',
      usage: 'ps-nav-rail with ps-nav-rail__item elements',
      a11y: ['data-tooltip for hover labels', 'aria-current on active item', 'Focus-visible ring'],
    },
    `
    <nav class="ps-nav-rail" aria-label="Icon navigation" style="min-height:14rem">
      <button type="button" class="ps-nav-rail__item ps-nav-rail__item--active" data-ps-rail-item data-tooltip="Stage" aria-current="page">◉</button>
      <button type="button" class="ps-nav-rail__item" data-ps-rail-item data-tooltip="Mixer">▤</button>
      <button type="button" class="ps-nav-rail__item" data-ps-rail-item data-tooltip="Presets">▦</button>
      <button type="button" class="ps-nav-rail__item" data-ps-rail-item data-tooltip="Settings">⚙</button>
    </nav>`,
  );
}

export function renderNavTopbar(): string {
  return navComponent(
    {
      name: 'Top Bar',
      purpose: 'Application-agnostic header with title, breadcrumbs, search, and actions.',
      description: 'Slots for profile and quick actions — content comes from apps.',
      usage: 'ps-shell__topbar with ps-topbar-title, ps-breadcrumbs, ps-search',
      a11y: ['role="banner"', 'Search input labeled', 'Keyboard shortcut hints in kbd'],
    },
    `
    <header class="ps-shell__topbar" style="border:1px solid var(--ds-color-border-subtle);border-radius:var(--ds-radius-lg)">
      <h2 class="ps-topbar-title">Perform</h2>
      <ol class="ps-breadcrumbs"><li><a href="#">Workspace</a></li><li><a href="#">Perform</a></li><li>Main Stage</li></ol>
      <div class="ps-search"><span class="ps-search__icon">⌕</span><input class="ps-search__input" placeholder="Search…" aria-label="Search" /></div>
      <div class="ps-topbar-actions">
        <button type="button" class="ps-shell__topbar-action">Commands <kbd>⌘K</kbd></button>
      </div>
    </header>`,
  );
}

export function renderNavDock(): string {
  return navComponent(
    {
      name: 'Bottom Dock',
      purpose: 'Transport, status, notifications, and quick actions strip.',
      description: 'Applications decide dock content — framework provides the container.',
      usage: 'ps-shell__dock with ps-transport and ps-shell__status slots',
      a11y: ['role="contentinfo"', 'Transport buttons with aria-label'],
    },
    `
    <footer class="ps-shell__dock" style="border:1px solid var(--ds-color-border-subtle);border-radius:var(--ds-radius-lg)">
      <div class="ps-transport" style="border:0;background:transparent;padding:0;min-height:auto">
        <button type="button" class="ps-transport-btn ps-transport-btn--primary" aria-label="Play">▶</button>
        <button type="button" class="ps-transport-btn" aria-label="Stop">■</button>
        <button type="button" class="ps-transport-btn" aria-label="Record">●</button>
      </div>
      <div class="ps-shell__status"><span class="ps-status-dot ps-status-dot--active"></span> 120 BPM · MIDI In</div>
    </footer>`,
  );
}

export function renderNavInspector(): string {
  return navComponent(
    {
      name: 'Inspector Panel',
      purpose: 'Contextual parameter editing and metadata.',
      description: 'Right, left, or floating modes via shell modifiers.',
      usage: 'ps-shell__inspector — toggle with ps-shell--inspector-hidden',
      variants: ['right (default)', 'left (ps-shell--inspector-left)', 'floating'],
      motion: ['Slide transition on open/close'],
      a11y: ['aria-label="Inspector"', 'Scrollable region'],
    },
    `
    <aside class="ps-shell__inspector" style="max-width:16rem;border:1px solid var(--ds-color-border-subtle);border-radius:var(--ds-radius-lg)" aria-label="Inspector">
      <div class="ps-section-header">Filter</div>
      <div class="ps-param-group"><label class="ps-param-label">Cutoff</label><div class="ps-control-cluster"><div class="ps-knob ps--compact" style="--ps-knob-value:65" role="presentation"><div class="ps-knob__ring"></div><div class="ps-knob__indicator"></div></div></div></div>
      <div class="ps-param-group mt-2"><label class="ps-param-label">Resonance</label><input type="range" class="ps-slider" min="0" max="100" value="40" /></div>
    </aside>`,
  );
}

export function renderNavWorkspace(): string {
  return navComponent(
    {
      name: 'Workspace Layouts',
      purpose: 'Reusable workspace regions — apps choose a layout.',
      description: 'Single, split, inspector, fullscreen, and floating panel modes.',
      usage: 'ps-workspace with --split, --floating modifiers inside ps-shell__main',
      responsive: ['Split stacks on mobile'],
    },
    `
    <div class="row g-3">
      <div class="col-md-6"><div class="border rounded p-2"><div class="small text-muted mb-1">Single</div><div class="ps-workspace bg-dark-subtle rounded" style="min-height:6rem">Content</div></div></div>
      <div class="col-md-6"><div class="border rounded p-2"><div class="small text-muted mb-1">Split</div><div class="ps-workspace ps-workspace--split rounded overflow-hidden" style="min-height:6rem"><div>A</div><div>B</div></div></div></div>
    </div>`,
  );
}

export function renderNavPanels(): string {
  return navComponent(
    {
      name: 'Panels',
      purpose: 'Collapsible, resizable, detachable panel system.',
      description: 'Click headers to collapse. Stack panels vertically.',
      usage: 'ps-panel, ps-panel-stack, data-ps-panel-toggle on header',
      a11y: ['Header is focusable button', 'Collapsed state hides body from layout'],
    },
    `
    <div class="ps-panel-stack" style="max-width:24rem">
      <div class="ps-panel"><div class="ps-panel__header" tabindex="0" data-ps-panel-toggle>Mixer <span aria-hidden="true">▼</span></div><div class="ps-panel__body">Channel strips…</div></div>
      <div class="ps-panel ps-panel--collapsed"><div class="ps-panel__header" tabindex="0" data-ps-panel-toggle>Effects <span aria-hidden="true">▶</span></div><div class="ps-panel__body">Effect chain…</div></div>
      <div class="ps-panel ps-panel--detached"><div class="ps-panel__header" tabindex="0">Floating Panel</div><div class="ps-panel__body">Detached content</div><div class="ps-panel__resize" aria-hidden="true"></div></div>
    </div>`,
  );
}

export function renderNavCommandPalette(): string {
  return navComponent(
    {
      name: 'Command Palette',
      purpose: 'Universal command system — ⌘K or trigger button.',
      description: 'Applications register commands; framework provides search and keyboard UX.',
      usage: 'renderCommandPalette(commands) + bindNavigationFramework()',
      a11y: ['role="dialog" aria-modal', 'Arrow keys in results', 'Escape closes'],
      motion: ['Backdrop fade', 'Dialog translateY'],
    },
    `<p class="small text-muted">Press <kbd>⌘K</kbd> or click Commands in the shell demo below.</p>${demoShell({}, '<div class="ps-workspace"><p class="text-muted small">Try ⌘K</p></div>', '18rem')}`,
  );
}

export function renderNavSearch(): string {
  return navComponent(
    {
      name: 'Search',
      purpose: 'Fuzzy search with grouped results and recent searches.',
      description: 'Type in the top bar search — arrow keys navigate results.',
      usage: 'ps-search with data-ps-search-input — bind via bindNavigationDemos()',
      a11y: ['role="listbox" on dropdown', 'aria-label on input'],
    },
    demoShell({}, '<div class="ps-workspace"><p class="text-muted small">Press <kbd>/</kbd> to focus search</p></div>', '18rem'),
  );
}

export function renderNavBreadcrumbs(): string {
  return navComponent(
    {
      name: 'Breadcrumbs',
      purpose: 'Hierarchy navigation — apps provide items, DS renders.',
      description: 'Ordered list with slash separators.',
      usage: 'renderBreadcrumbs(items) or ps-breadcrumbs markup',
      a11y: ['aria-label="Breadcrumb"', 'Current page not linked'],
    },
    `<ol class="ps-breadcrumbs"><li><a href="#">Plantasonic</a></li><li><a href="#">Perform</a></li><li>Main Stage</li></ol>`,
  );
}

export function renderNavResponsive(): string {
  return navComponent(
    {
      name: 'Responsive Navigation',
      purpose: 'Adapt layout without changing navigation identity.',
      description: 'Resize the viewport — sidebar overlays, inspector hides, dock persists.',
      usage: 'Shell CSS breakpoints at 992px and 576px',
      responsive: ['Desktop: full shell', 'Tablet: overlay sidebar', 'Mobile: compact top bar actions'],
    },
    demoShell(),
  );
}

export function renderNavKeyboard(): string {
  return navComponent(
    {
      name: 'Keyboard Navigation',
      purpose: 'Tab, arrow keys, shortcuts, focus management, escape handling.',
      description: 'Global shortcuts: ⌘K palette, / search, Escape close.',
      usage: 'bindGlobalNavigationShortcuts() in app bootstrap',
      a11y: ['Visible focus rings on all interactive nav', 'Skip redundant tabindex on decorative elements'],
    },
    `
    <table class="table table-sm">
      <thead><tr><th>Shortcut</th><th>Action</th></tr></thead>
      <tbody>
        <tr><td><kbd>⌘K</kbd> / <kbd>Ctrl+K</kbd></td><td>Open command palette</td></tr>
        <tr><td><kbd>/</kbd></td><td>Focus search</td></tr>
        <tr><td><kbd>Escape</kbd></td><td>Close palette / blur search</td></tr>
        <tr><td><kbd>↑</kbd> <kbd>↓</kbd></td><td>Navigate search results</td></tr>
        <tr><td><kbd>Tab</kbd></td><td>Move focus through shell regions</td></tr>
      </tbody>
    </table>
    ${demoShell({}, '<div class="ps-workspace"><p class="text-muted small">Test shortcuts here</p></div>', '16rem')}`,
  );
}

export function renderNavMotion(): string {
  return navComponent(
    {
      name: 'Motion',
      purpose: 'Subtle, purposeful navigation animations.',
      description: 'Respects prefers-reduced-motion and data-ds-reduced-motion.',
      usage: 'Token-driven transitions on shell, palette, panels',
      motion: ['Sidebar width', 'Floating sidebar translateX', 'Palette opacity + translateY', 'Panel collapse max-height'],
    },
    `<p class="text-muted small">Toggle sidebar collapse or open command palette to see motion. Enable reduced motion in Developer settings.</p>${demoShell({}, '<div class="ps-workspace">Motion demo</div>', '16rem')}`,
  );
}
