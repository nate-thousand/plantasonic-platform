import {
  REGION_NAMES,
  renderInstrumentShell,
  renderTransport,
  renderStatusBar,
  createMetrics,
  METRIC_PRESETS,
  createInspector,
  SHELL_MODES,
} from '@ds/instrument';
import { demoCard, docBlock, sectionHeader } from '../lib/ui';

const PREVIEW_STYLE =
  'position:relative; height:22rem; border:1px solid var(--ds-color-border-subtle); border-radius: var(--ds-radius-default); overflow:hidden; background: var(--ds-color-surface-app)';

function sampleStatus(): string {
  const metrics = createMetrics([
    METRIC_PRESETS.fps(() => 60),
    METRIC_PRESETS.cpu(() => 38),
    METRIC_PRESETS.audio(() => 'OK'),
    METRIC_PRESETS.latency(() => 6),
  ]);
  return metrics.renderStatusBar();
}

function sampleInspector(): string {
  const inspector = createInspector();
  inspector
    .registerPanel({ id: 'props', title: 'Properties', group: 'Inspect', render: () => '<p class="small text-muted mb-0">Bloom · Density · Chaos</p>' })
    .registerPanel({ id: 'perf', title: 'Performance', group: 'Inspect', collapsed: true, render: () => '<p class="small text-muted mb-0">FPS 60 · CPU 38%</p>' });
  return inspector.render();
}

function instrumentPreview(mode: 'edit' | 'performance' | 'presentation' | 'touch'): string {
  return `<div style="${PREVIEW_STYLE}">${renderInstrumentShell({
    title: 'Demo Instrument',
    mode,
    instrument: {
      stage: '<div style="position:absolute; inset:0; display:grid; place-items:center; color: var(--ds-color-text-secondary); font-family: var(--ds-font-family-mono)">◉ stage / canvas</div>',
      transport: renderTransport({ state: { tempo: 120, time: '1.1.0' } }),
      status: sampleStatus(),
      rail: '<div class="ps-dock ps-app-dock ps-app-dock--left" style="position:static">⚒</div>',
      aside: sampleInspector(),
      brand: '<strong>Plantasonic</strong>',
    },
  })}</div>`;
}

export function renderInstrumentShellSection(): string {
  return `
    ${sectionHeader('Instrument Shell', 'A canvas-first, edge-to-edge shell variant for immersive creative software. renderApplicationShell({ variant: "instrument" }).')}
    ${docBlock({
      purpose: 'Make applications feel like creative instruments — minimal chrome, floating controls, performance-first — reusable by any creative app.',
      usage: "renderApplicationShell({ variant: 'instrument', instrument: { stage, transport, status, aside } })",
      bestPractices: [
        'Compose the standardized regions instead of inventing layouts',
        'Provide behavior; let the Design System provide the UI',
      ],
      dos: ['Use createApplication() to wire shell + transport + status + input', 'Drive everything from tokens'],
      donts: ['Build a bespoke shell per app', 'Hardcode chrome sizing'],
      implementationNotes: ['Standard renderApplicationShell() (no variant) is unchanged and fully backward compatible'],
    })}
    ${demoCard('Instrument shell preview (edit mode)', instrumentPreview('edit'), ['--ps-instrument-gutter', '--ds-color-surface-stage'])}`;
}

export function renderCreativeRegions(): string {
  const list = REGION_NAMES.map((r) => `<span class="ds-c-badge" style="margin:0.15rem">${r}</span>`).join('');
  return `
    ${sectionHeader('Workspace Regions', 'Standardized regions every creative application composes: stage, transport, inspector, HUD, status, dock, palette, browser, timeline, and more.')}
    ${demoCard(`${REGION_NAMES.length} standardized regions`, `<div class="ds-l-inline" style="flex-wrap:wrap">${list}</div>`, [])}`;
}

export function renderCreativeTransport(): string {
  return `
    ${sectionHeader('Transport', 'Reusable transport framework — Play/Pause/Stop/Record/Loop, tempo, time, clock, sync, and a performance toggle. The DS provides UI; the app provides behavior.')}
    ${docBlock({
      purpose: 'A consistent transport bar across every creative tool, wired to app behavior via bindTransport().',
      usage: "renderTransport({ state: { tempo: 120 } }); bindTransport(root, { play, stop, record })",
      bestPractices: ['Subscribe to ps-transport-* events', 'Keep behavior in the app, UI in the DS'],
      dos: ['Reuse .ps-transport surfaces'],
      donts: ['Re-implement transport controls per app'],
      implementationNotes: ['bindTransport dispatches ps-transport-play/stop/record/change CustomEvents'],
    })}
    ${demoCard('Transport bar', renderTransport({ state: { tempo: 124, time: '2.1.0', sync: 'MIDI' } }), ['--ps-touch-target'])}`;
}

