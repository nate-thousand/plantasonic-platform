import {
  WORKSPACE_PRESETS,
  renderInstrumentWorkspace,
  renderVisualizerWorkspace,
  renderInstallationWorkspace,
  renderPresentationWorkspace,
  renderStudioWorkspace,
} from '@ds/creative-workspace';
import { renderTransport, createMetrics, METRIC_PRESETS } from '@ds/instrument';
import layerStackDiagram from '../../../docs/assets/creative-workspace/layer-stack.svg';
import instrumentLayoutDiagram from '../../../docs/assets/creative-workspace/instrument-layout.svg';
import { demoCard, docBlock, sectionHeader } from '../lib/ui';

const PREVIEW_STYLE =
  'position:relative; height:20rem; border:1px solid var(--ds-color-border-subtle); border-radius: var(--ds-radius-default); overflow:hidden; background: var(--ds-color-surface-app)';

function stagePlaceholder(label: string): string {
  return `<div style="position:absolute; inset:0; display:grid; place-items:center; color: var(--ds-color-text-secondary); font-family: var(--ds-font-family-mono); font-size: 0.85rem">${label}</div>`;
}

function sampleTransport(): string {
  return renderTransport({ state: { tempo: 120, time: '1.1.0' } });
}

function sampleHud(): string {
  const metrics = createMetrics([
    METRIC_PRESETS.fps(() => 60),
    METRIC_PRESETS.cpu(() => 24),
  ]);
  return metrics.renderStatusBar();
}

function instrumentPreview(): string {
  return `<div style="${PREVIEW_STYLE}">${renderInstrumentWorkspace({
    stage: stagePlaceholder('◉ stage'),
    transport: sampleTransport(),
    inspector: '<p class="small text-muted mb-0">Bloom · Density</p>',
    presetBrowser: '<p class="small text-muted mb-0">Presets…</p>',
    statusHud: sampleHud(),
  })}</div>`;
}

function presetPreview(preset: (typeof WORKSPACE_PRESETS)[number]): string {
  const renderers: Record<string, () => string> = {
    instrument: () =>
      renderInstrumentWorkspace({
        stage: stagePlaceholder('instrument'),
        transport: sampleTransport(),
        statusHud: 'FPS 60',
      }),
    visualizer: () =>
      renderVisualizerWorkspace({ stage: stagePlaceholder('visualizer'), statusHud: 'LIVE' }),
    installation: () =>
      renderInstallationWorkspace({ stage: stagePlaceholder('installation'), brand: '<strong>Install</strong>' }),
    presentation: () =>
      renderPresentationWorkspace({ stage: stagePlaceholder('presentation'), transport: sampleTransport() }),
    studio: () =>
      renderStudioWorkspace({
        stage: stagePlaceholder('studio'),
        presetBrowser: 'Assets',
        inspector: 'Properties',
        transport: sampleTransport(),
      }),
  };
  return `<div style="${PREVIEW_STYLE}">${renderers[preset]()}</div>`;
}

export function renderCreativeWorkspaceOverview(): string {
  const presetList = WORKSPACE_PRESETS.map(
    (p) => `<span class="ds-c-badge" style="margin:0.15rem">${p}</span>`,
  ).join('');
  return `
    ${sectionHeader('Creative Workspace', 'Reusable layout presets between the Application Shell and application content. Stage-first; everything else floats.')}
    ${docBlock({
      purpose: 'Give creative applications consistent workspace layouts without custom grid code. The stage is always dominant; transport, inspector, browser, HUD, and command palette are overlays.',
      usage: "import { renderCreativeWorkspace } from 'plantasonic-design-system/creative-workspace'; renderApplicationShell({ variant: 'instrument' }, renderCreativeWorkspace({ preset: 'instrument', stage, transport }))",
      bestPractices: [
        'Pick a preset that matches your app category, then pass content strings',
        'Call bindCreativeWorkspace(root) after mount for drag/snap on floating panels',
        'Import scss/creative-workspace.scss after scss/instrument.scss',
      ],
      dos: ['Compose inside renderApplicationShell workspace slot', 'Reuse instrument transport and inspector renderers'],
      donts: ['Build permanent dashboard sidebars for creative tools', 'Duplicate layout grids per application'],
      implementationNotes: [
        'Layer sits between Application Shell and content — does not replace the shell',
        'Five presets: instrument, visualizer, installation, presentation, studio',
      ],
    })}
    <figure class="ds-doc-figure mb-4">
      <img src="${layerStackDiagram}" alt="Application Shell, Creative Workspace, and application content layer stack" width="640" height="360" loading="lazy" style="max-width:100%; height:auto; border-radius: var(--ds-radius-default)" />
      <figcaption class="small text-muted mt-2">Creative Workspace sits between the Application Shell and application content.</figcaption>
    </figure>
    ${demoCard(`${WORKSPACE_PRESETS.length} workspace presets`, `<div class="ds-l-inline" style="flex-wrap:wrap">${presetList}</div>`, ['--ps-instrument-gutter'])}`;
}

export function renderCreativeWorkspaceInstrument(): string {
  return `
    ${sectionHeader('Instrument Workspace', 'Fullscreen stage with floating transport, inspector, preset browser, status HUD, and optional command palette.')}
    <figure class="ds-doc-figure mb-4">
      <img src="${instrumentLayoutDiagram}" alt="Instrument workspace with floating overlays" width="640" height="360" loading="lazy" style="max-width:100%; height:auto; border-radius: var(--ds-radius-default)" />
      <figcaption class="small text-muted mt-2">Stage fills the viewport; supporting panels are floating surfaces, not permanent sidebars.</figcaption>
    </figure>
    ${docBlock({
      purpose: 'Music, generative, and performance tools where the canvas is the hero and controls stay reachable but unobtrusive.',
      usage: "renderInstrumentWorkspace({ stage: renderCanvasMount(), transport: renderTransport(...), inspector, presetBrowser, statusHud, commandPalette })",
      bestPractices: ['Set optional regions to false to omit them', 'Keep preset browser content in the browser surface, not a docked sidebar'],
      dos: ['Use renderFullscreenStage for custom stage markup'],
      donts: ['Pin inspector as a permanent grid column in creative mode'],
      implementationNotes: ['Surfaces use .ps-cw-surface--{anchor} placement tokens'],
    })}
    ${demoCard('Instrument workspace preview', instrumentPreview(), ['--ds-color-surface-stage', '--ps-shadow-overlay'])}`;
}

export function renderCreativeWorkspacePresets(): string {
  const cards = WORKSPACE_PRESETS.filter((p) => p !== 'instrument')
    .map((p) => demoCard(`${p} workspace`, presetPreview(p), []))
    .join('');
  return `
    ${sectionHeader('Workspace Presets', 'Visualizer, installation, presentation, and studio layouts share the same overlay model with different defaults.')}
    ${cards}
    ${demoCard(
      'Unified dispatch',
      `<pre class="small mb-0" style="white-space:pre-wrap"><code>renderCreativeWorkspace({ preset: 'studio', stage, transport, inspector })</code></pre>`,
      [],
    )}`;
}
