/**
 * Creative Workspace — preset layout composers.
 *
 * Each preset arranges floating surfaces over a fullscreen stage.
 * Applications pass content strings; the Design System owns placement.
 */

import { renderCanvasMount } from '../instrument/shell.ts';
import { attrs, classList } from '../instrument/internal.ts';
import {
  renderCommandPaletteSlot,
  renderFloatingInspector,
  renderFloatingTransport,
  renderFullscreenStage,
  renderPresetBrowser,
  renderStatusHud,
} from './surfaces.ts';
import type { CreativeWorkspaceConfig, WorkspacePreset } from './types.ts';

type ResolvedConfig = Required<
  Pick<CreativeWorkspaceConfig, 'preset' | 'mode'>
> &
  CreativeWorkspaceConfig;

function resolveConfig(config: CreativeWorkspaceConfig = {}): ResolvedConfig {
  return {
    preset: config.preset ?? 'instrument',
    mode: config.mode ?? 'edit',
    ...config,
  };
}

function overlayLayer(surfaces: Array<string | false | undefined>): string {
  const inner = surfaces.filter(Boolean).join('');
  if (!inner) return '';
  return `<div class="ps-creative-workspace__overlays" data-ps-cw-overlays>${inner}</div>`;
}

function workspaceRoot(preset: WorkspacePreset, mode: ResolvedConfig['mode'], body: string, opts: ResolvedConfig): string {
  const rootAttrs = attrs({
    id: opts.id,
    class: classList(
      'ps-creative-workspace',
      `ps-creative-workspace--${preset}`,
      `ps-creative-workspace--${mode}`,
      opts.className,
    ),
    'data-ps-creative-workspace': preset,
    'data-ps-mode': mode,
    role: 'application',
  });
  return `<div ${rootAttrs}>${body}</div>`;
}

function stageBlock(content: string, brand?: string): string {
  const brandHtml = brand ? `<div class="ps-presenter-brand">${brand}</div>` : '';
  return `<div class="ps-creative-workspace__stage">${renderFullscreenStage(content)}${brandHtml}</div>`;
}

/**
 * Instrument Workspace — fullscreen stage with floating transport, inspector,
 * preset browser, status HUD, and optional command palette.
 */
export function renderInstrumentWorkspace(config: CreativeWorkspaceConfig = {}): string {
  const c = resolveConfig({ preset: 'instrument', ...config });
  const stage = c.stage ?? renderCanvasMount();
  const overlays = overlayLayer([
    c.presetBrowser !== false && c.presetBrowser ? renderPresetBrowser(c.presetBrowser) : '',
    c.inspector !== false && c.inspector ? renderFloatingInspector(c.inspector) : '',
    c.transport !== false && c.transport ? renderFloatingTransport(c.transport) : '',
    c.statusHud !== false && c.statusHud ? renderStatusHud(c.statusHud) : '',
    c.commandPalette !== false && c.commandPalette ? renderCommandPaletteSlot(c.commandPalette) : '',
    c.floating,
  ]);
  return workspaceRoot('instrument', c.mode, `${stageBlock(stage)}${overlays}`, c);
}

/**
 * Visualizer Workspace — fullscreen stage, minimal HUD, optional transport.
 * Optimized for passive viewing and live visualization.
 */
export function renderVisualizerWorkspace(config: CreativeWorkspaceConfig = {}): string {
  const c = resolveConfig({ preset: 'visualizer', mode: 'performance', ...config });
  const stage = c.stage ?? renderCanvasMount();
  const overlays = overlayLayer([
    c.statusHud !== false && c.statusHud ? renderStatusHud(c.statusHud, { anchor: 'top-left' }) : '',
    c.transport !== false && c.transport ? renderFloatingTransport(c.transport) : '',
    c.floating,
  ]);
  return workspaceRoot('visualizer', c.mode, `${stageBlock(stage)}${overlays}`, c);
}

/**
 * Installation Workspace — fullscreen immersive stage, ambient HUD only.
 * No editing chrome; suitable for gallery and site-specific work.
 */
export function renderInstallationWorkspace(config: CreativeWorkspaceConfig = {}): string {
  const c = resolveConfig({ preset: 'installation', mode: 'presentation', ...config });
  const stage = c.stage ?? renderCanvasMount();
  const overlays = overlayLayer([
    c.statusHud !== false && c.statusHud ? renderStatusHud(c.statusHud, { anchor: 'bottom-right' }) : '',
    c.presetBrowser !== false && c.presetBrowser ? renderPresetBrowser(c.presetBrowser, { anchor: 'center-left' }) : '',
    c.floating,
  ]);
  return workspaceRoot('installation', c.mode, `${stageBlock(stage, c.brand)}${overlays}`, c);
}

/**
 * Presentation Workspace — demo-ready fullscreen stage with hidden-until-hover
 * transport and presenter branding.
 */
export function renderPresentationWorkspace(config: CreativeWorkspaceConfig = {}): string {
  const c = resolveConfig({ preset: 'presentation', mode: 'presentation', ...config });
  const stage = c.stage ?? renderCanvasMount();
  const overlays = overlayLayer([
    c.transport !== false && c.transport ? renderFloatingTransport(c.transport) : '',
    c.statusHud !== false && c.statusHud ? renderStatusHud(c.statusHud) : '',
    c.commandPalette !== false && c.commandPalette ? renderCommandPaletteSlot(c.commandPalette) : '',
    c.floating,
  ]);
  return workspaceRoot('presentation', c.mode, `${stageBlock(stage, c.brand ?? '<strong>Demo</strong>')}${overlays}`, c);
}

/**
 * Studio Workspace — fullscreen stage with browser, inspector, transport,
 * and optional timeline slot for multi-tool creative production.
 */
export function renderStudioWorkspace(config: CreativeWorkspaceConfig = {}): string {
  const c = resolveConfig({ preset: 'studio', ...config });
  const stage = c.stage ?? renderCanvasMount();
  const overlays = overlayLayer([
    c.presetBrowser !== false && c.presetBrowser ? renderPresetBrowser(c.presetBrowser) : '',
    c.inspector !== false && c.inspector ? renderFloatingInspector(c.inspector) : '',
    c.transport !== false && c.transport ? renderFloatingTransport(c.transport) : '',
    c.statusHud !== false && c.statusHud ? renderStatusHud(c.statusHud) : '',
    c.commandPalette !== false && c.commandPalette ? renderCommandPaletteSlot(c.commandPalette) : '',
    c.floating,
  ]);
  return workspaceRoot('studio', c.mode, `${stageBlock(stage)}${overlays}`, c);
}

const PRESET_RENDERERS: Record<WorkspacePreset, (config: CreativeWorkspaceConfig) => string> = {
  instrument: renderInstrumentWorkspace,
  visualizer: renderVisualizerWorkspace,
  installation: renderInstallationWorkspace,
  presentation: renderPresentationWorkspace,
  studio: renderStudioWorkspace,
};

/** Dispatch to the layout preset renderer. Defaults to `instrument`. */
export function renderCreativeWorkspace(config: CreativeWorkspaceConfig = {}): string {
  const preset = config.preset ?? 'instrument';
  return PRESET_RENDERERS[preset](config);
}
