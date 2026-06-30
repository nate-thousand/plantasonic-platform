# Public API

Reference for `@plantasonic/platform` and `@plantasonic/platform-types`.

> SDK orchestration functions are production-ready. Lifecycle and preset registry remain lightweight placeholders.

## @plantasonic/platform

### createSoundEngineAdapter(options)

Creates a Sound Engine adapter wrapping `plantasia-sound-engine`.

```typescript
import { createApplication, createSoundEngineAdapter } from '@plantasonic/platform';

const app = createApplication(config);
const sound = createSoundEngineAdapter({ eventBus: app.eventBus, source: 'my-app' });

await sound.init();
await sound.start();           // user gesture required for first start
await sound.playPreset('seed');
await sound.updateParameter('growth', 0.6);
await sound.updateParameter('tempo', 90);
sound.getStatus();
sound.getAudioFeatures();    // platform-layer analysis for reactive bridge
await sound.stop();
await sound.dispose();
```

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `eventBus` | `PlatformEventBus` | Required — emits `sound:*` events |
| `source` | `string` | Event source identifier (default: `'sound-adapter'`) |

**Events emitted:** `sound:init`, `sound:start`, `sound:stop`, `sound:preset-change`, `sound:parameter-change`, `sound:error`

---

### listSoundEnginePresets()

Returns built-in preset summaries from the engine for UI population.

```typescript
import { listSoundEnginePresets } from '@plantasonic/platform';

const presets = listSoundEnginePresets(); // [{ id, name }, ...]
```

---

### createApplication(config)

Creates a platform application instance — the primary entry point.

```typescript
import { createApplication } from '@plantasonic/platform';

const app = createApplication({
  id: 'my-app',
  name: 'My Application',
  description: 'Optional description',
  workspace: { regions: [...] },  // optional, defaults provided
  initialStatus: 'idle',          // optional
});
```

**Returns:** `PlatformApplication`

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Application identifier |
| `name` | `string` | Display name |
| `description` | `string?` | Optional description |
| `status` | `LifecycleStatus` | Current lifecycle state |
| `createdAt` | `number` | Creation timestamp (ms) |
| `lifecycle` | `Lifecycle` | Lifecycle manager |
| `eventBus` | `PlatformEventBus` | Event bus |
| `workspace` | `Workspace` | Workspace manager |
| `presets` | `PresetRegistry` | Preset registry |
| `start()` | `() => void` | Start the application |
| `pause()` | `() => void` | Pause a running application |
| `stop()` | `() => void` | Stop the application |

---

### createEventBus()

Creates an in-memory pub/sub event bus.

```typescript
import { createEventBus } from '@plantasonic/platform';

const bus = createEventBus();

bus.emit({
  type: 'lifecycle.ready',
  timestamp: new Date().toISOString(),
  source: 'platform',
});

const sub = bus.on('lifecycle', (event) => {
  console.log(event.type, event.payload);
});

sub.unsubscribe();
bus.clear();
```

---

### createLifecycle(options)

Creates a lifecycle state machine.

```typescript
import { createLifecycle } from '@plantasonic/platform';

const lifecycle = createLifecycle({
  eventBus,
  source: 'platform',
  initialStatus: 'idle',
});

lifecycle.transition('initializing');
lifecycle.transition('ready');

const unsub = lifecycle.onStatusChange((status) => {
  console.log('Status:', status);
});
```

**Valid transitions:**

```
idle → initializing → ready → running ⇄ paused → stopping → stopped → idle
                              ↘ error → idle
```

---

### createWorkspace(options)

Creates a workspace with standard regions.

```typescript
import { createWorkspace, DEFAULT_REGIONS } from '@plantasonic/platform';

const workspace = createWorkspace();
// Regions: stage, transport, inspector, preset-browser, status

workspace.bindRegion('stage', document.querySelector('#stage')!);
workspace.getRegion('stage');
workspace.listRegions();
```

---

### createVisualEngineAdapter

```typescript
function createVisualEngineAdapter(
  options?: CreateVisualEngineAdapterOptions
): VisualEngineAdapter;
```

Wraps `ascii-visual-engine` (plantasia-visual-engine) with platform lifecycle, mount, and event emission.

### Methods

