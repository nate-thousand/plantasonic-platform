# Creative Application Guide

The Creative Application Framework (Phase 3) turns the Design System into a
first-class platform for **immersive creative software** — music, visual art,
video, animation, VJ, lighting, generative/AI, creative coding, installation
art, simulation, and performance tools.

Applications consume these capabilities directly. They provide business logic,
domain models, content, and engine integrations; the Design System provides the
shell, regions, transport UI, inspector layout, status display, floating
behavior, and input plumbing.

> Built to be reusable by **any** creative application — there are no
> Plantasonic-specific assumptions in the framework.

## Public entrypoints

| Import | Purpose |
|---|---|
| `plantasonic-design-system/instrument` | Regions, transport, canvas mounts, inspector + status registries, modes, floating, input |
| `plantasonic-design-system/creative-workspace` | Layout presets (instrument, visualizer, installation, presentation, studio) |
| `plantasonic-design-system/app` | `createApplication()` SDK |
| `plantasonic-design-system/scss/instrument.scss` | Instrument shell + region styles (token-driven) |
| `plantasonic-design-system/shell` | `renderApplicationShell({ variant: 'instrument' })` |

## The fastest path — the SDK

```ts
import { createApplication } from 'plantasonic-design-system/app';
import { renderCanvasMount, METRIC_PRESETS, mountCanvas, canvas2dAdapter } from 'plantasonic-design-system/instrument';
import 'plantasonic-design-system/scss/instrument.scss';

const app = createApplication({ title: 'My Instrument', id: 'my-instrument', persistState: true });

app
  .registerWorkspace({ id: 'main', render: () => renderCanvasMount('stage') })
  .registerTransport({ state: { tempo: 120 } }, { play: () => engine.start(), stop: () => engine.stop() })
  .registerInspector({ id: 'props', title: 'Properties', render: () => '<p>…</p>' })
  .registerStatus([METRIC_PRESETS.fps(() => sampler.fps())]);

await app.mount(document.getElementById('root')!);

// Mount any renderer into the stage without changing layout:
mountCanvas(document.getElementById('stage')!, canvas2dAdapter((g, ctx) => {
  g.clearRect(0, 0, ctx.width, ctx.height);
}));
```

## Building blocks

- **[Creative Workspace Guide](./CREATIVE_WORKSPACE_GUIDE.md)** — layout presets between shell and content.
- **[Instrument Shell Guide](./INSTRUMENT_SHELL_GUIDE.md)** — the canvas-first shell variant.
- **[Workspace Guide](./WORKSPACE_GUIDE.md)** — standardized regions and modes.
- **[Panel Guide](./PANEL_GUIDE.md)** — inspector panels + floating panels.
- **[Transport Guide](./TRANSPORT_GUIDE.md)** — transport UI + behavior.
- **[Canvas Guide](./CANVAS_GUIDE.md)** — swap renderers via mount adapters.
- **[Presentation Mode Guide](./PRESENTATION_MODE_GUIDE.md)** — demo/presenter chrome.
- **[Touch Mode Guide](./TOUCH_MODE_GUIDE.md)** — tablet/phone ergonomics.
- **[Application Architecture Guide](./APPLICATION_ARCHITECTURE_GUIDE.md)** — how the layers fit together.

## Principles

1. **Additive & backward compatible.** `renderApplicationShell()` with no
   `variant` behaves exactly as before. Every new field is optional.
2. **DS provides UI, app provides behavior.** Render functions return HTML
   strings; `bind*()` helpers wire DOM to your logic and emit CustomEvents.
3. **Token-driven.** No hardcoded color/spacing/motion — everything flows
   through the design token pipeline.
4. **Accessible by default.** Landmarks, ARIA, keyboard, and reduced-motion are
   built in; touch mode enlarges hit targets.
