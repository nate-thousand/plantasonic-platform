# Presentation Mode Guide

Presentation mode prepares an instrument for demonstrations: it hides editing
controls and shows a clean, branded, minimal-chrome surface.

## Enable

```ts
import { setShellMode } from 'plantasonic-design-system/instrument';

setShellMode(root, 'presentation', { shellId: 'my-instrument', persist: true });
```

Or set it at render time:

```ts
renderApplicationShell({
  variant: 'instrument',
  mode: 'presentation',
  instrument: { brand: '<strong>My Studio</strong>' },
});
```

## What it does

- Hides editing chrome: rail, aside/inspector, sidebar, toolbar, timeline, and
  anything tagged `[data-ps-editing]` or `[data-ps-dev]`.
- The transport bar is hidden by default and **auto-reveals on hover/focus**,
  keeping the canvas front and center.
- Renders presenter **branding** (`instrument.brand`) in the corner via
  `.ps-presenter-brand`.
- Provides a `.ps-presenter-pointer` affordance for pointer highlighting.

## Tips

- Combine with fullscreen (`element.requestFullscreen()`).
- Tag any controls you want hidden during a demo with `data-ps-editing`.
- Reduced motion is respected — the transport reveal transition is neutralized.

## Related

- [Workspace Guide](./WORKSPACE_GUIDE.md) — all display modes.
- [Touch Mode Guide](./TOUCH_MODE_GUIDE.md) — tablet/phone presentations.