| Method | Description |
|--------|-------------|
| `init()` | Prepare adapter; emit `visual:init` |
| `mount(target)` | Create engine, append canvas to mount element; emit `visual:mount` |
| `unmount()` | Stop and remove canvas from DOM |
| `start()` | Start render loop; emit `visual:start` |
| `stop()` | Stop render loop; emit `visual:stop` |
| `setPreset(id)` | Apply preset (maps sound ids); emit `visual:preset-change` |
| `updateParameter(name, value)` | Set control 0–1; emit `visual:parameter-change` |
| `resize(width, height)` | Resize canvas; emit `visual:resize` |
| `getStatus()` | Returns `VisualEngineStatus` |
| `dispose()` | Full teardown |

### Helpers

```typescript
function listVisualEnginePresets(): Preset[];
function resolveVisualPresetId(soundPresetId: string): string;
```

### VisualEngineStatus

```typescript
interface VisualEngineStatus {
  state: 'idle' | 'ready' | 'running' | 'stopped' | 'error';
  isReady: boolean;
  isRunning: boolean;
  presetId: string | null;
  fps: number | null;
  width: number;
  height: number;
  lastError: string | null;
}
```

### Events emitted

| Event | Payload |
|-------|---------|
| `visual:init` | `{ engineId }` |
| `visual:mount` | `{ width, height }` |
| `visual:start` | `{ presetId }` |
| `visual:stop` | `{}` |
| `visual:preset-change` | `{ presetId, previousPresetId }` |
| `visual:parameter-change` | `{ name, value }` |
| `visual:resize` | `{ width, height }` |
| `visual:error` | `{ message, operation }` |

---

### createAudioReactiveBridge(options)

Connects Sound and Visual adapters through platform-layer analysis and mapping.

```typescript
import {
  createApplication,
  createSoundEngineAdapter,
  createVisualEngineAdapter,
  createAudioReactiveBridge,
} from '@plantasonic/platform';

const app = createApplication(config);
const sound = createSoundEngineAdapter({ eventBus: app.eventBus });
const visual = createVisualEngineAdapter({ eventBus: app.eventBus });
const bridge = createAudioReactiveBridge({ eventBus: app.eventBus });

await bridge.init();
bridge.connect(sound, visual);
await bridge.start();

bridge.updateMapping({
  enabled: true,
  sensitivity: 0.75,
  smoothing: 0.65,
});

bridge.getStatus();
await bridge.stop();
await bridge.dispose();
```

**Methods:**

| Method | Description |
|--------|-------------|
| `init()` | Prepare bridge; emit `bridge:init` |
| `connect(sound, visual)` | Wire adapters; emit `bridge:connect` |
| `disconnect()` | Unwire adapters; emit `bridge:disconnect` |
| `start()` | Start RAF loop; emit `bridge:start` |
| `stop()` | Stop loop; emit `bridge:stop` |
| `updateMapping(config)` | Update mappings/sensitivity/smoothing; emit `bridge:mapping-change` |
| `getStatus()` | Returns `AudioReactiveBridgeStatus` |
| `dispose()` | Full teardown |

**Default mappings:** bass→density, mids→motion, highs→brightness, amplitude→scale, transient→glitch.

**Events emitted:** `bridge:init`, `bridge:connect`, `bridge:disconnect`, `bridge:start`, `bridge:stop`, `bridge:mapping-change`, `bridge:error`

---

### createPerformanceControlManager(options)

Routes Web MIDI and keyboard input to platform adapters.

```typescript
import { createPerformanceControlManager } from '@plantasonic/platform';

const performance = createPerformanceControlManager({ eventBus: app.eventBus });
await performance.init();
await performance.start();
await performance.requestMIDIAccess(); // user gesture
performance.enablePerformanceMode(true);
performance.setContext({ sound, visual, bridge, presetBundles, onTransportPlay, onTransportStop });
```

**Methods:** `init`, `start`, `stop`, `dispose`, `requestMIDIAccess`, `enablePerformanceMode`, `updateMappings`, `startLearnMode`, `stopLearnMode`, `getStatus`, `setContext`

**Events emitted:** `performance:init`, `performance:midi-connected`, `performance:midi-disconnected`, `performance:note-on`, `performance:note-off`, `performance:control-change`, `performance:mapping-change`, `performance:error`

---

### createPresetBundleRegistry(options)

Unified preset bundle registry coordinating sound, visual, bridge, workspace, and UI through adapters.

```typescript
import { createPresetBundleRegistry } from '@plantasonic/platform';

const registry = createPresetBundleRegistry({ eventBus: app.eventBus });

registry.registerBundle({ id: 'seed', name: 'Seed', sound: { presetId: 'seed' }, ... });
registry.setContext({ sound, visual, bridge, workspace: app.workspace });
await registry.applyBundle('seed');

registry.exportBundle('seed');
registry.importBundle(json);
```

