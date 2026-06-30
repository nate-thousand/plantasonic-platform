# Integration Guide

How to integrate external Plantasonic packages with the platform.

## Overview

The platform uses an **adapter pattern** to wrap external packages. The SDK never imports engine or Design System code directly — applications compose packages together through platform services.

## Integrating the Design System

**Status: Integrated in demo (Milestone 4 complete; Creative Workspace layer)**

The Design System owns all UI layout and chrome. The platform owns the workspace region contract. Applications import both packages and wire them together via `@plantasonic/platform-demo`.

### What the demo consumes

| Design System API | Export path |
|-------------------|-------------|
| Token CSS variables | `plantasonic-design-system/css/variables.css` |
| Bootstrap theme + instrument + creative workspace SCSS | `plantasonic-design-system/scss/*` |
| Application shell | `plantasonic-design-system/shell` |
| Instrument regions, transport, inspector, metrics | `plantasonic-design-system/instrument` |
| **Creative Workspace layouts** | `plantasonic-design-system/creative-workspace` |

The demo renders an **instrument Creative Workspace** (stage-first, floating overlays) inside `renderApplicationShell({ variant: 'instrument' })` — not a custom grid or dashboard layout.

### Integration pattern (from `@plantasonic/platform-demo`)

```typescript
import { mountInstrumentApp } from '@plantasonic/platform-demo/instrument-app';

// Thin apps supply content only; orchestration uses Creative Workspace:
await mountInstrumentApp(container, {
  application: appConfig,
  shell: shellConfig,
  presetBundles,
  plugins,
  branding,
});
```

Under the hood, `mountInstrumentApp()` composes:

```typescript
import { renderCreativeWorkspace, bindCreativeWorkspace } from 'plantasonic-design-system/creative-workspace';
import { renderApplicationShell, bindApplicationShell } from 'plantasonic-design-system/shell';
import { renderCanvasMount, renderTransport, createInspector, createMetrics } from 'plantasonic-design-system/instrument';

const workspaceHtml = renderCreativeWorkspace({
  preset: 'instrument',
  stage: renderCanvasMount('ps-stage-canvas'),
  transport: renderTransport({ /* ... */ }),
  inspector: inspector.render(),
  presetBrowser: renderPresetBrowserContent(bundles),
  statusHud: metrics.renderStatusBar(),
  commandPalette: false, // shell renders ⌘K palette
});

container.innerHTML = renderApplicationShell(
  { variant: 'instrument', instrument: { transport: false } },
  workspaceHtml,
);
bindApplicationShell(config);
bindCreativeWorkspace(container.querySelector('.ps-creative-workspace'));

// Bind platform regions to Creative Workspace floating surfaces
app.workspace.bindRegion('stage', container.querySelector('[data-ps-region="stage"]')!);
app.workspace.bindRegion('transport', container.querySelector('[data-ps-cw-surface="transport"]')!);
app.workspace.bindRegion('inspector', container.querySelector('[data-ps-cw-surface="inspector"]')!);
app.workspace.bindRegion('preset-browser', container.querySelector('[data-ps-cw-surface="browser"]')!);
app.workspace.bindRegion('status', container.querySelector('[data-ps-cw-surface="hud"]')!);
```

### Steps for new applications

1. Add `plantasonic-design-system` as an **application** dependency (not a platform SDK dependency)
2. Import token CSS, `scss/instrument.scss`, and `scss/creative-workspace.scss`
3. Use `mountInstrumentApp()` or compose `renderCreativeWorkspace()` + `renderApplicationShell()`
4. Bind platform workspace regions to `[data-ps-cw-surface]` landmarks (or `[data-ps-region="stage"]` for the stage)
5. Call `bindCreativeWorkspace()` for floating panel drag/snap behavior
6. Wire Design System transport and controls to platform lifecycle and event bus

### Rules

- Design System components must not import Sound Engine or Visual Engine
- UI actions flow: User → Design System → platform eventBus → engines
- The platform provides region binding; the Design System provides layout and UI
- Do not copy Design System source or recreate tokens or workspace layout locally

## Integrating the Sound Engine

**Status: Integrated in demo (Milestone 5 complete)**

The Sound Engine is wrapped by `createSoundEngineAdapter()` from `@plantasonic/platform`.

### Adapter usage

