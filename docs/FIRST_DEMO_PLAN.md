# First Demo Plan

This document describes the first **real** working demo — the milestone where all ecosystem packages come together through the platform.

## Current progress

| Step | Status |
|------|--------|
| 1. Design System shell | **Complete** — demo uses instrument shell, tokens, transport, inspector, browser, status |
| 2. Sound Engine playback | **Complete** — adapter, transport, presets, parameters |
| 3. Visual Engine rendering | **Complete** — adapter, stage mount, resize, presets, parameters |
| 4. Audio reactive bridge | **Complete** — bridge, mappings, sensitivity, smoothing, status |
| 5. Preset control | **Complete** — unified bundles, applyBundle, browser metadata |
| 6. MIDI control | **Complete** — platform performance layer (keyboard + Web MIDI) |
| 7. Plugin framework | **Complete** — register, enable/disable, demo plugins panel |
| 8. Project persistence | **Complete** — save/load/export/import via platform managers |
| 9. Prototype generator | **Complete** — `pnpm create:app <slug>` scaffolds thin apps |

## Goal

Demonstrate that `plantasonic-design-system`, `plantasia-sound-engine`, and `plantasia-visual-engine` can work together through `@plantasonic/platform` without any package violating its responsibility boundary.

## Demo Scenario

An interactive audio-visual experience where:

1. The **Design System** renders the application shell (workspace regions, transport controls, preset browser)
2. The **Sound Engine** plays generative audio
3. The **Visual Engine** renders reactive visuals on the stage
4. **Audio analysis** from the Sound Engine drives visual parameters
5. **Presets** control both engines simultaneously
6. **MIDI input** controls shared application state

## Architecture for the Demo

```
┌─────────────────────────────────────────────────┐
│              platform-demo (app)                │
│                                                 │
│  createApplication()                            │
│    ├── Design System → workspace regions        │
│    ├── SoundEngineAdapter → sound engine        │
│    ├── VisualEngineAdapter → visual engine      │
│    └── preset registry + event bus              │
└─────────────────────────────────────────────────┘
         │              │              │
         ▼              ▼              ▼
   Design System   Sound Engine   Visual Engine
```

## Integration Steps

### Step 1: Design System Shell

**Status: Complete**

**What:** Replace placeholder region HTML with Design System layout components.

**Implemented:**
- `plantasonic-design-system` added as demo dependency
- Token CSS and Bootstrap/theme SCSS imported in `main.ts`
- Instrument shell via `renderApplicationShell({ variant: 'instrument' })`
- Platform workspace regions bound to Design System `[data-ps-region]` landmarks
- Transport uses `renderTransport()` + `bindTransport()` wired to platform lifecycle
- Inspector uses `createInspector()` with placeholder panel
- Preset browser uses `renderBrowserRegion()` in the rail slot
- Status uses `createMetrics()` with lifecycle metric + event log

**Proves:** Platform workspace contract works with real Design System UI.

### Step 2: Sound Engine Playback

**Status: Complete**

**What:** Sound Engine plays audio when the user hits Play.

**Implemented:**
- `createSoundEngineAdapter()` in `@plantasonic/platform` wraps `plantasia-sound-engine`
- Demo calls `sound.init()` on mount (no audio unlock)
- Transport Play calls `sound.start()` after user gesture
- Transport Stop calls `sound.stop()`
- Preset browser buttons call `sound.playPreset(id)`
- Inspector sliders call `sound.updateParameter()` for ecology + tempo
- Status bar shows sound state, level, and active preset
- `sound:*` events logged in status region; errors displayed without crash

**Proves:** Platform adapter contract controls real audio without UI coupling.

### Step 3: Visual Engine Rendering

**Status: Complete**

**What:** Visual Engine renders on the stage region.

**How:**
- `createVisualEngineAdapter()` in `@plantasonic/platform` wraps `ascii-visual-engine`
- Demo mounts canvas into `[data-ps-canvas-mount]` inside the Design System stage
- Transport Start/Stop calls `visual.start()` / `visual.stop()`
- Preset selection calls `visual.setPreset()` alongside `sound.playPreset()`
- Visual parameter sliders call `visual.updateParameter()`
- `ResizeObserver` + window resize call `visual.resize()`
- Status bar shows visual state, FPS, and active preset

**Proves:** Platform workspace regions serve as render targets for engines via a clean adapter contract.

### Step 4: Audio Reactive Bridge

**Status: Complete**

**What:** Visuals react to audio in real time.

**How:**
- `createAudioReactiveBridge()` reads `sound.getAudioFeatures()` each frame
- Placeholder analyzer derives bass/mids/highs/transient from waveform + level
- Bridge writes mapped values via `visual.updateParameter()` (compatibility map in platform layer)
- Demo Audio Reactive inspector: toggle, mapping sliders, sensitivity, smoothing, status
- Bridge starts with transport Play, stops when either engine stops
- Platform emits `bridge:*` events

