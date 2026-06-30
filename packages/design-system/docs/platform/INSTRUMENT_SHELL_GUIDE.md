# Instrument Shell Guide

The `instrument` shell variant is an edge-to-edge, canvas-first chrome for
immersive creative software. It is an **additive** variant of the existing
application shell — the standard navigation shell is unchanged.

## Characteristics

- Fullscreen, immersive, canvas-first
- Minimal chrome, floating controls
- Edge-to-edge workspace with collapsible interface
- Performance-optimized, touch-friendly, keyboard-friendly, MIDI-friendly
- Safe-area aware (notches, fullscreen)

## Usage

```ts
import { renderApplicationShell } from 'plantasonic-design-system/shell';
import { renderTransport, renderStatusBar, createMetrics, METRIC_PRESETS } from 'plantasonic-design-system/instrument';
import 'plantasonic-design-system/scss/instrument.scss';

const metrics = createMetrics([METRIC_PRESETS.fps(() => 60)]);

const html = renderApplicationShell({
  title: 'My Instrument',
  variant: 'instrument',
  mode: 'edit', // edit | performance | presentation | touch
  instrument: {
    stage: '<div data-ps-canvas-mount id="stage"></div>',
    transport: renderTransport({ state: { tempo: 120 } }),
    status: metrics.renderStatusBar(),
    rail: '…',   // left tools rail
    aside: '…',  // inspector
    hud: '…',    // heads-up overlay
  },
});
document.getElementById('root')!.innerHTML = html;
```

Behavior is wired with `bindApplicationShell(config)` (command palette, theme,
keyboard) plus the instrument `bind*()` helpers (`bindTransport`,
`bindFloating`, `bindInspector`, `startMetricsLoop`) — or use
`createApplication()` to wire everything for you.

## Frame layout

```
┌──────┬──────────────────────────┬───────┐
│ rail │  stage (canvas + hud +   │ aside │
│      │  floating + timeline)    │       │
│      ├──────────────────────────┤       │
│      │  transport + status      │       │
└──────┴──────────────────────────┴───────┘
```

- `rail` / `aside` columns are `auto` — omit them and the grid collapses.
- The stage fills remaining space and hosts the canvas mount slot.
- The transport row spans the stage column at the bottom.

## InstrumentConfig

| Field | Type | Notes |
|---|---|---|
| `stage` | `string` | Stage/canvas markup. Defaults to a `.ps-canvas-mount` slot. |
| `transport` | `string \| false` | Transport markup, or `false` to hide. |
| `status` | `string` | Status bar markup. |
| `hud` | `string` | Non-interactive heads-up overlay. |
| `rail` | `string` | Left tools rail. |
| `aside` | `string` | Right inspector. |
| `timeline` | `string` | Timeline below the stage. |
| `floating` | `string` | Floating panels layer. |
| `brand` | `string` | Presenter branding (presentation mode). |
| `mode` | `ShellMode` | Initial display mode. |

## Backward compatibility

`renderApplicationShell({ /* no variant */ })` renders the standard navigation
shell exactly as before. The instrument frame is hosted inside the same
`[data-ps-app-shell]` root, so command palette, overlays, notifications, theme,
and keyboard shortcuts all work unchanged.