```typescript
import { createApplication, createSoundEngineAdapter } from '@plantasonic/platform';

const app = createApplication(config);
const sound = createSoundEngineAdapter({ eventBus: app.eventBus });

await sound.init(); // creates engine — no audio unlock

// On user gesture (transport Play):
await sound.start();

// Preset selection:
await sound.playPreset('seed');

// Parameter control:
await sound.updateParameter('growth', 0.7);
await sound.updateParameter('tempo', 90);

// Status:
sound.getStatus(); // { initialized, audioReady, playing, engineState, ... }

await sound.stop();
await sound.dispose();
```

### Platform events

| Event | When |
|-------|------|
| `sound:init` | Engine instance created |
| `sound:start` | Playback started |
| `sound:stop` | Playback stopped |
| `sound:preset-change` | Preset loaded |
| `sound:parameter-change` | Parameter updated |
| `sound:error` | Operation failed |

Subscribe via prefix: `app.eventBus.on('sound', handler)`.

### API mapping (adapter → plantasia-sound-engine)

| Adapter method | Engine API | Notes |
|----------------|------------|-------|
| `init()` | `createPlantasiaEngine()` | Does not unlock audio context |
| `start()` | `initialize()` + `loadDefaultSpecies()` + `start()` | Requires user gesture for first `initialize()` |
| `stop()` | `allNotesOff()` + `stopSpecies()` | Does not dispose engine |
| `playPreset()` | `loadPreset(presetId)` | Unlocks audio if needed |
| `updateParameter('growth', v)` | `setControl('growth', v)` | Ecological controls: 0–1 |
| `updateParameter('tempo', v)` | `setTempo(v)` | BPM 20–300 |
| `dispose()` | `dispose()` | Full teardown |

### Known limitations

- No MIDI integration yet
- No audio analysis events forwarded to platform bus (required for visual reactivity)
- `EngineAdapter.initialize()` delegates to `init()` — audio unlock still only on `start()` / `playPreset()`
- Parameter updates require engine instance; species must be loaded (via start or preset)
- Engine v1 `playPreset(PlantasiaPreset)` and v2 `loadPreset(id)` both exist — adapter uses v2 `loadPreset()`

### Browser audio safety

- `init()` does not unlock the Web Audio context
- `start()` and `playPreset()` call `engine.initialize()` on first use (user gesture)
- Errors are caught, emitted as `sound:error`, and displayed in the demo status region

### Rules

- Sound Engine must not import Visual Engine or Design System
- All cross-engine communication goes through the platform event bus
- Applications wire Design System transport to the adapter — the adapter does not import UI

## Integrating the Visual Engine

**Status: Integrated in demo (Milestone 6 complete)**

The Visual Engine is wrapped by `createVisualEngineAdapter()` from `@plantasonic/platform`.

> **Package naming:** npm package is `ascii-visual-engine`; ecosystem docs call it plantasia-visual-engine.

### Adapter usage

```typescript
import { createApplication, createVisualEngineAdapter } from '@plantasonic/platform';

const app = createApplication(config);
const visual = createVisualEngineAdapter({ eventBus: app.eventBus });

await visual.init();

const stageMount = document.querySelector('[data-ps-canvas-mount]')!;
await visual.mount({ element: stageMount });

// On user gesture (transport Play):
await visual.start();

// Preset (often paired with sound.playPreset):
await visual.setPreset('seed'); // maps to visual preset id

// Parameters:
await visual.updateParameter('density', 0.8);

// Resize:
visual.resize(width, height);

visual.getStatus();
await visual.stop();
await visual.dispose();
```

### Platform events

| Event | When |
|-------|------|
| `visual:init` | Adapter prepared |
| `visual:mount` | Canvas mounted in stage |
| `visual:start` | Render loop started |
| `visual:stop` | Render loop stopped |
| `visual:preset-change` | Visual preset applied |
| `visual:parameter-change` | Control updated |
| `visual:resize` | Dimensions changed |
| `visual:error` | Operation failed |

### API mapping (adapter → ascii-visual-engine)

| Adapter method | Engine API | Notes |
|----------------|------------|-------|
| `mount()` | `new AsciiEngine({ autoStart: false })` | Canvas appended to mount element |
| `start()` | `engine.start()` | Starts RAF render loop |
| `stop()` | `engine.inputPanic()` + `engine.stop()` | Stops render loop |
| `setPreset(id)` | `engine.setPresetById(mappedId)` | Maps sound preset ids via `SOUND_TO_VISUAL_PRESET` |
| `updateParameter(name, v)` | `engine.setControl(name, v)` | Normalized 0–1 |
| `resize(w, h)` | `engine.resize(w, h)` | Called on container resize |
| `dispose()` | `engine.destroy()` + DOM cleanup | Full teardown |

