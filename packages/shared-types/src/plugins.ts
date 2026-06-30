import type { LifecycleStatus } from './application.js';
import type { AudioReactiveBridge, AudioReactiveMapping } from './audioReactive.js';
import type {
  SoundEngineAdapter,
  VisualEngineAdapter,
} from './engines.js';
import type { PlatformEventBus } from './events.js';
import type { ControlMapping, PerformanceControlManager } from './performanceControls.js';
import type { PresetBundle, PresetBundleRegistry } from './presetBundles.js';
import type { PresetRegistry } from './presets.js';
import type { Workspace, WorkspaceRegion } from './workspace.js';

/** Capability flags declared in a plugin manifest */
export type PluginCapability =
  | 'commands'
  | 'panels'
  | 'preset-bundles'
  | 'sound-adapter'
  | 'visual-adapter'
  | 'performance-mappings'
  | 'audio-reactive-mappings'
  | 'workspace-regions'
  | 'documentation';

/** Optional plugin dependency reference */
export interface PluginDependency {
  pluginId: string;
  optional?: boolean;
}

/** Plugin manifest metadata */
export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description?: string;
  capabilities: PluginCapability[];
  dependencies?: PluginDependency[];
  /** Documentation links or notes */
  documentation?: PluginDocumentation;
  defaultEnabled?: boolean;
}

/** Documentation metadata contributed by a plugin */
export interface PluginDocumentation {
  summary?: string;
  url?: string;
  tags?: string[];
}

/** Declarative command contribution */
export interface PluginCommand {
  id: string;
  label: string;
  description?: string;
}

/** Declarative inspector panel contribution */
export interface PluginPanel {
  id: string;
  title: string;
  description?: string;
}

/** Placeholder adapter declaration (metadata only — no engine import) */
export interface PluginAdapterDeclaration {
  adapterId: string;
  engineName: string;
  description?: string;
}

/** Runtime plugin status */
export interface PluginStatus {
  pluginId: string;
  name: string;
  version: string;
  enabled: boolean;
  registered: boolean;
  capabilities: PluginCapability[];
  warnings: string[];
  lastError: string | null;
  contributionCounts: {
    commands: number;
    panels: number;
    presetBundles: number;
    performanceMappings: number;
    audioReactiveMappings: number;
    workspaceRegions: number;
    adapterDeclarations: number;
  };
}

/** Result of registering a plugin */
export interface PluginRegistrationResult {
  pluginId: string;
  registered: boolean;
  warnings: string[];
  error?: string;
}

/** Minimal lifecycle surface exposed to plugins */
export interface PlatformLifecycle {
  readonly status: LifecycleStatus;
  transition(to: LifecycleStatus): void;
  onStatusChange(handler: (status: LifecycleStatus) => void): () => void;
}

/** Context passed to plugin register/enable/disable hooks */
export interface PluginContext {
  readonly eventBus: PlatformEventBus;
  readonly lifecycle: PlatformLifecycle;
  readonly presets: PresetRegistry;
  readonly workspace: Workspace;
  readonly presetBundles?: PresetBundleRegistry;
  readonly sound?: SoundEngineAdapter;
  readonly visual?: VisualEngineAdapter;
  readonly bridge?: AudioReactiveBridge;
  readonly performance?: PerformanceControlManager;
  registerCommand(command: PluginCommand): void;
  registerPanel(panel: PluginPanel): void;
  registerPresetBundle(bundle: PresetBundle): void;
  registerPerformanceMapping(mapping: ControlMapping): void;
  registerAudioReactiveMapping(mapping: AudioReactiveMapping): void;
  registerWorkspaceRegion(region: WorkspaceRegion): void;
  registerDocumentation(doc: PluginDocumentation): void;
  /** Placeholder — declares sound adapter metadata without importing engine */
  declareSoundAdapter(declaration: PluginAdapterDeclaration): void;
  /** Placeholder — declares visual adapter metadata without importing engine */
  declareVisualAdapter(declaration: PluginAdapterDeclaration): void;
}

/** Platform plugin contract */
export interface PlatformPlugin {
  manifest: PluginManifest;
  register(context: PluginContext): void | Promise<void>;
  unregister?(context: PluginContext): void | Promise<void>;
  enable?(context: PluginContext): void | Promise<void>;
  disable?(context: PluginContext): void | Promise<void>;
}

/** Plugin manager contract */
export interface PluginManager {
  registerPlugin(plugin: PlatformPlugin): Promise<PluginRegistrationResult>;
  unregisterPlugin(pluginId: string): Promise<void>;
  getPlugin(pluginId: string): PlatformPlugin | undefined;
  getPlugins(): PlatformPlugin[];
  getPluginsByCapability(capability: PluginCapability): PlatformPlugin[];
  enablePlugin(pluginId: string): Promise<void>;
  disablePlugin(pluginId: string): Promise<void>;
  validatePlugin(plugin: PlatformPlugin): PluginRegistrationResult;
  getPluginStatus(pluginId: string): PluginStatus | undefined;
  getAllPluginStatuses(): PluginStatus[];
}
