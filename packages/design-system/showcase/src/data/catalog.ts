declare const __DS_VERSION__: string;
declare const __BUILD_TIME__: string;
declare const __GIT_COMMIT__: string;
declare const __BOOTSTRAP_VERSION__: string;

export const DS_VERSION = __DS_VERSION__;
export const BUILD_TIME = __BUILD_TIME__;
export const GIT_COMMIT = __GIT_COMMIT__;
export const BOOTSTRAP_VERSION = __BOOTSTRAP_VERSION__;

export type NavItem = {
  id: string;
  label: string;
  group?: string;
  keywords?: string[];
};

export const NAV_GROUPS = [
  'Overview',
  'Foundations',
  'Platform Library',
  'Creative Framework',
  'Bootstrap',
  'Navigation',
  'Application Shell',
  'Reference',
] as const;

export const CREATIVE_CATEGORIES = [
  { id: 'instrument-shell', label: 'Instrument Shell', complete: true },
  { id: 'creative-workspace', label: 'Creative Workspace', complete: true },
  { id: 'creative-workspace-instrument', label: 'Instrument Workspace', complete: true },
  { id: 'creative-workspace-presets', label: 'Workspace Presets', complete: true },
  { id: 'creative-regions', label: 'Workspace Regions', complete: true },
  { id: 'creative-transport', label: 'Transport', complete: true },
  { id: 'creative-canvas', label: 'Canvas System', complete: true },
  { id: 'creative-floating', label: 'Floating UI', complete: true },
  { id: 'creative-modes', label: 'Display Modes', complete: true },
  { id: 'creative-io', label: 'Input & Output', complete: true },
  { id: 'creative-sdk', label: 'Application SDK', complete: true },
] as const;

export const SHELL_CATEGORIES = [
  { id: 'shell-overview', label: 'Overview', complete: true },
  { id: 'shell-app-frame', label: 'App Frame', complete: true },
  { id: 'shell-workspace', label: 'Workspace Manager', complete: true },
  { id: 'shell-docks', label: 'Dock Framework', complete: true },
  { id: 'shell-panels', label: 'Panel System', complete: true },
  { id: 'shell-overlays', label: 'Overlay Manager', complete: true },
  { id: 'shell-notifications', label: 'Notifications', complete: true },
  { id: 'shell-theme', label: 'Theme Provider', complete: true },
  { id: 'shell-keyboard', label: 'Keyboard', complete: true },
  { id: 'shell-responsive', label: 'Layout Engine', complete: true },
  { id: 'shell-window-state', label: 'Window State', complete: true },
] as const;

export const NAVIGATION_CATEGORIES = [
  { id: 'nav-overview', label: 'Overview', complete: true },
  { id: 'nav-app-shell', label: 'App Shell', complete: true },
  { id: 'nav-sidebar', label: 'Sidebar', complete: true },
  { id: 'nav-rail', label: 'Navigation Rail', complete: true },
  { id: 'nav-topbar', label: 'Top Bar', complete: true },
  { id: 'nav-dock', label: 'Bottom Dock', complete: true },
  { id: 'nav-inspector', label: 'Inspector', complete: true },
  { id: 'nav-workspace', label: 'Workspace', complete: true },
  { id: 'nav-panels', label: 'Panels', complete: true },
  { id: 'nav-command-palette', label: 'Command Palette', complete: true },
  { id: 'nav-search', label: 'Search', complete: true },
  { id: 'nav-breadcrumbs', label: 'Breadcrumbs', complete: true },
  { id: 'nav-responsive', label: 'Responsive', complete: true },
  { id: 'nav-keyboard', label: 'Keyboard', complete: true },
  { id: 'nav-motion', label: 'Motion', complete: true },
] as const;

export const BOOTSTRAP_CATEGORIES = [
  { id: 'bs-buttons', label: 'Buttons', complete: true },
  { id: 'bs-forms', label: 'Forms', complete: true },
  { id: 'bs-selection', label: 'Selection Controls', complete: true },
  { id: 'bs-navigation', label: 'Navigation', complete: true },
  { id: 'bs-cards', label: 'Cards', complete: true },
  { id: 'bs-lists', label: 'Lists', complete: true },
  { id: 'bs-tables', label: 'Tables', complete: true },
  { id: 'bs-feedback', label: 'Feedback', complete: true },
  { id: 'bs-disclosure', label: 'Disclosure', complete: true },
  { id: 'bs-floating', label: 'Floating UI', complete: true },
  { id: 'bs-dialogs', label: 'Dialogs', complete: true },
  { id: 'bs-utilities', label: 'Utilities', complete: true },
] as const;

