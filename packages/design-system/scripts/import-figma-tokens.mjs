#!/usr/bin/env node
/**
 * Import Figma W3C token exports into Plantasonic token files.
 *
 * Expected inputs (from Figma Variables export):
 *   tokens/figma-source/foundation/Mode 1.tokens.json
 *   tokens/figma-source/Theme 1.tokens.json  (dark / Theme 1)
 *   tokens/figma-source/Theme 2.tokens.json  (light / Theme 2)
 *
 * Usage: node scripts/import-figma-tokens.mjs [figma-source-dir]
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TOKEN_FILES } from './lib/tokens.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_DIR = process.argv[2] ?? join(ROOT, 'tokens/figma-source');

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function extractColor(value) {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && value.hex) return value.hex.toLowerCase();
  return value;
}

function pxToRem(px) {
  return `${px / 16}rem`;
}

function token(type, value) {
  return { $type: type, $value: value };
}

function alias(path) {
  return `{${path}}`;
}

function loadFigmaSource() {
  const foundationPath = join(SOURCE_DIR, 'foundation/Mode 1.tokens.json');
  const theme1Path = join(SOURCE_DIR, 'Theme 1.tokens.json');
  const theme2Path = join(SOURCE_DIR, 'Theme 2.tokens.json');

  for (const p of [foundationPath, theme1Path, theme2Path]) {
    if (!existsSync(p)) {
      throw new Error(`Missing Figma export: ${p}\nRun with exports in tokens/figma-source/`);
    }
  }

  return {
    foundation: readJson(foundationPath),
    theme1: readJson(theme1Path),
    theme2: readJson(theme2Path),
  };
}

function buildFoundation(figma) {
  const f = figma.foundation;

  const green500 = extractColor(f.color['green-500'].$value);
  const green700 = extractColor(f.color['green-700'].$value);
  const green900 = extractColor(f.color['green-900'].$value);

  const space = { '0': token('dimension', '0') };
  const spaceMap = [
    ['1', 4],
    ['2', 8],
    ['3', 16],
    ['4', 24],
    ['5', 32],
    ['6', 48],
    ['8', 64],
    ['12', 12],
    ['20', 20],
    ['28', 28],
    ['36', 36],
    ['40', 40],
    ['44', 44],
    ['52', 52],
    ['56', 56],
    ['60', 60],
    ['68', 68],
    ['72', 72],
    ['999', 999],
  ];
  for (const [key, px] of spaceMap) {
    space[key] = token('dimension', px === 999 ? '999px' : pxToRem(px));
  }

  const radiusMap = {
    xs: 'XS',
    sm: 'S',
    default: 'M',
    lg: 'L',
    xl: 'XL',
    pill: 'round',
  };
  const scalePx = Object.fromEntries(
    Object.entries(f.scale ?? {})
      .filter(([k]) => !k.startsWith('$'))
      .map(([k, v]) => [k, v.$value]),
  );
  const radius = {};
  for (const [tokenKey, figmaKey] of Object.entries(radiusMap)) {
    const ref = f.radius?.[figmaKey]?.$value;
    const aliasPath = typeof ref === 'string' ? ref.replace(/[{}]/g, '') : null;
    const px = aliasPath ? scalePx[aliasPath.split('.')[1]] : null;
    radius[tokenKey] = token('dimension', px != null ? pxToRem(px) : '999px');
  }

  const sizes = Object.entries(f.fontSize ?? {})
    .filter(([k]) => !k.startsWith('$'))
    .map(([, v]) => v.$value)
    .sort((a, b) => a - b);

  return {
    $schema: 'https://design-tokens.github.io/community-group/format/',
    $description:
      'Plantasonic foundation primitives — imported from Figma foundation/Mode 1. Regenerate: npm run tokens:import-figma',
    color: {
      green: {
        500: token('color', green500),
        700: token('color', green700),
        900: token('color', green900),
      },
      neutral: Object.fromEntries(
        Object.entries(f.color.neutral ?? {})
          .filter(([k]) => !k.startsWith('$'))
          .map(([k, v]) => [k, token('color', extractColor(v.$value))]),
      ),
      status: {
        success: token('color', green500),
        warning: token('color', '#f5c542'),
        error: token('color', '#ff5c5c'),
        info: token('color', green700),
      },
      decorative: {
        favorite: token('color', '#f5c542'),
      },
    },
    gradient: {
      light: token('color', `linear-gradient(136deg, ${green500} 0%, #ffffff 100%)`),
      dark: token('color', `linear-gradient(136deg, ${green500} 0%, ${green900} 100%)`),
    },
    font: {
      family: {
        sans: token('fontFamily', [
          f.fontFamilies?.helvetica?.$value ?? 'Helvetica',
          'Arial',
          'sans-serif',
        ]),
        mono: token('fontFamily', [f.fontFamilies?.['dm-mono']?.$value ?? 'DM Mono', 'ui-monospace', 'monospace']),
      },
      size: {
        base: token('dimension', pxToRem(sizes[2] ?? 16)),
        display: token('dimension', pxToRem(f.fontSize?.['3']?.$value ?? 40)),
        h1: token('dimension', pxToRem(f.fontSize?.['4']?.$value ?? 48)),
        h2: token('dimension', pxToRem(32)),
        h3: token('dimension', pxToRem(24)),
        h4: token('dimension', pxToRem(18)),
        body: token('dimension', pxToRem(f.fontSize?.['2']?.$value ?? 16)),
        'body-sm': token('dimension', pxToRem(14)),
        caption: token('dimension', pxToRem(f.fontSize?.['1']?.$value ?? 12)),
        label: token('dimension', pxToRem(14)),
        overline: token('dimension', pxToRem(f.fontSize?.['0']?.$value ?? 10)),
      },
      'line-height': {
        base: token('number', 1.5),
        tight: token('number', 1.1),
        body: token('number', 1.4),
        relaxed: token('number', 1.6),
      },
      weight: {
        body: token('fontWeight', 400),
        headings: token('fontWeight', 700),
        label: token('fontWeight', 700),
        mono: token('fontWeight', 300),
      },
      'letter-spacing': {
        label: token('dimension', '0.08em'),
        overline: token('dimension', '0.08em'),
        caption: token('dimension', '0.04em'),
      },
    },
    space,
    radius,
    transition: {
      instant: token('duration', '80ms'),
      fast: token('duration', '150ms'),
      base: token('duration', '250ms'),
      slow: token('duration', '400ms'),
      slower: token('duration', '600ms'),
    },
    ease: {
      out: token('cubicBezier', [0, 0, 0.2, 1]),
      in: token('cubicBezier', [0.4, 0, 1, 1]),
      'in-out': token('cubicBezier', [0.4, 0, 0.2, 1]),
      standard: token('cubicBezier', [0.2, 0, 0, 1]),
      emphasized: token('cubicBezier', [0.05, 0.7, 0.1, 1]),
      spring: token('cubicBezier', [0.34, 1.56, 0.64, 1]),
    },
    motion: {
      duration: {
        micro: token('duration', alias('transition.instant')),
        fast: token('duration', alias('transition.fast')),
        base: token('duration', alias('transition.base')),
        slow: token('duration', alias('transition.slow')),
        slower: token('duration', alias('transition.slower')),
      },
      easing: {
        standard: token('cubicBezier', alias('ease.standard')),
        emphasized: token('cubicBezier', alias('ease.emphasized')),
        entrance: token('cubicBezier', alias('ease.out')),
        exit: token('cubicBezier', alias('ease.in')),
        spring: token('cubicBezier', alias('ease.spring')),
      },
    },
  };
}

function semanticColor(theme, group, key) {
  return extractColor(theme[group]?.[key]?.$value);
}

function buildDarkTheme(figma) {
  const t = figma.theme1;
  const bg = semanticColor(t, 'background', 'primary');
  const contentPrimary = semanticColor(t, 'content', 'primary');
  const contentSecondary = semanticColor(t, 'content', 'secondary');
  const borderPrimary = semanticColor(t, 'border', 'primary');
  const borderSecondary = semanticColor(t, 'border', 'secondary');

  return {
    $schema: 'https://design-tokens.github.io/community-group/format/',
    $description:
      'Plantasonic dark theme — Figma semantic Theme 1. Regenerate: npm run tokens:import-figma',
    color: {
      primary: {
        default: token('color', alias('color.green.500')),
        hover: token('color', alias('color.green.700')),
        pressed: token('color', '#00cc46'),
        disabled: token('color', alias('color.neutral.800')),
      },
      secondary: token('color', contentPrimary),
      accent: token('color', contentPrimary),
      surface: {
        default: token('color', bg),
        app: token('color', bg),
        stage: token('color', alias('color.neutral.black')),
        nav: token('color', bg),
        dock: token('color', bg),
        input: token('color', alias('color.neutral.800')),
        card: token('color', bg),
        raised: token('color', alias('color.neutral.900')),
        'raised-hover': token('color', '#182b20'),
        sunken: token('color', '#050a07'),
        overlay: token('color', alias('color.neutral.800')),
      },
      text: {
        primary: token('color', contentSecondary),
        secondary: token('color', alias('color.neutral.400')),
        muted: token('color', alias('color.neutral.500')),
        accent: token('color', contentPrimary),
        link: token('color', contentPrimary),
        inverse: token('color', contentSecondary),
        'on-primary': token('color', bg),
        'on-secondary': token('color', bg),
        'on-accent': token('color', bg),
      },
      border: {
        default: token('color', 'rgba(255, 255, 255, 0.14)'),
        subtle: token('color', 'rgba(255, 255, 255, 0.08)'),
        strong: token('color', borderSecondary),
        interactive: token('color', borderPrimary),
        focus: token('color', borderPrimary),
      },
      overlay: {
        backdrop: token('color', 'rgba(0, 0, 0, 0.65)'),
        'scrim-light': token('color', 'rgba(255, 255, 255, 0.08)'),
        scrim: token('color', alias('color.overlay.scrim-light')),
        'scrim-strong': token('color', 'rgba(255, 255, 255, 0.12)'),
        glass: token('color', 'rgba(7, 15, 10, 0.85)'),
        'focus-outline': token('color', 'rgba(255, 255, 255, 0.45)'),
      },
      status: {
        'error-surface': token('color', 'rgba(180, 40, 40, 0.92)'),
        'error-border': token('color', 'rgba(255, 255, 255, 0.15)'),
      },
    },
    shadow: {
      none: token('shadow', 'none'),
      sm: token('shadow', '0 4px 12px rgba(0, 255, 87, 0.08)'),
      md: token('shadow', '0 8px 24px rgba(0, 255, 87, 0.10)'),
      lg: token('shadow', '0 16px 48px rgba(0, 255, 87, 0.12)'),
      focus: token('shadow', '0 0 0 0.2rem rgba(77, 255, 137, 0.35)'),
      'glow-accent': token('shadow', '0 0 24px rgba(77, 255, 137, 0.35)'),
      'stage-inset': token('shadow', 'inset 0 0 48px rgba(0, 0, 0, 0.65)'),
    },
    product: {
      'nav-height': token('dimension', pxToRem(56)),
      'dock-height': token('dimension', pxToRem(72)),
      'sidebar-width': token('dimension', pxToRem(288)),
      'touch-target': token('dimension', pxToRem(44)),
      'touch-target-large': token('dimension', pxToRem(52)),
      'instrument-gutter': token('dimension', alias('space.3')),
      'floating-panel-min': token('dimension', pxToRem(192)),
      'hud-opacity': token('number', 0.86),
      'overlay-radius': token('dimension', alias('radius.xl')),
      'preset-card-radius': token('dimension', alias('radius.default')),
      'preset-card-border': token('color', alias('color.border.default')),
      'preset-card-active-border': token('color', alias('color.border.focus')),
      'slider-track': token('color', alias('color.surface.input')),
      'slider-thumb': token('color', alias('color.primary.default')),
      'stage-border': token('color', alias('color.border.default')),
      'performance-chrome-opacity': token('number', 0.92),
      'shadow-overlay': token('shadow', '0 16px 48px rgba(0, 0, 0, 0.65)'),
      'shadow-sidebar': token('shadow', '4px 0 24px rgba(0, 0, 0, 0.4)'),
      'shadow-panel': token('shadow', alias('product.shadow-overlay')),
    },
  };
}

function buildLightTheme(figma) {
  const t = figma.theme2;
  const bg = semanticColor(t, 'background', 'primary');
  const contentPrimary = semanticColor(t, 'content', 'primary');
  const contentSecondary = semanticColor(t, 'content', 'secondary');
  const borderPrimary = semanticColor(t, 'border', 'primary');
  const borderSecondary = semanticColor(t, 'border', 'secondary');

  return {
    $schema: 'https://design-tokens.github.io/community-group/format/',
    $description:
      'Plantasonic light theme — Figma semantic Theme 2 (green surface). Regenerate: npm run tokens:import-figma',
    color: {
      primary: {
        default: token('color', alias('color.green.500')),
        hover: token('color', alias('color.green.700')),
        pressed: token('color', '#00cc46'),
        disabled: token('color', alias('color.neutral.300')),
      },
      secondary: token('color', contentPrimary),
      accent: token('color', contentPrimary),
      surface: {
        default: token('color', bg),
        app: token('color', bg),
        stage: token('color', contentSecondary),
        nav: token('color', bg),
        dock: token('color', bg),
        input: token('color', borderPrimary),
        card: token('color', bg),
        raised: token('color', bg),
        'raised-hover': token('color', bg),
        sunken: token('color', borderPrimary),
        overlay: token('color', borderPrimary),
      },
      text: {
        primary: token('color', contentSecondary),
        secondary: token('color', borderPrimary),
        muted: token('color', alias('color.neutral.700')),
        accent: token('color', contentPrimary),
        link: token('color', borderPrimary),
        inverse: token('color', bg),
        'on-primary': token('color', borderPrimary),
        'on-secondary': token('color', borderPrimary),
        'on-accent': token('color', borderPrimary),
      },
      border: {
        default: token('color', borderPrimary),
        subtle: token('color', borderPrimary),
        strong: token('color', borderSecondary),
        interactive: token('color', borderSecondary),
        focus: token('color', borderPrimary),
      },
      overlay: {
        backdrop: token('color', 'rgba(0, 0, 0, 0.45)'),
        'scrim-light': token('color', 'rgba(7, 15, 10, 0.08)'),
        scrim: token('color', alias('color.overlay.scrim-light')),
        'scrim-strong': token('color', 'rgba(7, 15, 10, 0.12)'),
        glass: token('color', 'rgba(77, 255, 137, 0.85)'),
        'focus-outline': token('color', borderPrimary),
      },
      status: {
        'error-surface': token('color', 'rgba(180, 40, 40, 0.92)'),
        'error-border': token('color', borderPrimary),
      },
    },
    shadow: {
      none: token('shadow', 'none'),
      sm: token('shadow', '0 4px 12px rgba(7, 15, 10, 0.12)'),
      md: token('shadow', '0 8px 24px rgba(7, 15, 10, 0.14)'),
      lg: token('shadow', '0 16px 48px rgba(7, 15, 10, 0.16)'),
      focus: token('shadow', `0 0 0 0.2rem ${borderPrimary}`),
      'glow-accent': token('shadow', '0 0 24px rgba(7, 15, 10, 0.25)'),
      'stage-inset': token('shadow', 'inset 0 0 48px rgba(0, 0, 0, 0.35)'),
    },
    product: {
      'nav-height': token('dimension', pxToRem(56)),
      'dock-height': token('dimension', pxToRem(72)),
      'sidebar-width': token('dimension', pxToRem(288)),
      'touch-target': token('dimension', pxToRem(44)),
      'touch-target-large': token('dimension', pxToRem(52)),
      'instrument-gutter': token('dimension', alias('space.3')),
      'floating-panel-min': token('dimension', pxToRem(192)),
      'hud-opacity': token('number', 0.86),
      'overlay-radius': token('dimension', alias('radius.xl')),
      'preset-card-radius': token('dimension', alias('radius.default')),
      'preset-card-border': token('color', alias('color.border.default')),
      'preset-card-active-border': token('color', alias('color.border.focus')),
      'slider-track': token('color', alias('color.surface.input')),
      'slider-thumb': token('color', alias('color.primary.default')),
      'stage-border': token('color', alias('color.border.default')),
      'performance-chrome-opacity': token('number', 0.92),
      'shadow-overlay': token('shadow', '0 16px 48px rgba(0, 0, 0, 0.45)'),
      'shadow-sidebar': token('shadow', '4px 0 24px rgba(0, 0, 0, 0.15)'),
      'shadow-panel': token('shadow', alias('product.shadow-overlay')),
    },
  };
}

function main() {
  const figma = loadFigmaSource();
  const foundation = buildFoundation(figma);
  const dark = buildDarkTheme(figma);
  const light = buildLightTheme(figma);

  writeFileSync(TOKEN_FILES.foundation, `${JSON.stringify(foundation, null, 2)}\n`);
  writeFileSync(TOKEN_FILES.dark, `${JSON.stringify(dark, null, 2)}\n`);
  writeFileSync(TOKEN_FILES.light, `${JSON.stringify(light, null, 2)}\n`);

  console.log('Imported Figma tokens:');
  console.log(`  ${TOKEN_FILES.foundation}`);
  console.log(`  ${TOKEN_FILES.dark}`);
  console.log(`  ${TOKEN_FILES.light}`);
  console.log('\nNext: npm run build');
}

main();
