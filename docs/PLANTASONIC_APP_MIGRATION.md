# Plantasonic App Migration

Guide for rebuilding the production **Plantasonic** application as a thin consumer of `@plantasonic/platform`.

> **Status:** Production cutover **complete** in `plantasonic-xyz` (v0.3.0).  
> **Reference app:** `apps/plantasonic-reference/`  
> **Production app:** `plantasonic-xyz` — bootstraps via `src/platform-consumer/` + `mountInstrumentApp()`.

---

## Migration status

| Area | Status | Notes |
|------|--------|-------|
| Platform SDK orchestration | **Ready** | Adapters, bridge, presets, performance, plugins, persistence |
| Design System instrument shell | **Ready** | `renderApplicationShell({ variant: 'instrument' })` |
| Reference app scaffold | **Ready** | Thin consumer in `apps/plantasonic-reference/` |
| Parameterized mount API | **Ready** | `mountInstrumentApp()` in `@plantasonic/platform-demo/instrument-app` |
| Production Plantasonic repo cutover | **Complete** | `plantasonic-xyz` v0.3.0 — thin platform consumer; legacy runtime removed |
| Prototype generator CLI | **Complete** | `pnpm create:app <slug>` — see [PROTOTYPE_GENERATOR.md](./PROTOTYPE_GENERATOR.md) |

---

## Target architecture

The production Plantasonic app should become a **thin application layer** — creative direction and content on top of platform orchestration.

```
┌─────────────────────────────────────────────────────────────┐
│              Plantasonic App (production)                     │
│  Owns: presets · branding · app config · creative content   │
└──────────────────────────┬──────────────────────────────────┘
                           │ composes
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  @plantasonic/platform                        │
│  lifecycle · event bus · adapters · bridge · presets ·       │
│  performance · plugins · project persistence                  │
└──────┬──────────────────┬──────────────────┬────────────────┘
       │                  │                  │
       ▼                  ▼                  ▼
 Design System      Sound Engine       Visual Engine
 (UI shell)         (plantasia)        (ascii-visual)
```

### Plantasonic app **should own**

- Creative direction and copy
- Default preset bundle definitions (`PresetBundle[]`)
- App-specific plugin manifests (optional extensions)
- Sound/visual mapping **configuration** (preset ids, bundle metadata — not engine code)
- Branding (title, tagline, preset browser labels)
- Default workspace configuration
- Demo assets and marketing content

### Plantasonic app **should not own**

| Concern | Owner |
|---------|--------|
| Design tokens | `plantasonic-design-system` |
| Layout system / shell | `plantasonic-design-system` |
| Reusable UI components | `plantasonic-design-system` |
| Sound synthesis internals | `plantasia-sound-engine` |
| Visual rendering internals | `ascii-visual-engine` (plantasia-visual-engine) |
| Plugin system runtime | `@plantasonic/platform` |
| Project persistence | `@plantasonic/platform` |
| MIDI / keyboard routing | `@plantasonic/platform` (performance controls) |
| Audio reactive bridge | `@plantasonic/platform` |
| Prototype generator | `@plantasonic/create-app` CLI |

---

## Reference app

`apps/plantasonic-reference/` is **not** the production app. It proves the migration path:

```
apps/plantasonic-reference/src/
  main.ts                    # ~20 lines — entry point
  plantasonicAppContent.ts   # Injected content bundle
  config/
    appConfig.ts             # ApplicationConfig
    shellConfig.ts           # Design System shell (no local theme)
    workspaceConfig.ts       # Default regions
  content/
    presetBundles.ts         # Plantasonic PresetBundle definitions
    plugins.ts               # App plugins
    mappings.ts              # Mapping documentation (not engine code)
    branding.ts              # Copy and labels
  styles/
    index.scss                 # DS imports only
    app-layout.scss            # Minimal layout (DS variables)
```

Run:

```bash
pnpm --filter @plantasonic/plantasonic-reference dev    # http://localhost:5174
pnpm --filter @plantasonic/plantasonic-reference validate
pnpm --filter @plantasonic/plantasonic-reference build
```

The reference app wires the full platform stack:

- Instrument shell (stage, transport, inspector, preset browser, status)
- Sound + visual engine adapters
- Audio reactive bridge
- Preset bundle registry
- Performance controls
- Plugin manager
- Project state persistence

Platform wiring lives in `mountInstrumentApp()` — the reference app only injects `InstrumentAppContent`.

---

## Migration checklist

Use this when cutting over the **real Plantasonic repository**:

### Remove from Plantasonic app

- [ ] **Local application shell** — replace with `renderApplicationShell({ variant: 'instrument' })`
- [ ] **Local design tokens** — import `plantasonic-design-system/css/variables.css` only
- [ ] **Local Bootstrap theme** — import DS SCSS layers; do not copy theme files
- [ ] **Duplicated transport / inspector / browser controls** — use DS instrument APIs
- [ ] **Direct sound engine wiring** — replace with `createSoundEngineAdapter()`
- [ ] **Direct visual engine wiring** — replace with `createVisualEngineAdapter()`
- [ ] **Local preset JSON scattered across UI** — consolidate into `PresetBundle[]`
- [ ] **Local MIDI handlers** — replace with `createPerformanceControlManager()`
- [ ] **Local session/localStorage code** — replace with `createWorkspacePersistence()`
- [ ] **Cross-engine imports** — all coordination through platform event bus

### Keep in Plantasonic app

- [ ] Preset bundle content (names, descriptions, categories, tags, UI defaults)
- [ ] App configuration (`ApplicationConfig`, shell title, workspace defaults)
- [ ] Branding copy and assets
- [ ] App-specific plugins (optional)
- [ ] Creative mapping notes (preset id references — not engine internals)

