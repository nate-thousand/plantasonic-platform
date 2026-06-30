# Architecture

This document describes the architecture of `plantasonic-platform` and how it fits into the Plantasonic ecosystem.

## Ecosystem Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Plantasonic Platform                     │
│             application-agnostic reusable foundation         │
└──────────────────────────┬──────────────────────────────────┘
                           │ provides
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     Reusable Packages                       │
│  SDK · Design System · Theme System · templates · docs      │
│  Audio Engine · ASCII Engine · Visual Engine · MIDI         │
└──────┬──────────────────┬──────────────────┬────────────────┘
       │ consumed by      │ consumed by      │ consumed by
       ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐
│plantasonic-xyz│ │signal-9-live │  │ Plantasia / Future   │
│ reference app │ │ product app  │  │ independent apps     │
└──────────────┘  └──────────────┘  └──────────────────────┘
```

The Plantasonic Platform is completely application agnostic. Applications consume the Platform. Applications are developed, versioned, and deployed independently.

## Responsibility Boundaries

### Platform Owns

- Design System and Theme System
- Shared components and templates
- Application lifecycle (idle → initializing → ready → running → stopped)
- Event bus for cross-component communication
- Workspace region layout contract
- Preset registry and routing
- Engine adapter registration and orchestration
- Plugin registration and capability routing
- Integration contracts (TypeScript types)

### Platform Does Not Own

- Product applications: `signal-9-live`, Plantasia, `plantasonic-xyz`, or future apps
- Creative direction or application UX (Applications)
- Application repositories, deployment, release history, or product roadmaps

## Package Dependency Rules

```
@plantasonic/platform-demo
    └── @plantasonic/platform
            └── @plantasonic/platform-types

Workspace packages:
    plantasonic-design-system  ← consumed by demos and applications, not the platform SDK
    plantasia-sound-engine     ← wrapped by SoundEngineAdapter
    ascii-visual-engine        ← wrapped by VisualEngineAdapter
```

**Rules:**

1. `@plantasonic/platform-types` has **zero runtime dependencies** — types only
2. `@plantasonic/platform` depends only on `@plantasonic/platform-types`
3. The platform SDK must **not** import Design System, Sound Engine, or Visual Engine directly
4. Engine packages must **not** import the platform or each other
5. The Design System must **not** know about sound or visuals
6. Applications import the platform SDK and compose everything together

## Application Composition Model

Applications are created through a single entry point:

```typescript
import { createApplication } from '@plantasonic/platform';

const app = createApplication({
  id: 'my-app',
  name: 'My Application',
});

app.start();
```

An application instance provides:

| Service | Purpose |
|---------|---------|
| `lifecycle` | State machine for init/run/pause/stop |
| `eventBus` | Pub/sub for platform-wide events |
| `workspace` | Region layout (stage, transport, inspector, etc.) — bound to DS Creative Workspace surfaces |
| `presets` | Preset registration and application |

Applications bind external packages to platform services:

1. **Design System** renders the Creative Workspace layout into the application shell
2. **Sound Engine** registers as a `SoundEngineAdapter`
3. **Visual Engine** registers as a `VisualEngineAdapter`
4. **Presets** route data to adapters via the event bus

## Communication Model

Components never communicate directly. All cross-boundary messages flow through the platform event bus:

```
Sound Adapter ──getAudioFeatures──▶ Audio Reactive Bridge ──updateParameter──▶ Visual Adapter
Sound Adapter ──emit──▶ eventBus ◀──on── Bridge (lifecycle)
Design System ──emit──▶ eventBus ──on──▶ Application
Preset Registry ──emit──▶ eventBus ──on──▶ Sound + Visual Adapters
Plugin Manager ──emit──▶ eventBus ──on──▶ Application / Demo UI
```

Engines never import each other. The bridge reads from the sound adapter and writes through the visual adapter only.

Event types use dot-namespaced strings: `lifecycle.ready`, `preset.applied`, `plugin:register`.

## Plugin Framework

Extensions register through `createPluginManager()` without modifying platform core:

```
Application
    │
    ├── createPluginManager({ eventBus })
    │       setServices({ lifecycle, adapters, registries, ... })
    │       registerPlugin(PlatformPlugin)
    │           └── plugin.register(PluginContext)
    │                   ├── registerPresetBundle → presetBundles (on enable)
    │                   ├── registerPerformanceMapping → performance (on enable)
    │                   ├── registerAudioReactiveMapping → bridge (on enable)
    │                   └── declareSoundAdapter / declareVisualAdapter (metadata)
    │
    └── Demo UI listens for plugin:* events
