#!/usr/bin/env node
/**
 * Testing + performance reports for v1.0 stabilization.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

const testFiles = readdirSync(join(ROOT, 'tests')).filter((f) => f.endsWith('.test.mjs'));
const testSuites = {
  tokens: ['tokens.test.mjs', 'theme.test.mjs'],
  accessibility: ['accessibility.test.mjs'],
  bootstrap: ['bootstrap-coverage.test.mjs'],
  platform: ['primitives.test.mjs', 'components.test.mjs', 'motion.test.mjs', 'shell.test.mjs'],
  creative: ['instrument.test.mjs', 'instrument-shell.test.mjs', 'input.test.mjs', 'app-sdk.test.mjs'],
  ai: ['ai.test.mjs'],
  prototype: ['prototype.test.mjs'],
  ecosystem: ['platform.test.mjs'],
  studio: ['studio.test.mjs'],
  stabilization: ['stabilization.test.mjs', 'examples.test.mjs'],
  cli: ['cli.test.mjs', 'template-shell.test.mjs'],
  build: ['showcase-build.test.mjs'],
};

const testingReport = {
  generatedAt: new Date().toISOString(),
  version: pkg.version,
  totalTestFiles: testFiles.length,
  coverage: Object.fromEntries(
    Object.entries(testSuites).map(([area, files]) => [
      area,
      { files: files.filter((f) => testFiles.includes(f)), complete: files.every((f) => testFiles.includes(f)) },
    ]),
  ),
  gates: [
    'npm run test',
    'npm run validate:prototypes',
    'npm run validate:examples',
    'npm run validate:templates',
    'npm run quality',
    'npm run build',
  ],
  gaps: [
    'CLI execution integration (create/spec end-to-end)',
    'Visual regression (manual via showcase)',
    'App SDK DOM mount integration',
  ],
};

writeFileSync(join(ROOT, 'docs/generated/TESTING_REPORT.md'), formatTesting(testingReport), 'utf8');

// Performance benchmarks (local, approximate)
const perf = {};
const bench = async (label, fn) => {
  const t0 = performance.now();
  await fn();
  perf[label] = Math.round(performance.now() - t0);
};

await bench('token-validate', async () => {
  const { spawnSync } = await import('node:child_process');
  spawnSync('node', ['scripts/validate-tokens.mjs'], { cwd: ROOT, stdio: 'pipe' });
});

const cssSize = statSync(join(ROOT, 'css/variables.css')).size;
const showcaseDist = join(ROOT, 'showcase/dist');
let showcaseBundleKb = null;
if (existsSync(showcaseDist)) {
  const assets = readdirSync(join(showcaseDist, 'assets'), { withFileTypes: true }).filter((d) => d.isFile());
  showcaseBundleKb = Math.round(assets.reduce((s, f) => s + statSync(join(showcaseDist, 'assets', f.name)).size, 0) / 1024);
}

const performanceReport = {
  generatedAt: new Date().toISOString(),
  version: pkg.version,
  benchmarksMs: perf,
  artifacts: {
    cssVariablesBytes: cssSize,
    showcaseBundleKb,
    exportCount: Object.keys(pkg.exports).length,
  },
  notes: [
    'Token validation target: < 500ms',
    'Full generate-all target: < 15s on CI',
    'Showcase bundle monitored via showcase-build.test.mjs',
  ],
};

writeFileSync(join(ROOT, 'docs/generated/PERFORMANCE_REPORT.md'), formatPerf(performanceReport), 'utf8');
console.log('✓ docs/generated/TESTING_REPORT.md');
console.log('✓ docs/generated/PERFORMANCE_REPORT.md');

function formatTesting(r) {
  return `# Testing Report

Generated: ${r.generatedAt} · Version: ${r.version}

## Summary

- **Test files:** ${r.totalTestFiles}
- **Quality gates:** ${r.gates.map((g) => `\`${g}\``).join(', ')}

## Coverage by area

| Area | Files | Complete |
| --- | --- | --- |
${Object.entries(r.coverage)
  .map(([k, v]) => `| ${k} | ${v.files.join(', ') || '—'} | ${v.complete ? '✓' : 'partial'} |`)
  .join('\n')}

## Known gaps

${r.gaps.map((g) => `- ${g}`).join('\n')}
`;
}

function formatPerf(r) {
  return `# Performance Report

Generated: ${r.generatedAt} · Version: ${r.version}

## Benchmarks (local)

| Operation | ms |
| --- | --- |
${Object.entries(r.benchmarksMs)
  .map(([k, v]) => `| ${k} | ${v} |`)
  .join('\n')}

## Artifacts

- CSS variables: ${r.artifacts.cssVariablesBytes} bytes
- Package exports: ${r.artifacts.exportCount}
- Showcase bundle: ${r.artifacts.showcaseBundleKb ?? 'run showcase:build first'} KB

## Notes

${r.notes.map((n) => `- ${n}`).join('\n')}
`;
}
