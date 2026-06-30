import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const REQUIRED = [
  'scss/bootstrap-theme.scss',
  'scss/css-theme-bridge.scss',
  'css/variables.css',
];

let ok = true;
for (const rel of REQUIRED) {
  const full = join(ROOT, rel);
  if (!existsSync(full)) {
    console.error(`✗ Missing ${rel}`);
    ok = false;
  }
}

if (!ok) process.exit(1);

console.log('✓ Bootstrap theme artifacts present');

const showcaseDir = join(ROOT, 'showcase');
if (existsSync(join(showcaseDir, 'node_modules/bootstrap'))) {
  const result = spawnSync('npm', ['run', 'showcase:build'], { cwd: ROOT, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
  console.log('✓ Showcase build validates Bootstrap integration');
} else {
  console.log('ℹ Skipping showcase build (install showcase deps for full bootstrap validation)');
}
