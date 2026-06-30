#!/usr/bin/env node
/**
 * Validates the Plantasonic reference app scaffold.
 * Ensures the app is thin, platform-driven, and free of legacy duplication.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, '..');
const srcRoot = path.join(appRoot, 'src');

const failures = [];
const warnings = [];

function walk(dir) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) entries.push(...walk(full));
    else entries.push(full);
  }
  return entries;
}

const srcFiles = walk(srcRoot);
const forbiddenPatterns = [
  { pattern: /variables\.css$/, message: 'Do not copy Design System token CSS locally' },
  { pattern: /bootstrap-theme\.scss$/, message: 'Do not duplicate Bootstrap theme files' },
  { pattern: /legacy/i, message: 'Legacy UI file names are not allowed' },
];

for (const file of srcFiles) {
  const rel = path.relative(appRoot, file);
  for (const { pattern, message } of forbiddenPatterns) {
    if (pattern.test(rel)) failures.push(`${rel}: ${message}`);
  }
}

const mainTs = readFileSync(path.join(srcRoot, 'main.ts'), 'utf8');
if (!mainTs.includes('mountInstrumentApp')) {
  failures.push('main.ts must mount via mountInstrumentApp()');
}
if (!mainTs.includes('@plantasonic/platform-demo/instrument-app')) {
  failures.push('main.ts must import from @plantasonic/platform-demo/instrument-app');
}

const packageJson = JSON.parse(readFileSync(path.join(appRoot, 'package.json'), 'utf8'));
const requiredDeps = [
  '@plantasonic/platform',
  '@plantasonic/platform-types',
  'plantasonic-design-system',
  'plantasia-sound-engine',
  'ascii-visual-engine',
];
for (const dep of requiredDeps) {
  if (!packageJson.dependencies?.[dep]) {
    failures.push(`package.json missing dependency: ${dep}`);
  }
}

const contentFiles = srcFiles.filter((file) => file.endsWith('.ts') || file.endsWith('.tsx'));
const lineCount = contentFiles.reduce((total, file) => {
  return total + readFileSync(file, 'utf8').split('\n').length;
}, 0);

if (lineCount > 600) {
  warnings.push(`Reference app source is ${lineCount} lines — keep app layer thin`);
}

const plantasonicContent = readFileSync(path.join(srcRoot, 'plantasonicAppContent.ts'), 'utf8');
if (!plantasonicContent.includes('plantasonicAppContent')) {
  failures.push('plantasonicAppContent.ts must export plantasonicAppContent');
}

if (failures.length) {
  console.error('Reference app validation failed:\n');
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  process.exit(1);
}

console.log('Reference app validation passed');
console.log(`  Source files: ${contentFiles.length}`);
console.log(`  Source lines: ${lineCount}`);
if (warnings.length) {
  console.log('\nWarnings:');
  for (const warning of warnings) console.warn(`  ⚠ ${warning}`);
}
