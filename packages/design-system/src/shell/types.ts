/**
 * Plantasonic Application Shell — public type definitions.
 */

export type NavIcon = string;

export type NavBadge = {
  label: string;
  variant?: 'default' | 'accent';
};

export type NavItemConfig = {
  id: string;
  label: string;
  icon?: NavIcon;
  href?: string;
  badge?: NavBadge;
  favorite?: boolean;
  active?: boolean;
  children?: NavItemConfig[];
};

export type NavGroupConfig = {
  id: string;
  label: string;
  items: NavItemConfig[];
};

export type CommandItemConfig = {
  id: string;
  label: string;
  group: string;
  shortcut?: string;
  keywords?: string[];
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type ShellLayout =
  | 'default'
  | 'sidebar-collapsed'
  | 'sidebar-hidden'
  | 'sidebar-floating'
  | 'inspector-hidden'
  | 'inspector-left'
  | 'no-dock'
  | 'fullscreen';

export type NavigationConfig = {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  groups: NavGroupConfig[];
  commands?: CommandItemConfig[];
  layout?: ShellLayout;
};

export type ThemeMode = 'dark' | 'light' | 'auto';

export type WorkspaceMode =
  | 'single'
  | 'split'
  | 'inspector'
  | 'fullscreen'
  | 'floating'
  | 'focus';

export type DockPosition = 'left' | 'right' | 'bottom' | 'floating';

export type DockItemConfig = {
  id: string;
  label: string;
  icon?: string;
  badge?: string;
  active?: boolean;
};

export type DockConfig = {
  position: DockPosition;
  items: DockItemConfig[];
  visible?: boolean;
};

export type PanelState = 'expanded' | 'collapsed' | 'pinned' | 'floating' | 'hidden';

export type PanelConfig = {
  id: string;
  title: string;
  state?: PanelState;
  resizable?: boolean;
  defaultHeight?: string;
  content?: string;
};

export type OverlayType = 'modal' | 'drawer' | 'popover' | 'tooltip' | 'context-menu' | 'loading' | 'error';

export type OverlayRequest = {
  id: string;
  type: OverlayType;
  title?: string;
  message?: string;
  position?: 'left' | 'right' | 'center';
};

export type NotificationVariant = 'toast' | 'banner' | 'success' | 'warning' | 'error' | 'progress' | 'background';

export type NotificationConfig = {
  id: string;
  variant: NotificationVariant;
  title: string;
  message?: string;
  progress?: number;
  dismissible?: boolean;
};

export type ShellCommand = CommandItemConfig & {
  action?: () => void;
};

export type ShellRoute = {
  id: string;
  path: string;
  label: string;
};

export type ShellRegionsConfig = {
  header?: boolean;
  sidebar?: boolean;
  workspace?: boolean;
  inspector?: boolean;
  dock?: boolean;
  overlay?: boolean;
};

export type ShellWindowState = {
  sidebarCollapsed: boolean;
  inspectorWidth: number;
  dockVisible: boolean;
  theme: ThemeMode;
  workspaceMode: WorkspaceMode;
  panelStates: Record<string, PanelState>;
  shellMode?: ShellMode;
};

/** Shell variants. `standard` is the existing navigation shell; `instrument` is the creative, canvas-first shell. */
export type ShellVariant = 'standard' | 'instrument';

/** Display modes for the instrument shell. */
export type ShellMode = 'edit' | 'performance' | 'presentation' | 'touch';

/**
 * Configuration for the `instrument` shell variant. Every field is optional and
 * holds pre-rendered region HTML (compose with the `instrument` region/transport
 * helpers, or via the `createApplication()` SDK). The shell only lays them out.
 */
export type InstrumentConfig = {
  /** Stage / canvas region markup (fills the viewport). */
  stage?: string;
  /** Transport bar markup, or `false` to hide it. */
  transport?: string | false;
  /** Status bar markup (bottom metrics row). */
  status?: string;
  /** HUD overlay markup (non-interactive heads-up display). */
  hud?: string;
  /** Left rail markup (tools / minimal sidebar). */
  rail?: string;
  /** Right aside markup (inspector / panels). */
  aside?: string;
  /** Timeline region markup (below the stage). */
  timeline?: string;
  /** Floating panels layer markup. */
  floating?: string;
  /** Presenter branding markup (shown in presentation mode). */
  brand?: string;
  /** Initial display mode (default `edit`). */
  mode?: ShellMode;
};

export type ApplicationShellConfig = {
  id?: string;
  title: string;
  navigation: NavigationConfig;
  regions?: ShellRegionsConfig;
  workspace?: WorkspaceMode;
  docks?: DockConfig[];
  panels?: PanelConfig[];
  commands?: ShellCommand[];
  routes?: ShellRoute[];
  theme?: ThemeMode;
  persistState?: boolean;
  /** Shell variant. Omit (or `'standard'`) for the existing navigation shell. */
  variant?: ShellVariant;
  /** Initial display mode for the instrument shell. */
  mode?: ShellMode;
  /** Instrument shell region content (used when `variant` is `'instrument'`). */
  instrument?: InstrumentConfig;
};

export const DEFAULT_REGIONS: ShellRegionsConfig = {
  header: true,
  sidebar: true,
  workspace: true,
  inspector: true,
  dock: true,
  overlay: true,
};

export const EXAMPLE_SHELL: ApplicationShellConfig = {
  id: 'plantasonic-studio',
  title: 'Plantasonic Studio',
  theme: 'dark',
  persistState: true,
  regions: DEFAULT_REGIONS,
  workspace: 'single',
  navigation: {
    title: 'Plantasonic Studio',
    breadcrumbs: [
      { label: 'Workspace', href: '#' },
      { label: 'Perform', href: '#' },
      { label: 'Main Stage' },
    ],
    groups: [
      {
        id: 'perform',
        label: 'Perform',
        items: [
          { id: 'stage', label: 'Stage', icon: '◉', active: true, favorite: true },
          { id: 'mixer', label: 'Mixer', icon: '▤' },
        ],
      },
      {
        id: 'create',
        label: 'Create',
        items: [
          { id: 'presets', label: 'Presets', icon: '▦', badge: { label: '12' } },
        ],
      },
    ],
    commands: [
      { id: 'play', label: 'Toggle Play', group: 'Transport', shortcut: 'Space' },
      { id: 'palette', label: 'Command Palette', group: 'Navigation', shortcut: '⌘K' },
      { id: 'theme', label: 'Toggle Theme', group: 'Settings', shortcut: '⌘⇧T' },
      { id: 'focus', label: 'Focus Mode', group: 'View', shortcut: 'F' },
    ],
  },
  docks: [
    {
      position: 'left',
      items: [
        { id: 'tools', label: 'Tools', icon: '⚒', active: true },
        { id: 'layers', label: 'Layers', icon: '▦' },
      ],
    },
  ],
  panels: [
    { id: 'mixer', title: 'Mixer', state: 'expanded', resizable: true },
    { id: 'effects', title: 'Effects', state: 'collapsed' },
  ],
  routes: [
    { id: 'stage', path: '/stage', label: 'Stage' },
    { id: 'mixer', path: '/mixer', label: 'Mixer' },
  ],
};

/** Showcase / docs demo — no persisted state, single workspace, inspector hidden. */
export const SHOWCASE_SHELL: ApplicationShellConfig = {
  ...EXAMPLE_SHELL,
  id: 'showcase-shell-demo',
  persistState: false,
  workspace: 'single',
  regions: { ...DEFAULT_REGIONS, inspector: false },
};
