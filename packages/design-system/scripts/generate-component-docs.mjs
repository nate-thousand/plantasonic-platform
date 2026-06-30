import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BOOTSTRAP_DIR = join(ROOT, 'showcase/src/sections/bootstrap');
const OUT = join(ROOT, 'docs/generated/COMPONENTS.md');

mkdirSync(join(ROOT, 'docs/generated'), { recursive: true });

const categories = existsSync(BOOTSTRAP_DIR)
  ? readdirSync(BOOTSTRAP_DIR).filter((f) => f.endsWith('.ts') && f !== 'index.ts').map((f) => f.replace('.ts', ''))
  : [];

const lines = [
  '# Component Reference (Generated)',
  '',
  'Bootstrap showcase categories shipped with the design system.',
  '',
  'Regenerate: `npm run generate:component-docs`',
  '',
  '## Bootstrap categories',
  '',
  ...categories.map((c) => `- \`${c}\` — see showcase → Bootstrap → ${c.replace(/-/g, ' ')}`),
  '',
  '## Plantasonic components',
  '',
  'Milestone 3 instrument components are documented in the showcase when available.',
  '',
];

writeFileSync(OUT, lines.join('\n'), 'utf8');
console.log(`✓ ${OUT} (${categories.length} bootstrap categories)`);
