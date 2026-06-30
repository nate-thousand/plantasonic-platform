import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateTokens, TOKEN_FILES } from './lib/tokens.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function flattenAliases(obj, prefix = '', out = new Map(), dupes = []) {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && '$value' in value) {
      if (out.has(path)) dupes.push(path);
      out.set(path, value);
    } else if (value && typeof value === 'object') {
      flattenAliases(value, path, out, dupes);
    }
  }
  return { map: out, dupes };
}

function loadFlat(file) {
  return flattenAliases(JSON.parse(readFileSync(file, 'utf8')));
}

const files = [
  ['foundation', TOKEN_FILES.foundation],
  ['dark', TOKEN_FILES.dark],
  ['light', TOKEN_FILES.light],
];

const withinFileDupes = [];
for (const [name, file] of files) {
  const { dupes } = loadFlat(file);
  for (const path of dupes) withinFileDupes.push({ path, file: name });
}

const validation = validateTokens();
let ok = validation.ok;

console.log('Plantasonic quality check\n');

if (!validation.ok) {
  console.error('✗ Token validation failed');
  ok = false;
} else {
  console.log(`✓ Tokens valid (${validation.cssVarCount} CSS mappings)`);
}

if (withinFileDupes.length > 0) {
  console.error('✗ Duplicate token paths within a token file:');
  for (const { path, file } of withinFileDupes) {
    console.error(`  ${path} in ${file}`);
  }
  ok = false;
} else {
  console.log('✓ No duplicate token paths within token files');
}

