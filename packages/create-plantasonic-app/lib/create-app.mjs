/**
 * create-app — shared generator for Plantasonic platform consumer apps.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  buildBlueprintMeta,
  buildBlueprintVars,
  listBlueprintOverlayFiles,
  listBlueprints,
  resolveBlueprint,
} from './blueprints.mjs';
import {
  buildConceptMeta,
  buildConceptVars,
  listConceptOverlayFiles,
  listConceptTemplates,
  resolveConcept,
} from './concepts.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const PACKAGE_ROOT = path.resolve(__dirname, '..');
export const TEMPLATES_ROOT = path.join(PACKAGE_ROOT, 'templates');

export const SLUG_RE = /^[a-z][a-z0-9-]*$/;

/** Supported prototype types → template directory name */
export const PROTOTYPE_TYPES = {
  instrument: {
    label: 'Instrument',
    description: 'Full audiovisual instrument with sound, visual, presets, and transport',
    defaultPort: 5175,
  },
  'audio-reactive': {
    label: 'Audio Reactive',
    description: 'Bridge-focused instrument with reactive preset bundles and strong audio→visual mappings',
    defaultPort: 5176,
  },
  'visual-synth': {
    label: 'Visual Synth',
    description: 'Audio-reactive visual synth — visual-first sessions with bridge-driven motion and glitch',
    defaultPort: 5178,
  },
};

/**
 * @typedef {Object} CreateAppOptions
 * @property {string} slug
 * @property {keyof typeof PROTOTYPE_TYPES} prototypeType
 * @property {string} [concept]
 * @property {string} [name]
 * @property {number} [port]
 * @property {string} [output]
 * @property {boolean} [force]
 * @property {string} [cwd]
 */

/**
 * @typedef {Object} CreateAppResult
 * @property {boolean} success
 * @property {string} outputPath
 * @property {string} packageName
 * @property {string} prototypeType
 * @property {string} [conceptId]
 * @property {string[]} warnings
 */

export function printPlantasonicHelp() {
  const types = Object.entries(PROTOTYPE_TYPES)
    .map(([id, meta]) => `    ${id.padEnd(16)} ${meta.description}`)
    .join('\n');
  const blueprints = listBlueprints()
    .map((id) => `    ${id.padEnd(16)} Application blueprint (identity + startup)`)
    .join('\n');
  const concepts = listConceptTemplates()
    .map((c) => `    ${c.id.padEnd(16)} ${c.tagline}`)
    .join('\n');

  console.log(`plantasonic — Plantasonic Platform CLI

Usage:
  plantasonic create <prototype-type> <app-slug> [options]

Prototype types (technical setup):
${types}

Application blueprints (identity + startup experience):
${blueprints || '    (none)'}

Concept templates (identity only):
${concepts}

Options:
  --concept <id>      Blueprint or concept template id (recommended)
  --name <string>     Display name (default: concept name or title-cased slug)
  --port <number>     Dev server port (default: per prototype type)
  --output <path>     Output directory (default: apps/<slug> in monorepo)
  --force             Overwrite existing directory
  --help              Show this help

Examples:
  pnpm plantasonic create audio-reactive signal-9-live --concept signal-9
  pnpm plantasonic create audio-reactive flowers --concept flowers
  pnpm plantasonic create audio-reactive plantasonic-v2 --concept plantasonic

Legacy:
  create-plantasonic-app <slug> [--type instrument] [--concept plantasonic]
`);
}

export function printCreateAppHelp() {
  console.log(`create-plantasonic-app — scaffold a thin @plantasonic/platform consumer

Usage:
  create-plantasonic-app <app-slug> [options]

Options:
  --type <string>     Prototype type (default: instrument)
  --concept <id>      Blueprint or concept template (signal-9, plantasonic, flowers)
  --name <string>     Display name
  --port <number>     Dev server port
  --output <path>     Output directory
  --force             Overwrite existing directory
  --help              Show this help

See also: pnpm plantasonic create <type> <slug> --concept <id>
`);
}

export function titleCaseSlug(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function toCamelCase(slug) {
  const parts = slug.split('-').filter(Boolean);
  return parts
    .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join('');
}

export function toConstPrefix(slug) {
  return slug.replace(/-/g, '_').toUpperCase();
}

export function detectMonorepoRoot(cwd) {
  let dir = cwd;
  while (dir !== path.dirname(dir)) {
    if (
      existsSync(path.join(dir, 'pnpm-workspace.yaml')) &&
      existsSync(path.join(dir, 'packages', 'sdk'))
    ) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return null;
}

export function resolveTemplateRoot(prototypeType) {
  const meta = PROTOTYPE_TYPES[prototypeType];
  if (!meta) {
    const available = Object.keys(PROTOTYPE_TYPES).join(', ');
    throw new Error(`Unknown prototype type "${prototypeType}". Available: ${available}`);
  }
  const templateRoot = path.join(TEMPLATES_ROOT, prototypeType);
  if (!existsSync(templateRoot)) {
    throw new Error(`Template not found for "${prototypeType}": ${templateRoot}`);
  }
  return templateRoot;
}

function walkTemplateFiles(dir, base = dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) {
      files.push(...walkTemplateFiles(full, base));
    } else {
      files.push(path.relative(base, full));
    }
  }
  return files;
}

