import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;

describe('AI layer — package wiring', () => {
  it('exports ./ai from package.json', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    assert.ok(pkg.exports['./ai']);
    assert.equal(pkg.exports['./ai'].default, './src/ai/index.ts');
  });

  it('exposes generated AI context files in package exports', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    for (const f of ['index', 'components', 'tokens', 'registry', 'knowledge-graph', 'architecture']) {
      assert.ok(pkg.exports[`./generated/ai/${f}.json`], `missing export ${f}.json`);
    }
  });
});

describe('AI layer — registry', () => {
  it('registers every component, primitive, layout, pattern, token, and theme', async () => {
    const { registry } = await import('../src/ai/index.ts');
    const s = registry.summary();
    assert.equal(s.component, 12);
    assert.equal(s.primitive, 17);
    assert.ok(s.layout >= 9);
    assert.ok(s.pattern >= 12);
    assert.ok(s.token >= 100);
    assert.equal(s.theme, 2);
  });

  it('every record has the required metadata fields', async () => {
    const { registry } = await import('../src/ai/index.ts');
    for (const r of registry.all()) {
      assert.ok(r.id && r.name && r.kind && r.version, `incomplete record ${JSON.stringify(r.id)}`);
      assert.ok(r.purpose && r.category && r.status, `missing core metadata on ${r.id}`);
    }
  });

  it('query filters by kind, status, and text', async () => {
    const { registry } = await import('../src/ai/index.ts');
    assert.ok(registry.query({ kind: 'pattern' }).length >= 12);
    assert.ok(registry.query({ text: 'button' }).some((r) => r.id === 'component.button'));
    assert.ok(registry.query({ status: 'stable' }).length > 0);
  });
});

describe('AI layer — knowledge graph & impact', () => {
  it('builds a graph with nodes and edges', async () => {
    const { getKnowledgeGraph } = await import('../src/ai/index.ts');
    const kg = getKnowledgeGraph();
    assert.equal(kg.nodes.length, 312);
    assert.ok(kg.edges.length > 0);
    for (const e of kg.edges) {
      assert.ok(kg.nodes.some((n) => n.id === e.from));
      assert.ok(kg.nodes.some((n) => n.id === e.to));
    }
  });

  it('impact analysis finds dependents of a component', async () => {
    const { getImpact } = await import('../src/ai/index.ts');
    const report = getImpact('component.button');
    assert.ok(report.directDependents.includes('component.iconButton'));
    assert.ok(report.transitiveDependents.length >= report.directDependents.length);
  });
});

describe('AI layer — SDK', () => {
  it('exposes the stable public surface', async () => {
    const ai = await import('../src/ai/index.ts');
    for (const fn of ['getComponents', 'getLayouts', 'getPatterns', 'getTokens', 'getThemes', 'validateApplication', 'generateDocumentation', 'getArchitecture']) {
      assert.equal(typeof ai[fn], 'function', `missing SDK fn ${fn}`);
    }
  });

  it('generateDocumentation derives catalogs from the registry', async () => {
    const { generateDocumentation } = await import('../src/ai/index.ts');
    const docs = generateDocumentation();
    assert.match(docs['COMPONENT_CATALOG.md'], /Button/);
    assert.match(docs['TOKEN_REFERENCE.md'], /--ds-color-primary/);
  });

  it('getToken resolves by id, css var, and path', async () => {
    const { getToken } = await import('../src/ai/index.ts');
    assert.ok(getToken('--ds-color-primary'));
    assert.ok(getToken('color.primary.default'));
    assert.ok(getToken('token.color.primary.default'));
  });
});

describe('AI layer — validation engine', () => {
  it('flags hardcoded hex colors as errors', async () => {
    const { validateApplication } = await import('../src/ai/index.ts');
    const report = validateApplication([{ path: 'a.css', content: '.x { color: #ff0066; }' }]);
    assert.equal(report.ok, false);
    assert.ok(report.violations.some((v) => v.rule === 'no-hardcoded-color'));
  });

  it('passes token-driven source', async () => {
    const { validateApplication } = await import('../src/ai/index.ts');
    const report = validateApplication([{ path: 'a.css', content: '.x { color: var(--ds-color-text-primary); }' }]);
    assert.equal(report.ok, true);
  });

  it('flags unknown design tokens', async () => {
    const { validateApplication } = await import('../src/ai/index.ts');
    const report = validateApplication([{ path: 'a.css', content: '.x { color: var(--ds-color-not-real); }' }]);
    assert.ok(report.violations.some((v) => v.rule === 'unknown-design-token'));
  });

  it('ignores layout-primitive internal vars', async () => {
    const { validateApplication } = await import('../src/ai/index.ts');
    const report = validateApplication([{ path: 'a.css', content: '.x { gap: var(--ds-l-gap); }' }]);
    assert.equal(report.violations.length, 0);
  });
});

describe('AI layer — generators', () => {
  it('generateComponent produces a token-driven component and metadata', async () => {
    const { generateComponent } = await import('../src/ai/index.ts');
    const files = generateComponent({ name: 'level-meter', variants: ['default', 'accent'] });
    const comp = files.find((f) => f.path.endsWith('level-meter.ts'));
    assert.ok(comp);
    assert.doesNotMatch(comp.content, /#[0-9a-fA-F]{3,8}\b/);
    assert.match(comp.content, /export function levelMeter/);
    assert.ok(files.some((f) => /defineComponent/.test(f.content)));
  });

  it('generateTheme produces W3C token override JSON', async () => {
    const { generateTheme } = await import('../src/ai/index.ts');
    const [file] = generateTheme({ name: 'sunset', overrides: { 'color.primary.default': '#ff8800' } });
    const json = JSON.parse(file.content);
    assert.equal(json.color.primary.default.$value, '#ff8800');
  });
});

describe('AI layer — plugin architecture', () => {
  it('applies plugin contributions to a host registry', async () => {
    const { createPluginHost, definePlugin } = await import('../src/ai/index.ts');
    const plugin = definePlugin({
      name: 'demo',
      version: '1.0.0',
      contributes: {
        components: [
          {
            id: 'component.demoWidget',
            name: 'Demo Widget',
            kind: 'component',
            export: 'demoWidget',
            version: '1.0.0',
            purpose: 'Demo.',
            category: 'controls',
            status: 'experimental',
          },
        ],
        commands: [{ id: 'demo.run', label: 'Run Demo' }],
      },
    });
    const host = createPluginHost().use(plugin);
    assert.ok(host.registry.has('component.demoWidget'));
    assert.equal(host.commands.length, 1);
  });

  it('enforces plugin dependencies', async () => {
    const { createPluginHost, definePlugin } = await import('../src/ai/index.ts');
    const plugin = definePlugin({ name: 'b', version: '1.0.0', dependsOn: ['a'], contributes: {} });
    assert.throws(() => createPluginHost().use(plugin), /requires "a"/);
  });
});

describe('AI layer — generated context export', () => {
  it('emits the AI context manifest and core files', () => {
    const dir = join(ROOT, 'generated/ai');
    for (const f of ['index.json', 'components.json', 'tokens.json', 'registry.json', 'knowledge-graph.json', 'architecture.json']) {
      assert.ok(existsSync(join(dir, f)), `missing generated/ai/${f}`);
    }
    const index = JSON.parse(readFileSync(join(dir, 'index.json'), 'utf8'));
    assert.equal(index.summary.total, 312);
  });
});
