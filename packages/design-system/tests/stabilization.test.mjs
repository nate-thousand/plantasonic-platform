import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

describe('v1.0 stabilization — API surface', () => {
  it('api-surface.json lists stable exports', async () => {
    const surface = JSON.parse(readFileSync(new URL('../generated/api-surface.json', import.meta.url).pathname, 'utf8'));
    assert.equal(surface.status, '1.0-ready');
    assert.ok(surface.public.length >= 20);
    assert.ok(surface.sdk.length === 4);
  });

  it('package.json exports match stable surface', async () => {
    const { allStableExportPaths } = await import('../scripts/api-surface.mjs');
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url).pathname, 'utf8'));
    for (const path of allStableExportPaths()) {
      assert.ok(pkg.exports[path], `missing export: ${path}`);
    }
  });

  it('shell export is public and stable', async () => {
    const surface = JSON.parse(readFileSync(new URL('../generated/api-surface.json', import.meta.url).pathname, 'utf8'));
    assert.ok(surface.public.some((e) => e.path === './shell'));
  });
});

describe('v1.0 stabilization — governance docs', () => {
  const root = new URL('..', import.meta.url).pathname;
  const required = [
    'docs/platform/API_REFERENCE.md',
    'docs/platform/APPLICATION_DEVELOPMENT_GUIDE.md',
    'docs/platform/RELEASE_GUIDE.md',
    'docs/platform/GOVERNANCE.md',
    'docs/platform/PLATFORM_AUDIT_REPORT.md',
    'examples/README.md',
  ];

  for (const rel of required) {
    it(`has ${rel}`, () => {
      assert.ok(existsSync(join(root, rel)), rel);
    });
  }
});

describe('v1.0 stabilization — platform deployment', () => {
  it('generateVercelConfig produces valid JSON', async () => {
    const { generateVercelConfig } = await import('../src/platform/deployment.ts');
    const config = JSON.parse(generateVercelConfig());
    assert.equal(config.framework, 'vite');
    assert.ok(config.buildCommand);
  });

  it('validateManifest passes for example spec', async () => {
    const { validateManifest } = await import('../src/platform/quality.ts');
    const { createProjectFromConcept } = await import('../src/studio/orchestrator.ts');
    const { manifest } = createProjectFromConcept({ name: 'Test', category: 'generative-art' });
    const report = validateManifest(manifest);
    assert.equal(report.ok, true);
  });
});

describe('v1.0 stabilization — studio validation', () => {
  it('validateSpecification and getStudioArchitecture', async () => {
    const { validateSpecification, getStudioArchitecture, generateSpecification } = await import('../src/studio/index.ts');
    const spec = generateSpecification({ name: 'Audit', category: 'generative-art' });
    assert.equal(validateSpecification(spec).ok, true);
    assert.ok(getStudioArchitecture().pipeline.length === 10);
  });
});

describe('v1.0 stabilization — version', () => {
  it('package version remains on the v1.0 line', () => {
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url).pathname, 'utf8'));
    assert.match(pkg.version, /^1\.0\.\d+$/);
  });
});