export const NAV: NavItem[] = [
  { id: 'overview', label: 'Overview', group: 'Overview', keywords: ['home', 'version', 'stats', 'search'] },
  { id: 'tokens', label: 'Design Tokens', group: 'Foundations', keywords: ['catalog', 'variables', 'css'] },
  { id: 'colors', label: 'Colors', group: 'Foundations', keywords: ['palette', 'swatch', 'hex', 'green'] },
  { id: 'typography', label: 'Typography', group: 'Foundations', keywords: ['font', 'heading', 'mono'] },
  { id: 'spacing', label: 'Spacing', group: 'Foundations', keywords: ['space', 'grid', 'ruler'] },
  { id: 'radius', label: 'Radius', group: 'Foundations', keywords: ['border-radius', 'corners'] },
  { id: 'shadows', label: 'Shadows', group: 'Foundations', keywords: ['elevation', 'glow'] },
  { id: 'motion', label: 'Motion', group: 'Foundations', keywords: ['transition', 'easing', 'duration'] },
  { id: 'primitives', label: 'Layout Primitives', group: 'Platform Library', keywords: ['stack', 'grid', 'cluster', 'sidebar', 'split', 'layer 9'] },
  { id: 'components', label: 'Components', group: 'Platform Library', keywords: ['button', 'card', 'panel', 'badge', 'toolbar', 'layer 1'] },
  { id: 'motion-system', label: 'Motion System', group: 'Platform Library', keywords: ['animate', 'preset', 'spring', 'reduced motion', 'layer 3'] },
  ...CREATIVE_CATEGORIES.map((c) => ({
    id: c.id,
    label: c.label,
    group: 'Creative Framework' as const,
    keywords: [c.label.toLowerCase(), 'instrument', 'creative', 'canvas', 'transport', 'phase 3'],
  })),
  { id: 'bootstrap', label: 'Bootstrap Overview', group: 'Bootstrap', keywords: ['milestone', 'coverage', '5.0.2'] },
  ...BOOTSTRAP_CATEGORIES.map((c) => ({
    id: c.id,
    label: c.label,
    group: 'Bootstrap' as const,
    keywords: [c.label.toLowerCase(), 'bootstrap'],
  })),
  { id: 'nav-overview', label: 'Navigation Overview', group: 'Navigation', keywords: ['shell', 'framework', 'workspace', 'milestone 3.5'] },
  ...NAVIGATION_CATEGORIES.filter((c) => c.id !== 'nav-overview').map((c) => ({
    id: c.id,
    label: c.label,
    group: 'Navigation' as const,
    keywords: [c.label.toLowerCase(), 'navigation', 'shell', 'command palette'],
  })),
  { id: 'shell-overview', label: 'Shell Overview', group: 'Application Shell', keywords: ['application shell', 'framework', 'milestone 4', 'operating system'] },
  ...SHELL_CATEGORIES.filter((c) => c.id !== 'shell-overview').map((c) => ({
    id: c.id,
    label: c.label,
    group: 'Application Shell' as const,
    keywords: [c.label.toLowerCase(), 'shell', 'workspace', 'overlay', 'notification'],
  })),
  { id: 'accessibility', label: 'Accessibility', group: 'Reference', keywords: ['contrast', 'focus', 'a11y', 'aria'] },
  { id: 'themes', label: 'Themes', group: 'Reference', keywords: ['dark', 'light', 'switcher'] },
  { id: 'developer', label: 'Developer', group: 'Reference', keywords: ['debug', 'inspector', 'build'] },
  { id: 'changelog', label: 'Changelog', group: 'Reference', keywords: ['release', 'history'] },
];