**Proves:** Platform connects sound state to visual behavior without direct engine coupling.

### Step 5: Preset Control

**Status: Complete**

**What:** Selecting a preset bundle changes sound, visuals, bridge, workspace, and UI state.

**How:**
- `createPresetBundleRegistry()` with unified `PresetBundle` schema
- Demo bundles: Seed, Root, Bloom, Mycelium, Mutation
- Preset browser lists name, description, category, tags
- `applyBundle()` routes through sound, visual, and bridge adapters
- Workspace/UI handlers apply inspector panel and slider state
- Status bar shows active bundle name
- Missing engine refs warn without crashing

**Proves:** One platform preset system coordinates all engines without direct coupling.

### Step 6: Performance Controls

**Status: Complete**

**What:** MIDI and keyboard drive shared platform state.

**How:**
- `createPerformanceControlManager()` routes input through adapters
- Web MIDI via Connect MIDI button (user gesture)
- Keyboard fallback when MIDI unavailable
- Demo Performance inspector: status, device, active notes, mapping list
- Keys, MIDI CC, pads, transport mapped to sound, visual, bundles, bridge

**Proves:** Platform performance layer coordinates engines without modifying them.

### Step 7: Plugin Framework

**Status: Complete**

**What:** Extensions register capabilities without modifying platform core.

**How:**
- `createPluginManager()` with `PluginContext` wired to event bus, lifecycle, adapters, registries
- Demo plugins: Seed Preset, ASCII Visual placeholder, Plantasia Sound placeholder, Performance Mapping placeholder
- Plugins inspector: status list, capabilities, enable/disable toggles, errors
- Seed bundle contributed via plugin; preset browser includes plugin bundle in static list
- Platform emits `plugin:*` events; invalid plugins fail validation without crashing

**Proves:** Platform supports extensibility at the orchestration layer with clear boundary rules.

### Step 8: Workspace Persistence

**Status: Complete**

**What:** Save and restore full demo session state across engines, plugins, and UI.

**How:**
- `createWorkspacePersistence()` with replaceable localStorage adapter
- `captureProjectState()` / `applyProjectState()` route through adapters, bridge, performance, plugins, preset bundles
- Demo status region: Save, Load, Reset, Export, Import + project status display
- Validation: invalid import fails; version mismatch warns; missing refs warn; corrupted storage cleared
- Platform emits `project:*` events

**Proves:** Platform orchestration state is serializable without engine coupling or DOM-only hacks.

## Success Criteria

| Criterion | Verification |
|-----------|-------------|
| Design System renders all workspace regions | Visual inspection |
| Sound plays on Start, pauses on Pause | Audio output |
| Visuals render on stage region | Canvas/WebGL visible |
| Visuals react to audio amplitude | Visual changes with audio |
| Preset switch changes sound + visuals | Select preset, observe both change |
| MIDI CC adjusts parameters | Connect controller, observe response |
| No package imports another's internals | Dependency audit |
| No direct engine-to-engine calls | Code review |
| Plugins register and enable/disable | Plugins inspector + event log |
| Invalid plugins do not crash app | Validation rejects bad manifest |
| Project save/load/export/import works | Status region controls + event log |
| Invalid project data does not crash app | Import validation + safe storage reset |

## Non-Goals for First Demo

- Prototype generator CLI (available via `pnpm create:app`)
- Production performance optimization
- Full preset authoring UI
- Multi-application support
- Publishing to npm

## Dependencies Required

| Package | Version | Purpose |
|---------|---------|---------|
| `plantasonic-design-system` | latest | UI shell |
| `plantasia-sound-engine` | latest | Audio playback and analysis |
| `plantasia-visual-engine` | latest | Visual rendering |
| `@plantasonic/platform` | workspace | Orchestration |

All adapters live in the demo app — not in the platform SDK. The platform provides contracts; the application provides wiring.

## Timeline Estimate

| Step | Depends On | Milestone |
|------|-----------|-----------|
| Design System shell | Milestone 4 | ROADMAP #4 |
| Sound Engine playback | Milestone 5 | ROADMAP #5 |
| Visual Engine rendering | Milestone 6 | ROADMAP #6 |
| Audio reactive bridge | Milestones 5 + 6 | ROADMAP #7 |
| Preset control | Milestones 5 + 6 + 8 | ROADMAP #8 |
| MIDI control | Milestones 5 + 6 | ROADMAP #9 |
| Plugin framework | Milestones 8 + 9 | ROADMAP #10 |
| Project persistence | Milestones 10 + 8 | ROADMAP #11 |

Steps 2 and 3 can proceed in parallel once the Design System shell is in place.

**Next step:** Production Plantasonic repository cutover (ROADMAP #13).