```

**Boundary rules:**

1. Plugins must not import Sound Engine, Visual Engine, or Design System
2. Runtime adapters are wired by the application — plugins declare metadata only
3. Platform core does not change when adding new plugins
4. Plugin failures emit `plugin:error` and do not crash the application

## Project State Persistence

Applications capture orchestration state without reading engine internals directly:

```
createWorkspacePersistence({ eventBus, context })
    │
    ├── captureProjectState(context)
    │       ├── presetBundles.getActiveBundleId()
    │       ├── sound/visual.getStatus() + getParameterSnapshot()
    │       ├── bridge.getStatus()
    │       ├── performance.getStatus()
    │       ├── pluginManager.getAllPluginStatuses()
    │       └── collectUIState() (application hook)
    │
    └── applyProjectState(context, state)
            ├── pluginManager enable/disable
            ├── presetBundles.applyBundle()
            ├── sound/visual updateParameter()
            ├── bridge.updateMapping()
            ├── performance.updateMappings()
            └── applyUIState() (application hook)
```

Storage is behind a replaceable `ProjectStorageAdapter` — first pass uses localStorage.

## Thin application pattern

Independent applications should inject content into platform orchestration:

```
my-application/src/
  main.ts                 → mountInstrumentApp(container, plantasonicAppContent)
  plantasonicAppContent.ts → { application, shell, presetBundles, plugins, branding }
  config/                 → app-owned configuration
  content/                → preset bundles, plugins, branding
  styles/                 → Design System imports (instrument + creative-workspace SCSS)
