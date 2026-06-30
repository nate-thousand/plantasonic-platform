/**
 * Creative Workspace — configuration types.
 *
 * Layout presets sit between the Application Shell and application content.
 * The stage is always dominant; supporting surfaces are overlays.
 */

import type { ShellMode } from '../shell/types.ts';

/** Built-in creative workspace layout presets. */
export type WorkspacePreset =
  | 'instrument'
  | 'visualizer'
  | 'installation'
  | 'presentation'
  | 'studio';

export const WORKSPACE_PRESETS: WorkspacePreset[] = [
  'instrument',
  'visualizer',
  'installation',
  'presentation',
  'studio',
];

/** Anchor positions for floating workspace surfaces. */
export type SurfaceAnchor =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'full';

export type FloatingSurfaceOptions = {
  id?: string;
  className?: string;
  anchor?: SurfaceAnchor;
  label?: string;
  collapsed?: boolean;
  pinned?: boolean;
};

export type CreativeWorkspaceConfig = {
  /** Layout preset — selects region defaults and surface placement. */
  preset?: WorkspacePreset;
  /** Primary stage content (canvas, renderer, scene). */
  stage?: string;
  /** Floating transport bar content (`renderTransport()` output). Set `false` to omit. */
  transport?: string | false;
  /** Floating inspector content (`renderInspector()` output). Set `false` to omit. */
  inspector?: string | false;
  /** Preset / library browser panel. Set `false` to omit. */
  presetBrowser?: string | false;
  /** Status HUD metrics (`renderStatusBar()` or `renderHud()` output). Set `false` to omit. */
  statusHud?: string | false;
  /** Command palette mount HTML. Set `false` to omit. */
  commandPalette?: string | false;
  /** Extra floating panels layered above the stage. */
  floating?: string;
  /** Display mode class modifier (edit, performance, presentation, touch). */
  mode?: ShellMode;
  /** Root element id. */
  id?: string;
  /** Extra root class names. */
  className?: string;
  /** Presenter branding (presentation preset). */
  brand?: string;
};