**Methods:** `registerBundle`, `unregisterBundle`, `getBundle`, `getBundles`, `getBundlesByCategory`, `getBundlesByTag`, `applyBundle`, `exportBundle`, `importBundle`, `getActiveBundleId`, `setContext`

**Events emitted:** `preset:register`, `preset:unregister`, `preset:apply`, `preset:export`, `preset:import`, `preset:error`

---

### createPluginManager(options)

Platform plugin registration and lifecycle management.

```typescript
import { createPluginManager } from '@plantasonic/platform';
import type { PlatformPlugin } from '@plantasonic/platform-types';

const manager = createPluginManager({ eventBus: app.eventBus, source: 'my-app' });
manager.setServices({ eventBus, lifecycle, presets, workspace, presetBundles, sound, visual, bridge, performance });

const result = await manager.registerPlugin(plugin);
manager.validatePlugin(plugin);
manager.getPluginStatus('demo.seed-preset');
manager.getPluginsByCapability('preset-bundles');
await manager.enablePlugin('demo.seed-preset');
await manager.disablePlugin('demo.seed-preset');
await manager.unregisterPlugin('demo.seed-preset');
```

**Methods:** `registerPlugin`, `unregisterPlugin`, `getPlugin`, `getPlugins`, `getPluginsByCapability`, `enablePlugin`, `disablePlugin`, `validatePlugin`, `getPluginStatus`, `getAllPluginStatuses`, `setServices`

**Events emitted:** `plugin:register`, `plugin:unregister`, `plugin:enable`, `plugin:disable`, `plugin:error`, `plugin:capability-register`

**Errors:** `PluginValidationError` when services not configured before register

---

### createWorkspacePersistence(options)

Save, load, export, import, and reset full project state.

```typescript
import {
  createWorkspacePersistence,
  captureProjectState,
  applyProjectState,
  serializeProject,
  deserializeProject,
} from '@plantasonic/platform';

const persistence = createWorkspacePersistence({
  eventBus: app.eventBus,
  storageKey: 'plantasonic-demo-project',
  context: { applicationId: app.id, presetBundles, sound, visual, bridge, performance, pluginManager, workspace: app.workspace },
});

await persistence.saveProject();
await persistence.loadProject();
persistence.exportProject();
await persistence.importProject(json);
await persistence.resetProject();
persistence.getCurrentState();
```

**Methods:** `getCurrentState`, `saveProject`, `loadProject`, `exportProject`, `importProject`, `resetProject`, `setContext`

**Helpers:** `captureProjectState`, `applyProjectState`, `serializeProject`, `deserializeProject`, `validateProjectState`, `validateSerializedProject`, `createDefaultProjectState`

**Storage adapters:** `createLocalStorageAdapter()`, `createMemoryStorageAdapter()`

**Events emitted:** `project:save`, `project:load`, `project:export`, `project:import`, `project:reset`, `project:error`

**Constants:** `PROJECT_STATE_VERSION` (`1.0.0`)

---

### mountInstrumentApp(container, content)

Parameterized instrument mount for thin platform consumer applications. Exported from `@plantasonic/platform-demo/instrument-app`.

```typescript
import { mountInstrumentApp, type InstrumentAppContent } from '@plantasonic/platform-demo/instrument-app';

const content: InstrumentAppContent = {
  application: { id: 'plantasonic', name: 'Plantasonic' },
  shell: { id: 'plantasonic', title: 'Plantasonic', variant: 'instrument', theme: 'dark' },
  presetBundles: [/* PresetBundle[] */],
  plugins: [/* PlatformPlugin[] */],
  branding: { eventSource: 'plantasonic', presetBrowserLabel: 'Presets' },
};

await mountInstrumentApp(container, content);
```

Wires: sound/visual adapters, bridge, preset registry, performance, plugins, project persistence, Design System instrument shell.

See [docs/PLANTASONIC_APP_MIGRATION.md](./docs/PLANTASONIC_APP_MIGRATION.md).

---

### create-plantasonic-app (CLI)

Scaffold a thin platform consumer application.

```bash
pnpm create:app my-instrument
# or
node packages/create-plantasonic-app/bin/create-plantasonic-app.mjs my-instrument --name "My Instrument" --port 5175
```

