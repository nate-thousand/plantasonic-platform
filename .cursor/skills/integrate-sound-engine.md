---
name: integrate-sound-engine
description: Integrates plantasia-sound-engine via @plantasonic/platform sound adapter. Use when wiring audio, presets, ecological controls, or transport playback.
---

# Skill: Integrate Sound Engine

## Purpose

Connect `plantasia-sound-engine` through the platform adapter — never import engine APIs from UI code.

## Inputs

- Platform application instance (`createApplication`)
- Event bus reference
- Preset ids for preset bundles
- Ecological parameter defaults (growth, bloom, roots, mold, bacteria, tempo)

## Outputs

- `createSoundEngineAdapter()` instance wired to event bus
- Sound preset playback on bundle apply
- Parameter updates from inspector/performance controls

## Required packages

- `@plantasonic/platform`
- `plantasia-sound-engine` (npm dependency on app or SDK adapter layer)

## Validation checklist

- [ ] Sound accessed only via `createSoundEngineAdapter()`
- [ ] `await sound.init()` before playback
- [ ] `await sound.start()` on user gesture (transport Play)
- [ ] Preset bundles call `playPreset()` via platform apply
- [ ] `sound:*` events emitted on event bus
- [ ] No direct Tone.js or engine facade imports in app UI

## Success criteria

- Audio plays after user gesture
- Preset switching changes sound character
- Inspector sliders update ecological parameters
- Errors surface without crashing app

## Common mistakes

- Copying `PlantasiaSoundAdapter` into application repos
- Calling engine `loadPreset()` from UI components
- Autoplay before user gesture
- Duplicating engine preset validation in apps (use platform bundles)

## Example usage

```typescript
import { createApplication, createSoundEngineAdapter } from '@plantasonic/platform';

const app = createApplication(config);
const sound = createSoundEngineAdapter({ eventBus: app.eventBus });
await sound.init();
await sound.start();
await sound.playPreset('plantasonic');
await sound.updateParameter('bloom', 0.7);
```

See also: `docs/INTEGRATION_GUIDE.md` (Sound Engine section), `docs/SDK_GUIDE.md`.