### Known limitations

- No audio-reactive bridge yet — visuals do not respond to sound analysis
- Sound and visual preset ids differ — adapter maps common sound ids to visual presets; unknown ids fall back to `basic`
- No MIDI integration
- Visual engine keyboard input disabled in demo (`disableKeyboardInput()`)
- Engines are workspace packages — `workspace:*` links to `packages/sound-engine` and `packages/visual-engine`

### Resize handling

Demo uses `ResizeObserver` on `[data-ps-region="stage"]` plus window `resize` events to call `visual.resize()`.

### Rules

- Visual Engine must not import Sound Engine or Design System
- Platform adapter does not import UI — demo mounts canvas into Design System stage slot
- Cross-engine preset sync goes through application code + platform event bus

## Audio Reactive Bridge

**Status: Integrated in demo (Milestone 7 complete)**

The bridge connects Sound and Visual adapters without direct engine coupling.

### Usage

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

await sound.init();
await visual.init();
await visual.mount({ element: stageMount });
await bridge.init();
bridge.connect(sound, visual);

// On transport Play (after sound.start() + visual.start()):
await bridge.start();

bridge.updateMapping({
  enabled: true,
  sensitivity: 0.75,
  smoothing: 0.65,
});

await bridge.stop();
await bridge.dispose();
```

### Default mappings

| Audio feature | Visual target | Engine control |
|---------------|---------------|----------------|
| bass | density | `density` |
| mids | motion | `speed` |
| highs | brightness | `strength` |
| amplitude | scale | `sourceContrast` |
| transient | glitch | `glitchAmount` |

### Platform events

| Event | When |
|-------|------|
| `bridge:init` | Bridge prepared |
| `bridge:connect` | Adapters wired |
| `bridge:start` | Analysis loop started |
| `bridge:stop` | Loop stopped |
| `bridge:disconnect` | Adapters unwired |
| `bridge:mapping-change` | Config updated |
| `bridge:error` | Operation failed |

### Analysis source (placeholder)

The Sound Engine exposes `getLevel()` and `getWaveform()` but not native FFT bands. The platform SDK includes `placeholderAudioAnalyzer.ts` which derives bass/mids/highs/transient inside the sound adapter's `getAudioFeatures()` method. Replace when the Sound Engine ships band analysis.

### Engine boundary rules

- Sound Engine does not import Visual Engine
- Visual Engine does not import Sound Engine
- Bridge lives in `@plantasonic/platform` only
- Bridge reads `sound.getAudioFeatures()` and writes via `visual.updateParameter()`
- Bridge stops when either engine emits `sound:stop` or `visual:stop`

### Known limitations

- Placeholder band analysis (not true FFT)
- Manual visual sliders and bridge both write parameters — bridge uses base offsets
- No MIDI
- No preset-driven reactive profiles yet

## Preset Bundle Framework

**Status: Integrated in demo (Milestone 8 complete)**

Unified bundles coordinate sound, visual, bridge, workspace, and UI state through adapters.

### Usage

```typescript
import {
  createPresetBundleRegistry,
  createSoundEngineAdapter,
  createVisualEngineAdapter,
  createAudioReactiveBridge,
} from '@plantasonic/platform';

const registry = createPresetBundleRegistry({ eventBus: app.eventBus });

registry.registerBundle({
  id: 'seed',
  name: 'Seed',
  description: 'Gentle organic sprout',
  category: 'flora',
  tags: ['organic', 'starter'],
  sound: { presetId: 'seed' },
  visual: { presetId: 'seed' },
  audioReactive: { enabled: true, sensitivity: 0.6 },
  workspace: { activeInspectorPanel: 'sound-parameters' },
  ui: { tempo: 68, audioReactiveEnabled: true },
});

