import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const HEX = /#[0-9a-fA-F]{3,8}\b/;

function fakeClassListEl() {
  const classes = new Set();
  const attrs = {};
  return {
    classes,
    attrs,
    classList: {
      toggle(c, on) {
        const next = on === undefined ? !classes.has(c) : on;
        if (next) classes.add(c);
        else classes.delete(c);
        return next;
      },
      add: (c) => classes.add(c),
      contains: (c) => classes.has(c),
    },
    setAttribute(k, v) {
      attrs[k] = v;
    },
    getAttribute(k) {
      return attrs[k] ?? null;
    },
  };
}

describe('instrument — regions', () => {
  it('defines 15 standardized regions', async () => {
    const { REGION_NAMES } = await import('../src/instrument/regions.ts');
    assert.equal(REGION_NAMES.length, 15);
  });

  it('stage is a labelled main landmark', async () => {
    const { renderStage } = await import('../src/instrument/regions.ts');
    const html = renderStage('<canvas></canvas>');
    assert.match(html, /data-ps-region="stage"/);
    assert.match(html, /role="main"/);
    assert.match(html, /aria-label="Stage"/);
  });

  it('inspector region reuses .ps-inspector and is complementary', async () => {
    const { renderInspectorRegion } = await import('../src/instrument/regions.ts');
    const html = renderInspectorRegion('x');
    assert.match(html, /ps-inspector/);
    assert.match(html, /role="complementary"/);
  });
});

describe('instrument — transport', () => {
  it('renders a transport toolbar reusing .ps-transport surfaces', async () => {
    const { renderTransport, DEFAULT_TRANSPORT_STATE } = await import('../src/instrument/transport.ts');
    assert.equal(DEFAULT_TRANSPORT_STATE.tempo, 120);
    const html = renderTransport({ state: { tempo: 128 } });
    assert.match(html, /class="ps-transport"/);
    assert.match(html, /role="toolbar"/);
    assert.match(html, /data-ps-transport="play"/);
    assert.match(html, /data-ps-transport="record"/);
    assert.match(html, /ps-tempo-display/);
    assert.match(html, />128</);
    assert.doesNotMatch(html, HEX);
  });

  it('bindTransport is a safe no-op without a DOM root', async () => {
    const { bindTransport } = await import('../src/instrument/transport.ts');
    const cleanup = bindTransport(null);
    assert.equal(typeof cleanup, 'function');
    cleanup();
  });
});

describe('instrument — canvas adapters', () => {
  it('built-in adapters report their renderer type', async () => {
    const { canvas2dAdapter, htmlAdapter, imageAdapter, videoAdapter } = await import('../src/instrument/canvas.ts');
    assert.equal(canvas2dAdapter(() => {}).type, 'canvas2d');
    assert.equal(htmlAdapter('<p>x</p>').type, 'html');
    assert.equal(imageAdapter('a.png').type, 'image');
    assert.equal(videoAdapter('a.mp4').type, 'video');
  });
});

describe('instrument — status / metrics', () => {
  it('renders a status bar with live-update hooks', async () => {
    const { createMetrics, METRIC_PRESETS } = await import('../src/instrument/status.ts');
    const metrics = createMetrics([METRIC_PRESETS.fps(() => 60), METRIC_PRESETS.cpu(() => 42)]);
    const bar = metrics.renderStatusBar();
    assert.match(bar, /ps-status-bar/);
    assert.match(bar, /data-ps-metric-value="fps"/);
    assert.match(bar, /data-ps-metric-value="cpu"/);
    assert.doesNotMatch(bar, HEX);
    assert.equal(metrics.snapshot().fps, '60');
  });

  it('renders a HUD with meters reusing .ps-performance-overlay / .ps-meter', async () => {
    const { createMetrics, METRIC_PRESETS } = await import('../src/instrument/status.ts');
    const metrics = createMetrics([METRIC_PRESETS.cpu(() => 50)]);
    const hud = metrics.renderHud();
    assert.match(hud, /ps-performance-overlay/);
    assert.match(hud, /ps-meter/);
  });

  it('startMetricsLoop is a safe no-op without rAF/DOM', async () => {
    const { createMetrics, startMetricsLoop } = await import('../src/instrument/status.ts');
    const stop = startMetricsLoop(null, createMetrics());
    assert.equal(typeof stop, 'function');
    stop();
  });
});

describe('instrument — inspector registry', () => {
  it('composes registered panels into .ps-inspector and escapes titles', async () => {
    const { createInspector } = await import('../src/instrument/inspector.ts');
    const inspector = createInspector();
    inspector.registerPanel({ id: 'props', title: '<Props>', render: () => '<p>body</p>' });
    const html = inspector.render();
    assert.match(html, /ps-inspector/);
    assert.match(html, /&lt;Props&gt;/);
    assert.match(html, /data-ps-inspector-panel="props"/);
    assert.equal(inspector.getPanels().length, 1);
  });
});

describe('instrument — display modes', () => {
  it('exposes four modes and toggles the matching class', async () => {
    const { SHELL_MODES, setShellMode, getShellMode } = await import('../src/instrument/modes.ts');
    assert.deepEqual(SHELL_MODES, ['edit', 'performance', 'presentation', 'touch']);
    const el = fakeClassListEl();
    setShellMode(el, 'performance');
    assert.ok(el.classList.contains('ps-instrument--performance'));
    assert.equal(el.getAttribute('data-ps-mode'), 'performance');
    assert.equal(getShellMode('no-such-shell'), 'edit');
  });
});

describe('instrument — floating', () => {
  it('bindFloating is a safe no-op without a DOM root', async () => {
    const { bindFloating } = await import('../src/instrument/floating.ts');
    const cleanup = bindFloating(null);
    assert.equal(typeof cleanup, 'function');
    cleanup();
  });
});
