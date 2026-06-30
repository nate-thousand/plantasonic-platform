/**
 * Generate documentation from the registry (single source of truth).
 *
 * Writes registry-derived catalogs to `docs/generated/ai/` so component,
 * layout, pattern, and token references never need hand-maintenance.
 *
 * Run: `npm run generate:ai-docs`
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateDocumentation } from '../src/ai/index.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'docs/generated/ai');
mkdirSync(OUT_DIR, { recursive: true });

const docs = generateDocumentation();
const written = [];
for (const [name, content] of Object.entries(docs)) {
  writeFileSync(join(OUT_DIR, name), content.endsWith('\n') ? content : content + '\n', 'utf8');
  written.push(name);
}

writeFileSync(
  join(OUT_DIR, 'README.md'),
  [
    '# AI-Generated Documentation',
    '',
    'These catalogs are generated from the design system registry. Do not edit manually.',
    '',
    'Regenerate: `npm run generate:ai-docs`',
    '',
    ...written.map((n) => `- [${n}](./${n})`),
    '',
  ].join('\n'),
  'utf8',
);

console.log(`✓ docs/generated/ai/ (${written.length + 1} files)`);
