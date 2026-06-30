---
name: integrate-visual-engine
description: Integrates ascii-visual-engine via @plantasonic/platform visual adapter. Use when wiring ASCII canvas, visual presets, or stage rendering.
---

# Skill: Integrate Visual Engine

## Purpose

Connect `ascii-visual-engine` through the platform visual adapter — never import engine APIs from UI code.

## Inputs

- Stage DOM container (from DS shell region)
- Visual preset ids (glyph presets or mapped sound ids)
- Visual parameters (density, speed, glitchAmount, trailAmount)

## Outputs

- `createVisualEngineAdapter()` mounted in stage region
- Canvas render loop controlled by transport
- Preset and parameter updates on bundle apply

## Required packages

- `@plantasonic/platform`
- `ascii-visual-engine` (npm dependency)

## Validation checklist

- [ ] Visual accessed only via `createVisualEngineAdapter()`
- [ ] `await visual.init()` then `visual.mount({ container })`
- [ ] `await visual.start()` synced with transport
- [ ] `setPreset()` called on bundle apply
- [ ] `ResizeObserver` or resize handler forwards to `visual.resize()`
- [ ] `visual:*` events on event bus
- [ ] No direct `AsciiEngine` imports in app UI

## Success criteria

- ASCII canvas renders in stage region
- Preset switching changes visual character
- Visual parameters respond to inspector sliders
- Canvas resizes with container

## Common mistakes

- Copying `PlantasiaAsciiAdapter` into application repos
- Creating canvas outside DS stage region
- Not calling `visual.start()` with transport
- Duplicating visual preset id mapping (use `resolveVisualPresetId()`)

## Example usage

```typescript
import { createVisualEngineAdapter, resolveVisualPresetId } from '@plantasonic/platform';

const visual = createVisualEngineAdapter({ eventBus: app.eventBus });
await visual.init();
await visual.mount({ container: stageElement });
await visual.start();
await visual.setPreset(resolveVisualPresetId('glyphOrganicBloom'));
await visual.updateParameter('density', 0.8);
```

See also: `docs/INTEGRATION_GUIDE.md` (Visual Engine section), `docs/SDK_GUIDE.md`.
