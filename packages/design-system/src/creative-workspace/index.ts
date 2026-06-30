/**
 * Creative Workspace — public entrypoint (`plantasonic-design-system/creative-workspace`).
 *
 * Reusable layout presets for creative software. Sits between the Application
 * Shell and application content: the stage is always dominant; transport,
 * inspector, browser, HUD, and command palette are floating overlays.
 *
 * Pair with `scss/creative-workspace.scss` and compose inside
 * `renderApplicationShell({ variant: 'instrument' }, workspaceHtml)`.
 */

export type {
  WorkspacePreset,
  SurfaceAnchor,
  FloatingSurfaceOptions,
  CreativeWorkspaceConfig,
} from './types.ts';

export { WORKSPACE_PRESETS } from './types.ts';

export {
  renderFullscreenStage,
  renderFloatingTransport,
  renderFloatingInspector,
  renderPresetBrowser,
  renderStatusHud,
  renderCommandPaletteSlot,
} from './surfaces.ts';

export {
  renderInstrumentWorkspace,
  renderVisualizerWorkspace,
  renderInstallationWorkspace,
  renderPresentationWorkspace,
  renderStudioWorkspace,
  renderCreativeWorkspace,
} from './layouts.ts';

export { bindCreativeWorkspace, type CreativeWorkspaceBindOptions } from './bind.ts';
