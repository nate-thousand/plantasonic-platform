export type {
  ApplicationConfig,
  ApplicationInstance,
  LifecycleStatus,
} from './application.js';

export type {
  PlatformEvent,
  PlatformEventHandler,
  PlatformEventSubscription,
  PlatformEventBus,
} from './events.js';

export type {
  EngineAdapter,
  SoundEngineAdapter,
  SoundEngineStatus,
  VisualEngineAdapter,
  VisualEngineStatus,
  VisualEngineMountTarget,
  EngineAdapterRegistry,
} from './engines.js';

export type {
  AudioBand,
  AudioFeature,
  AudioFeaturesSnapshot,
  AudioReactiveBridge,
  AudioReactiveBridgeConfig,
  AudioReactiveBridgeStatus,
  AudioReactiveMapping,
  MappingAmount,
  VisualTarget,
} from './audioReactive.js';

export type {
  AudioReactivePreset,
  PresetBundle,
  PresetBundleApplyResult,
  PresetBundleRegistry,
  PresetCategory,
  PresetTag,
  SoundPresetRef,
  UIPresetState,
  VisualPresetRef,
  WorkspacePreset,
} from './presetBundles.js';

export type {
  ControlMapping,
  ControlSourceKind,
  ControlTarget,
  ControlValue,
  KeyboardInputState,
  LearnModeState,
  MIDIMessage,
  MIDIInputState,
  PerformanceControlManager,
  PerformanceControlStatus,
} from './performanceControls.js';

export type {
  PlatformLifecycle,
  PlatformPlugin,
  PluginAdapterDeclaration,
  PluginCapability,
  PluginCommand,
  PluginContext,
  PluginDependency,
  PluginDocumentation,
  PluginManager,
  PluginManifest,
  PluginPanel,
  PluginRegistrationResult,
  PluginStatus,
} from './plugins.js';

export type {
  BridgeState,
  EngineState,
  PerformanceState,
  PluginState,
  ProjectApplyResult,
  ProjectState,
  ProjectStateVersion,
  ProjectStorageAdapter,
  ProjectValidationResult,
  SerializedProject,
  SoundState,
  UIState,
  VisualState,
  WorkspacePersistence,
  WorkspaceState,
} from './projectState.js';

export type { Preset, PresetCollection, PresetRegistry } from './presets.js';

export type {
  WorkspaceRegionId,
  WorkspaceRegion,
  WorkspaceConfig,
  Workspace,
} from './workspace.js';
