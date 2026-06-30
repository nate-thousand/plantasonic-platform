# Roadmap

Milestones for `plantasonic-platform`, in order.

## 1. Repository Foundation

**Status: Complete**

- pnpm workspace monorepo structure
- `@plantasonic/platform-types`, `@plantasonic/platform`, `@plantasonic/platform-demo`
- TypeScript configuration
- Documentation skeleton
- `.gitignore`, changelog

## 2. SDK Contracts

**Status: Complete (placeholder implementations)**

- `createApplication()` — application factory
- `createEventBus()` — pub/sub communication
- `createWorkspace()` — region layout manager
- `createPresetRegistry()` — preset management
- `createLifecycle()` — state machine
- Clean TypeScript interfaces for all services

## 3. Demo Scaffold

**Status: Complete**

- Vite demo app
- Lifecycle status display
- Placeholder workspace regions (Stage, Transport, Inspector, Preset Browser, Status)
- Transport controls wired to lifecycle

## 4. Design System Integration

**Status: Complete**

- `plantasonic-design-system` added as demo dependency (local file link)
- Demo imports token CSS (`css/variables.css`) and Bootstrap/theme SCSS layers
- Instrument shell renders via `renderApplicationShell({ variant: 'instrument' })`
- **Creative Workspace** (`creative-workspace`) — instrument preset with floating overlays
- Platform workspace regions bound to Creative Workspace surface landmarks
- Transport, inspector, preset browser, and status HUD use floating surfaces (not dashboard panels)
- Lifecycle status displayed via Design System metrics in status HUD
- No Design System source copied or modified

## 4b. Creative Workspace Migration

**Status: Complete**

- Demo orchestrator uses `renderCreativeWorkspace({ preset: 'instrument' })` + `bindCreativeWorkspace()`
- `plantasonic-v2` and `plantasonic-reference` inherit layout via `@plantasonic/platform-demo`
- Removed duplicated canvas/stage layout CSS from demo styles
- Apps import `scss/creative-workspace.scss`; stage is dominant, controls float above

## 5. Sound Engine Integration

**Status: Complete**

- `plantasia-sound-engine` dependency on `@plantasonic/platform`
- `createSoundEngineAdapter()` wraps engine facade
- Demo wires transport Play/Stop to adapter `start()` / `stop()`
- Preset browser calls `playPreset()`
- Inspector sliders call `updateParameter()`
- Platform event bus receives `sound:*` events
- Audio unlock deferred until user gesture (no autoplay)
- Errors surfaced in status region without crashing

## 6. Visual Engine Integration

**Status: Complete**

- `ascii-visual-engine` dependency on `@plantasonic/platform` (npm name; ecosystem: plantasia-visual-engine)
- `createVisualEngineAdapter()` wraps `AsciiEngine`
- Demo mounts visual output in Design System Stage region
- Transport Play/Stop controls visual render loop
- Preset browser calls `setPreset()` alongside `playPreset()`
- Visual parameter sliders call `updateParameter()`
- `ResizeObserver` + window resize forward to `visual.resize()`
- Platform event bus receives `visual:*` events

## 7. Audio Reactive Bridge

**Status: Complete**

- `createAudioReactiveBridge()` connects Sound + Visual adapters via platform event bus
- Placeholder analyzer derives bass/mids/highs/transient from `getLevel()` + `getWaveform()`
- Configurable mappings, sensitivity, and smoothing
- Demo Audio Reactive inspector panel (toggle, mapping sliders, status)
- Bridge stops when either engine stops; errors surfaced in status region
- Platform event bus receives `bridge:*` events
- No direct Sound Engine → Visual Engine coupling

## 8. Preset Framework

**Status: Complete**

- `createPresetBundleRegistry()` with unified `PresetBundle` schema
- Bundles coordinate sound, visual, audio-reactive, workspace, and UI state
- `applyBundle()` routes through adapters — no direct engine coupling
- Demo bundles: Seed, Root, Bloom, Mycelium, Mutation
- Preset browser lists name, description, category, tags
- Validation: missing refs warn; invalid bundles rejected; bridge defaults on missing mapping
- Import/export via JSON
- Platform events: `preset:register`, `preset:apply`, `preset:import`, etc.

## 9. Performance Controls

**Status: Complete**

- `createPerformanceControlManager()` — Web MIDI + keyboard routing
- Routes to sound, visual, preset bundles, bridge, transport, workspace, UI
- Demo mappings: keys A–G (notes), 1–5 (bundles), Space (toggle), MIDI CC/pads
- MIDI access deferred until user clicks Connect MIDI
- Keyboard fallback when Web MIDI unavailable
- Platform events: `performance:*`

