/**
 * Shared builder for AI token + theme metadata.
 *
 * Derives machine-readable {@link TokenMetadata} / {@link ThemeMetadata} records
 * from the token JSON source so both the TypeScript SDK module
 * (`src/ai/tokens.generated.ts`) and the JSON context export
 * (`generated/ai/tokens.json`) stay in lock-step with `tokens/*.tokens.json`.
 */
import {
  CSS_VAR_NAME,
  CSS_SECTIONS,
  TOKEN_FILES,
  flattenTokens,
  loadTokenFile,
  loadResolvedThemes,
} from './tokens.mjs';

function buildCategoryMap() {
  const map = new Map();
  for (const section of CSS_SECTIONS) {
    for (const path of section.paths) map.set(path, section.label);
  }
  return map;
}

function formatValue(type, value) {
  if (value === undefined) return undefined;
  if (type === 'fontFamily' && Array.isArray(value)) {
    return value.map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(', ');
  }
  if (type === 'cubicBezier' && Array.isArray(value)) {
    return `cubic-bezier(${value.join(', ')})`;
  }
  return String(value);
}

const USAGE_BY_CATEGORY = {
  Brand: 'Brand identity surfaces and primary actions.',
  Surfaces: 'Background fills for app chrome, cards, panels, and stages.',
  Text: 'Foreground text colors by emphasis and context.',
  Borders: 'Hairlines, dividers, and interactive outlines.',
  Overlays: 'Scrims, backdrops, and glass overlays.',
  Status: 'Success / warning / error / info feedback colors.',
  Typography: 'Font families, sizes, weights, line-height, and tracking.',
  Spacing: 'Spacing scale for gaps, padding, and margins.',
  Radius: 'Corner radii for surfaces and controls.',
  Shadows: 'Elevation, focus rings, and glows.',
  Motion: 'Transitions, durations, and easing curves.',
  'Product layout': 'Product chrome dimensions (nav, dock, sidebar, touch targets).',
};

/** Build the full array of token metadata records. */
export function buildTokenMetadata() {
  const { dark, light } = loadResolvedThemes();
  const foundationRaw = flattenTokens(loadTokenFile(TOKEN_FILES.foundation));
  const darkRaw = flattenTokens(loadTokenFile(TOKEN_FILES.dark));
  const lightRaw = flattenTokens(loadTokenFile(TOKEN_FILES.light));
  const categoryOf = buildCategoryMap();

  // Reverse alias index: target path → paths that reference it via {alias}.
  const aliasOf = new Map();
  for (const map of [foundationRaw, darkRaw, lightRaw]) {
    for (const [path, leaf] of map) {
      const match = typeof leaf.value === 'string' && leaf.value.match(/^\{([^}]+)\}$/);
      if (match) {
        const target = match[1];
        if (!aliasOf.has(target)) aliasOf.set(target, []);
        if (!aliasOf.get(target).includes(path)) aliasOf.get(target).push(path);
      }
    }
  }

  const records = [];
  for (const [path, cssVar] of Object.entries(CSS_VAR_NAME)) {
    const type = dark.types.get(path);
    const label = categoryOf.get(path) ?? 'Misc';
    const origin = foundationRaw.has(path)
      ? 'foundation'
      : darkRaw.has(path)
        ? 'theme.dark'
        : lightRaw.has(path)
          ? 'theme.light'
          : 'unknown';

    const record = {
      id: `token.${path}`,
      name: cssVar,
      kind: 'token',
      version: '1.0.0',
      purpose: `${label} token exposed as ${cssVar}.`,
      category: label.toLowerCase().replace(/\s+/g, '-'),
      status: 'stable',
      cssVar,
      path,
      valueType: type,
      values: {
        dark: formatValue(type, dark.resolved.get(path)),
        light: formatValue(type, light.resolved.get(path)),
      },
      usage: USAGE_BY_CATEGORY[label] ?? 'Design token.',
      origin,
      deprecated: false,
      supportedThemes: ['dark', 'light'],
    };
    const aliases = aliasOf.get(path);
    if (aliases && aliases.length) record.aliases = aliases;
    records.push(record);
  }
  return records;
}

/** Build theme metadata records. */
export function buildThemeMetadata() {
  const { dark, light } = loadResolvedThemes();
  return [
    {
      id: 'theme.dark',
      name: 'Dark',
      kind: 'theme',
      version: '1.0.0',
      purpose: 'Default dark instrument theme.',
      category: 'theme',
      status: 'stable',
      selector: '[data-theme="dark"]',
      tokenCount: dark.resolved.size,
      supportedThemes: ['dark'],
    },
    {
      id: 'theme.light',
      name: 'Light',
      kind: 'theme',
      version: '1.0.0',
      purpose: 'Light variant theme.',
      category: 'theme',
      status: 'beta',
      selector: '[data-theme="light"]',
      tokenCount: light.resolved.size,
      supportedThemes: ['light'],
    },
  ];
}
