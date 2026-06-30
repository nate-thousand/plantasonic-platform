# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.10.0] - 2026-06-29

### Added

- Prototype Generator (`@plantasonic/create-app`)
- CLI: `create-plantasonic-app` / `pnpm create:app <slug>`
- `instrument` template with full platform stack pre-wired
- Generated app validation script (`pnpm validate`)
- Docs: [docs/PROTOTYPE_GENERATOR.md](./docs/PROTOTYPE_GENERATOR.md)

### Known limitations

- Single template (instrument) in first pass
- Monorepo workspace deps assumed for generated apps
- No interactive CLI prompts yet

## [0.9.0] - 2026-06-29

### Added

- Plantasonic reference app (`apps/plantasonic-reference/`) — thin platform consumer scaffold
- Migration guide: [docs/PLANTASONIC_APP_MIGRATION.md](./docs/PLANTASONIC_APP_MIGRATION.md)
- `mountInstrumentApp()` parameterized mount API with `InstrumentAppContent` injection
- Reference app validation script (`pnpm validate:reference`)
- Root scripts: `pnpm dev:reference`, `pnpm validate:reference`

### Changed

- `createDemoPresetBundleRegistry()` accepts preset bundle array parameter
- `createDemoPluginManager()` accepts plugins array parameter
- Demo `mountDemo()` delegates to `mountInstrumentApp()`

### Known limitations

- Reference app depends on `@plantasonic/platform-demo` for wiring (future `@plantasonic/app-kit`)
- Production Plantasonic repository not modified
- Next step: Prototype Generator

## [0.8.0] - 2026-06-29

### Added

- Workspace Persistence (`createWorkspacePersistence`)
- Project state capture/apply (`captureProjectState`, `applyProjectState`, `serializeProject`, `deserializeProject`)
- Shared types: `ProjectState`, `WorkspaceState`, `EngineState`, `SoundState`, `VisualState`, `BridgeState`, `PluginState`, `PerformanceState`, `UIState`, `SerializedProject`, `ProjectStorageAdapter`, `WorkspacePersistence`
- Replaceable storage adapters: `createLocalStorageAdapter`, `createMemoryStorageAdapter`
- Sound/visual adapter `getParameterSnapshot()` for persistence without engine duplication
- Demo project controls: Save, Load, Reset, Export, Import + status display
- Platform events: `project:save`, `project:load`, `project:export`, `project:import`, `project:reset`, `project:error`
- Validation: invalid import fails clearly; version mismatch warns; missing plugin/bundle refs warn; corrupted localStorage cleared safely

### Known limitations

- localStorage only in first pass (adapter replaceable)
- No autosave on parameter changes
- MIDI device connection not restored after load
- Next step: Prototype Generator

## [0.7.0] - 2026-06-29

### Added

- Plugin Framework (`createPluginManager`)
- Shared types: `PlatformPlugin`, `PluginManifest`, `PluginContext`, `PluginCapability`, `PluginStatus`, `PluginDependency`, `PluginRegistrationResult`, `PluginCommand`, `PluginPanel`, `PluginAdapterDeclaration`
- Plugin contributions: commands, panels, preset bundles, adapter declarations, performance mappings, audio-reactive mappings, workspace regions, documentation
- Demo plugins: Seed Preset, ASCII Visual placeholder, Plantasia Sound placeholder, Performance Mapping placeholder
- Demo Plugins inspector panel with enable/disable, capabilities, warnings, and errors
- Platform events: `plugin:register`, `plugin:unregister`, `plugin:enable`, `plugin:disable`, `plugin:error`, `plugin:capability-register`
- Validation: missing manifest fails; duplicate IDs rejected; missing deps warn; unsupported capabilities warn

### Changed

- Seed preset bundle moved from static demo list to Seed Preset Plugin contribution (browser still lists Seed via combined bundle array)

### Known limitations

- Plugin panels and commands are metadata-only — not rendered in Design System shell
- No runtime plugin loading from external URLs/packages
- No plugin sandbox
- Next step: Workspace Persistence and Project State

## [0.6.0] - 2026-06-29

### Added

