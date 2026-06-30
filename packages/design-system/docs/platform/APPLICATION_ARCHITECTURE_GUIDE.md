# Application Architecture Guide

How the Creative Application Framework layers fit together, and how an app wires
itself with `createApplication()`.

## Layering

```
Application (business logic, domain models, content, engine integrations)
        │  registers workspaces / panels / transport / status / input
        ▼
createApplication()  ── plantasonic-design-system/app
        │  mount()
        ▼
renderApplicationShell({ variant: 'instrument' })  ── /shell
        │
        ├─ regions / transport / inspector / status  ── /instrument
        ├─ canvas mount adapters                      ── /instrument
        ├─ floating + modes + input                   ── /instrument
        ▼
Design tokens → CSS variables → scss/instrument.scss
```

No application implements its own shell infrastructure.

## The SDK

`createApplication(config)` returns a controller. `config` extends
`ApplicationShellConfig` (so `title`, `id`, `theme`, `persistState`, `commands`,
etc. all apply) and defaults `variant` to `'instrument'`.

```ts
import { createApplication } from 'plantasonic-design-system/app';

const app = createApplication({ title: 'My Instrument', id: 'my-app', persistState: true });
```

### Registration API (chainable)

| Method | Purpose |
|---|---|
| `registerWorkspace({ id, label?, render })` | Stage content; first registered is active. |
| `registerPanels(panels)` / `registerInspector(panel)` | Inspector panels. |
| `registerTransport(config, handlers?)` | Transport UI + behavior. |
| `registerStatus(metrics)` | Output metrics (FPS/CPU/…); displayed consistently. |
| `registerCommands(commands)` | Command palette entries. |
| `registerInput(adapter)` | Device adapter (MIDI/gamepad/pen). |
| `setMode(mode)` | Switch display mode. |

### Introspection

- `getWorkspaces()` — registered workspaces.
- `buildInstrument()` — the composed `InstrumentConfig`.
- `getConfig()` — the full `ApplicationShellConfig` (variant, mode, commands, instrument).
- `app.input`, `app.inspector`, `app.metrics` — the live registries.

### Lifecycle

```ts
await app.mount(document.getElementById('root')!);
// renders the instrument shell and wires:
//   bindApplicationShell (palette/theme/keyboard)
//   bindTransport, bindFloating, bindInspector
//   startMetricsLoop (rAF), input.attach + adapters

app.unmount(); // tears down all listeners and the input manager
```

## Creative input layer

`createInputManager()` normalizes input so apps subscribe to events instead of
re-implementing device plumbing.

```ts
const input = createInputManager().attach(stageEl);
const off = input.on('pointer', (p) => { /* x, y, buttons, pointerType, pressure */ });
input.on('key', (k) => { /* key, code, mods */ });
input.on('wheel', (w) => { /* dx, dy */ });
input.on('gesture', (g) => { /* pinch scale */ });
```

Device backends attach as adapters on the same API:

```ts
const detach = input.registerAdapter({
  name: 'web-midi',
  attach: (emit) => {
    // subscribe to MIDIAccess, then emit('key' | custom, payload)
    return () => { /* cleanup */ };
  },
});
```

Web MIDI, Gamepad, and pen-pressure backends ship in a later release on this
exact contract.

## Creative output layer

Register metrics; the DS displays them consistently and updates them on a
throttled rAF loop.

```ts
import { createMetrics, METRIC_PRESETS, startMetricsLoop, createFpsSampler } from 'plantasonic-design-system/instrument';

const sampler = createFpsSampler(); // call sampler.frame() each rendered frame
const metrics = createMetrics([
  METRIC_PRESETS.fps(() => sampler.fps()),
  METRIC_PRESETS.cpu(() => cpuPercent()),
  METRIC_PRESETS.latency(() => audioLatencyMs()),
]);

root.querySelector('[data-ps-region="status"]')!.innerHTML = metrics.renderStatusBar();
const stop = startMetricsLoop(root, metrics);
```

Presets: `fps`, `cpu`, `gpu`, `audio`, `midi`, `memory`, `renderer`, `latency`,
`recording`, `streaming`.

## Backward compatibility

The standard navigation shell, every token, and all `.ps-*`/`.bs-*`/`.ds-*`
classes are untouched. The instrument variant and all SDK fields are additive
and optional. See [MIGRATION](./MIGRATION.md).
