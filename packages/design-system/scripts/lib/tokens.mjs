import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

export const TOKEN_FILES = {
  foundation: join(ROOT, 'tokens/foundation.tokens.json'),
  dark: join(ROOT, 'tokens/theme.dark.tokens.json'),
  light: join(ROOT, 'tokens/theme.light.tokens.json'),
};

export const CSS_OUTPUT = join(ROOT, 'css/variables.css');

/** Token JSON dot-path → CSS custom property name */
export const CSS_VAR_NAME = {
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
  'color.brand.primary.500': '--ds-color-brand-primary-500',
  'color.brand.primary.700': '--ds-color-brand-primary-700',
  'color.brand.primary.900': '--ds-color-brand-primary-900',
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
  'font.line-height.base': '--ds-line-height-base',
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
  'space.12': '--ds-space-12',
  'space.3': '--ds-space-3',
  'space.20': '--ds-space-20',
  'space.4': '--ds-space-4',
  'space.5': '--ds-space-5',
  'space.28': '--ds-space-28',
  'space.6': '--ds-space-6',
  'space.36': '--ds-space-36',
  'space.40': '--ds-space-40',
  'space.44': '--ds-space-44',
  'space.8': '--ds-space-8',
  'space.52': '--ds-space-52',
  'space.56': '--ds-space-56',
  'space.60': '--ds-space-60',
  'space.68': '--ds-space-68',
  'space.72': '--ds-space-72',
  'space.80': '--ds-space-80',
  'space.96': '--ds-space-96',
  'space.128': '--ds-space-128',
  'space.16': '--ds-space-16',
  'space.24': '--ds-space-24',
  'space.32': '--ds-space-32',
  'space.48': '--ds-space-48',
  'space.64': '--ds-space-64',
  'space.999': '--ds-space-999',
  'radius.xs': '--ds-radius-xs',
  'radius.none': '--ds-radius-none',
  'radius.md': '--ds-radius-md',
  'radius.full': '--ds-radius-full',
  'radius.sm': '--ds-radius-sm',
  'radius.default': '--ds-radius-default',
  'radius.lg': '--ds-radius-lg',
  'radius.xl': '--ds-radius-xl',
  'radius.pill': '--ds-radius-pill',
  'shadow.none': '--ds-shadow-none',
  'shadow.sm': '--ds-shadow-sm',
  'shadow.md': '--ds-shadow-md',
  'shadow.lg': '--ds-shadow-lg',
  'shadow.focus': '--ds-shadow-focus',
  'shadow.glow-accent': '--ds-shadow-glow-accent',
  'shadow.stage-inset': '--ds-shadow-stage-inset',
  'transition.instant': '--ds-transition-instant',
  'transition.fast': '--ds-transition-fast',
  'transition.base': '--ds-transition-base',
  'transition.slow': '--ds-transition-slow',
  'transition.slower': '--ds-transition-slower',
  'ease.out': '--ds-ease-out',
  'ease.in': '--ds-ease-in',
  'ease.in-out': '--ds-ease-in-out',
  'ease.standard': '--ds-ease-standard',
  'ease.emphasized': '--ds-ease-emphasized',
  'ease.spring': '--ds-ease-spring',
  'motion.duration.micro': '--ds-motion-duration-micro',
  'motion.duration.fast': '--ds-motion-duration-fast',
  'motion.duration.base': '--ds-motion-duration-base',
  'motion.duration.slow': '--ds-motion-duration-slow',
  'motion.duration.slower': '--ds-motion-duration-slower',
  'motion.easing.standard': '--ds-motion-easing-standard',
  'motion.easing.emphasized': '--ds-motion-easing-emphasized',
  'motion.easing.entrance': '--ds-motion-easing-entrance',
  'motion.easing.exit': '--ds-motion-easing-exit',
  'motion.easing.spring': '--ds-motion-easing-spring',
  'product.nav-height': '--ps-nav-height',
  'product.dock-height': '--ps-dock-height',
  'product.sidebar-width': '--ps-sidebar-width',
  'product.touch-target': '--ps-touch-target',
  'product.touch-target-large': '--ps-touch-target-large',
  'product.instrument-gutter': '--ps-instrument-gutter',
  'product.floating-panel-min': '--ps-floating-panel-min',
  'product.hud-opacity': '--ps-hud-opacity',
  'product.overlay-radius': '--ps-overlay-radius',
  'product.preset-card-radius': '--ps-preset-card-radius',
  'product.preset-card-border': '--ps-preset-card-border',
  'product.preset-card-active-border': '--ps-preset-card-active-border',
  'product.slider-track': '--ps-slider-track',
  'product.slider-thumb': '--ps-slider-thumb',
  'product.stage-border': '--ps-stage-border',
  'product.performance-chrome-opacity': '--ps-performance-chrome-opacity',
  'product.shadow-overlay': '--ps-shadow-overlay',
  'product.shadow-sidebar': '--ps-shadow-sidebar',
  'product.shadow-panel': '--ps-shadow-panel',
  'fontSize.xs': '--ds-font-size-xs',
  'fontSize.sm': '--ds-font-size-sm',
  'fontSize.md': '--ds-font-size-md',
  'fontSize.lg': '--ds-font-size-lg',
  'fontSize.xl': '--ds-font-size-xl',
  'fontSize.2xl': '--ds-font-size-2xl',
  'fontSize.3xl': '--ds-font-size-3xl',
  'fontSize.4xl': '--ds-font-size-4xl',
  'lineHeight.tight': '--ds-line-height-tight-scale',
  'lineHeight.normal': '--ds-line-height-normal',
  'lineHeight.relaxed': '--ds-line-height-relaxed-scale',
  'lineHeight.loose': '--ds-line-height-loose',
  'letterSpacing.tighter': '--ds-letter-spacing-tighter',
  'letterSpacing.tight': '--ds-letter-spacing-tight',
  'letterSpacing.normal': '--ds-letter-spacing-normal',
  'letterSpacing.wide': '--ds-letter-spacing-wide',
  'letterSpacing.wider': '--ds-letter-spacing-wider',
  'size.xs': '--ds-size-xs',
  'size.sm': '--ds-size-sm',
  'size.md': '--ds-size-md',
  'size.lg': '--ds-size-lg',
  'size.xl': '--ds-size-xl',
  'size.xxl': '--ds-size-xxl',
  'opacity.0': '--ds-opacity-0',
  'opacity.50': '--ds-opacity-50',
  'opacity.100': '--ds-opacity-100',
  'borderWidth.hairline': '--ds-border-width-hairline',
  'borderWidth.thin': '--ds-border-width-thin',
  'borderWidth.medium': '--ds-border-width-medium',
  'borderWidth.thick': '--ds-border-width-thick',
  'stroke.subtle': '--ds-stroke-subtle',
  'stroke.default': '--ds-stroke-default',
  'stroke.strong': '--ds-stroke-strong',
  'stroke.emphasis': '--ds-stroke-emphasis',
  'shadow.xs': '--ds-shadow-xs',
  'shadow.xl': '--ds-shadow-xl',
  'shadow.glow': '--ds-shadow-glow',
  'shadow.neon': '--ds-shadow-neon',
  'blur.sm': '--ds-blur-sm',
  'blur.md': '--ds-blur-md',
  'blur.lg': '--ds-blur-lg',
  'zIndex.floating': '--ds-z-floating',
  'zIndex.overlay': '--ds-z-overlay',
  'zIndex.modal': '--ds-z-modal',
  'duration.fast': '--ds-duration-fast',
  'duration.normal': '--ds-duration-normal',
  'easing.standard': '--ds-easing-standard',
  'easing.emphasized': '--ds-easing-emphasized',
  'motion.hover.duration': '--ds-motion-hover-duration',
  'motion.hover.easing': '--ds-motion-hover-easing',
  'iconSize.md': '--ds-icon-size-md',
  'iconSize.lg': '--ds-icon-size-lg',
  'breakpoint.tablet': '--ds-breakpoint-tablet',
  'breakpoint.desktop': '--ds-breakpoint-desktop',
  'grid.gutter': '--ds-grid-gutter',
  'grid.maxWidth': '--ds-grid-max-width',
  'layout.headerHeight': '--ds-layout-header-height',
  'layout.sidebarWidth': '--ds-layout-sidebar-width',
  'layout.inspectorWidth': '--ds-layout-inspector-width',
  'layout.stagePadding': '--ds-layout-stage-padding',
  'creative.stage.background': '--ps-creative-stage-background',
  'creative.stage.border': '--ps-creative-stage-border',
  'creative.stage.shadow': '--ps-creative-stage-shadow',
  'creative.stage.padding': '--ps-creative-stage-padding',
  'creative.hud.text': '--ps-creative-hud-text',
  'creative.hud.opacity': '--ps-creative-hud-opacity',
  'creative.transport.background': '--ps-creative-transport-background',
  'creative.transport.border': '--ps-creative-transport-border',
  'creative.transport.shadow': '--ps-creative-transport-shadow',
  'creative.visualizer.background': '--ps-creative-visualizer-background',
  'creative.visualizer.border': '--ps-creative-visualizer-border',
  'creative.visualizer.shadow': '--ps-creative-visualizer-shadow',
  'creative.ascii.foreground': '--ps-creative-ascii-foreground',
  'creative.ascii.background': '--ps-creative-ascii-background',
  'creative.ascii.glow': '--ps-creative-ascii-glow',
  'creative.waveform.line': '--ps-creative-waveform-line',
  'creative.waveform.fill': '--ps-creative-waveform-fill',
  'creative.waveform.background': '--ps-creative-waveform-background',
  'creative.midi.active': '--ps-creative-midi-active',
  'creative.midi.idle': '--ps-creative-midi-idle',
  'creative.midi.learn': '--ps-creative-midi-learn',
  'creative.performance.chrome-opacity': '--ps-creative-performance-chrome-opacity',
  'creative.performance.background': '--ps-creative-performance-background',
  'creative.instrument.gutter': '--ps-creative-instrument-gutter',
  'creative.instrument.background': '--ps-creative-instrument-background',
  'creative.presetBrowser.background': '--ps-creative-preset-browser-background',
  'creative.presetBrowser.border': '--ps-creative-preset-browser-border',
  'creative.presetBrowser.active-border': '--ps-creative-preset-browser-active-border',
  'creative.presetBrowser.radius': '--ps-creative-preset-browser-radius',
  'creative.inspector.background': '--ps-creative-inspector-background',
  'creative.inspector.border': '--ps-creative-inspector-border',
  'creative.inspector.shadow': '--ps-creative-inspector-shadow',
  'creative.overlay.backdrop': '--ps-creative-overlay-backdrop',
  'creative.overlay.shadow': '--ps-creative-overlay-shadow',
  'creative.overlay.radius': '--ps-creative-overlay-radius',
  'creative.glass.background': '--ps-creative-glass-background',
  'creative.glass.blur': '--ps-creative-glass-blur',
  'creative.glow.shadow': '--ps-creative-glow-shadow',
  'creative.glow.accent': '--ps-creative-glow-accent',
  'creative.focusRing.color': '--ps-creative-focus-ring-color',
  'creative.focusRing.width': '--ps-creative-focus-ring-width',
  'creative.focusRing.shadow': '--ps-creative-focus-ring-shadow',
  'creative.selection.background': '--ps-creative-selection-background',
  'creative.selection.border': '--ps-creative-selection-border',
  'creative.selection.text': '--ps-creative-selection-text',
};

