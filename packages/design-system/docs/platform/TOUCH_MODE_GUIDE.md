# Touch Mode Guide

Touch mode optimizes an instrument for tablets and phones: larger hit targets,
adaptive spacing, and thumb-reachable controls.

## Enable

```ts
import { setShellMode } from 'plantasonic-design-system/instrument';

setShellMode(root, 'touch', { shellId: 'my-instrument', persist: true });
```

You can auto-detect coarse pointers:

```ts
if (window.matchMedia('(pointer: coarse)').matches) {
  setShellMode(root, 'touch', { shellId, persist: true });
}
```

## What it does

- Promotes the touch target token: `--ps-touch-target` resolves to
  `--ps-touch-target-large` (3.25rem) within `.ps-instrument--touch`.
- Enlarges transport buttons, dock items, and toolbar controls to the large
  target.
- Adds vertical padding to the transport row.
- Supports a `.ps-thumb-zone` container to keep primary controls near the bottom
  edge for thumb reach.

## Gestures

The unified input layer normalizes pointer input across mouse/touch/pen and
emits basic two-pointer **pinch** gestures:

```ts
import { createInputManager } from 'plantasonic-design-system/instrument';

const input = createInputManager().attach(stage);
input.on('gesture', (g) => { if (g.gesture === 'pinch') zoom(g.scale); });
input.on('pointer', (p) => { if (p.pointerType === 'touch') /* … */ });
```

See the [Application Architecture Guide](./APPLICATION_ARCHITECTURE_GUIDE.md)
for the full input model.

## Accessibility

- Large targets meet touch ergonomics.
- Orientation changes are handled by the responsive grid (stage + transport
  stack on narrow viewports).
- All controls remain keyboard reachable.
