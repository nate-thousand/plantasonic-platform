/**
 * Instrument shell variant — edge-to-edge, canvas-first creative shell.
 *
 * Pure render function: returns an HTML string for the `.ps-instrument` frame.
 * Behavior is wired separately (bindApplicationShell + the instrument bind*()
 * helpers) so this module stays framework-agnostic and unit-testable.
 *
 * Reuses the standardized regions in regions.ts and the existing `.ps-*`
 * instrument surfaces; never duplicates CSS.
 */

import type { ApplicationShellConfig, ShellMode } from '../shell/types';
import { attrs, classList, escapeHtml } from './internal.ts';
import {
  renderFloatingLayer,
  renderHud,
  renderSidebarRegion,
  renderStage,
  renderStatusRegion,
  renderTimelineRegion,
  renderTransportRegion,
  renderInspectorRegion,
} from './regions.ts';

/** Default stage content — an empty canvas mount slot for `mountCanvas()`. */
export function renderCanvasMount(id = 'ps-stage-canvas'): string {
  return `<div class="ps-canvas-mount" data-ps-canvas-mount id="${escapeHtml(id)}"></div>`;
}

export function renderInstrumentShell(
  config: Partial<ApplicationShellConfig> = {},
  workspaceContent?: string,
): string {
  const inst = config.instrument ?? {};
  const mode: ShellMode = config.mode ?? inst.mode ?? 'edit';

  const stageInner = inst.stage ?? workspaceContent ?? renderCanvasMount();
  const stageExtras = [
    mode === 'presentation' && inst.brand ? `<div class="ps-presenter-brand">${inst.brand}</div>` : '',
    inst.hud ? renderHud(inst.hud) : '',
    inst.floating ? renderFloatingLayer(inst.floating) : '',
  ].filter(Boolean).join('');

  const stage = `<div class="ps-instrument__stage">${renderStage(stageInner)}${stageExtras}${
    inst.timeline ? renderTimelineRegion(inst.timeline) : ''
  }</div>`;

  const rail = inst.rail ? `<div class="ps-instrument__rail">${renderSidebarRegion(inst.rail)}</div>` : '';
  const aside = inst.aside ? `<div class="ps-instrument__aside">${renderInspectorRegion(inst.aside)}</div>` : '';

  const transportInner = inst.transport === false ? '' : (inst.transport ?? '');
  const statusInner = inst.status ? renderStatusRegion(inst.status) : '';
  const transport =
    inst.transport === false && !statusInner
      ? ''
      : `<div class="ps-instrument__transport">${
          transportInner ? renderTransportRegion(transportInner) : ''
        }${statusInner}</div>`;

  const rootAttrs = attrs({
    class: classList('ps-instrument', `ps-instrument--${mode}`),
    'data-ps-instrument': true,
    'data-ps-mode': mode,
    'aria-label': config.title ?? 'Instrument',
    role: 'application',
  });

  return `<div ${rootAttrs}>${rail}${stage}${aside}${transport}</div>`;
}