- Performance Control Manager (`createPerformanceControlManager`)
- Web MIDI + keyboard routing to sound, visual, preset bundles, bridge, transport
- Shared types: `PerformanceControlManager`, `ControlMapping`, `MIDIMessage`, `MIDIInputState`, `KeyboardInputState`, `LearnModeState`
- Sound adapter `noteOn()` / `noteOff()` wrappers
- Demo Performance inspector panel with MIDI status, active notes, mapping list
- Platform events: `performance:init`, `performance:midi-connected`, `performance:note-on`, `performance:control-change`, `performance:mapping-change`, `performance:error`

### Known limitations

- MIDI learn is placeholder-only
- Web MIDI browser support limited (Chrome/Edge)
- Sound engine native MIDI (`enableMidi()`) not used — platform parses MIDI independently
- Next step: Plugin Framework

## [0.5.0] - 2026-06-29

### Added

- Unified Preset Bundle Framework (`createPresetBundleRegistry`)
- Extended types: `PresetBundle`, `SoundPresetRef`, `VisualPresetRef`, `AudioReactivePreset`, `WorkspacePreset`, `UIPresetState`, `PresetCategory`, `PresetTag`
- `applyBundle()` coordinates sound, visual, bridge, workspace, and UI through adapters
- Demo bundles: Seed, Root, Bloom, Mycelium, Mutation
- Import/export, category/tag filtering, validation with warnings
- Platform events: `preset:register`, `preset:unregister`, `preset:apply`, `preset:export`, `preset:import`, `preset:error`
- Legacy flat registry renamed to `PresetCollection` / `createPresetRegistry`

### Known limitations

- Workspace/UI presets are placeholder-level (visibility, slider values, inspector panel)
- No MIDI
- Next step: MIDI and Performance Control Framework

## [0.4.0] - 2026-06-29

### Added

- Audio Reactive Bridge (`createAudioReactiveBridge`) connecting sound + visual adapters
- Shared types: `AudioReactiveBridge`, `AudioReactiveMapping`, `AudioBand`, `AudioFeature`, `VisualTarget`, `MappingAmount`
- Placeholder audio analyzer in platform SDK (`placeholderAudioAnalyzer.ts`)
- Sound adapter `getAudioFeatures()` for bridge consumption
- Visual target compatibility map (`density`, `speed`, `strength`, `sourceContrast`, `glitchAmount`)
- Demo Audio Reactive inspector panel with toggle, mapping controls, sensitivity, smoothing, status
- Platform events: `bridge:init`, `bridge:start`, `bridge:stop`, `bridge:connect`, `bridge:disconnect`, `bridge:mapping-change`, `bridge:error`

### Known limitations

- Placeholder band analysis (not native FFT from Sound Engine)
- No MIDI

## [0.3.0] - 2026-06-29

### Added

- Visual Engine adapter (`createVisualEngineAdapter`) wrapping `ascii-visual-engine`
- Visual lifecycle: init, mount, unmount, start, stop, setPreset, updateParameter, resize, getStatus, dispose
- Platform events: `visual:init`, `visual:mount`, `visual:start`, `visual:stop`, `visual:preset-change`, `visual:parameter-change`, `visual:resize`, `visual:error`
- Demo stage mount with live ASCII render output, resize handling, and combined transport/preset wiring
- `resolveVisualPresetId()` for sound → visual preset mapping

### Known limitations

- No audio-reactive bridge (Milestone 7)
- No MIDI
- Visual engine package linked locally (`file:../../../frameworks/visual-engine`) when GitHub dist is unavailable

## [0.2.0] - 2026-06-29

### Added

- `createSoundEngineAdapter()` — wraps `plantasia-sound-engine` with platform event bus integration
- `listSoundEnginePresets()` — exposes engine preset list for demo UI
- `SoundEngineStatus` type and expanded `SoundEngineAdapter` contract
- Demo: transport Play/Stop, preset browser, parameter sliders wired to sound adapter
- Platform events: `sound:init`, `sound:start`, `sound:stop`, `sound:preset-change`, `sound:parameter-change`, `sound:error`

## [0.1.0] - 2026-06-29

### Added

- Design System integration in demo — instrument shell, tokens, transport, inspector, browser, status regions
- Demo imports `plantasonic-design-system` (shell + instrument APIs)

## [0.0.0] - 2026-06-29

### Added

- Initial repository foundation with pnpm workspaces
- `@plantasonic/platform-types` — shared TypeScript contracts
- `@plantasonic/platform` — platform SDK with placeholder orchestration
- `@plantasonic/platform-demo` — minimal Vite demo scaffold
- Architecture, integration, and roadmap documentation