/** Token path → CSS custom property (mirrors scripts/lib/tokens.mjs) */
export const CSS_VAR_MAP: Record<string, string> = {
  'color.primary.default': '--ds-color-primary',
  'color.primary.hover': '--ds-color-primary-hover',
  'color.primary.pressed': '--ds-color-primary-pressed',
  'color.primary.disabled': '--ds-color-primary-disabled',
  'color.secondary': '--ds-color-secondary',
  'color.accent': '--ds-color-accent',
  'color.surface.default': '--ds-color-surface-default',
  'color.surface.app': '--ds-color-surface-app',
  'color.surface.stage': '--ds-color-surface-stage',
  'color.surface.nav': '--ds-color-surface-nav',
  'color.surface.dock': '--ds-color-surface-dock',
  'color.surface.input': '--ds-color-surface-input',
  'color.surface.card': '--ds-color-surface-card',
  'color.surface.raised': '--ds-color-surface-raised',
  'color.surface.raised-hover': '--ds-color-surface-raised-hover',
  'color.surface.sunken': '--ds-color-surface-sunken',
  'color.surface.overlay': '--ds-color-surface-overlay',
  'color.text.primary': '--ds-color-text-primary',
  'color.text.secondary': '--ds-color-text-secondary',
  'color.text.muted': '--ds-color-text-muted',
  'color.text.accent': '--ds-color-text-accent',
  'color.text.link': '--ds-color-text-link',
  'color.text.inverse': '--ds-color-text-inverse',
  'color.text.on-primary': '--ds-color-text-on-primary',
  'color.text.on-secondary': '--ds-color-text-on-secondary',
  'color.text.on-accent': '--ds-color-text-on-accent',
  'color.border.default': '--ds-color-border-default',
  'color.border.subtle': '--ds-color-border-subtle',
  'color.border.strong': '--ds-color-border-strong',
  'color.border.interactive': '--ds-color-border-interactive',
  'color.border.focus': '--ds-color-border-focus',
  'color.overlay.backdrop': '--ds-color-overlay-backdrop',
  'color.overlay.scrim-light': '--ds-color-overlay-scrim-light',
  'color.overlay.scrim': '--ds-color-overlay-scrim',
  'color.overlay.scrim-strong': '--ds-color-overlay-scrim-strong',
  'color.overlay.glass': '--ds-color-overlay-glass',
  'color.overlay.focus-outline': '--ds-color-overlay-focus-outline',
  'color.decorative.favorite': '--ds-color-favorite',
  'color.status.success': '--ds-color-success',
  'color.status.warning': '--ds-color-warning',
  'color.status.error': '--ds-color-error',
  'color.status.info': '--ds-color-info',
  'color.status.error-surface': '--ds-color-error-surface',
  'color.status.error-border': '--ds-color-error-border',
  'font.family.sans': '--ds-font-family-sans',
  'font.family.mono': '--ds-font-family-mono',
  'font.size.base': '--ds-font-size-base',
  'font.size.display': '--ds-font-size-display',
  'font.size.h1': '--ds-font-size-h1',
  'font.size.h2': '--ds-font-size-h2',
  'font.size.h3': '--ds-font-size-h3',
  'font.size.h4': '--ds-font-size-h4',
  'font.size.body': '--ds-font-size-body',
  'font.size.body-sm': '--ds-font-size-body-sm',
  'font.size.caption': '--ds-font-size-caption',
  'font.size.label': '--ds-font-size-label',
  'font.size.overline': '--ds-font-size-overline',
  'font.line-height.tight': '--ds-line-height-tight',
  'font.line-height.body': '--ds-line-height-body',
  'font.line-height.relaxed': '--ds-line-height-relaxed',
  'font.weight.body': '--ds-font-weight-body',
  'font.weight.headings': '--ds-font-weight-headings',
  'font.weight.label': '--ds-font-weight-label',
  'font.weight.mono': '--ds-font-weight-mono',
  'font.letter-spacing.label': '--ds-letter-spacing-label',
  'font.letter-spacing.overline': '--ds-letter-spacing-overline',
  'font.letter-spacing.caption': '--ds-letter-spacing-caption',
  'space.0': '--ds-space-0',
  'space.1': '--ds-space-1',
  'space.2': '--ds-space-2',
  'space.3': '--ds-space-3',
  'space.4': '--ds-space-4',
  'space.5': '--ds-space-5',
  'space.6': '--ds-space-6',
  'space.8': '--ds-space-8',
  'radius.xs': '--ds-radius-xs',
  'radius.sm': '--ds-radius-sm',
  'radius.default': '--ds-radius-default',
  'radius.lg': '--ds-radius-lg',
  'radius.xl': '--ds-radius-xl',
  'radius.pill': '--ds-radius-pill',
  'shadow.sm': '--ds-shadow-sm',
  'shadow.md': '--ds-shadow-md',
  'shadow.lg': '--ds-shadow-lg',
  'shadow.focus': '--ds-shadow-focus',
  'shadow.glow-accent': '--ds-shadow-glow-accent',
  'shadow.stage-inset': '--ds-shadow-stage-inset',
  'transition.fast': '--ds-transition-fast',
  'transition.base': '--ds-transition-base',
  'transition.slow': '--ds-transition-slow',
  'ease.out': '--ds-ease-out',
  'ease.in': '--ds-ease-in',
  'ease.in-out': '--ds-ease-in-out',
  'product.nav-height': '--ps-nav-height',
  'product.dock-height': '--ps-dock-height',
  'product.sidebar-width': '--ps-sidebar-width',
  'product.touch-target': '--ps-touch-target',
  'product.touch-target-large': '--ps-touch-target-large',
  'product.instrument-gutter': '--ps-instrument-gutter',
  'product.floating-panel-min': '--ps-floating-panel-min',
  'product.hud-opacity': '--ps-hud-opacity',
};

