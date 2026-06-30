import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CSS_VAR_NAME, loadResolvedThemes } from './lib/tokens.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'scss/_tokens.generated.scss');

const { dark } = loadResolvedThemes();

const lines = [
  '// Plantasonic Design System — SCSS token references',
  '// Generated — do not edit manually. Run: npm run generate:scss',
  '',
];

for (const [path, cssVar] of Object.entries(CSS_VAR_NAME)) {
  const scssName = '$ds-' + path.replace(/\./g, '-');
  const value = dark.resolved.get(path);
  if (value === undefined) continue;
  lines.push(`${scssName}: var(${cssVar});`);
}

writeFileSync(OUT, lines.join('\n') + '\n', 'utf8');
console.log(`✓ ${OUT}`);
