/**
 * Creative Application Framework — public entrypoint (`plantasonic-design-system/instrument`).
 *
 * Standardized regions, transport, canvas mounts, inspector + status registries,
 * display modes, floating behavior, and the unified input layer for immersive
 * creative software. Pair with the `instrument` shell variant and the
 * `createApplication()` SDK (`plantasonic-design-system/app`).
 */

export { renderInstrumentShell, renderCanvasMount } from './shell.ts';

export {
  type RegionName,
  type RegionOptions,
  REGION_NAMES,
  renderStage,
  renderTransportRegion,
  renderInspectorRegion,
  renderSidebarRegion,
  renderFloatingLayer,
  renderOverlayRegion,
  renderHud,
  renderStatusRegion,
  renderNotificationRegion,
  renderWorkspaceRegion,
  renderDockRegion,
  renderPaletteRegion,
  renderBrowserRegion,
  renderTimelineRegion,
  renderToolbarRegion,
} from './regions.ts';

export {
  type TransportAction,
  type TransportState,
  type TransportConfig,
  type TransportHandlers,
  DEFAULT_TRANSPORT_STATE,
  renderTransport,
  bindTransport,
} from './transport.ts';

export {
  type CanvasType,
  type CanvasContext,
  type CanvasAdapter,
  type CanvasMount,
  mountCanvas,
  canvas2dAdapter,
  htmlAdapter,
  imageAdapter,
  videoAdapter,
} from './canvas.ts';

export {
  type InspectorPanel,
  type InspectorRegistry,
  createInspector,
  renderInspector,
  bindInspector,
} from './inspector.ts';

export {
  type Metric,
  type MetricValue,
  type MetricsRegistry,
  type MetricPresetName,
  createMetrics,
  renderStatusBar,
  renderHud as renderMetricsHud,
  startMetricsLoop,
  createFpsSampler,
  METRIC_PRESETS,
} from './status.ts';

export type { ShellMode, ShellVariant, InstrumentConfig } from '../shell/types';

export {
  type SetModeOptions,
  SHELL_MODES,
  shellModeClass,
  setShellMode,
  getShellMode,
  cycleShellMode,
} from './modes.ts';

export { type FloatingOptions, bindFloating } from './floating.ts';

export {
  type InputEventType,
  type PointerPhase,
  type NormalizedPointer,
  type NormalizedKey,
  type NormalizedWheel,
  type NormalizedGesture,
  type NormalizedInput,
  type InputHandler,
  type InputAdapter,
  type InputManager,
  createInputManager,
} from './input.ts';
