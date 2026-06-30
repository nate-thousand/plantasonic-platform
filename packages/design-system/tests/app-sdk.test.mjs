import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

describe('application SDK — createApplication', () => {
  it('returns a chainable controller with the documented surface', async () => {
    const { createApplication } = await import('../src/app/index.ts');
    const app = createApplication({ title: 'Test Instrument' });
    for (const method of [
      'registerWorkspace',
      'registerPanels',
      'registerInspector',
      'registerTransport',
      'registerStatus',
      'registerCommands',
      'registerInput',
      'setMode',
      'buildInstrument',
      'getConfig',
      'mount',
      'unmount',
    ]) {
      assert.equal(typeof app[method], 'function', `missing ${method}`);
    }
    // register* are chainable
    const same = app.registerWorkspace({ id: 'main', render: () => '<div id="stage"></div>' });
    assert.equal(same, app);
  });

  it('composes registered pieces into an instrument config', async () => {
    const { createApplication } = await import('../src/app/index.ts');
    const app = createApplication({ title: 'Composer' });
    app
      .registerWorkspace({ id: 'main', render: () => '<div id="stage"></div>' })
      .registerTransport({ state: { tempo: 100 } }, { play: () => {} })
      .registerInspector({ id: 'props', title: 'Properties', render: () => '<p>p</p>' });

    const inst = app.buildInstrument();
    assert.match(inst.stage, /id="stage"/);
    assert.match(inst.transport, /ps-transport/);
    assert.match(inst.aside, /ps-inspector/);
    assert.equal(inst.mode, 'edit');
  });

  it('defaults to the instrument variant and carries commands + mode', async () => {
    const { createApplication } = await import('../src/app/index.ts');
    const app = createApplication({ title: 'Variant', mode: 'performance' });
    app.registerCommands([{ id: 'play', label: 'Play', group: 'Transport' }]);
    const cfg = app.getConfig();
    assert.equal(cfg.variant, 'instrument');
    assert.equal(cfg.mode, 'performance');
    assert.ok(cfg.commands.some((c) => c.id === 'play'));
    assert.ok(cfg.instrument);
  });

  it('exposes input, inspector, and metrics registries', async () => {
    const { createApplication } = await import('../src/app/index.ts');
    const app = createApplication();
    assert.equal(typeof app.input.on, 'function');
    assert.equal(typeof app.inspector.registerPanel, 'function');
    assert.equal(typeof app.metrics.registerMetric, 'function');
  });

  it('mount is async and unmount is safe before mounting', async () => {
    const { createApplication } = await import('../src/app/index.ts');
    const app = createApplication();
    assert.equal(app.mount.constructor.name, 'AsyncFunction');
    assert.doesNotThrow(() => app.unmount());
  });
});
