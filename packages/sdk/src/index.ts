export {
  createWorkspacePersistence,
  createLocalStorageAdapter,
  createMemoryStorageAdapter,
  ProjectValidationError,
  PROJECT_STATE_VERSION,
  applyProjectState,
  captureProjectState,
  createDefaultProjectState,
  deserializeProject,
  serializeProject,
  validateProjectState,
  validateSerializedProject,
  type CreateWorkspacePersistenceOptions,
  type ProjectStateContext,
  type WorkspacePersistenceWithContext,
} from './workspacePersistence.js';
export {
  createPluginManager,
  PluginValidationError,
  type CreatePluginManagerOptions,
  type PluginManagerServices,
  type PluginManagerWithServices,
} from './pluginManager.js';
export {
  createPerformanceControlManager,
  DEFAULT_PERFORMANCE_MAPPINGS,
  midiNoteToName,
  parseMidiMessage,
  type CreatePerformanceControlManagerOptions,
  type PerformanceControlContext,
  type PerformanceControlManagerWithContext,
} from './performanceControls.js';
export {
  createPresetBundleRegistry,
  applyWorkspacePresetToRegions,
  PresetBundleValidationError,
  type CreatePresetBundleRegistryOptions,
  type PresetBundleApplyContext,
  type PresetBundleRegistryWithContext,
} from './presetBundleRegistry.js';
export {
  createAudioReactiveBridge,
  DEFAULT_AUDIO_REACTIVE_MAPPINGS,
  type CreateAudioReactiveBridgeOptions,
} from './audioReactiveBridge.js';
export {
  createSoundEngineAdapter,
  listSoundEnginePresets,
  type CreateSoundEngineAdapterOptions,
  type SoundPresetSummary,
} from './soundEngineAdapter.js';
export {
  createVisualEngineAdapter,
  listVisualEnginePresets,
  resolveVisualPresetId,
  type CreateVisualEngineAdapterOptions,
  type VisualPresetSummary,
} from './visualEngineAdapter.js';
export { createApplication, type PlatformApplication } from './createApplication.js';
export { createEventBus } from './events.js';
export { createLifecycle, type Lifecycle, type LifecycleOptions } from './lifecycle.js';
export {
  createPresetRegistry,
  type PresetRegistryOptions,
} from './presets.js';
export {
  createWorkspace,
  DEFAULT_REGIONS,
  type WorkspaceOptions,
} from './workspace.js';