export const CSS_SECTIONS = [
  {
    label: 'Brand',
    paths: [
      'color.primary.default',
      'color.primary.hover',
      'color.primary.pressed',
      'color.primary.disabled',
      'color.secondary',
      'color.accent',
    ],
  },
  {
    label: 'Surfaces',
    paths: [
      'color.surface.default',
      'color.surface.app',
      'color.surface.stage',
      'color.surface.nav',
      'color.surface.dock',
      'color.surface.input',
      'color.surface.card',
      'color.surface.raised',
      'color.surface.raised-hover',
      'color.surface.sunken',
      'color.surface.overlay',
    ],
  },
  {
    label: 'Text',
    paths: [
      'color.text.primary',
      'color.text.secondary',
      'color.text.muted',
      'color.text.accent',
      'color.text.link',
      'color.text.inverse',
      'color.text.on-primary',
      'color.text.on-secondary',
      'color.text.on-accent',
    ],
  },
  {
    label: 'Borders',
    paths: [
      'color.border.default',
      'color.border.subtle',
      'color.border.strong',
      'color.border.interactive',
      'color.border.focus',
    ],
  },
  {
    label: 'Overlays',
    paths: [
      'color.overlay.backdrop',
      'color.overlay.scrim-light',
      'color.overlay.scrim',
      'color.overlay.scrim-strong',
      'color.overlay.glass',
      'color.overlay.focus-outline',
    ],
  },
  {
    label: 'Status',
    paths: [
      'color.status.success',
      'color.status.warning',
      'color.status.error',
      'color.status.info',
      'color.status.error-surface',
      'color.status.error-border',
      'color.decorative.favorite',
    ],
  },
  {
    label: 'Typography',
    paths: [
      'font.family.sans',
      'font.family.mono',
      'font.size.base',
      'font.size.display',
      'font.size.h1',
      'font.size.h2',
      'font.size.h3',
      'font.size.h4',
      'font.size.body',
      'font.size.body-sm',
      'font.size.caption',
      'font.size.label',
      'font.size.overline',
      'font.weight.body',
      'font.weight.headings',
      'font.weight.label',
      'font.weight.mono',
      'font.line-height.tight',
      'font.line-height.body',
      'font.line-height.relaxed',
      'font.letter-spacing.label',
      'font.letter-spacing.overline',
      'font.letter-spacing.caption',
    ],
  },
  {
    label: 'Spacing',
    paths: ['space.0', 'space.1', 'space.2', 'space.3', 'space.4', 'space.5', 'space.6', 'space.8'],
  },
  {
    label: 'Radius',
    paths: [
      'radius.xs',
      'radius.sm',
      'radius.default',
      'radius.lg',
      'radius.xl',
      'radius.pill',
    ],
  },
  {
    label: 'Shadows',
    paths: [
      'shadow.sm',
      'shadow.md',
      'shadow.lg',
      'shadow.focus',
      'shadow.glow-accent',
      'shadow.stage-inset',
    ],
  },
  {
    label: 'Motion',
    paths: [
      'transition.instant',
      'transition.fast',
      'transition.base',
      'transition.slow',
      'transition.slower',
      'ease.out',
      'ease.in',
      'ease.in-out',
      'ease.standard',
      'ease.emphasized',
      'ease.spring',
      'motion.duration.micro',
      'motion.duration.fast',
      'motion.duration.base',
      'motion.duration.slow',
      'motion.duration.slower',
      'motion.easing.standard',
      'motion.easing.emphasized',
      'motion.easing.entrance',
      'motion.easing.exit',
      'motion.easing.spring',
    ],
  },
  {
    label: 'Foundation spacing (px scale)',
    paths: ['space.16', 'space.24', 'space.32', 'space.48', 'space.64', 'space.80', 'space.96', 'space.128'],
  },
  {
    label: 'Foundation brand',
    paths: ['color.brand.primary.500', 'color.brand.primary.700', 'color.brand.primary.900'],
  },
  {
    label: 'Foundation typography scale',
    paths: [
      'fontSize.xs',
      'fontSize.sm',
      'fontSize.md',
      'fontSize.lg',
      'fontSize.xl',
      'fontSize.2xl',
      'fontSize.3xl',
      'fontSize.4xl',
      'lineHeight.tight',
      'lineHeight.normal',
      'lineHeight.relaxed',
      'lineHeight.loose',
      'letterSpacing.tighter',
      'letterSpacing.tight',
      'letterSpacing.normal',
      'letterSpacing.wide',
      'letterSpacing.wider',
    ],
  },
  {
    label: 'Foundation layout',
    paths: [
      'size.xs',
      'size.sm',
      'size.md',
      'size.lg',
      'size.xl',
      'size.xxl',
      'layout.headerHeight',
      'layout.sidebarWidth',
      'layout.inspectorWidth',
      'layout.panelGap',
      'layout.contentMaxWidth',
      'layout.stagePadding',
      'grid.gutter',
      'grid.maxWidth',
      'breakpoint.tablet',
      'breakpoint.desktop',
    ],
  },
  {
    label: 'Foundation effects',
    paths: [
      'opacity.50',
      'borderWidth.hairline',
      'borderWidth.thin',
      'stroke.default',
      'shadow.xs',
      'shadow.xl',
      'shadow.glow',
      'shadow.neon',
      'blur.sm',
      'blur.md',
      'blur.lg',
      'zIndex.floating',
      'zIndex.overlay',
      'zIndex.modal',
      'duration.fast',
      'duration.normal',
      'easing.standard',
      'easing.emphasized',
      'motion.hover.duration',
      'motion.hover.easing',
      'iconSize.md',
      'iconSize.lg',
    ],
  },
  {
    label: 'Product layout',
    paths: [
      'product.nav-height',
      'product.dock-height',
      'product.sidebar-width',
      'product.touch-target',
      'product.touch-target-large',
      'product.instrument-gutter',
      'product.floating-panel-min',
      'product.hud-opacity',
      'product.overlay-radius',
      'product.preset-card-border',
      'product.preset-card-active-border',
      'product.slider-track',
      'product.slider-thumb',
      'product.stage-border',
      'product.performance-chrome-opacity',
      'product.shadow-overlay',
      'product.shadow-sidebar',
      'product.shadow-panel',
    ],
  },
  {
    label: 'Creative surfaces',
    paths: [
      'creative.stage.background',
      'creative.stage.border',
      'creative.stage.shadow',
      'creative.stage.padding',
      'creative.hud.text',
      'creative.hud.opacity',
      'creative.transport.background',
      'creative.transport.border',
      'creative.transport.shadow',
      'creative.visualizer.background',
      'creative.visualizer.border',
      'creative.visualizer.shadow',
      'creative.ascii.foreground',
      'creative.ascii.background',
      'creative.ascii.glow',
      'creative.waveform.line',
      'creative.waveform.fill',
      'creative.waveform.background',
      'creative.midi.active',
      'creative.midi.idle',
      'creative.midi.learn',
      'creative.performance.chrome-opacity',
      'creative.performance.background',
      'creative.instrument.gutter',
      'creative.instrument.background',
      'creative.presetBrowser.background',
      'creative.presetBrowser.border',
      'creative.presetBrowser.active-border',
      'creative.presetBrowser.radius',
      'creative.inspector.background',
      'creative.inspector.border',
      'creative.inspector.shadow',
      'creative.overlay.backdrop',
      'creative.overlay.shadow',
      'creative.overlay.radius',
      'creative.glass.background',
      'creative.glass.blur',
      'creative.glow.shadow',
      'creative.glow.accent',
      'creative.focusRing.color',
      'creative.focusRing.width',
      'creative.focusRing.shadow',
      'creative.selection.background',
      'creative.selection.border',
      'creative.selection.text',
    ],
  },
];

