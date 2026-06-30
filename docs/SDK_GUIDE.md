# SDK Guide

Reference for `@plantasonic/platform` and `@plantasonic/platform-types`.

> Full API reference: [PUBLIC_API.md](./PUBLIC_API.md)

## Core factories

| Factory | Purpose |
|---------|---------|
| `createApplication()` | Application instance + lifecycle |
| `createEventBus()` | Typed pub/sub |
| `createWorkspace()` | Region layout contract |
| `createSoundEngineAdapter()` | Sound engine wrapper |
| `createVisualEngineAdapter()` | Visual engine wrapper |
| `createAudioReactiveBridge()` | Sound → visual modulation |
| `createPresetBundleRegistry()` | Unified preset bundles |
| `createPerformanceControlManager()` | MIDI + keyboard |
| `createPluginManager()` | Plugin registration |
| `createWorkspacePersistence()` | Project save/load |

## Mount API (applications)

```typescript
import { mountInstrumentApp, type InstrumentAppContent } from '@plantasonic/platform-demo/instrument-app';
```

## Types package

All config interfaces live in `@plantasonic/platform-types`:

- `ApplicationConfig`, `PresetBundle`, `PlatformPlugin`, `ProjectState`, etc.

## Cross references

- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- Skills: `integrate-sound-engine`, `integrate-visual-engine`, `audio-reactive`, `performance-controls`, `project-persistence`
