import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, it } from 'node:test';

describe('Creative Ecosystem — engines', () => {
  it('catalogs 10 shared engines', async () => {
    const { getEngines, ENGINE_CATALOG } = await import('../src/platform/index.ts');
    assert.equal(getEngines().length, 10);
    assert.equal(ENGINE_CATALOG.length, 10);
  });

  it('installEngine resolves package metadata', async () => {
    const { installEngine } = await import('../src/platform/index.ts');
    const s = installEngine('engine.sound');
    assert.equal(s.package, 'plantasia-sound-engine');
  });

  it('resolveEngineInstall includes dependencies', async () => {
    const { resolveEngineInstall } = await import('../src/platform/index.ts');
    const specs = resolveEngineInstall(['engine.lighting']);
    assert.ok(specs.some((s) => s.id === 'engine.midi'));
  });
});

describe('Creative Ecosystem — assets & presets', () => {
  it('registerAsset and query', async () => {
    const { defineAsset, assetRegistry } = await import('../src/platform/index.ts');
    defineAsset('texture', 'Noise Tile', 'assets://noise.png', { tags: ['procedural'] });
    assert.ok(assetRegistry.query({ tag: 'procedural' }).length >= 1);
  });

  it('preset import/export', async () => {
    const { definePreset, exportPresets, importPresets, PresetRegistry } = await import('../src/platform/index.ts');
    const registry = new PresetRegistry();
    definePreset({ id: 'preset.test', name: 'Test', category: 'visual', data: { gain: 0.5 } });
    const json = exportPresets(['preset.test']);
    registry.register({ id: 'preset.test', name: 'Old', version: '0.0.1', category: 'x', tags: [], data: {} });
    registry.import(JSON.parse(json), { merge: true });
    assert.equal(registry.get('preset.test')?.version, '1.0.0');
  });
});

describe('Creative Ecosystem — workflows & services', () => {
  it('registers built-in workflows', async () => {
    const { getWorkflows, WORKFLOW_CATALOG } = await import('../src/platform/index.ts');
    assert.equal(getWorkflows().length, WORKFLOW_CATALOG.length);
    assert.ok(getWorkflows().some((w) => w.id === 'workflow.import-assets'));
  });

  it('createPlatformServices exposes enabled services', async () => {
    const { createPlatformServices } = await import('../src/platform/index.ts');
    const s = createPlatformServices(['logging', 'settings']);
    assert.ok(s.logging);
    assert.ok(s.settings);
  });
});

describe('Creative Ecosystem — createProject', () => {
  it('generates prototype + platform files', async () => {
    const { createProject } = await import('../src/platform/index.ts');
    const result = createProject({ type: 'generative-art', name: 'Flower Study' });
    assert.ok(result.manifest.engines.includes('engine.visual'));
    const paths = new Set(result.files.map((f) => f.path));
    assert.ok(paths.has('platform.json'));
    assert.ok(paths.has('docs/PLATFORM.md'));
    assert.ok(paths.has('docs/AI_CONTEXT.json'));
    assert.ok(paths.has('src/platform/services.ts'));
  });

  it('validateProjectFiles passes', async () => {
    const { createProject, validateProjectFiles } = await import('../src/platform/index.ts');
    const result = createProject({ type: 'music-instrument', name: 'Pad Lab' });
    const report = validateProjectFiles(result.files, result.manifest);
    assert.equal(report.ok, true, report.checks.filter((c) => !c.ok).map((c) => c.label).join(', '));
  });

  it('scaffoldProject writes to disk', async () => {
    const { scaffoldProject } = await import('../src/platform/index.ts');
    const { validatePrototypeStructure } = await import('../src/prototype/index.ts');
    const tmp = mkdtempSync(join(tmpdir(), 'ps-eco-'));
    const dir = join(tmp, 'bloom-room');
    try {
      scaffoldProject(
        { type: 'audio-reactive-installation', name: 'Bloom Room', sound: true, midi: true },
        dir,
      );
      assert.ok(existsSync(join(dir, 'platform.json')));
      const report = validatePrototypeStructure(dir);
      assert.equal(report.ok, true);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });
});

describe('Creative Ecosystem — project registry', () => {
  it('tracks projects and engine usage', async () => {
    const { ProjectRegistry } = await import('../src/platform/index.ts');
    const registry = new ProjectRegistry();
    const base = {
      version: '0.1.0',
      plugins: [],
      assets: [],
      workflows: [],
      services: [],
      dependencies: {},
      documentation: [],
      deployment: { target: 'local', status: 'local' },
      createdAt: '',
      updatedAt: '',
    };
    registry.register({ ...base, id: 'eco-a', name: 'A', type: 'generative-art', engines: ['engine.visual'] });
    registry.register({
      ...base,
      id: 'eco-b',
      name: 'B',
      type: 'music-instrument',
      engines: ['engine.sound', 'engine.visual'],
    });
    const usage = registry.engineUsage();
    assert.deepEqual(usage.get('engine.visual')?.sort(), ['eco-a', 'eco-b']);
  });
});

describe('Creative Ecosystem — plugins & AI context', () => {
  it('ecosystem plugin host extends AI host', async () => {
    const { createEcosystemPluginHost, defineEcosystemPlugin } = await import('../src/platform/index.ts');
    const host = createEcosystemPluginHost().useEcosystem(
      defineEcosystemPlugin({
        name: 'demo-fx',
        version: '1.0.0',
        contributes: {
          effects: [{ id: 'fx.glow', name: 'Glow', category: 'post' }],
          workflows: [{ id: 'workflow.custom', name: 'Custom', purpose: 'Demo', invoke: 'demo.run' }],
        },
      }),
    );
    assert.equal(host.effects.length, 1);
    assert.equal(host.workflows.length, 9); // 8 built-in + 1 plugin
  });

  it('buildEcosystemContext includes architecture', async () => {
    const { buildEcosystemContext } = await import('../src/platform/index.ts');
    const ctx = buildEcosystemContext();
    assert.ok(ctx.designSystem);
    assert.ok(ctx.engines);
  });
});

describe('Creative Ecosystem — package export', () => {
  it('exports ./platform', async () => {
    const { readFileSync } = await import('node:fs');
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url).pathname, 'utf8'));
    assert.ok(pkg.exports['./platform']);
  });
});