function isTokenLeaf(node) {
  return typeof node === 'object' && node !== null && '$value' in node && !Array.isArray(node);
}

function isMetadataKey(key) {
  return key.startsWith('$');
}

export function flattenTokens(node, prefix = '') {
  const result = new Map();

  if (isTokenLeaf(node)) {
    result.set(prefix, { type: node.$type, value: node.$value });
    return result;
  }

  if (typeof node !== 'object' || node === null || Array.isArray(node)) {
    return result;
  }

  for (const [key, value] of Object.entries(node)) {
    if (isMetadataKey(key)) continue;
    const path = prefix ? `${prefix}.${key}` : key;
    for (const [childPath, leaf] of flattenTokens(value, path)) {
      result.set(childPath, leaf);
    }
  }

  return result;
}

export function loadTokenFile(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function mergeTokenMaps(...maps) {
  const merged = new Map();
  for (const map of maps) {
    for (const [path, leaf] of map) {
      merged.set(path, leaf);
    }
  }
  return merged;
}

function parseAlias(value) {
  if (typeof value !== 'string') return null;
  const match = value.match(/^\{([^}]+)\}$/);
  return match ? match[1] : null;
}

function formatCssValue(type, value) {
  if (type === 'fontFamily' && Array.isArray(value)) {
    return value
      .map((font) => (/\s/.test(font) ? `"${font}"` : font))
      .join(', ');
  }

  if (type === 'cubicBezier' && Array.isArray(value)) {
    return `cubic-bezier(${value.join(', ')})`;
  }

  if (typeof value === 'number') {
    return String(value);
  }

  return String(value);
}

