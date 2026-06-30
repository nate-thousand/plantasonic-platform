---
name: audio-reactive
description: Configures audio-reactive bridge between sound and visual adapters. Use when wiring bass/mids/highs mappings, bridge sensitivity, or reactive visual modulation.
---

# Skill: Audio Reactive Bridge

## Purpose

Connect sound analysis to visual parameters via `createAudioReactiveBridge()`.

## Inputs

- Sound adapter instance
- Visual adapter instance
- Mapping table (feature → visual target → amount)
- Sensitivity and smoothing values
- Enable/disable flag

## Outputs

- Bridge instance running RAF analysis loop
- Visual parameters modulated by audio features
- `bridge:*` events on platform event bus

## Required packages

- `@plantasonic/platform`
- Active sound + visual adapters

## Validation checklist

- [ ] Bridge created after both adapters initialized
- [ ] `bridge.connect(sound, visual)` called
- [ ] Bridge starts/stops with transport playback
- [ ] Mappings defined in preset bundle `audioReactive` section
- [ ] Sensitivity/smoothing exposed in inspector when enabled
- [ ] No custom FFT analysis duplicated in apps (use adapter `getAudioFeatures()`)

## Success criteria

- Visuals respond to audio amplitude and bands when bridge enabled
- Disabling bridge stops reactive modulation
- Preset bundles restore bridge config on apply
- No performance collapse on long sessions

## Common mistakes

- Implementing local audio→visual mapping in app code
- Starting bridge before sound adapter is playing
- Hardcoding mappings instead of preset bundle config
- Expecting native FFT bands (placeholder analyzer in SDK today)

## Example usage

```typescript
import { createAudioReactiveBridge, DEFAULT_AUDIO_REACTIVE_MAPPINGS } from '@plantasonic/platform';

const bridge = createAudioReactiveBridge({
  eventBus: app.eventBus,
  sound,
  visual,
  mappings: DEFAULT_AUDIO_REACTIVE_MAPPINGS,
});
await bridge.connect();
await bridge.start();
```

Preset bundle excerpt:

```typescript
audioReactive: {
  enabled: true,
  sensitivity: 0.65,
  smoothing: 0.7,
  mappings: [
    { feature: 'bass', target: 'density', amount: 0.4, enabled: true },
  ],
},
```

See also: `docs/INTEGRATION_GUIDE.md`, `templates/audio-reactive/`.