function renderTemplate(content, vars) {
  let result = content;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{{${key}}}`, String(value));
  }
  if (/\{\{[A-Z_]+\}\}/.test(result)) {
    const leftover = result.match(/\{\{[A-Z_]+\}\}/g);
    throw new Error(`Unresolved template placeholders: ${leftover?.join(', ')}`);
  }
  return result;
}

function copyAndRenderTemplate(templateRoot, templateRelPath, targetPath, vars) {
  const sourcePath = path.join(templateRoot, templateRelPath);
  const raw = readFileSync(sourcePath, 'utf8');
  const rendered = renderTemplate(raw, vars);
  mkdirSync(path.dirname(targetPath), { recursive: true });
  writeFileSync(targetPath, rendered, 'utf8');
}

function buildBaseVars({ slug, prototypeType, name, port, monorepoRoot }) {
  const meta = PROTOTYPE_TYPES[prototypeType];
  const displayName = name ?? titleCaseSlug(slug);
  const devPort = Number.isFinite(port) ? port : meta.defaultPort;
  const camel = toCamelCase(slug);
  const constPrefix = toConstPrefix(slug);
  const packageName = monorepoRoot ? `@plantasonic/${slug}` : slug;

  return {
    APP_SLUG: slug,
    APP_ID: slug,
    APP_NAME: displayName,
    APP_TITLE: displayName,
    APP_TAGLINE: 'A platform audiovisual instrument.',
    APP_DESCRIPTION: `${displayName} — a thin consumer of @plantasonic/platform.`,
    PROTOTYPE_TYPE: prototypeType,
    PACKAGE_NAME: packageName,
    APP_CAMEL: camel,
    APP_CONST: constPrefix,
    EVENT_SOURCE: slug,
    PORT: String(devPort),
    CONCEPT_ID: 'none',
    PRESET_BROWSER_LABEL: `${displayName} Presets`,
    DEFAULT_TEMPO: '72',
    THEME_INTENT: 'dark',
    VISUAL_DIRECTION: 'Assign a --concept template for visual direction.',
    SOUND_DIRECTION: 'Assign a --concept template for sound direction.',
    CONCEPT_ABOUT: `${displayName} — assign a --concept template for app identity.`,
  };
}

function applyConceptOverlay(outputDir, concept, vars) {
  const overlayFiles = listConceptOverlayFiles(concept.overlayRoot);
  for (const rel of overlayFiles) {
    copyAndRenderTemplate(concept.overlayRoot, rel, path.join(outputDir, rel), vars);
  }
  writeFileSync(
    path.join(outputDir, 'concept.meta.json'),
    `${JSON.stringify(buildConceptMeta(concept), null, 2)}\n`,
    'utf8',
  );
}

function applyBlueprintOverlay(outputDir, blueprint, vars) {
  const overlayFiles = listBlueprintOverlayFiles(blueprint.overlayRoot);
  for (const rel of overlayFiles) {
    copyAndRenderTemplate(blueprint.overlayRoot, rel, path.join(outputDir, rel), vars);
  }
  writeFileSync(
    path.join(outputDir, 'blueprint.meta.json'),
    `${JSON.stringify(buildBlueprintMeta(blueprint), null, 2)}\n`,
    'utf8',
  );
}

function resolveIdentityTemplate(identityId) {
  if (!identityId) return null;
  const blueprint = resolveBlueprint(identityId);
  if (blueprint) return { kind: 'blueprint', template: blueprint };
  try {
    const concept = resolveConcept(identityId);
    return { kind: 'concept', template: concept };
  } catch {
    const conceptIds = listConceptTemplates()
      .map((c) => c.id)
      .join(', ');
    throw new Error(
      `Unknown blueprint or concept "${identityId}". Blueprints: ${listBlueprints().join(', ') || 'none'}. Concepts: ${conceptIds}`,
    );
  }
}

/**
 * @param {CreateAppOptions} options
 * @returns {CreateAppResult}
 */
export function createApp(options) {
  const warnings = [];
  const {
    slug,
    prototypeType = 'instrument',
    concept: conceptId,
    name,
    port,
    output,
    force = false,
    cwd = process.cwd(),
  } = options;

  if (!slug || !SLUG_RE.test(slug)) {
    throw new Error('App slug must be lowercase kebab-case (e.g. my-instrument)');
  }

  const templateRoot = resolveTemplateRoot(prototypeType);
  const monorepoRoot = detectMonorepoRoot(cwd);
  const identity = conceptId ? resolveIdentityTemplate(conceptId) : null;

  let vars = buildBaseVars({ slug, prototypeType, name, port, monorepoRoot });
  if (identity?.kind === 'blueprint') {
    const blueprint = identity.template;
    vars = buildBlueprintVars(blueprint, {
      ...vars,
      APP_NAME: name ?? blueprint.identity?.name ?? blueprint.id,
      APP_TITLE: name ?? blueprint.identity?.name ?? blueprint.id,
    });
  } else if (identity?.kind === 'concept') {
    const concept = identity.template;
    vars = buildConceptVars(concept, {
      ...vars,
      APP_NAME: name ?? concept.name,
      APP_TITLE: name ?? concept.name,
    });
  }

  const defaultOutput = monorepoRoot
    ? path.join(monorepoRoot, 'apps', slug)
    : path.join(cwd, slug);
  const outputDir = path.resolve(output ?? defaultOutput);

  if (existsSync(outputDir) && !force) {
    throw new Error(`Output directory already exists: ${outputDir} (use --force to overwrite)`);
  }

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const templateFiles = walkTemplateFiles(templateRoot);
  for (const rel of templateFiles) {
    copyAndRenderTemplate(templateRoot, rel, path.join(outputDir, rel), vars);
  }

  if (identity?.kind === 'blueprint') {
    applyBlueprintOverlay(outputDir, identity.template, vars);
  } else if (identity?.kind === 'concept') {
    applyConceptOverlay(outputDir, identity.template, vars);
  } else {
    warnings.push(
      'No --concept provided. App uses neutral prototype defaults — assign a blueprint or concept for identity.',
    );
  }

  if (!monorepoRoot) {
    warnings.push('Not in plantasonic-platform monorepo — verify sibling paths to platform, DS, and engines.');
  }

  return {
    success: true,
    outputPath: outputDir,
    packageName: vars.PACKAGE_NAME,
    prototypeType,
    conceptId: identity?.template?.id,
    blueprintId: identity?.kind === 'blueprint' ? identity.template.id : undefined,
    warnings,
  };
}

export function printCreateResult(result, { monorepoRoot }) {
  const identityLabel = result.blueprintId
    ? ` + blueprint ${result.blueprintId}`
    : result.conceptId
      ? ` + concept ${result.conceptId}`
      : '';
  console.log(`\nCreated ${result.prototypeType}${identityLabel} app at ${result.outputPath}\n`);
  if (monorepoRoot) {
    console.log('Next steps (from monorepo root):');
    console.log('  pnpm install');
    console.log(`  pnpm --filter ${result.packageName} dev`);
    console.log(`  pnpm --filter ${result.packageName} validate`);
  } else {
    console.log('Next steps:');
    console.log(`  cd ${path.basename(result.outputPath)}`);
    console.log('  pnpm install && pnpm dev');
  }
  if (result.warnings.length) {
    console.log('\nWarnings:');
    for (const w of result.warnings) console.warn(`  ⚠ ${w}`);
  }
  console.log('');
}

/** Parse argv for plantasonic create <type> <slug> */
export function parsePlantasonicCreateArgs(argv) {
  const options = { force: false };
  const positional = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--force') options.force = true;
    else if (arg === '--name') options.name = argv[++i];
    else if (arg === '--port') options.port = Number(argv[++i]);
    else if (arg === '--output') options.output = argv[++i];
    else if (arg === '--concept') options.concept = argv[++i];
    else if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
    else positional.push(arg);
  }

  if (positional.length < 2) {
    return { options, prototypeType: null, slug: null };
  }

  return {
    options,
    prototypeType: positional[0],
    slug: positional[1].toLowerCase(),
  };
}

/** Parse argv for create-plantasonic-app <slug> [--type] */
export function parseCreateAppArgs(argv) {
  const options = { force: false, prototypeType: 'instrument' };
  const positional = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--force') options.force = true;
    else if (arg === '--type') options.prototypeType = argv[++i];
    else if (arg === '--concept') options.concept = argv[++i];
    else if (arg === '--name') options.name = argv[++i];
    else if (arg === '--port') options.port = Number(argv[++i]);
    else if (arg === '--output') options.output = argv[++i];
    else if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
    else positional.push(arg);
  }

  return { options, slug: positional[0]?.toLowerCase() ?? null };
}