### Wire in Plantasonic app

- [ ] Add dependencies: `@plantasonic/platform`, `@plantasonic/platform-types`, DS, engines
- [ ] Create `plantasonicAppContent.ts` (or equivalent) injecting app-owned config
- [ ] Call `mountInstrumentApp(container, content)` or copy the pattern locally
- [ ] Bind workspace regions to DS landmarks after shell render
- [ ] Register preset bundles and plugins through platform managers
- [ ] Verify project save/load restores sessions

---

## Step-by-step migration path

### Phase 1 — Dependencies and shell (low risk)

1. Add platform + DS dependencies to Plantasonic app `package.json`
2. Replace custom shell HTML with `renderApplicationShell({ variant: 'instrument' })`
3. Import DS token CSS and theme SCSS in entry point — remove local token files
4. Bind platform workspace regions to Creative Workspace landmarks (`[data-ps-cw-surface]` + stage)

**Validation:** App renders DS instrument shell; no local token files remain.

### Phase 2 — Engine adapters (medium risk)

1. Remove direct `plantasia-sound-engine` / visual engine imports from UI code
2. Create adapters via `@plantasonic/platform` in app bootstrap
3. Wire transport Play/Stop to adapter `start()` / `stop()`
4. Wire inspector sliders to `updateParameter()`

**Validation:** Audio and visuals work; no engine imports in UI components.

### Phase 3 — Preset bundles (medium risk)

1. Convert scattered presets to unified `PresetBundle[]`
2. Register via `createPresetBundleRegistry()`
3. Replace preset picker logic with `applyBundle()`
4. Move seed/starter presets to plugins if desired

**Validation:** One-click preset switch updates sound, visual, bridge, and UI.

### Phase 4 — Platform services (medium risk)

1. Add audio reactive bridge via `createAudioReactiveBridge()`
2. Add performance controls via `createPerformanceControlManager()`
3. Add plugins via `createPluginManager()` for app extensions
4. Add persistence via `createWorkspacePersistence()`

**Validation:** MIDI, reactive visuals, plugin toggles, and project save/load work.

### Phase 5 — Delete legacy code (high risk — do last)

1. Remove unused shell components
2. Remove duplicated control components
3. Remove local persistence utilities
4. Remove direct engine lifecycle code

**Validation:** App source is thin; platform SDK handles orchestration.

---

## What is ready today

| Platform capability | API | Reference app |
|--------------------|-----|---------------|
| Application lifecycle | `createApplication()` | ✓ |
| Design System shell | `renderApplicationShell()` | ✓ |
| Sound adapter | `createSoundEngineAdapter()` | ✓ |
| Visual adapter | `createVisualEngineAdapter()` | ✓ |
| Audio reactive bridge | `createAudioReactiveBridge()` | ✓ |
| Preset bundles | `createPresetBundleRegistry()` | ✓ |
| Performance controls | `createPerformanceControlManager()` | ✓ |
| Plugins | `createPluginManager()` | ✓ |
| Project persistence | `createWorkspacePersistence()` | ✓ |
| Thin mount API | `mountInstrumentApp()` | ✓ |

---

## What is still placeholder

| Item | Notes |
|------|-------|
| `mountInstrumentApp()` location | Lives in platform-demo package; may move to dedicated `@plantasonic/app-kit` later |
| Production branding/assets | Reference uses minimal copy only |
| App-specific plugins | Reference includes seed + adapter declaration plugins only |
| Shell `persistState` | Still disabled; separate from platform project persistence |
| Prototype generator | **Available** — `pnpm create:app <slug>` |
| Full legacy UI parity | Reference proves architecture, not pixel-perfect production UI |

---

## What to do in the real Plantasonic repository next

1. **Add platform dependencies** — mirror `apps/plantasonic-reference/package.json`
2. **Create app content module** — copy pattern from `plantasonicAppContent.ts`
3. **Replace shell bootstrap** — one `main.ts` calling `mountInstrumentApp()`
4. **Port preset content** — move existing presets into `PresetBundle[]` format
5. **Delete legacy orchestration** — follow migration checklist incrementally
6. **Run validation** — no local tokens, no engine imports in UI, platform events flowing
7. **Cut over behind feature flag** — ship thin app alongside legacy until parity confirmed

Do **not** copy files from the legacy Plantasonic UI into the platform repo. The reference app demonstrates the target shape without duplicating production components.

---

## Validation rules

The reference app includes `pnpm validate` checks:

- Uses `mountInstrumentApp()` from platform demo mount API
- Declares all required package dependencies
- No copied token CSS or Bootstrap theme files in app source
- No legacy UI file names
- Source stays thin (warns if app layer grows too large)

Run in CI:

```bash
pnpm --filter @plantasonic/plantasonic-reference validate
pnpm --filter @plantasonic/plantasonic-reference build
```

---

## Known limitations

- Reference app depends on `@plantasonic/platform-demo` for wiring — production app may inline or use a future `@plantasonic/app-kit` package
- Engine packages are linked locally (visual engine) or via GitHub npm (sound engine) — same as platform demo
- No automated migration script for legacy Plantasonic repo yet
- Use `pnpm create:app` to scaffold new thin apps instead of copying reference manually

---

## Related documentation

- [ARCHITECTURE.md](../ARCHITECTURE.md) — ecosystem boundaries
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) — adapter patterns
- [PUBLIC_API.md](./PUBLIC_API.md) — SDK reference
- [ROADMAP.md](../ROADMAP.md) — milestone 13 migration status
