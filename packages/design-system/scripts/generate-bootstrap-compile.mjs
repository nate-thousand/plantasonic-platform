import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadResolvedThemes } from './lib/tokens.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'scss/_bootstrap-compile.generated.scss');

/** Token paths used for Bootstrap compile-time SCSS (dark theme defaults) */
export const BOOTSTRAP_COMPILE_MAP = {
  '$ds-color-primary': 'color.primary.default',
  '$ds-color-primary-hover': 'color.primary.hover',
  '$ds-color-primary-pressed': 'color.primary.pressed',
  '$ds-color-primary-disabled': 'color.primary.disabled',
  '$ds-color-secondary': 'color.secondary',
  '$ds-color-accent': 'color.accent',
  '$ds-color-surface-default': 'color.surface.default',
  '$ds-color-surface-app': 'color.surface.app',
  '$ds-color-surface-stage': 'color.surface.stage',
  '$ds-color-surface-nav': 'color.surface.nav',
  '$ds-color-surface-dock': 'color.surface.dock',
  '$ds-color-surface-input': 'color.surface.input',
  '$ds-color-surface-card': 'color.surface.card',
  '$ds-color-surface-raised': 'color.surface.raised',
  '$ds-color-surface-raised-hover': 'color.surface.raised-hover',
  '$ds-color-surface-sunken': 'color.surface.sunken',
  '$ds-color-surface-overlay': 'color.surface.overlay',
  '$ds-color-text-primary': 'color.text.primary',
  '$ds-color-text-secondary': 'color.text.secondary',
  '$ds-color-text-muted': 'color.text.muted',
  '$ds-color-text-accent': 'color.text.accent',
  '$ds-color-text-link': 'color.text.link',
  '$ds-color-text-on-primary': 'color.text.on-primary',
  '$ds-color-text-on-secondary': 'color.text.on-secondary',
  '$ds-color-border-default': 'color.border.default',
  '$ds-color-border-subtle': 'color.border.subtle',
  '$ds-color-border-strong': 'color.border.strong',
  '$ds-color-border-focus': 'color.border.focus',
  '$ds-color-overlay-backdrop': 'color.overlay.backdrop',
  '$ds-color-overlay-scrim-light': 'color.overlay.scrim-light',
  '$ds-color-overlay-scrim-strong': 'color.overlay.scrim-strong',
  '$ds-color-success': 'color.status.success',
  '$ds-color-warning': 'color.status.warning',
  '$ds-color-error': 'color.status.error',
  '$ds-color-info': 'color.status.info',
  '$ds-color-error-surface': 'color.status.error-surface',
  '$ds-color-error-border': 'color.status.error-border',
  '$ds-font-family-sans': 'font.family.sans',
  '$ds-font-family-mono': 'font.family.mono',
  '$ds-font-size-base': 'font.size.base',
  '$ds-font-size-body-sm': 'font.size.body-sm',
  '$ds-font-size-h4': 'font.size.h4',
  '$ds-font-size-h1': 'font.size.h1',
  '$ds-font-size-h2': 'font.size.h2',
  '$ds-font-size-h3': 'font.size.h3',
  '$ds-font-size-label': 'font.size.label',
  '$ds-font-size-caption': 'font.size.caption',
  '$ds-line-height-relaxed': 'font.line-height.relaxed',
  '$ds-headings-font-weight': 'font.weight.headings',
  '$ds-font-weight-label': 'font.weight.label',
  '$ds-spacer': 'space.3',
  '$ds-space-12': 'space.12',
  '$ds-radius-default': 'radius.default',
  '$ds-radius-sm': 'radius.sm',
  '$ds-radius-lg': 'radius.lg',
  '$ds-shadow-sm': 'shadow.sm',
  '$ds-shadow-md': 'shadow.md',
  '$ds-shadow-lg': 'shadow.lg',
  '$ds-shadow-focus': 'shadow.focus',
  '$ds-shadow-stage-inset': 'shadow.stage-inset',
  '$ps-slider-track': 'product.slider-track',
  '$ps-slider-thumb': 'product.slider-thumb',
  '$ps-shadow-sidebar': 'product.shadow-sidebar',
};

function formatScssValue(type, value) {
  if (type === 'fontFamily' && Array.isArray(value)) {
    return value.map((f) => (/\s/.test(f) ? `'${f}'` : f)).join(', ');
  }
  if (typeof value === 'number') return String(value);
  return String(value);
}

export function buildBootstrapCompileScss() {
  const { dark } = loadResolvedThemes();
  const lines = [
    '// Plantasonic Bootstrap compile-time token values (dark theme defaults)',
    '// Generated — do not edit manually. Run: npm run generate:bootstrap-compile',
    '',
  ];

  for (const [scssName, path] of Object.entries(BOOTSTRAP_COMPILE_MAP)) {
    const value = dark.resolved.get(path);
    const type = dark.types.get(path);
    if (value === undefined) {
      throw new Error(`Missing token for bootstrap compile: ${path}`);
    }
    lines.push(`${scssName}: ${formatScssValue(type, value)};`);
  }

  return lines.join('\n') + '\n';
}

mkdirSync(join(ROOT, 'scss'), { recursive: true });
writeFileSync(OUT, buildBootstrapCompileScss(), 'utf8');
console.log(`✓ ${OUT}`);