registry.setContext({ sound, visual, bridge, workspace: app.workspace });
await registry.applyBundle('seed');
```

### Bundle schema

| Field | Type | Purpose |
|-------|------|---------|
| `id`, `name` | `string` | Required identifiers |
| `description`, `category`, `tags` | optional | Browser metadata |
| `sound` | `SoundPresetRef` | Sound engine preset id |
| `visual` | `VisualPresetRef` | Visual engine preset id |
| `audioReactive` | `AudioReactivePreset` | Bridge mappings and settings |
| `workspace` | `WorkspacePreset` | Region visibility, inspector panel |
| `ui` | `UIPresetState` | Slider values, bridge toggle |

### Platform events

| Event | When |
|-------|------|
| `preset:register` | Bundle registered |
| `preset:unregister` | Bundle removed |
| `preset:apply` | Bundle applied (includes warnings) |
| `preset:export` | Bundle exported to JSON |
| `preset:import` | Bundle imported from JSON |
| `preset:error` | Validation or apply failure |

### Validation behavior

- Missing sound/visual preset refs → **warn**, skip that section, continue
- Missing bridge mapping → fall back to defaults
- Invalid bundle JSON or missing id/name → **reject** with `PresetBundleValidationError`

### Engine boundary rules

- Registry calls adapters only — engines never import each other
- Workspace/UI application uses demo-provided handlers (placeholder serialization)

**Next step:** Workspace Persistence and Project State.

## Performance Controls

**Status: Integrated in demo (Milestone 9 complete)**

Platform layer routes Web MIDI and keyboard input to adapters — engines are not modified.

### Usage

```typescript
import { createPerformanceControlManager } from '@plantasonic/platform';

const performance = createPerformanceControlManager({ eventBus: app.eventBus });
await performance.init();
await performance.start();

// User gesture required:
await performance.requestMIDIAccess();
performance.enablePerformanceMode(true);

performance.setContext({ sound, visual, bridge, presetBundles, onTransportPlay, onTransportStop });
```

### Default demo mappings

| Input | Action |
|-------|--------|
| Keys A–G | Sound notes C4–G4 + visual glitch bump |
| Keys 1–5 | Preset bundles Seed–Mutation |
| Space | Transport toggle |
| Escape | Transport stop |
| MIDI CC 1 | Sound `growth` |
| MIDI CC 2 | Visual `density` |
| MIDI CC 3 | Bridge bass mapping amount |
| MIDI pads 36–40 | Preset bundles |

### Platform events

`performance:init`, `performance:midi-connected`, `performance:midi-disconnected`, `performance:note-on`, `performance:note-off`, `performance:control-change`, `performance:mapping-change`, `performance:error`

### Browser limitations

- Web MIDI requires Chrome/Edge and HTTPS or localhost
- `requestMIDIAccess()` must run from a user click
- Unsupported browsers fall back to keyboard only

### MIDI boundary rules

- Platform parses MIDI — Sound Engine is not modified
- Notes routed via `sound.noteOn()` / `sound.noteOff()` adapter wrappers
- No direct MIDI import into engine packages

## Plugin Framework

**Status: Integrated in demo (Milestone 10 complete)**

Platform-level plugin system so engines, panels, presets, controls, mappings, and workflows register without changing platform core.

### Usage

```typescript
import { createPluginManager } from '@plantasonic/platform';
import type { PlatformPlugin } from '@plantasonic/platform-types';

const manager = createPluginManager({ eventBus: app.eventBus });
manager.setServices({
  eventBus: app.eventBus,
  lifecycle: app.lifecycle,
  presets: app.presets,
  workspace: app.workspace,
  presetBundles: bundleRegistry,
  sound,
  visual,
  bridge,
  performance,
});

const myPlugin: PlatformPlugin = {
  manifest: {
    id: 'my.plugin',
    name: 'My Plugin',
    version: '0.1.0',
    capabilities: ['preset-bundles', 'documentation'],
    defaultEnabled: true,
  },
  register(context) {
    context.registerPresetBundle({ id: 'custom', name: 'Custom', sound: { presetId: 'seed' } });
  },
};