## 10. Plugin System

**Status: Complete**

- `createPluginManager()` — register, enable/disable, validate plugins
- Shared types: `PlatformPlugin`, `PluginManifest`, `PluginContext`, `PluginCapability`, `PluginStatus`, `PluginDependency`, `PluginRegistrationResult`
- Plugins contribute commands, panels, preset bundles, adapter declarations, performance mappings, audio-reactive mappings, workspace regions, documentation
- `PluginContext` exposes event bus, lifecycle, presets, workspace, adapters, bridge, performance, preset bundle registry
- Validation: missing manifest fails; duplicate IDs rejected; missing deps warn; unsupported capabilities warn; failures do not crash app
- Demo plugins: Seed Preset, ASCII Visual placeholder, Plantasia Sound placeholder, Performance Mapping placeholder
- Platform events: `plugin:register`, `plugin:unregister`, `plugin:enable`, `plugin:disable`, `plugin:error`, `plugin:capability-register`

## 11. Workspace Persistence and Project State

**Status: Complete**

- `createWorkspacePersistence()` — save, load, export, import, reset project state
- Shared types: `ProjectState`, `WorkspaceState`, `EngineState`, `SoundState`, `VisualState`, `BridgeState`, `PluginState`, `PerformanceState`, `UIState`, `SerializedProject`
- `captureProjectState()` / `applyProjectState()` route through platform managers (adapters, bridge, performance, plugins, preset bundles)
- localStorage adapter with replaceable `ProjectStorageAdapter` interface
- Validation: invalid import fails clearly; version mismatch warns; missing plugin/bundle refs warn; corrupted storage cleared safely
- Demo status region: Save, Load, Reset, Export, Import controls + project status display
- Platform events: `project:save`, `project:load`, `project:export`, `project:import`, `project:reset`, `project:error`
- Sound/visual adapters track `getParameterSnapshot()` for persistence without engine duplication

## 12. Prototype Generator

**Status: Complete**

- `@plantasonic/create-app` CLI (`create-plantasonic-app`)
- `instrument` template — thin platform consumer with full stack pre-wired
- Monorepo detection — defaults output to `apps/<slug>/`
- Generated app validation script (`pnpm validate`)
- Root command: `pnpm create:app <slug>`
- Docs: [docs/PROTOTYPE_GENERATOR.md](./docs/PROTOTYPE_GENERATOR.md)

## 13. Plantasonic App Migration

**Status: Complete (production cutover v0.3.0)**

- Migration guide: [docs/PLANTASONIC_APP_MIGRATION.md](./docs/PLANTASONIC_APP_MIGRATION.md)
- Reference app: `apps/plantasonic-reference/` — thin platform consumer
- Parameterized mount: `mountInstrumentApp()` exports app-owned content injection
- Production repo cutover: `plantasonic-xyz` v0.3.0
- Skill: `application-migration`

## 14. Development Environment

**Status: Complete**

- `.cursor/rules/plantasonic-platform.md` — always-on AI rules
- `skills/` — 10 agent workflows (synced to `.cursor/skills/`)
- `templates/` — prototype template catalog (instrument active, 6 placeholders)
- `docs/` — documentation framework (12 guides + validation checklist)
- `scripts/` — placeholder interfaces (create-app, validate, generate-docs, release, audit)
- `examples/` — pattern documentation
- Updated README with dev workflow

## 15. Template Ecosystem

**Status: In progress**

- [x] Unified CLI: `pnpm plantasonic create <type> <name>`
- [x] `audio-reactive` template with pulse/drift/glitch preset bundles
- [ ] Implement `generative-art`, `installation`, `visual-synth`, `portfolio-demo`, `research` templates
- [ ] Template-specific preset defaults and workspace configs (remaining types)
- [ ] Runnable examples per template type

## 16. Plugin Ecosystem

**Status: Planned**

- [ ] Plugin-declared panels rendered in shell
- [ ] Plugin command palette integration
- [ ] Plugin marketplace / discovery metadata
- [ ] First-party plugin pack documentation

## 17. Platform v1.0

**Status: Planned**

- [ ] Stable `@plantasonic/app-kit` mount API (extract from platform-demo)
- [ ] Published npm packages (platform, types, create-app)
- [ ] Full validation runner (`scripts/validate.ts`)
- [ ] Ecosystem audit tool (`scripts/audit.ts`)
- [ ] Native FFT bands in audio-reactive bridge
- [ ] Autosave and cloud persistence adapters