**Options:** `--name`, `--port`, `--output`, `--force`

**Output:** `apps/<slug>/` with config, content, styles, validation script

**Generated stack:** instrument shell, adapters, bridge, preset registry, performance, plugins, persistence via `mountInstrumentApp()`

See [docs/PROTOTYPE_GENERATOR.md](./docs/PROTOTYPE_GENERATOR.md).

---

## createPresetRegistry(options)

Creates a preset registry.

```typescript
import { createPresetRegistry } from '@plantasonic/platform';

const presets = createPresetRegistry({ eventBus });

presets.registerBundle({
  id: 'defaults',
  name: 'Default Presets',
  presets: [{ id: 'p1', name: 'Preset 1', data: {} }],
});

presets.getPreset('p1');
presets.listPresets();
presets.applyPreset('p1'); // emits preset.applied
```

---

## @plantasonic/platform-types

### Application Types

```typescript
type LifecycleStatus =
  | 'idle' | 'initializing' | 'ready' | 'running'
  | 'paused' | 'stopping' | 'stopped' | 'error';

interface ApplicationConfig {
  id: string;
  name: string;
  description?: string;
  workspace?: WorkspaceConfig;
  initialStatus?: LifecycleStatus;
}

interface ApplicationInstance {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly status: LifecycleStatus;
  readonly createdAt: number;
}
```

### Event Types

```typescript
interface PlatformEvent<TPayload = unknown> {
  type: string;
  timestamp: string;
  source: string;
  payload?: TPayload;
}

interface PlatformEventBus {
  emit<TPayload>(event: PlatformEvent<TPayload>): void;
  on<TPayload>(typePrefix: string, handler: PlatformEventHandler<TPayload>): PlatformEventSubscription;
  clear(): void;
}
```

### Engine Adapter Types

```typescript
interface EngineAdapter {
  readonly id: string;
  readonly engineName: string;
  readonly isReady: boolean;
  initialize(): Promise<void>;
  dispose(): Promise<void>;
}

interface SoundEngineStatus {
  initialized: boolean;
  audioReady: boolean;
  playing: boolean;
  engineState: string;
  currentSpecies: string | null;
  currentPresetId: string | null;
  level: number;
  lastError: string | null;
}

interface SoundEngineAdapter extends EngineAdapter {
  readonly id: 'sound';
  init(): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  playPreset(preset: Preset | string): Promise<void>;
  updateParameter(name: string, value: number): Promise<void>;
  getStatus(): SoundEngineStatus;
  getAudioFeatures(): AudioFeaturesSnapshot;
  dispose(): Promise<void>;
}

type AudioBand = 'bass' | 'mids' | 'highs';
type AudioFeature = AudioBand | 'amplitude' | 'transient';
type VisualTarget = 'density' | 'motion' | 'brightness' | 'scale' | 'glitch';
type MappingAmount = number;

interface AudioFeaturesSnapshot {
  amplitude: number;
  bass: number;
  mids: number;
  highs: number;
  transient: number;
  timestamp: number;
}

interface AudioReactiveMapping {
  feature: AudioFeature;
  target: VisualTarget;
  amount: MappingAmount;
  enabled?: boolean;
}

interface AudioReactiveBridge {
  init(): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  connect(sound: SoundEngineAdapter, visual: VisualEngineAdapter): void;
  disconnect(): void;
  updateMapping(config: Partial<AudioReactiveBridgeConfig>): void;
  getStatus(): AudioReactiveBridgeStatus;
  dispose(): Promise<void>;
}

interface VisualEngineAdapter extends EngineAdapter {
  readonly id: 'visual';
  render?(): void;
  resize?(width: number, height: number): void;
}
```

### Preset Types

```typescript
interface Preset {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  data: Record<string, unknown>;
}

interface PresetCollection {
  id: string;
  name: string;
  presets: Preset[];
}

interface PresetBundle {
  id: string;
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  sound?: { presetId: string };
  visual?: { presetId: string };
  audioReactive?: AudioReactivePreset;
  workspace?: WorkspacePreset;
  ui?: UIPresetState;
}

interface PresetBundleRegistry {
  registerBundle(bundle: PresetBundle): void;
  unregisterBundle(id: string): void;
  getBundle(id: string): PresetBundle | undefined;
  getBundles(): PresetBundle[];
  applyBundle(id: string): Promise<PresetBundleApplyResult>;
  exportBundle(id: string): string;
  importBundle(json: string): PresetBundle;
  getActiveBundleId(): string | null;
}

interface PresetRegistry {
  registerBundle(collection: PresetCollection): void;
  getPreset(id: string): Preset | undefined;
  listPresets(): Preset[];
  applyPreset(id: string): void;
}
```