await manager.registerPlugin(myPlugin);
await manager.enablePlugin('my.plugin');
```

### Plugin manifest schema

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `id` | `string` | yes | Unique plugin identifier |
| `name` | `string` | yes | Display name |
| `version` | `string` | yes | Semver string |
| `description` | `string` | no | Summary text |
| `capabilities` | `PluginCapability[]` | yes | Declared contribution types |
| `dependencies` | `PluginDependency[]` | no | Other plugin IDs (`optional` flag) |
| `documentation` | `PluginDocumentation` | no | Summary, URL, tags |
| `defaultEnabled` | `boolean` | no | Auto-enable after register (default `true`) |

### Capabilities

| Capability | Registration API | Applied when enabled |
|------------|------------------|----------------------|
| `commands` | `registerCommand()` | Metadata only (first pass) |
| `panels` | `registerPanel()` | Metadata only (first pass) |
| `preset-bundles` | `registerPresetBundle()` | `presetBundles.registerBundle()` |
| `sound-adapter` | `declareSoundAdapter()` | Metadata only |
| `visual-adapter` | `declareVisualAdapter()` | Metadata only |
| `performance-mappings` | `registerPerformanceMapping()` | `performance.updateMappings()` |
| `audio-reactive-mappings` | `registerAudioReactiveMapping()` | `bridge.updateMapping()` |
| `workspace-regions` | `registerWorkspaceRegion()` | Metadata only (first pass) |
| `documentation` | `registerDocumentation()` | Metadata only |

### Platform events

| Event | When |
|-------|------|
| `plugin:register` | Plugin registered successfully |
| `plugin:unregister` | Plugin removed |
| `plugin:enable` | Contributions applied |
| `plugin:disable` | Contributions removed |
| `plugin:error` | Validation or lifecycle failure |
| `plugin:capability-register` | Individual contribution recorded |

### Validation behavior

- Missing or invalid manifest → **reject** with clear error
- Duplicate plugin ID → **reject**
- Missing required dependency → **warn**, registration continues
- Unsupported capability in manifest → **warn**
- Plugin `register()` throw → **reject**, record removed, `plugin:error` emitted, app continues

### Boundary rules

- Plugins live in applications or separate packages — not inside `@plantasonic/platform` core
- Plugins must not import Sound Engine, Visual Engine, or Design System internals
- Adapter declarations are metadata placeholders; runtime adapters are wired by the application
- Platform core is unchanged when adding new plugins

### Demo plugins

| Plugin ID | Purpose |
|-----------|---------|
| `demo.seed-preset` | Contributes Seed unified preset bundle |
| `demo.ascii-visual` | Declares visual adapter + panel placeholder |
| `demo.plantasia-sound` | Declares sound adapter + command placeholder |
| `demo.performance-mapping` | Adds MIDI CC 74 → trails + supplemental reactive mapping |

### Known limitations

- Plugin panels and commands are not rendered into the Design System shell yet
- No plugin sandbox or isolated execution context
- No dynamic plugin loading from URL/npm at runtime
- Workspace region contributions are recorded but not bound to DOM

## Prototype Generator

**Status: Complete (Milestone 12)**

```bash
pnpm create:app my-instrument --name "My Instrument"
pnpm install
pnpm --filter @plantasonic/my-instrument dev
```

See [PROTOTYPE_GENERATOR.md](./PROTOTYPE_GENERATOR.md).

## Workspace Persistence

**Status: Integrated in demo (Milestone 11 complete)**

Save, restore, export, and import full demo session state through platform managers.

### Usage

```typescript
import { createWorkspacePersistence, createLocalStorageAdapter } from '@plantasonic/platform';

const persistence = createWorkspacePersistence({
  eventBus: app.eventBus,
  storageKey: 'my-app-project',
  storage: createLocalStorageAdapter(),
  context: {
    applicationId: app.id,
    presetBundles: bundleRegistry,
    sound,
    visual,
    bridge,
    performance,
    pluginManager,
    workspace: app.workspace,
    collectUIState: () => ({ /* inspector panel state */ }),
    applyUIState: async (ui) => { /* sync controls via adapters */ },
  },
});