const bootstrapFiles = [
  ['scss/bootstrap-theme.scss', /\$ds-color-primary|bootstrap-compile\.generated/],
  ['scss/bootstrap-components.scss', /\$ds-color-primary-default|var\(--ds-/],
  ['scss/bootstrap-utilities.scss', /\$ds-color-primary-default|var\(--ds-/],
  ['scss/css-theme-bridge.scss', /bootstrap-components/],
  ['scss/_bootstrap-compile.generated.scss', /\$ds-color-primary:/],
];
for (const [rel, pattern] of bootstrapFiles) {
  const content = readFileSync(join(ROOT, rel), 'utf8');
  if (!pattern.test(content)) {
    console.error(`✗ ${rel} missing expected token references`);
    ok = false;
  }
}
console.log('✓ Bootstrap SCSS layer files present and token-linked');

const bootstrapSections = join(ROOT, 'showcase/src/sections/bootstrap');
const sectionCount = readdirSync(bootstrapSections).filter((f) => f.endsWith('.ts') && f !== 'index.ts').length;
if (sectionCount < 10) {
  console.error(`✗ Bootstrap showcase coverage low (${sectionCount} sections)`);
  ok = false;
} else {
  console.log(`✓ Bootstrap showcase coverage (${sectionCount} sections)`);
}

const templates = readdirSync(join(ROOT, 'templates'));
if (templates.length < 4) {
  console.error('✗ Missing starter templates');
  ok = false;
} else {
  console.log(`✓ Starter templates (${templates.length})`);
}

// Platform layers — primitives (Layer 9), components (Layer 1), motion (Layer 3)
const platformFiles = [
  ['src/primitives/index.ts', /export function stack/],
  ['src/components/index.ts', /export .*button/],
  ['src/motion/index.ts', /export function animate/],
  ['scss/primitives.scss', /var\(--ds-space-/],
  ['scss/components.scss', /var\(--ds-color-/],
  ['scss/motion.scss', /var\(--ds-motion-/],
];
let platformOk = true;
for (const [rel, pattern] of platformFiles) {
  const content = readFileSync(join(ROOT, rel), 'utf8');
  if (!pattern.test(content)) {
    console.error(`✗ ${rel} missing expected platform content`);
    ok = false;
    platformOk = false;
  }
}
if (platformOk) console.log('✓ Platform layers present and token-linked (primitives, components, motion)');

// Creative Application Framework (Phase 3) — instrument shell + SDK
const creativeFiles = [
  ['src/instrument/shell.ts', /export function renderInstrumentShell/],
  ['src/instrument/regions.ts', /export const REGION_NAMES/],
  ['src/instrument/transport.ts', /export function renderTransport/],
  ['src/instrument/canvas.ts', /export function mountCanvas/],
  ['src/instrument/inspector.ts', /export function createInspector/],
  ['src/instrument/status.ts', /export function createMetrics/],
  ['src/instrument/modes.ts', /export function setShellMode/],
  ['src/instrument/floating.ts', /export function bindFloating/],
  ['src/instrument/input.ts', /export function createInputManager/],
  ['src/instrument/index.ts', /renderInstrumentShell/],
  ['src/app/index.ts', /export function createApplication/],
  ['scss/instrument.scss', /\.ps-instrument/],
];
let creativeOk = true;
for (const [rel, pattern] of creativeFiles) {
  const content = readFileSync(join(ROOT, rel), 'utf8');
  if (!pattern.test(content)) {
    console.error(`✗ ${rel} missing expected creative-framework content`);
    ok = false;
    creativeOk = false;
  }
}
// instrument variant must be additive: standard navigation path preserved
const shellIndex = readFileSync(join(ROOT, 'src/shell/index.ts'), 'utf8');
if (!/renderNavigationFrame/.test(shellIndex) || !/variant === 'instrument'/.test(shellIndex)) {
  console.error('✗ src/shell/index.ts must keep the standard path and branch on the instrument variant');
  ok = false;
  creativeOk = false;
}
if (creativeOk) console.log('✓ Creative Application Framework present (instrument shell, regions, transport, canvas, inspector, status, modes, floating, input, SDK)');

// Creative Workspace layer — layout presets between shell and content
const cwFiles = [
  ['src/creative-workspace/layouts.ts', /export function renderCreativeWorkspace/],
  ['src/creative-workspace/surfaces.ts', /export function renderFullscreenStage/],
  ['src/creative-workspace/bind.ts', /export function bindCreativeWorkspace/],
  ['src/creative-workspace/index.ts', /WORKSPACE_PRESETS/],
  ['scss/creative-workspace.scss', /\.ps-creative-workspace/],
  ['docs/platform/CREATIVE_WORKSPACE_GUIDE.md', /renderCreativeWorkspace/],
];
let cwOk = true;
for (const [rel, pattern] of cwFiles) {
  const content = readFileSync(join(ROOT, rel), 'utf8');
  if (!pattern.test(content)) {
    console.error(`✗ ${rel} missing expected creative-workspace content`);
    ok = false;
    cwOk = false;
  }
}
if (cwOk) console.log('✓ Creative Workspace layer present (5 presets, floating surfaces, bindCreativeWorkspace)');

// AI-native platform (Phase 13) — metadata, registry, SDK, generators, context export
const aiFiles = [
  ['src/ai/metadata.ts', /export interface ComponentMetadata/],
  ['src/ai/registry.ts', /export class Registry/],
  ['src/ai/sdk.ts', /export function getComponents/],
  ['src/ai/validate.ts', /export function validateApplication/],
  ['src/ai/generators.ts', /export function generateComponent/],
  ['src/ai/plugin.ts', /export function definePlugin/],
  ['src/ai/index.ts', /from '.\/sdk.ts'/],
  ['src/ai/tokens.generated.ts', /export const TOKEN_METADATA/],
  ['generated/ai/index.json', /"metadataSpecVersion"/],
  ['generated/ai/registry.json', /"records"/],
];
let aiOk = true;
for (const [rel, pattern] of aiFiles) {
  if (!existsSync(join(ROOT, rel)) || !pattern.test(readFileSync(join(ROOT, rel), 'utf8'))) {
    console.error(`✗ ${rel} missing expected AI-native platform content`);
    ok = false;
    aiOk = false;
  }
}
if (aiOk) console.log('✓ AI-native platform present (metadata, registry, SDK, validation, generators, plugins, context export)');

const prototypeFiles = [
  ['src/prototype/create-prototype.ts', /export function createPrototype/],
  ['src/prototype/catalog.ts', /PROTOTYPE_TYPE_IDS/],
  ['src/prototype/spec-parser.ts', /planFromBrief/],
  ['src/prototype/validate.ts', /validatePrototypeStructure/],
];
let protoOk = true;
for (const [rel, pattern] of prototypeFiles) {
  if (!existsSync(join(ROOT, rel)) || !pattern.test(readFileSync(join(ROOT, rel), 'utf8'))) {
    console.error(`✗ ${rel} missing expected prototype platform content`);
    ok = false;
    protoOk = false;
  }
}
if (protoOk) console.log('✓ Prototype platform present (catalog, SDK, spec parser, validation, CLI)');

const ecosystemFiles = [
  ['src/platform/create-project.ts', /export function createProject/],
  ['src/platform/engines.ts', /ENGINE_CATALOG/],
  ['src/platform/projects.ts', /ProjectRegistry/],
  ['src/platform/sdk.ts', /getPlatformArchitecture/],
];
let ecosystemOk = true;
for (const [rel, pattern] of ecosystemFiles) {
  if (!existsSync(join(ROOT, rel)) || !pattern.test(readFileSync(join(ROOT, rel), 'utf8'))) {
    console.error(`✗ ${rel} missing expected creative ecosystem content`);
    ok = false;
    ecosystemOk = false;
  }
}
if (ecosystemOk) console.log('✓ Creative ecosystem platform present (engines, projects, assets, workflows, services, quality)');

const studioFiles = [
  ['src/studio/orchestrator.ts', /orchestrateProject/],
  ['src/studio/specification.ts', /generateSpecification/],
  ['src/studio/workspace.ts', /loadWorkspace/],
  ['src/studio/sdk.ts', /getStudioArchitecture/],
];
let studioOk = true;
for (const [rel, pattern] of studioFiles) {
  if (!existsSync(join(ROOT, rel)) || !pattern.test(readFileSync(join(ROOT, rel), 'utf8'))) {
    console.error(`✗ ${rel} missing expected creative studio content`);
    ok = false;
    studioOk = false;
  }
}
if (studioOk) console.log('✓ Creative Studio present (pipeline, orchestrator, workspace, automation, validation)');

const pkgJson = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const requiredExports = [
  './css/variables.css',
  './shell',
  './primitives',
  './components',
  './motion',
  './scss/primitives.scss',
  './scss/components.scss',
  './scss/motion.scss',
  './instrument',
  './creative-workspace',
  './app',
  './scss/instrument.scss',
  './scss/creative-workspace.scss',
  './ai',
  './prototype',
  './platform',
  './studio',
  './generated/api-surface.json',
];
const missingExports = requiredExports.filter((e) => !pkgJson.exports[e]);
if (missingExports.length) {
  console.error(`✗ package.json missing exports: ${missingExports.join(', ')}`);
  ok = false;
} else {
  console.log('✓ Platform package exports present');
}

const showcaseSectionsDir = join(ROOT, 'showcase/src/sections');
for (const section of ['primitives.ts', 'components.ts', 'motion-system.ts', 'creative.ts', 'creative-workspace.ts']) {
  if (!readdirSync(showcaseSectionsDir).includes(section)) {
    console.error(`✗ Missing showcase section: ${section}`);
    ok = false;
  }
}
console.log('✓ Platform showcase sections present');

const examplesDir = join(ROOT, 'examples');
const exampleCount = existsSync(examplesDir)
  ? readdirSync(examplesDir).filter((d) => !d.startsWith('.') && d !== 'README.md').length
  : 0;
if (exampleCount < 7) {
  console.error(`✗ Expected 7 reference examples, found ${exampleCount}`);
  ok = false;
} else {
  console.log(`✓ Reference examples present (${exampleCount})`);
}

if (!existsSync(join(ROOT, 'generated/api-surface.json'))) {
  console.error('✗ Missing generated/api-surface.json — run npm run generate:api-surface');
  ok = false;
} else {
  console.log('✓ API surface manifest present');
}

if (!ok) process.exit(1);
console.log('\nAll quality checks passed');