export function resolveTokenMap(flatMap) {
  const resolved = new Map();
  const types = new Map();

  for (const [path, leaf] of flatMap) {
    resolved.set(path, leaf.value);
    types.set(path, leaf.type);
  }

  let changed = true;
  while (changed) {
    changed = false;

    for (const [path, rawValue] of [...resolved.entries()]) {
      const alias = parseAlias(rawValue);
      if (!alias) continue;
      if (!resolved.has(alias)) continue;

      const target = resolved.get(alias);
      if (parseAlias(target)) continue;

      resolved.set(path, target);
      types.set(path, types.get(alias));
      changed = true;
    }
  }

  const unresolved = [];
  for (const [path, value] of resolved.entries()) {
    const alias = parseAlias(value);
    if (alias) {
      unresolved.push({ path, alias });
    }
  }

  return { resolved, types, unresolved };
}

export function loadResolvedThemes() {
  const foundation = flattenTokens(loadTokenFile(TOKEN_FILES.foundation));
  const darkTheme = flattenTokens(loadTokenFile(TOKEN_FILES.dark));
  const lightTheme = flattenTokens(loadTokenFile(TOKEN_FILES.light));

  const darkFlat = mergeTokenMaps(foundation, darkTheme);
  const lightFlat = mergeTokenMaps(foundation, lightTheme);

  return {
    dark: resolveTokenMap(darkFlat),
    light: resolveTokenMap(lightFlat),
  };
}

