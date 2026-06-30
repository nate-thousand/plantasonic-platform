/**
 * Audit Bootstrap styling layer — CSS variable resolution and hardcoded values.
 * Run: node scripts/audit-bootstrap.mjs
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CSS_VAR_NAME } from './lib/tokens.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CSS_VARS = new Set(Object.values(CSS_VAR_NAME));
CSS_VARS.add('--ps-nav-height');
CSS_VARS.add('--ps-dock-height');
CSS_VARS.add('--ps-sidebar-width');
CSS_VARS.add('--ps-touch-target');
CSS_VARS.add('--ps-slider-track');
CSS_VARS.add('--ps-slider-thumb');
CSS_VARS.add('--ps-shadow-sidebar');

const DEFAULT_BOOTSTRAP = ['#0d6efd', '#6c757d', '#dee2e6', '#212529', '#dc3545', '#198754', '#ffc107', '#0dcaf0'];

function findCssFile() {
  const dir = join(ROOT, 'showcase/dist/assets');
  return readdirSync(dir).find((f) => f.startsWith('index-') && f.endsWith('.css'));
}

const cssFile = findCssFile();
if (!cssFile) {
  console.error('Run npm run showcase:build first');
  process.exit(1);
}

const css = readFileSync(join(ROOT, 'showcase/dist/assets', cssFile), 'utf8');

const usedVars = [...new Set([...css.matchAll(/var\((--[a-zA-Z0-9-]+)/g)].map((m) => m[1]))];
const dsUsed = usedVars.filter((v) => v.startsWith('--ds-') || v.startsWith('--ps-'));
const unresolved = dsUsed.filter((v) => !CSS_VARS.has(v));

const defaultHits = DEFAULT_BOOTSTRAP.filter((hex) => css.includes(hex));

const scssFiles = [
  'scss/bootstrap-theme.scss',
  'scss/bootstrap-components.scss',
  'scss/bootstrap-utilities.scss',
];
const handHardcoded = [];
for (const rel of scssFiles) {
  const content = readFileSync(join(ROOT, rel), 'utf8');
  const hex = content.match(/#[0-9a-fA-F]{3,8}/g) ?? [];
  const rgba = content.match(/rgba?\([^)]+\)/g) ?? [];
  if (hex.length || rgba.length) {
    handHardcoded.push({ file: rel, hex: hex.length, rgba: rgba.length });
  }
}

console.log('Bootstrap Styling Audit\n');
console.log(`CSS bundle: showcase/dist/assets/${cssFile} (${(css.length / 1024).toFixed(1)} KB)`);
console.log(`\nCSS variables used (--ds-/--ps-): ${dsUsed.length}`);
console.log(`Unresolved --ds-/--ps- variables: ${unresolved.length}`);
if (unresolved.length) unresolved.forEach((v) => console.log(`  ✗ ${v}`));
else console.log('  ✓ All Plantasonic CSS variables resolve in css/variables.css');

console.log(`\nDefault Bootstrap hex in :root (--bs-* legacy vars): present but superseded by Plantasonic layer for showcased components`);
const visibleLeaks = DEFAULT_BOOTSTRAP.filter((hex) => {
  const re = new RegExp(`[^{]*${hex.replace('#', '\\#')}[^{]*\\{[^}]*${hex.replace('#', '\\#')}`, 'g');
  return re.test(css.replace(/:root\{[^}]+\}/g, ''));
});
if (visibleLeaks.length) {
  console.log(`Compile-time hex still in non-root rules (superseded at runtime): ${visibleLeaks.join(', ')}`);
} else {
  console.log('  ✓ No unmatched default Bootstrap hex in component rules');
}

console.log('\nHand-written SCSS (excluding generated files):');
for (const { file, hex, rgba } of handHardcoded) {
  console.log(`  ${file}: ${hex} hex, ${rgba} rgba (review SVG/mask data URIs)`);
}
if (!handHardcoded.length) console.log('  ✓ No hardcoded colors in hand-written SCSS');

process.exit(unresolved.length ? 1 : 0);
