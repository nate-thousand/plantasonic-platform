import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const HEX = /#[0-9a-fA-F]{3,8}\b/;

describe('creative-workspace — presets', () => {
  it('defines five workspace presets', async () => {
    const { WORKSPACE_PRESETS } = await import('../src/creative-workspace/types.ts');
    assert.deepEqual(WORKSPACE_PRESETS, [
      'instrument',
      'visualizer',
      'installation',
      'presentation',
      'studio',
    ]);
  });

  it('renderCreativeWorkspace dispatches by preset', async () => {
    const { renderCreativeWorkspace } = await import('../src/creative-workspace/layouts.ts');
    const instrument = renderCreativeWorkspace({ preset: 'instrument' });
    const visualizer = renderCreativeWorkspace({ preset: 'visualizer' });
    assert.match(instrument, /data-ps-creative-workspace="instrument"/);
    assert.match(visualizer, /data-ps-creative-workspace="visualizer"/);
  });
});

describe('creative-workspace — instrument layout', () => {
  it('stage is the dominant main landmark', async () => {
    const { renderInstrumentWorkspace } = await import('../src/creative-workspace/layouts.ts');
    const html = renderInstrumentWorkspace({ stage: '<canvas id="main"></canvas>' });
    assert.match(html, /ps-creative-workspace__stage/);
    assert.match(html, /data-ps-region="stage"/);
    assert.match(html, /role="main"/);
    assert.match(html, /<canvas id="main"><\/canvas>/);
  });

  it('composes floating transport, inspector, browser, HUD, and palette', async () => {
    const { renderInstrumentWorkspace } = await import('../src/creative-workspace/layouts.ts');
    const html = renderInstrumentWorkspace({
      transport: '<div class="ps-transport">T</div>',
      inspector: '<div class="ps-inspector">I</div>',
      presetBrowser: '<nav>presets</nav>',
      statusHud: '<span>FPS 60</span>',
      commandPalette: '<div data-cmd-palette></div>',
    });
    assert.match(html, /data-ps-cw-surface="transport"/);
    assert.match(html, /data-ps-cw-surface="inspector"/);
    assert.match(html, /data-ps-cw-surface="browser"/);
    assert.match(html, /data-ps-cw-surface="hud"/);
    assert.match(html, /data-ps-cw-surface="palette"/);
    assert.match(html, /ps-creative-workspace__overlays/);
    assert.doesNotMatch(html, HEX);
  });

  it('omits surfaces when set to false', async () => {
    const { renderInstrumentWorkspace } = await import('../src/creative-workspace/layouts.ts');
    const html = renderInstrumentWorkspace({
      transport: false,
      inspector: false,
      presetBrowser: false,
      statusHud: false,
      commandPalette: false,
    });
    assert.doesNotMatch(html, /data-ps-cw-overlays/);
  });
});

describe('creative-workspace — other presets', () => {
  it('visualizer defaults to performance mode', async () => {
    const { renderVisualizerWorkspace } = await import('../src/creative-workspace/layouts.ts');
    const html = renderVisualizerWorkspace({ statusHud: 'ok' });
    assert.match(html, /ps-creative-workspace--performance/);
    assert.match(html, /data-ps-creative-workspace="visualizer"/);
  });

  it('installation includes optional brand', async () => {
    const { renderInstallationWorkspace } = await import('../src/creative-workspace/layouts.ts');
    const html = renderInstallationWorkspace({ brand: '<em>Gallery</em>' });
    assert.match(html, /ps-presenter-brand/);
    assert.match(html, /<em>Gallery<\/em>/);
  });

  it('presentation hides inspector by default in preset', async () => {
    const { renderPresentationWorkspace } = await import('../src/creative-workspace/layouts.ts');
    const html = renderPresentationWorkspace({ transport: 'go' });
    assert.match(html, /data-ps-creative-workspace="presentation"/);
    assert.match(html, /data-ps-cw-surface="transport"/);
  });

  it('studio includes browser and inspector', async () => {
    const { renderStudioWorkspace } = await import('../src/creative-workspace/layouts.ts');
    const html = renderStudioWorkspace({
      presetBrowser: 'lib',
      inspector: 'props',
      transport: 'tr',
    });
    assert.match(html, /data-ps-creative-workspace="studio"/);
    assert.match(html, /data-ps-cw-surface="browser"/);
    assert.match(html, /data-ps-cw-surface="inspector"/);
  });
});

describe('creative-workspace — surfaces', () => {
  it('floating transport anchors bottom-center', async () => {
    const { renderFloatingTransport } = await import('../src/creative-workspace/surfaces.ts');
    const html = renderFloatingTransport('<span>play</span>');
    assert.match(html, /ps-cw-surface--bottom-center/);
    assert.match(html, /data-ps-cw-surface="transport"/);
    assert.match(html, /ps-floating-panel/);
  });

  it('status HUD is non-interactive', async () => {
    const { renderStatusHud } = await import('../src/creative-workspace/surfaces.ts');
    const html = renderStatusHud('CPU 12%');
    assert.match(html, /role="status"/);
    assert.match(html, /ps-cw-hud/);
  });
});

describe('creative-workspace — bind', () => {
  it('bindCreativeWorkspace is a safe no-op without DOM', async () => {
    const { bindCreativeWorkspace } = await import('../src/creative-workspace/bind.ts');
    const cleanup = bindCreativeWorkspace(null);
    assert.equal(typeof cleanup, 'function');
    cleanup();
  });
});

describe('creative-workspace — public index', () => {
  it('exports layout and surface renderers', async () => {
    const mod = await import('../src/creative-workspace/index.ts');
    assert.equal(typeof mod.renderCreativeWorkspace, 'function');
    assert.equal(typeof mod.renderInstrumentWorkspace, 'function');
    assert.equal(typeof mod.renderFloatingInspector, 'function');
    assert.equal(typeof mod.bindCreativeWorkspace, 'function');
    assert.ok(mod.WORKSPACE_PRESETS.length === 5);
  });
});
