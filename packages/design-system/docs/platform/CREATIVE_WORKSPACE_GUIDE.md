# Creative Workspace Guide

Reusable **layout presets** for creative software. The Creative Workspace layer
sits **between the Application Shell and application content** — it does not
replace the shell, platform, or engines.

Applications pick a preset, pass content strings for each region, and mount the
result inside `renderApplicationShell()`. The **stage is always dominant**;
transport, inspector, preset browser, status HUD, and command palette are
**floating overlays**, not permanent dashboard panels.

![Layer stack](./assets/creative-workspace/layer-stack.svg)

## Public entrypoint

```typescript
import {
  renderCreativeWorkspace,
  renderInstrumentWorkspace,
  bindCreativeWorkspace,
  WORKSPACE_PRESETS,
} from 'plantasonic-design-system/creative-workspace';
```

```scss
@import 'plantasonic-design-system/scss/instrument';
@import 'plantasonic-design-system/scss/creative-workspace';
```

## Layering

```
Application Shell (renderApplicationShell)
        │
        ▼
Creative Workspace (renderCreativeWorkspace)  ← this guide
        │
        ▼
Application content (canvas, scene, domain UI)
```

Pair with the instrument shell variant:

```typescript
import { renderApplicationShell, bindApplicationShell } from 'plantasonic-design-system/shell';
import { renderCreativeWorkspace } from 'plantasonic-design-system/creative-workspace';
import { renderTransport, renderCanvasMount } from 'plantasonic-design-system/instrument';

const workspaceHtml = renderCreativeWorkspace({
  preset: 'instrument',
  stage: renderCanvasMount('stage'),
  transport: renderTransport({ state: { tempo: 120 } }),
  inspector: '<div class="ps-inspector">…</div>',
  presetBrowser: '<nav>…</nav>',
  statusHud: '<span>FPS 60</span>',
  commandPalette: false, // omit when not needed
});

document.getElementById('root')!.innerHTML = renderApplicationShell(
  { variant: 'instrument', title: 'My App' },
  workspaceHtml,
);
bindApplicationShell({ variant: 'instrument' });
bindCreativeWorkspace(document.querySelector('.ps-creative-workspace'));
```

## Workspace presets

| Preset | Best for | Default surfaces |
| --- | --- | --- |
| `instrument` | Music, generative, performance tools | Stage, transport, inspector, preset browser, HUD, optional palette |
| `visualizer` | Live visualization, passive viewing | Stage, HUD, optional transport |
| `installation` | Gallery, site-specific, immersive | Stage, ambient HUD, optional browser |
| `presentation` | Demos, talks, showrooms | Stage, hidden-until-hover transport, brand |
| `studio` | Multi-tool production | Stage, browser, inspector, transport, HUD, optional palette |

```typescript
renderCreativeWorkspace({ preset: 'studio', stage, transport, inspector });
// or call a preset directly:
renderVisualizerWorkspace({ stage, statusHud: metrics.renderStatusBar() });
```

## Instrument Workspace regions

![Instrument layout](./assets/creative-workspace/instrument-layout.svg)

| Region | Surface | Placement | Notes |
| --- | --- | --- | --- |
| Fullscreen Stage | `renderFullscreenStage()` | Fills viewport | Primary focus — canvas, renderer, scene |
| Floating Transport | `renderFloatingTransport()` | Bottom center | Pass `renderTransport()` output |
| Floating Inspector | `renderFloatingInspector()` | Right | Pass `renderInspector()` output |
| Preset Browser | `renderPresetBrowser()` | Left | Libraries, presets, assets |
| Status HUD | `renderStatusHud()` | Top right | Non-interactive metrics |
| Command Palette | `renderCommandPaletteSlot()` | Top center | Optional; shell may also render palette |

Omit any region with `false`:

```typescript
renderInstrumentWorkspace({
  stage: renderCanvasMount(),
  transport: renderTransport(),
  inspector: false,
  presetBrowser: false,
  commandPalette: false,
});
```

## Floating surface primitives

Use these directly when composing custom presets:

```typescript
import {
  renderFullscreenStage,
  renderFloatingTransport,
  renderFloatingInspector,
  renderPresetBrowser,
  renderStatusHud,
  renderCommandPaletteSlot,
} from 'plantasonic-design-system/creative-workspace';

renderFloatingInspector(content, { anchor: 'center-right', id: 'props' });
```

Anchors: `top-left`, `top-center`, `top-right`, `center-left`, `center-right`,
`bottom-left`, `bottom-center`, `bottom-right`.

## Behavior

`bindCreativeWorkspace(root)` wires drag, edge-snap, collapse, and pin on
`.ps-floating-panel` surfaces inside the workspace. Positions can persist via
`{ persist: true, storageKey: 'my-app' }`.

## Relationship to other layers

| Layer | Responsibility |
| --- | --- |
| `plantasonic-design-system/shell` | App chrome, navigation, theme, commands |
| `plantasonic-design-system/creative-workspace` | **Layout presets between shell and content** |
| `plantasonic-design-system/instrument` | Regions, transport, canvas, inspector, status, input |
| `plantasonic-design-system/app` | `createApplication()` SDK orchestration |
| `plantasonic-design-system/studio` | Portfolio / multi-project orchestration (different `CreativeWorkspace` type) |

> **Note:** `plantasonic-design-system/studio` uses a `CreativeWorkspace` type for
> multi-project portfolio management. The **Creative Workspace layout layer**
> (`./creative-workspace`) is UI layout only — see
> [Studio Workspace Guide](./STUDIO_WORKSPACE_GUIDE.md) for portfolio APIs.

## Principles

1. **Stage-first.** The canvas or scene always fills the workspace frame.
2. **Overlays, not sidebars.** Supporting UI floats above the stage.
3. **Preset-driven.** Pick `instrument`, `visualizer`, `installation`,
   `presentation`, or `studio` — do not copy grid markup.
4. **Additive.** Existing shell and instrument APIs are unchanged.
5. **Token-driven.** Import `scss/creative-workspace.scss`; no hardcoded chrome.

## See also

- [Creative Application Guide](./CREATIVE_APPLICATION_GUIDE.md)
- [Instrument Shell Guide](./INSTRUMENT_SHELL_GUIDE.md)
- [Application Architecture Guide](./APPLICATION_ARCHITECTURE_GUIDE.md)
