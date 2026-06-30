/**
 * Creative Workspace — floating surface primitives.
 *
 * Supporting panels render as overlays on top of the fullscreen stage.
 * Reuses instrument region renderers and `.ps-floating-panel` surfaces.
 */

import { renderStage } from '../instrument/regions.ts';
import { attrs, classList, escapeHtml } from '../instrument/internal.ts';
import type { FloatingSurfaceOptions, SurfaceAnchor } from './types.ts';

const DEFAULT_ANCHORS: Record<string, SurfaceAnchor> = {
  transport: 'bottom-center',
  inspector: 'center-right',
  browser: 'center-left',
  hud: 'top-right',
  palette: 'top-center',
};

function surface(
  kind: string,
  content: string,
  opts: FloatingSurfaceOptions = {},
  defaultAnchor?: SurfaceAnchor,
): string {
  const anchor = opts.anchor ?? defaultAnchor ?? 'bottom-center';
  const panelId = opts.id ?? kind;
  const collapsed = opts.collapsed ? ' ps-is-collapsed' : '';
  const pinned = opts.pinned ? ' ps-is-pinned' : '';
  const attrString = attrs({
    class: classList(
      'ps-cw-surface',
      `ps-cw-surface--${kind}`,
      `ps-cw-surface--${anchor}`,
      opts.className,
    ),
    'data-ps-cw-surface': kind,
    'data-ps-cw-anchor': anchor,
    role: kind === 'inspector' ? 'complementary' : kind === 'browser' ? 'navigation' : undefined,
    'aria-label': opts.label,
  });
  return `<div ${attrString}>
    <div class="ps-floating-panel${collapsed}${pinned}" data-ps-floating-panel="${escapeHtml(panelId)}">
      <div class="ps-floating-panel__body">${content}</div>
    </div>
  </div>`;
}

/** Fullscreen stage — always the dominant visual element. */
export function renderFullscreenStage(content = '', opts: { id?: string; className?: string } = {}): string {
  return renderStage(content, { id: opts.id, className: classList('ps-cw-stage', opts.className) });
}

/** Floating transport — bottom-centered overlay. */
export function renderFloatingTransport(content: string, opts: FloatingSurfaceOptions = {}): string {
  return surface('transport', content, { label: 'Transport', ...opts }, DEFAULT_ANCHORS.transport);
}

/** Floating inspector — right-side overlay. */
export function renderFloatingInspector(content: string, opts: FloatingSurfaceOptions = {}): string {
  return surface('inspector', content, { label: 'Inspector', ...opts }, DEFAULT_ANCHORS.inspector);
}

/** Preset / library browser — left-side overlay. */
export function renderPresetBrowser(content: string, opts: FloatingSurfaceOptions = {}): string {
  return surface('browser', content, { label: 'Preset browser', ...opts }, DEFAULT_ANCHORS.browser);
}

/** Status HUD — non-interactive metrics overlay. */
export function renderStatusHud(content: string, opts: FloatingSurfaceOptions = {}): string {
  const anchor = opts.anchor ?? DEFAULT_ANCHORS.hud;
  const attrString = attrs({
    class: classList('ps-cw-surface', 'ps-cw-surface--hud', `ps-cw-surface--${anchor}`, opts.className),
    'data-ps-cw-surface': 'hud',
    'data-ps-cw-anchor': anchor,
    role: 'status',
    'aria-label': opts.label ?? 'Status',
  });
  return `<div ${attrString}><div class="ps-cw-hud">${content}</div></div>`;
}

/** Command palette mount — top-centered overlay slot. */
export function renderCommandPaletteSlot(content: string, opts: FloatingSurfaceOptions = {}): string {
  return surface('palette', content, { label: 'Command palette', ...opts }, DEFAULT_ANCHORS.palette);
}
