import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CSS_VAR_NAME } from './lib/tokens.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'generated/css-vars.d.ts');

mkdirSync(join(ROOT, 'generated'), { recursive: true });

const unionLines = Object.values(CSS_VAR_NAME).map((v) => `  | '${v}'`).join('\n');

const lines = [
  '/**',
  ' * Plantasonic Design System — CSS custom property names',
  ' * Generated — do not edit manually. Run: npm run generate:types',
  ' */',
  '',
  'export type DsCssVar =',
  unionLines + ';',
  '',
  'export const dsCssVars = {',
];

for (const [path, cssVar] of Object.entries(CSS_VAR_NAME)) {
  lines.push(`  '${path}': '${cssVar}',`);
}
lines.push('} as const;', '');
lines.push('export type DsTokenPath = keyof typeof dsCssVars;', '');

writeFileSync(OUT, lines.join('\n'), 'utf8');
console.log(`✓ ${OUT} (${Object.keys(CSS_VAR_NAME).length} vars)`);
