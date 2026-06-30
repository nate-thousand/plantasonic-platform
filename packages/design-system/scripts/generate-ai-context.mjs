/**
 * Generate AI context export — structured JSON describing the entire Design
 * System so AI tools understand it without parsing source code.
 *
 * Writes to `generated/ai/`:
 *   components.json · layouts.json · patterns.json · tokens.json · themes.json
 *   registry.json · knowledge-graph.json · architecture.json · compliance.json
 *   index.json (manifest)
 *
 * Run: `npm run generate:ai-context`
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  registry,
  getComponents,
  getLayouts,
  getPatterns,
  getTokens,
  getThemes,
  getKnowledgeGraph,
  getArchitecture,
  METADATA_SPEC_VERSION,
  SDK_VERSION,
} from '../src/ai/index.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'generated/ai');
mkdirSync(OUT_DIR, { recursive: true });

const generatedAt = new Date().toISOString();

function write(name, data) {
  writeFileSync(join(OUT_DIR, name), JSON.stringify(data, null, 2) + '\n', 'utf8');
  return name;
}

const COMPLIANCE_RULES = [
  { id: 'no-hardcoded-color', severity: 'error', description: 'No hardcoded hex colors — use design tokens.' },
  { id: 'no-raw-color-function', severity: 'warning', description: 'Avoid raw rgb()/hsl() colors; prefer tokens.' },
  { id: 'unknown-design-token', severity: 'warning', description: 'Referenced --ds-*/--ps-* variable not in the token registry.' },
  { id: 'deprecated-token', severity: 'error', description: 'Use of a deprecated token.' },
  { id: 'deprecated-api', severity: 'error', description: 'Use of a deprecated component API.' },
  { id: 'duplicate-component', severity: 'warning', description: 'Local component duplicates a Design System component.' },
];

const meta = { generatedAt, sdkVersion: SDK_VERSION, metadataSpecVersion: METADATA_SPEC_VERSION };

const files = [];
files.push(write('components.json', { ...meta, components: getComponents() }));
files.push(write('layouts.json', { ...meta, layouts: getLayouts() }));
files.push(write('patterns.json', { ...meta, patterns: getPatterns() }));
files.push(write('tokens.json', { ...meta, tokens: getTokens() }));
files.push(write('themes.json', { ...meta, themes: getThemes() }));
files.push(write('registry.json', { ...meta, summary: registry.summary(), records: registry.all() }));
files.push(write('knowledge-graph.json', { ...meta, ...getKnowledgeGraph() }));
files.push(write('architecture.json', getArchitecture()));
files.push(write('compliance.json', { ...meta, rules: COMPLIANCE_RULES }));

write('index.json', {
  ...meta,
  description: 'Plantasonic Design System — AI context manifest. Machine-readable source of truth.',
  summary: registry.summary(),
  files,
});

console.log(`✓ generated/ai/ (${files.length + 1} files, ${registry.summary().total} records)`);