```

Platform wiring lives in `mountInstrumentApp()` (`@plantasonic/platform-demo/instrument-app`), which composes `renderCreativeWorkspace({ preset: 'instrument' })` inside the instrument shell. Applications must not duplicate shell, workspace layout, tokens, adapters, or persistence logic.

Internal platform demo/scaffold apps may exist for validation, but product applications live outside the Platform repository.

## Workspace Regions

The platform defines a standard set of workspace regions. The Design System **Creative Workspace** layer renders floating surfaces; the platform binds DOM elements for SDK services.

| Platform region | Creative Workspace landmark | Purpose |
|-----------------|------------------------------|---------|
| `stage` | `[data-ps-region="stage"]` | Fullscreen visual canvas (dominant) |
| `transport` | `[data-ps-cw-surface="transport"]` | Floating playback controls |
| `inspector` | `[data-ps-cw-surface="inspector"]` | Floating parameter panels |
| `preset-browser` | `[data-ps-cw-surface="browser"]` | Floating preset bundle list |
| `status` | `[data-ps-cw-surface="hud"]` | Floating metrics, project controls, event log |

The demo (`@plantasonic/platform-demo`) calls `renderCreativeWorkspace()` + `bindCreativeWorkspace()` inside `renderApplicationShell({ variant: 'instrument' })`. The platform SDK owns the region contract; the Design System owns layout and UI.

## Design System Integration (Complete)

The demo application consumes `plantasonic-design-system` directly — not through the platform SDK:

```
createApplication()              ← platform SDK (orchestration)
renderCreativeWorkspace()        ← design system (layout presets)
renderApplicationShell()         ← design system (app chrome)
bindCreativeWorkspace()          ← design system (floating panel behavior)
app.workspace.bindRegion()       ← platform binds Creative Workspace landmarks
```

The platform SDK does **not** import the Design System. Applications compose both packages.

## Engine Adapter Pattern

External engines are wrapped, not imported:

```typescript
interface EngineAdapter {
  readonly id: string;
  readonly engineName: string;
  readonly isReady: boolean;
  initialize(): Promise<void>;
  dispose(): Promise<void>;
}
```

Specialized adapters extend the base:

- `SoundEngineAdapter` — wraps `plantasia-sound-engine`
- `VisualEngineAdapter` — wraps `ascii-visual-engine`

The platform orchestrates adapter lifecycle. Adapters delegate all domain logic to their engine packages.

## Integration Path

### Phase 1: Foundation (complete)

Repository setup, SDK contracts, demo scaffold.

### Phase 2: Design System Integration (complete)

- Demo depends on `plantasonic-design-system` (local file link)
- Token CSS and Bootstrap/theme SCSS imported in demo entry point
- Instrument shell via `renderApplicationShell({ variant: 'instrument' })`
- Platform workspace regions bound to Design System region landmarks
- Transport wired to platform lifecycle via `bindTransport()`

### Phase 3: Sound Engine Integration (complete)

- `createSoundEngineAdapter()` in `@plantasonic/platform` wraps `plantasia-sound-engine`
- Demo wires transport, preset browser, and parameter controls to adapter
- Platform event bus emits `sound:*` events
- Audio context unlock deferred until user gesture

### Phase 4: Visual Engine Integration (complete)

- `createVisualEngineAdapter()` wraps `ascii-visual-engine`
- Demo mounts canvas in Stage region via Design System `[data-ps-canvas-mount]`
- Transport, presets, and parameters wired to visual adapter
- Resize handling via `ResizeObserver`

### Phase 5: Audio Reactive Bridge (complete)

- `createAudioReactiveBridge()` in `@plantasonic/platform`
- Sound adapter `getAudioFeatures()` with placeholder band analyzer
- Visual target compatibility map (`density`, `speed`, `strength`, etc.)
- Demo inspector panel for reactive controls
- Bridge lifecycle tied to engine transport start/stop

### Phase 6: Preset Framework (complete)

- `createPresetBundleRegistry()` applies bundles through sound, visual, and bridge adapters
- Extended types: `SoundPresetRef`, `VisualPresetRef`, `AudioReactivePreset`, `WorkspacePreset`, `UIPresetState`
- Demo preset browser driven by unified bundles

### Phase 7: Performance Controls (complete)

- Platform performance layer routes MIDI/keyboard without engine coupling
- Sound adapter extended with `noteOn()` / `noteOff()` wrappers only

### Phase 8: Plugin System (complete)

- `createPluginManager()` registers plugins without modifying platform core
- Plugins contribute preset bundles, mappings, panels, commands, and metadata via `PluginContext`
- Adapter declarations are metadata-only — plugins do not import engine packages
- Demo Plugins inspector shows status, capabilities, enable/disable, and errors
- Invalid plugins fail validation or emit `plugin:error` without crashing the app

### Phase 9: Workspace Persistence (complete)

- `createWorkspacePersistence()` captures and restores project state through platform managers
- JSON export/import with `plantasonic-project` envelope format
- localStorage persistence with replaceable storage adapter
- Demo project controls in status region

### Phase 10: Plantasonic App Migration (first pass complete)

- Internal reference scaffold demonstrates thin consumer pattern
- `mountInstrumentApp()` accepts injected `InstrumentAppContent`
- Migration guide: [docs/PLANTASONIC_APP_MIGRATION.md](./docs/PLANTASONIC_APP_MIGRATION.md)

### Phase 11: Prototype Generator (complete)

- `@plantasonic/create-app` CLI scaffolds thin instrument apps from template
- Generated apps use `mountInstrumentApp()` with injected content
- Validation script enforces thin-app constraints

### Phase 12: Independent application migration (next)

- Independent applications consume the Platform without moving into this repository

See [ROADMAP.md](./ROADMAP.md) for the full milestone list.
