import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CSS_VAR_NAME, loadResolvedThemes } from './lib/tokens.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'docs/generated/TOKENS.md');

mkdirSync(join(ROOT, 'docs/generated'), { recursive: true });

const { dark, light } = loadResolvedThemes();

const lines = [
  '# Design Tokens (Generated)',
  '',
  'Auto-generated reference from `tokens/*.tokens.json`. Do not edit manually.',
  '',
  'Regenerate: `npm run generate:token-docs`',
  '',
  '| Token path | CSS variable | Dark | Light |',
  '| --- | --- | --- | --- |',
];

for (const [path, cssVar] of Object.entries(CSS_VAR_NAME)) {
  const d = dark.resolved.get(path) ?? '—';
  const l = light.resolved.get(path) ?? '—';
  lines.push(`| \`${path}\` | \`${cssVar}\` | \`${d}\` | \`${l}\` |`);
}

writeFileSync(OUT, lines.join('\n') + '\n', 'utf8');
console.log(`✓ ${OUT}`);