### Workspace Types

```typescript
type WorkspaceRegionId =
  | 'stage' | 'transport' | 'inspector'
  | 'preset-browser' | 'status';

interface WorkspaceRegion {
  id: WorkspaceRegionId;
  label: string;
  element?: HTMLElement;
}

interface Workspace {
  readonly config: WorkspaceConfig;
  bindRegion(id: WorkspaceRegionId, element: HTMLElement): void;
  getRegion(id: WorkspaceRegionId): WorkspaceRegion | undefined;
  listRegions(): WorkspaceRegion[];
}
```

### Plugin Types

```typescript
type PluginCapability =
  | 'commands' | 'panels' | 'preset-bundles'
  | 'sound-adapter' | 'visual-adapter'
  | 'performance-mappings' | 'audio-reactive-mappings'
  | 'workspace-regions' | 'documentation';

interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description?: string;
  capabilities: PluginCapability[];
  dependencies?: PluginDependency[];
  documentation?: PluginDocumentation;
  defaultEnabled?: boolean;
}

interface PluginDependency {
  pluginId: string;
  optional?: boolean;
}

interface PluginContext {
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
  declareSoundAdapter(declaration: PluginAdapterDeclaration): void;
  declareVisualAdapter(declaration: PluginAdapterDeclaration): void;
}

interface PlatformPlugin {
  manifest: PluginManifest;
  register(context: PluginContext): void | Promise<void>;
  unregister?(context: PluginContext): void | Promise<void>;
  enable?(context: PluginContext): void | Promise<void>;
  disable?(context: PluginContext): void | Promise<void>;
}

interface PluginStatus {
  pluginId: string;
  name: string;
  version: string;
  enabled: boolean;
  registered: boolean;
  capabilities: PluginCapability[];
  warnings: string[];
  lastError: string | null;
  contributionCounts: Record<string, number>;
}

interface PluginRegistrationResult {
  pluginId: string;
  registered: boolean;
  warnings: string[];
  error?: string;
}

interface PluginManager {
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
```

### Project State Types

```typescript
interface SoundState {
  presetId: string | null;
  parameters: Record<string, number>;
}

interface VisualState {
  presetId: string | null;
  parameters: Record<string, number>;
}

interface EngineState {
  sound: SoundState;
  visual: VisualState;
}

interface BridgeState {
  enabled: boolean;
  sensitivity: number;
  smoothing: number;
  mappings: AudioReactiveMapping[];
}

interface WorkspaceState {
  regions?: Partial<Record<WorkspaceRegionId, { visible?: boolean; label?: string }>>;
  activeInspectorPanel?: string;
}

interface PluginState {
  pluginId: string;
  enabled: boolean;
}

interface PerformanceState {
  performanceModeEnabled: boolean;
  mappings: ControlMapping[];
}

interface UIState {
  activeInspectorPanel?: string;
  inspectorPanels?: Partial<Record<string, { collapsed?: boolean }>>;
  performanceModeEnabled?: boolean;
  audioReactiveEnabled?: boolean;
  tempo?: number;
  soundParameters?: Record<string, number>;
  visualParameters?: Record<string, number>;
  bridgeMappingAmounts?: Partial<Record<string, number>>;
  bridgeSensitivity?: number;
  bridgeSmoothing?: number;
}

interface ProjectState {
  version: string;
  applicationId?: string;
  activePresetBundleId?: string | null;
  sound: SoundState;
  visual: VisualState;
  bridge: BridgeState;
  workspace: WorkspaceState;
  plugins: PluginState[];
  performance: PerformanceState;
  ui: UIState;
}

interface SerializedProject {
  format: 'plantasonic-project';
  version: string;
  savedAt: string;
  state: ProjectState;
}

interface ProjectStorageAdapter {
  read(key: string): string | null;
  write(key: string, value: string): void;
  remove(key: string): void;
}

interface WorkspacePersistence {
  getCurrentState(): ProjectState;
  saveProject(): Promise<ProjectApplyResult>;
  loadProject(): Promise<ProjectApplyResult>;
  exportProject(): string;
  importProject(json: string): Promise<ProjectApplyResult>;
  resetProject(): Promise<ProjectApplyResult>;
}
```