export function validateTokens() {
  const { dark, light } = loadResolvedThemes();
  const errors = [];

  if (dark.unresolved.length > 0) {
    errors.push({ theme: 'dark', unresolved: dark.unresolved });
  }

  if (light.unresolved.length > 0) {
    errors.push({ theme: 'light', unresolved: light.unresolved });
  }

  const missingCssMappings = Object.keys(CSS_VAR_NAME).filter((path) => !dark.resolved.has(path));

  return {
    ok: errors.length === 0 && missingCssMappings.length === 0,
    errors,
    missingCssMappings,
    cssVarCount: Object.keys(CSS_VAR_NAME).length,
    tokenCount: {
      dark: dark.resolved.size,
      light: light.resolved.size,
    },
  };
}

function buildCssBlock(resolved, types, pathsFilter = null, indent = '  ') {
  const lines = [];

  for (const section of CSS_SECTIONS) {
    const sectionLines = [];
    for (const path of section.paths) {
      if (pathsFilter && !pathsFilter.includes(path)) continue;

      const cssVar = CSS_VAR_NAME[path];
      const value = resolved.get(path);
      if (cssVar === undefined || value === undefined) continue;

      const type = types.get(path);
      sectionLines.push(`${indent}${cssVar}: ${formatCssValue(type, value)};`);
    }
    if (sectionLines.length === 0) continue;
    lines.push(`${indent}/* ${section.label} */`);
    lines.push(...sectionLines);
    lines.push('');
  }

  return lines.join('\n').trimEnd();
}

