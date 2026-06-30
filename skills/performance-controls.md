---
name: performance-controls
description: Configures MIDI and keyboard performance controls via platform PerformanceControlManager. Use when wiring MIDI, keyboard input, control mappings, or performance mode.
---

# Skill: Performance Controls

## Purpose

Route MIDI and keyboard input through `createPerformanceControlManager()` — apps do not implement local MIDI modules.

## Inputs

- Sound and visual adapter references
- Performance mapping table (note/CC → parameter/action)
- MIDI enable preference
- Keyboard fallback requirement

## Outputs

- Performance manager handling MIDI + keyboard
- Control changes routed to adapters, presets, bridge, transport
- `performance:*` events on event bus

## Required packages

- `@plantasonic/platform`

## Validation checklist

- [ ] No local `src/midi/` or `src/keyboard/` in generated apps
- [ ] `createPerformanceControlManager()` wired via platform mount
- [ ] MIDI access requested on user gesture
- [ ] Keyboard fallback works when MIDI unavailable
- [ ] Performance mappings configurable via preset bundles or plugins

## Success criteria

- Keyboard triggers notes/parameters
- MIDI device connects and routes controls (when hardware present)
- Performance mode toggle works
- No duplicate input routing in app layer

## Common mistakes

- Copying legacy `midiModule.ts` / `keyboardModule.ts` into apps
- Binding keyboard events directly to engine APIs
- Skipping user gesture before `requestMIDIAccess()`

## Example usage

```typescript
import { createPerformanceControlManager, DEFAULT_PERFORMANCE_MAPPINGS } from '@plantasonic/platform';

const performance = createPerformanceControlManager({
  eventBus: app.eventBus,
  sound,
  visual,
  mappings: DEFAULT_PERFORMANCE_MAPPINGS,
});
await performance.init();
await performance.start();
await performance.requestMIDIAccess();
```

See also: `docs/SDK_GUIDE.md`, `docs/INTEGRATION_GUIDE.md`.
