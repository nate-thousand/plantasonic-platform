#!/usr/bin/env node
/** Validates generated app is thin and platform-driven */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, '..');
const srcRoot = path.join(appRoot, 'src');
const failures = [];

function walk(dir) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) entries.push(...walk(full));
    else entries.push(full);
  }
  return entries;
}

const mainTs = readFileSync(path.join(srcRoot, 'main.ts'), 'utf8');
if (!mainTs.includes('mountInstrumentApp')) {
  failures.push('main.ts must use mountInstrumentApp()');
}

const packageJson = JSON.parse(readFileSync(path.join(appRoot, 'package.json'), 'utf8'));
for (const dep of ['@plantasonic/platform', '@plantasonic/platform-types', 'plantasonic-design-system']) {
  if (!packageJson.dependencies?.[dep]) failures.push(`missing dependency: ${dep}`);
}

for (const file of walk(srcRoot)) {
  const rel = path.relative(appRoot, file);
  if (/variables\.css$/.test(rel) || /bootstrap-theme\.scss$/.test(rel)) {
    failures.push(`${rel}: do not duplicate Design System assets locally`);
  }
}

if (failures.length) {
  console.error('Validation failed:\n');
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}

console.log('App validation passed');
