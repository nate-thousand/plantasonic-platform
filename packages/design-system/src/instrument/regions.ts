/**
 * Standardized creative workspace regions.
 *
 * Every creative application composes these regions instead of inventing new
 * layouts. Each renderer emits a `.ps-region` element tagged with
 * `data-ps-region`, reusing existing `.ps-*` surfaces where they exist and
 * adding `.ps-region--*` only where needed. All output is a plain HTML string.
 */

import { attrs, classList, escapeHtml } from './internal.ts';

export type RegionName =
  | 'stage'
  | 'transport'
  | 'inspector'
  | 'sidebar'
  | 'floating'
  | 'overlay'
  | 'hud'
  | 'status'
  | 'notification'
  | 'workspace'
  | 'dock'
  | 'palette'
  | 'browser'
  | 'timeline'
  | 'toolbar';

export type RegionOptions = {
  /** Optional element id. */
  id?: string;
  /** Extra class names appended to the region. */
  className?: string;
  /** ARIA label for the region landmark. */
  label?: string;
  /** ARIA role override. */
  role?: string;
  /** Extra data-* attributes (keys without the `data-` prefix). */
  data?: Record<string, string | number | boolean>;
};

function region(name: RegionName, content: string, opts: RegionOptions = {}, extraClass = ''): string {
  const dataAttrs = opts.data
    ? Object.entries(opts.data)
        .map(([k, v]) => `data-${k}="${escapeHtml(String(v))}"`)
        .join(' ')
    : '';
  const attrString = attrs({
    id: opts.id,
    class: classList('ps-region', `ps-region--${name}`, extraClass, opts.className),
    'data-ps-region': name,
    role: opts.role,
    'aria-label': opts.label,
  });
  return `<div ${attrString}${dataAttrs ? ' ' + dataAttrs : ''}>${content}</div>`;
}

/** Stage — primary canvas surface; fills available space. */
export function renderStage(content = '', opts: RegionOptions = {}): string {
  return region('stage', content, { role: 'main', label: 'Stage', ...opts }, 'ps-stage ps-stage-container');
}

/** Transport region wrapper (pass `renderTransport()` output as content). */
export function renderTransportRegion(content = '', opts: RegionOptions = {}): string {
  return region('transport', content, { role: 'toolbar', label: 'Transport', ...opts });
}

/** Inspector region (right side; pass `renderInspector()` output as content). */
export function renderInspectorRegion(content = '', opts: RegionOptions = {}): string {
  return region('inspector', content, { role: 'complementary', label: 'Inspector', ...opts }, 'ps-inspector');
}

/** Sidebar / left rail region. */
export function renderSidebarRegion(content = '', opts: RegionOptions = {}): string {
  return region('sidebar', content, { role: 'navigation', label: 'Sidebar', ...opts });
}

/** Floating panels layer (absolute children). */
export function renderFloatingLayer(content = '', opts: RegionOptions = {}): string {
  return region('floating', content, opts, 'ps-floating-layer');
}

/** Overlay region (modals / drawers host). */
export function renderOverlayRegion(content = '', opts: RegionOptions = {}): string {
  return region('overlay', content, opts);
}

/** HUD — non-interactive heads-up overlay. */
export function renderHud(content = '', opts: RegionOptions = {}): string {
  return region('hud', content, { role: 'status', label: 'Heads-up display', ...opts }, 'ps-hud ps-hud-overlay');
}

/** Status bar — bottom metrics row. */
export function renderStatusRegion(content = '', opts: RegionOptions = {}): string {
  return region('status', content, { role: 'status', label: 'Status', ...opts }, 'ps-status-bar');
}

/** Notification host region. */
export function renderNotificationRegion(content = '', opts: RegionOptions = {}): string {
  return region('notification', content, { role: 'status', label: 'Notifications', ...opts });
}

/** Workspace region wrapper. */
export function renderWorkspaceRegion(content = '', opts: RegionOptions = {}): string {
  return region('workspace', content, opts);
}

/** Dock region (tool dock). */
export function renderDockRegion(content = '', opts: RegionOptions = {}): string {
  return region('dock', content, { role: 'toolbar', label: 'Dock', ...opts }, 'ps-dock');
}

/** Command palette mount region. */
export function renderPaletteRegion(content = '', opts: RegionOptions = {}): string {
  return region('palette', content, opts);
}

/** Browser / library region. */
export function renderBrowserRegion(content = '', opts: RegionOptions = {}): string {
  return region('browser', content, { role: 'navigation', label: 'Browser', ...opts });
}

/** Timeline region (below the stage). */
export function renderTimelineRegion(content = '', opts: RegionOptions = {}): string {
  return region('timeline', content, { role: 'group', label: 'Timeline', ...opts });
}

/** Toolbar region. */
export function renderToolbarRegion(content = '', opts: RegionOptions = {}): string {
  return region('toolbar', content, { role: 'toolbar', label: 'Toolbar', ...opts });
}

/** All standardized region names, useful for introspection / docs. */
export const REGION_NAMES: RegionName[] = [
  'stage',
  'transport',
  'inspector',
  'sidebar',
  'floating',
  'overlay',
  'hud',
  'status',
  'notification',
  'workspace',
  'dock',
  'palette',
  'browser',
  'timeline',
  'toolbar',
];