await persistence.saveProject();
await persistence.loadProject();
const json = persistence.exportProject();
await persistence.importProject(json);
await persistence.resetProject();
persistence.getCurrentState();
```

### Project state schema

| Section | Fields |
|---------|--------|
| `version` | Schema version (`1.0.0`) |
| `activePresetBundleId` | Active unified preset bundle |
| `sound` | `presetId`, `parameters` |
| `visual` | `presetId`, `parameters` |
| `bridge` | `enabled`, `sensitivity`, `smoothing`, `mappings` |
| `workspace` | Region visibility/labels, `activeInspectorPanel` |
| `plugins` | `{ pluginId, enabled }[]` |
| `performance` | `performanceModeEnabled`, `mappings` |
| `ui` | Inspector collapse state, control values, bridge toggle |

### Export envelope

```json
{
  "format": "plantasonic-project",
  "version": "1.0.0",
  "savedAt": "2026-06-29T12:00:00.000Z",
  "state": { /* ProjectState */ }
}
```

### Platform events

| Event | When |
|-------|------|
| `project:save` | Saved to storage |
| `project:load` | Loaded from storage |
| `project:export` | JSON exported |
| `project:import` | JSON imported and applied |
| `project:reset` | Storage cleared, defaults applied |
| `project:error` | Validation or persistence failure |

### Validation behavior

- Invalid JSON or wrong format → **reject** with clear error
- Version mismatch → **warn**, attempt apply
- Missing plugin or preset bundle → **warn**, skip that section
- Corrupted localStorage → **clear storage**, fail safely

### Known limitations

- localStorage only (adapter replaceable for IndexedDB, file system, etc.)
- No autosave — manual Save button
- Shell window chrome (`persistState`) separate from platform project state
- MIDI device connection not persisted (requires user gesture on reload)

## Plantasonic app migration

**Status: First-pass reference scaffold (Milestone 13)**

The production Plantasonic app should become a thin consumer of `@plantasonic/platform`. A reference implementation lives at `apps/plantasonic-reference/`.

### Reference app pattern

```typescript
import { mountInstrumentApp } from '@plantasonic/platform-demo/instrument-app';
import { plantasonicAppContent } from './plantasonicAppContent.js';

await mountInstrumentApp(container, plantasonicAppContent);
```

`InstrumentAppContent` injects:

| Field | App-owned |
|-------|-----------|
| `application` | `ApplicationConfig` |
| `shell` | Design System shell config (no local theme) |
| `presetBundles` | `PresetBundle[]` creative content |
| `browserSeedBundles` | Optional seed bundles for browser |
| `plugins` | App plugin manifests |
| `branding` | Event source, labels, default tempo |

### Migration checklist (production repo)

Remove: local shell, tokens, Bootstrap theme, duplicated controls, direct engine wiring, local MIDI, local persistence.

Keep: preset content, branding, app config, creative mapping configuration.

Full guide: [PLANTASONIC_APP_MIGRATION.md](./PLANTASONIC_APP_MIGRATION.md)

### Validation

```bash
pnpm validate:reference
pnpm --filter @plantasonic/plantasonic-reference build
```

## Event Bus Conventions

Use dot-namespaced event types:

| Prefix | Examples |
|--------|----------|
| `application.*` | `application.created` |
| `lifecycle.*` | `lifecycle.ready`, `lifecycle.transition` |
| `preset:*` | `preset:apply`, `preset:register`, `preset:import`, `preset:error` |
| `sound:*` | `sound:start`, `sound:preset-change`, `sound:error` |
| `visual:*` | `visual:mount`, `visual:start`, `visual:resize`, `visual:error` |
| `bridge:*` | `bridge:start`, `bridge:mapping-change`, `bridge:error` |
| `performance:*` | `performance:note-on`, `performance:control-change`, `performance:midi-connected` |
| `plugin:*` | `plugin:register`, `plugin:enable`, `plugin:disable`, `plugin:error`, `plugin:capability-register` |
| `project:*` | `project:save`, `project:load`, `project:export`, `project:import`, `project:reset`, `project:error` |
| `midi.*` | `midi.noteOn`, `midi.controlChange` (future) |

Subscribe using prefix matching:

```typescript
app.eventBus.on('preset', (event) => {
  if (event.type === 'preset.applied') {
    // Handle preset application
  }
});
```

## Preset Integration

Presets are opaque data routed by the platform:

```typescript
app.presets.registerBundle({
  id: 'default',
  name: 'Default Presets',
  presets: [
    {
      id: 'ambient-01',
      name: 'Ambient 01',
      data: {
        sound: { /* engine-specific */ },
        visual: { /* engine-specific */ },
      },
    },
  ],
});

app.presets.applyPreset('ambient-01');
// Emits preset.applied — adapters subscribe and apply their section
```

Each engine adapter reads only its section of `preset.data`.

## Checklist for New Integrations

- [ ] Adapter implements the platform interface (`EngineAdapter` or extension)
- [ ] No direct imports between engines or Design System
- [ ] Communication uses the platform event bus
- [ ] Lifecycle init/dispose coordinated by platform
- [ ] Preset data is engine-specific and opaque to the platform
- [ ] Workspace regions used for layout, not hardcoded DOM
