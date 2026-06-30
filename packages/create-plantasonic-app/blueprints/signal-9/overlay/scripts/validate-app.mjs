#!/usr/bin/env node
/** Validates blueprint-generated app is thin, platform-driven, and concept-safe */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
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
if (!mainTs.includes('@plantasonic/platform-demo/instrument-app')) {
  failures.push('main.ts must import from @plantasonic/platform-demo/instrument-app');
}

const packageJson = JSON.parse(readFileSync(path.join(appRoot, 'package.json'), 'utf8'));
for (const dep of [
  '@plantasonic/platform',
  '@plantasonic/platform-demo',
  '@plantasonic/platform-types',
  'plantasonic-design-system',
  'plantasia-sound-engine',
  'ascii-visual-engine',
]) {
  if (!packageJson.dependencies?.[dep]) failures.push(`missing dependency: ${dep}`);
}

const stylesIndex = readFileSync(path.join(srcRoot, 'styles/index.scss'), 'utf8');
if (!stylesIndex.includes('creative-workspace.scss')) {
  failures.push('styles/index.scss must import plantasonic-design-system/scss/creative-workspace.scss');
}

const shellConfig = readFileSync(path.join(srcRoot, 'config/shellConfig.ts'), 'utf8');
if (!shellConfig.includes("variant: 'instrument'")) {
  failures.push("shellConfig.ts must use variant: 'instrument' for Creative Workspace");
}

for (const file of walk(srcRoot)) {
  const rel = path.relative(appRoot, file);
  if (/variables\.css$/.test(rel) || /bootstrap-theme\.scss$/.test(rel)) {
    failures.push(`${rel}: do not duplicate Design System assets locally`);
  }
}

const metaPath = path.join(appRoot, 'blueprint.meta.json');
const conceptMetaPath = path.join(appRoot, 'concept.meta.json');
const metaFile = existsSync(metaPath) ? metaPath : conceptMetaPath;

if (existsSync(metaFile)) {
  const meta = JSON.parse(readFileSync(metaFile, 'utf8'));
  const inspectPaths = [
    path.join(srcRoot, 'content'),
    path.join(appRoot, 'README.md'),
    path.join(appRoot, 'index.html'),
  ].filter((p) => existsSync(p));

  let inspectText = '';
  for (const inspectPath of inspectPaths) {
    if (statSync(inspectPath).isDirectory()) {
      inspectText += walk(inspectPath).map((f) => readFileSync(f, 'utf8')).join('\n');
    } else {
      inspectText += readFileSync(inspectPath, 'utf8');
    }
  }

  for (const term of meta.forbiddenTerms ?? []) {
    if (inspectText.includes(term)) {
      failures.push(`blueprint "${meta.blueprintId ?? meta.conceptId}" forbidden term found: ${term}`);
    }
  }

  for (const requiredConfig of ['startupWorkspace.ts', 'theme.ts', 'hud.ts']) {
    if (!existsSync(path.join(srcRoot, 'config', requiredConfig))) {
      failures.push(`missing blueprint config: src/config/${requiredConfig}`);
    }
  }
  for (const requiredContent of ['startupPresets.ts', 'scenes.ts', 'assets.ts']) {
    if (!existsSync(path.join(srcRoot, 'content', requiredContent))) {
      failures.push(`missing blueprint content: src/content/${requiredContent}`);
    }
  }
} else {
  failures.push('missing blueprint.meta.json or concept.meta.json — regenerate with --concept signal-9');
}

if (failures.length) {
  console.error('Validation failed:\n');
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}

console.log('App validation passed (Signal 9 blueprint)');
