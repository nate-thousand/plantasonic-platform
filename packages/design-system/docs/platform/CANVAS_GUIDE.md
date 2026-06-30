# Canvas Guide

Support immersive content and **swap renderers without changing layout**. The
framework owns the lifecycle; your renderer owns the pixels.

## Mount a renderer

```ts
import { mountCanvas, canvas2dAdapter } from 'plantasonic-design-system/instrument';

const stage = document.getElementById('stage')!; // contains [data-ps-canvas-mount]
const mount = mountCanvas(stage, canvas2dAdapter((g, ctx) => {
  g.clearRect(0, 0, ctx.width, ctx.height);
  g.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--ds-color-primary');
  g.fillRect(0, 0, ctx.width, ctx.height);
}));

// later
mount.resize();
mount.destroy();
```

`mountCanvas(stageEl, adapter)`:

- Resolves the `[data-ps-canvas-mount]` slot (or uses the stage element).
- Measures CSS size + device pixel ratio.
- Calls `adapter.create(ctx)`, then wires `ResizeObserver` (→ `resize`),
  visibility (`visibilitychange` + `IntersectionObserver` → `visibility`).
- Returns `{ type, handle, host, resize(), destroy() }`.

## Supported renderer types

`canvas2d`, `webgl`, `svg`, `html`, `three`, `pixi`, `ascii`, `video`, `image`,
`mixed`.

## Built-in adapters

| Adapter | Type |
|---|---|
| `canvas2dAdapter(draw)` | `canvas2d` — `draw(g, ctx)` on create/resize |
| `htmlAdapter(html)` | `html` — arbitrary markup layer |
| `imageAdapter(src, alt?)` | `image` |
| `videoAdapter(src, { loop, muted, autoplay })` | `video` — pauses when hidden |

## Custom adapters (WebGL / Three / Pixi / ASCII / SVG / Mixed)

Implement the `CanvasAdapter` contract:

```ts
import type { CanvasAdapter } from 'plantasonic-design-system/instrument';

const threeAdapter: CanvasAdapter<{ renderer: THREE.WebGLRenderer }> = {
  type: 'three',
  create: (ctx) => {
    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(ctx.dpr);
    renderer.setSize(ctx.width, ctx.height);
    ctx.host.appendChild(renderer.domElement);
    return { renderer };
  },
  resize: (h, ctx) => h.renderer.setSize(ctx.width, ctx.height),
  visibility: (h, visible) => { /* pause/resume loop */ },
  destroy: (h) => h.renderer.dispose(),
};

mountCanvas(stage, threeAdapter);
```

Shipped Three/Pixi/ASCII adapters land in a later release on this same API.

## CanvasContext

```ts
type CanvasContext = { host: HTMLElement; width: number; height: number; dpr: number };
```
