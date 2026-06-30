# Engine Integration Guide

Applications **install** shared engines — they do not embed engine source.

---

## Engine catalog

Ten official engines ship in `ENGINE_CATALOG`:

| ID | Package | Role |
| --- | --- | --- |
| `engine.sound` | `plantasia-sound-engine` | Audio synthesis and ambience |
| `engine.visual` | `ascii-visual-engine` | ASCII / generative visuals |
| `engine.physics` | `@plantasonic/physics-engine` | Simulation |
| `engine.particle` | `@plantasonic/particle-engine` | Particle systems |
| `engine.animation` | `@plantasonic/animation-engine` | Timeline animation |
| `engine.lighting` | `@plantasonic/lighting-engine` | DMX / lighting control |
| `engine.midi` | `@plantasonic/midi-engine` | Web MIDI |
| `engine.osc` | `@plantasonic/osc-engine` | Open Sound Control |
| `engine.camera` | `@plantasonic/camera-engine` | Capture / video input |
| `engine.ai` | `@plantasonic/ai-engine` | AI-assisted generation |

---

## Install an engine

```typescript
import { installEngine, resolveEngineInstall, enginesForPrototype } from 'plantasonic-design-system/platform';

const spec = installEngine('engine.sound');
// { id, name, package, version, dependencies }

const all = resolveEngineInstall(['engine.lighting']);
// Includes transitive deps (e.g. engine.midi for lighting control)
```

Generated projects include `src/platform/engines.ts` with adapter stubs and `package.json` dependencies resolved from the manifest.

---

## Prototype defaults

`enginesForPrototype(type)` maps each of the 12 prototype types to recommended engines. `createProject()` merges user flags (`sound`, `midi`, `visual`) with catalog defaults.

---

## Adapter pattern

Generated apps use thin adapters — not forked engines:

```
src/engines/soundAdapter.ts   → npm:plantasia-sound-engine
src/engines/visualAdapter.ts    → npm:ascii-visual-engine
```

Runtime orchestration stays in application code; engines expose stable adapter contracts.

---

## Project manifest

`platform.json` lists installed engines:

```json
{
  "engines": ["engine.sound", "engine.visual", "engine.midi"]
}
```

Cross-project maintenance uses `projectRegistry.engineUsage()` to find every project sharing an engine.
