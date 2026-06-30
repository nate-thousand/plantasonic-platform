import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const steps = [
  ['generate:bootstrap-compile', 'scripts/generate-bootstrap-compile.mjs'],
  ['generate:types', 'scripts/generate-types.mjs'],
  ['generate:scss', 'scripts/generate-scss.mjs'],
  ['generate:token-docs', 'scripts/generate-token-docs.mjs'],
  ['generate:component-docs', 'scripts/generate-component-docs.mjs'],
  ['generate:ai-tokens', 'scripts/generate-ai-tokens.mjs'],
  ['generate:ai-context', 'scripts/generate-ai-context.mjs'],
  ['generate:ai-docs', 'scripts/generate-ai-docs.mjs'],
  ['generate:ecosystem-context', 'scripts/generate-ecosystem-context.mjs'],
  ['generate:studio-context', 'scripts/generate-studio-context.mjs'],
  ['generate:api-surface', 'scripts/generate-api-surface.mjs'],
  ['generate:stabilization-reports', 'scripts/generate-stabilization-reports.mjs'],
  ['docs', 'scripts/build-docs.mjs'],
];

for (const [name, script] of steps) {
  const result = spawnSync('node', [script], { cwd: ROOT, stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(`✗ ${name} failed`);
    process.exit(result.status ?? 1);
  }
}

console.log('✓ All generation complete');
