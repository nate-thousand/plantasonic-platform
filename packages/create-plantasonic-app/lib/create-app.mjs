/**
 * create-app — shared generator for Plantasonic platform consumer apps.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
};

/**
 * @typedef {Object} CreateAppOptions
 * @property {string} slug
 * @property {keyof typeof PROTOTYPE_TYPES} prototypeType
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
 * @property {string[]} warnings
 */

export function printPlantasonicHelp() {
  const types = Object.entries(PROTOTYPE_TYPES)
    .map(([id, meta]) => `    ${id.padEnd(16)} ${meta.description}`)
    .join('\n');

  console.log(`plantasonic — Plantasonic Platform CLI

Usage:
  plantasonic create <prototype-type> <app-slug> [options]

Prototype types:
${types}

Options:
  --name <string>     Display name (default: title-cased slug)
  --port <number>     Dev server port (default: per prototype type)
  --output <path>     Output directory (default: apps/<slug> in monorepo)
  --force             Overwrite existing directory
  --help              Show this help

Examples:
  pnpm plantasonic create instrument flora-lab
  pnpm plantasonic create audio-reactive pulse-field --name "Pulse Field"
  pnpm create:app my-app --type audio-reactive

Legacy:
  create-plantasonic-app <slug> [--type instrument]
`);
}

export function printCreateAppHelp() {
  console.log(`create-plantasonic-app — scaffold a thin @plantasonic/platform consumer

Usage:
  create-plantasonic-app <app-slug> [options]

Options:
  --type <string>     Prototype type (default: instrument)
  --name <string>     Display name
  --port <number>     Dev server port
  --output <path>     Output directory
  --force             Overwrite existing directory
  --help              Show this help

See also: pnpm plantasonic create <type> <slug>
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

/**
 * @param {CreateAppOptions} options
 * @returns {CreateAppResult}
 */
export function createApp(options) {
  const warnings = [];
  const {
    slug,
    prototypeType = 'instrument',
    name,
    port,
    output,
    force = false,
    cwd = process.cwd(),
  } = options;

  if (!slug || !SLUG_RE.test(slug)) {
    throw new Error('App slug must be lowercase kebab-case (e.g. my-instrument)');
  }

  const meta = PROTOTYPE_TYPES[prototypeType];
  const templateRoot = resolveTemplateRoot(prototypeType);
  const monorepoRoot = detectMonorepoRoot(cwd);
  const displayName = name ?? titleCaseSlug(slug);
  const devPort = Number.isFinite(port) ? port : meta.defaultPort;
  const camel = toCamelCase(slug);
  const constPrefix = toConstPrefix(slug);

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

  const packageName = monorepoRoot ? `@plantasonic/${slug}` : slug;

  const vars = {
    APP_SLUG: slug,
    APP_ID: slug,
    APP_NAME: displayName,
    APP_TITLE: displayName,
    APP_DESCRIPTION:
      prototypeType === 'audio-reactive'
        ? `${displayName} — an audio-reactive platform instrument.`
        : `${displayName} — a thin consumer of @plantasonic/platform.`,
    PROTOTYPE_TYPE: prototypeType,
    PACKAGE_NAME: packageName,
    APP_CAMEL: camel,
    APP_CONST: constPrefix,
    EVENT_SOURCE: slug,
    PORT: String(devPort),
    PRESET_BROWSER_LABEL:
      prototypeType === 'audio-reactive' ? 'Reactive Presets' : `${displayName} Presets`,
    DEFAULT_TEMPO: prototypeType === 'audio-reactive' ? '84' : '72',
  };

  const templateFiles = walkTemplateFiles(templateRoot);
  for (const rel of templateFiles) {
    copyAndRenderTemplate(templateRoot, rel, path.join(outputDir, rel), vars);
  }

  if (!monorepoRoot) {
    warnings.push('Not in plantasonic-platform monorepo — verify sibling paths to platform, DS, and engines.');
  }

  return {
    success: true,
    outputPath: outputDir,
    packageName,
    prototypeType,
    warnings,
  };
}

export function printCreateResult(result, { monorepoRoot }) {
  console.log(`\nCreated ${result.prototypeType} app at ${result.outputPath}\n`);
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
    else if (arg === '--name') options.name = argv[++i];
    else if (arg === '--port') options.port = Number(argv[++i]);
    else if (arg === '--output') options.output = argv[++i];
    else if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
    else positional.push(arg);
  }

  return { options, slug: positional[0]?.toLowerCase() ?? null };
}