export function renderCreativeCanvas(): string {
  const types = ['canvas2d', 'webgl', 'svg', 'html', 'three', 'pixi', 'ascii', 'video', 'image', 'mixed']
    .map((t) => `<span class="ds-c-badge" style="margin:0.15rem">${t}</span>`)
    .join('');
  return `
    ${sectionHeader('Canvas System', 'Swap renderers without changing layout. mountCanvas(stage, adapter) owns the create → resize → visibility → destroy lifecycle and DPR.')}
    ${docBlock({
      purpose: 'Let applications swap WebGL / Canvas2D / SVG / Three / Pixi / ASCII / video renderers behind one mount contract.',
      usage: "mountCanvas(stageEl, canvas2dAdapter((g, ctx) => { /* draw */ }))",
      bestPractices: ['Implement a CanvasAdapter for custom renderers', 'Use the resize/visibility hooks'],
      dos: ['Reuse the .ps-canvas-mount slot'],
      donts: ['Couple renderer code to layout'],
      implementationNotes: ['Built-in adapters: Canvas2D, HTML, Image, Video; others via app-provided adapters'],
    })}
    ${demoCard('Supported renderer types', `<div class="ds-l-inline" style="flex-wrap:wrap">${types}</div>`, [])}`;
}

export function renderCreativeFloating(): string {
  return `
    ${sectionHeader('Floating UI', 'Floating panels with drag, edge-snap, collapse, pin, and remembered position. bindFloating(root, { persist: true }).')}
    ${demoCard(
      'Floating panel affordances',
      `<div style="position:relative; height:12rem; border:1px solid var(--ds-color-border-subtle); border-radius: var(--ds-radius-default)">
        <div class="ps-floating-panel" data-ps-floating-panel="demo" style="left:1rem; top:1rem; padding: var(--ds-space-3)">
          <div class="ps-floating-panel__handle" data-ps-floating-handle><strong>Mixer</strong>
            <span><button class="ds-c-btn ds-c-btn--ghost ds-c-btn--sm" data-ps-floating-pin aria-pressed="false">pin</button>
            <button class="ds-c-btn ds-c-btn--ghost ds-c-btn--sm" data-ps-floating-collapse>–</button></span>
          </div>
          <div class="ps-floating-panel__body"><p class="small text-muted mb-0">Drag the handle · snaps to edges · position remembered</p></div>
        </div>
      </div>`,
      ['--ps-floating-panel-min'],
    )}`;
}

export function renderCreativeModes(): string {
  const cards = (['performance', 'presentation', 'touch'] as const)
    .map((m) => demoCard(`${m} mode`, instrumentPreview(m), []))
    .join('');
  return `
    ${sectionHeader('Display Modes', `Four shell modes (${SHELL_MODES.join(', ')}). Performance hides chrome; presentation hides editing controls; touch enlarges hit targets.`)}
    ${docBlock({
      purpose: 'Distraction-free performance, demo-ready presentation, and tablet-friendly touch — all from one shell.',
      usage: "setShellMode(root, 'performance', { shellId, persist: true })",
      bestPractices: ['Persist the chosen mode', 'Keep transport reachable in touch mode'],
      dos: ['Use cycleShellMode for quick toggles'],
      donts: ['Duplicate mode logic per app'],
      implementationNotes: ['Modes toggle .ps-instrument--{mode}; reduced-motion respected'],
    })}
    ${cards}`;
}

export function renderCreativeIO(): string {
  return `
    ${sectionHeader('Input & Output Layers', 'Subscribe to normalized pointer/key/wheel/gesture events; register metrics the DS displays consistently (FPS/CPU/GPU/Audio/MIDI/Memory/Latency…).')}
    ${docBlock({
      purpose: 'Stop re-implementing device plumbing and status displays in every app.',
      usage: "const input = createInputManager(); input.attach(root); input.on('pointer', handler)",
      bestPractices: ['Add MIDI/gamepad/pen via InputAdapter', 'Register metrics; let startMetricsLoop update them'],
      dos: ['Use METRIC_PRESETS for consistent labels'],
      donts: ['Wire raw device events per app'],
      implementationNotes: ['Device backends (Web MIDI/Gamepad/pen pressure) attach as adapters on this same API'],
    })}
    ${demoCard('Status bar (registered metrics)', sampleStatus(), ['--ps-hud-opacity'])}`;
}

export function renderCreativeSDK(): string {
  return `
    ${sectionHeader('Application SDK', 'createApplication() lets a creative app initialize from configuration instead of custom wiring.')}
    ${docBlock({
      purpose: 'Applications provide business logic, domain models, content, and engine integrations — everything else comes from the Design System.',
      usage: "createApplication({ title }).registerWorkspace(...).registerTransport(...).registerStatus(...).mount(root)",
      bestPractices: ['Register workspaces/panels/transport/status/input, then mount()', 'Let mount() wire shell + behaviors'],
      dos: ['Compose from the framework'],
      donts: ['Implement your own shell infrastructure'],
      implementationNotes: ['mount() renders the instrument shell and binds transport, floating, inspector, metrics, and input'],
    })}
    ${demoCard(
      'createApplication() lifecycle',
      `<pre class="small mb-0" style="white-space:pre-wrap"><code>createApplication({ title: 'My Instrument' })
  .registerWorkspace({ id: 'main', render: () =&gt; renderCanvasMount() })
  .registerTransport({ state: { tempo: 120 } }, { play, stop })
  .registerInspector({ id: 'props', title: 'Properties', render })
  .registerStatus([METRIC_PRESETS.fps(() =&gt; sampler.fps())])
  .mount(document.getElementById('root'));</code></pre>`,
      [],
    )}`;
}
