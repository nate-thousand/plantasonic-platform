import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, it } from 'node:test';

describe('Prototype Platform — catalog', () => {
  it('defines 12 official prototype types', async () => {
    const { PROTOTYPE_TYPE_IDS, PROTOTYPE_TYPES } = await import('../src/prototype/index.ts');
    assert.equal(PROTOTYPE_TYPE_IDS.length, 12);
    assert.equal(PROTOTYPE_TYPES.length, 12);
  });

  it('isPrototypeType detects valid ids', async () => {
    const { isPrototypeType } = await import('../src/prototype/index.ts');
    assert.equal(isPrototypeType('generative-art'), true);
    assert.equal(isPrototypeType('react-vite'), false);
  });
});

describe('Prototype Platform — spec parser', () => {
  it('infers audio-reactive type from brief', async () => {
    const { planFromBrief } = await import('../src/prototype/index.ts');
    const plan = planFromBrief(
      'Create an audio reactive flower installation with ambient sound and fullscreen visuals',
      'Bloom Room',
    );
    assert.equal(plan.type, 'audio-reactive-installation');
    assert.equal(plan.features.sound, true);
    assert.ok(plan.panels.some((p) => p.id === 'assets'));
  });

  it('infers generative-art from brief', async () => {
    const { parseBrief } = await import('../src/prototype/index.ts');
    const partial = parseBrief('A generative art study with parameter controls');
    assert.equal(partial.type, 'generative-art');
  });
});

describe('Prototype Platform — createPrototype SDK', () => {
  it('generates a complete file set for generative-art', async () => {
    const { createPrototype } = await import('../src/prototype/index.ts');
    const { plan, files } = createPrototype({ type: 'generative-art', name: 'Flower Study' });
    assert.equal(plan.slug, 'flower-study');
    assert.equal(plan.shellVariant, 'instrument');
    const paths = new Set(files.map((f) => f.path));
    assert.ok(paths.has('package.json'));
    assert.ok(paths.has('src/main.ts'));
    assert.ok(paths.has('src/prototype-config.ts'));
    assert.ok(paths.has('src/styles/main.scss'));
    assert.ok(paths.has('src/engines/visual.ts'));
    assert.ok(paths.has('README.md'));
    assert.ok(paths.has('ROADMAP.md'));
    assert.ok(paths.has('CHANGELOG.md'));
    assert.ok(paths.has('vercel.json'));
    assert.ok(paths.has('scripts/validate.mjs'));
  });

  it('generates standard shell for ai-assistant', async () => {
    const { createPrototype } = await import('../src/prototype/index.ts');
    const { plan, files } = createPrototype({ type: 'ai-assistant', name: 'Helper' });
    assert.equal(plan.shellVariant, 'standard');
    const main = files.find((f) => f.path === 'src/main.ts')?.content ?? '';
    assert.match(main, /renderApplicationShell/);
    const scss = files.find((f) => f.path === 'src/styles/main.scss')?.content ?? '';
    assert.match(scss, /application-shell/);
  });

  it('validateGeneratedFiles passes for every type', async () => {
    const { createPrototype, validateGeneratedFiles, PROTOTYPE_TYPE_IDS } = await import('../src/prototype/index.ts');
    for (const type of PROTOTYPE_TYPE_IDS) {
      const { files } = createPrototype({ type, name: `Test ${type}` });
      const report = validateGeneratedFiles(files);
      assert.equal(report.ok, true, `${type}: ${report.checks.filter((c) => !c.ok).map((c) => c.label).join(', ')}`);
    }
  });
});

describe('Prototype Platform — write to disk', () => {
  it('scaffoldPrototype writes a valid directory', async () => {
    const { scaffoldPrototype, validatePrototypeStructure } = await import('../src/prototype/index.ts');
    const tmp = mkdtempSync(join(tmpdir(), 'ps-proto-'));
    const target = join(tmp, 'signal-grid');
    try {
      scaffoldPrototype({ type: 'visual-synth', name: 'Signal Grid' }, target);
      assert.ok(existsSync(join(target, 'src/main.ts')));
      const report = validatePrototypeStructure(target);
      assert.equal(report.ok, true);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });
});

describe('Prototype Platform — package export', () => {
  it('exports ./prototype from package.json', async () => {
    const { readFileSync } = await import('node:fs');
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url).pathname, 'utf8'));
    assert.ok(pkg.exports['./prototype']);
  });
});