function lightOverridePaths(darkResolved, lightResolved) {
  return Object.keys(CSS_VAR_NAME).filter((path) => {
    if (!lightResolved.has(path)) return false;
    return darkResolved.get(path) !== lightResolved.get(path);
  });
}

export function buildVariablesCss() {
  const validation = validateTokens();
  if (!validation.ok) {
    throw new Error(formatValidationErrors(validation));
  }

  const { dark, light } = loadResolvedThemes();
  const overridePaths = lightOverridePaths(dark.resolved, light.resolved);

  const header = `/**
 * Plantasonic Design System — CSS custom properties
 * Generated from tokens/foundation.tokens.json + tokens/theme.dark.tokens.json + tokens/theme.light.tokens.json
 * Do not edit manually — run: npm run tokens:build-css
 */`;

  const rootBlock = `:root {\n${buildCssBlock(dark.resolved, dark.types)}\n}`;
  const darkBlock = `[data-theme="dark"] {\n${buildCssBlock(dark.resolved, dark.types)}\n}`;
  const lightBlock = `[data-theme="light"] {\n${buildCssBlock(light.resolved, light.types, overridePaths)}\n}`;

  return [header, '', rootBlock, '', darkBlock, '', lightBlock, ''].join('\n');
}

export function formatValidationErrors(validation) {
  const parts = ['Token validation failed:'];

  for (const error of validation.errors) {
    parts.push(`\n${error.theme} theme unresolved aliases:`);
    for (const { path, alias } of error.unresolved) {
      parts.push(`  ${path} → {${alias}}`);
    }
  }

  if (validation.missingCssMappings.length > 0) {
    parts.push('\nMissing token paths required for CSS output:');
    for (const path of validation.missingCssMappings) {
      parts.push(`  ${path}`);
    }
  }

  return parts.join('\n');
}
