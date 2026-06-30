#!/usr/bin/env node
/**
 * Platform audit — unused exports, doc gaps, API risks. Writes docs/generated/PLATFORM_AUDIT.json
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { allStableExportPaths } from './api-surface.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const findings = [];

function add(severity, category, message, path) {
  findings.push({ severity, category, message, path });
}

// Export coverage
const exportKeys = Object.keys(pkg.exports);
const stable = allStableExportPaths();
for (const path of stable) {
  if (!exportKeys.includes(path)) add('error', 'exports', 'Missing stable export', path);
}
for (const path of exportKeys) {
  if (!stable.includes(path) && !path.startsWith('./generated/')) {
    add('info', 'exports', 'Export not in api-surface stable list (review)', path);
  }
}

// Required docs for v1.0
const requiredDocs = [
  'docs/platform/API_REFERENCE.md',
  'docs/platform/APPLICATION_DEVELOPMENT_GUIDE.md',
  'docs/platform/RELEASE_GUIDE.md',
  'docs/platform/GOVERNANCE.md',
  'docs/platform/PLATFORM_AUDIT_REPORT.md',
  'examples/README.md',
  'generated/api-surface.json',
];
for (const rel of requiredDocs) {
  if (!existsSync(join(ROOT, rel))) add('error', 'documentation', 'Missing v1.0 deliverable', rel);
}

// Examples
const examplesDir = join(ROOT, 'examples');
if (existsSync(examplesDir)) {
  const examples = readdirSync(examplesDir).filter((d) => !d.startsWith('.'));
  if (examples.filter((d) => d !== 'README.md').length < 7) {
    add('warning', 'examples', 'Fewer than 7 reference examples', 'examples/');
  }
}

// Duplicate escapeHtml (known debt)
let escapeHtmlCount = 0;
for (const rel of walk(join(ROOT, 'src'))) {
  if (rel.endsWith('.ts') && readFileSync(rel, 'utf8').includes('function escapeHtml')) escapeHtmlCount++;
}
if (escapeHtmlCount > 3) {
  add('info', 'technical-debt', `${escapeHtmlCount} local escapeHtml copies — consolidate in v1.1`, 'src/');
}

// Phantom patterns export
const patterns = readFileSync(join(ROOT, 'src/ai/patterns.ts'), 'utf8');
if (patterns.includes("'plantasonic-design-system/patterns'")) {
  add('warning', 'api-risk', 'Metadata references non-exported ./patterns path', 'src/ai/patterns.ts');
}

// Test count
const tests = readdirSync(join(ROOT, 'tests')).filter((f) => f.endsWith('.test.mjs'));
if (tests.length < 18) add('warning', 'testing', `Only ${tests.length} test files`, 'tests/');

const report = {
  generatedAt: new Date().toISOString(),
  version: pkg.version,
  status: findings.some((f) => f.severity === 'error') ? 'needs-work' : '1.0-ready',
  summary: {
    exports: exportKeys.length,
    stableExports: stable.length,
    testFiles: tests.length,
    findings: findings.length,
    errors: findings.filter((f) => f.severity === 'error').length,
    warnings: findings.filter((f) => f.severity === 'warning').length,
  },
  findings,
};

writeFileSync(join(ROOT, 'docs/generated/PLATFORM_AUDIT.json'), JSON.stringify(report, null, 2) + '\n');
console.log(`✓ Platform audit: ${report.status} (${findings.length} findings, ${report.summary.errors} errors)`);
if (report.summary.errors > 0) process.exit(1);

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}