export const COLOR_GROUPS: Record<string, string[]> = {
  Green: [
    'color.green.500',
    'color.green.700',
    'color.green.900',
    'color.primary.default',
    'color.primary.hover',
    'color.primary.pressed',
  ],
  Neutral: [
    'color.neutral.100',
    'color.neutral.400',
    'color.neutral.500',
    'color.neutral.800',
    'color.neutral.900',
    'color.neutral.white',
    'color.neutral.black',
  ],
  Accent: [
    'color.secondary',
    'color.accent',
    'color.text.accent',
    'color.text.link',
    'color.border.interactive',
    'color.border.focus',
  ],
  Surfaces: [
    'color.surface.app',
    'color.surface.stage',
    'color.surface.nav',
    'color.surface.dock',
    'color.surface.raised',
    'color.surface.input',
    'color.surface.sunken',
  ],
  Text: [
    'color.text.primary',
    'color.text.secondary',
    'color.text.muted',
    'color.text.inverse',
  ],
  Status: [
    'color.status.success',
    'color.status.warning',
    'color.status.error',
    'color.status.info',
    'color.decorative.favorite',
  ],
  Overlay: [
    'color.overlay.backdrop',
    'color.overlay.scrim-light',
    'color.overlay.glass',
    'color.overlay.focus-outline',
  ],
};

export const BOOTSTRAP_DEMOS = BOOTSTRAP_CATEGORIES.map((c) => c.label);

export const NAV_FRAMEWORK_PRIMITIVES = [
  'App Shell', 'Sidebar', 'Navigation Rail', 'Top Bar', 'Bottom Dock',
  'Inspector', 'Workspace', 'Panels', 'Command Palette', 'Search', 'Breadcrumbs',
] as const;

export const PLANTASONIC_M3_COMPONENTS = [
  'Knob', 'Slider', 'Transport Bar', 'Dock', 'Preset Card', 'Preset Browser',
  'Parameter Group', 'MIDI Status', 'Piano Keyboard', 'Visualizer Frame',
  'Notification', 'Overlay', 'Empty State', 'Error State', 'Loading State',
];

export const SHELL_MODULES = [
  'App Frame', 'Workspace Manager', 'Dock Framework', 'Panel System',
  'Overlay Manager', 'Notification System', 'Theme Provider', 'Command Registry',
  'Keyboard Framework', 'Window State',
] as const;

export const COMPONENT_COUNT =
  BOOTSTRAP_CATEGORIES.length +
  PLANTASONIC_M3_COMPONENTS.length +
  NAV_FRAMEWORK_PRIMITIVES.length +
  SHELL_MODULES.length;
