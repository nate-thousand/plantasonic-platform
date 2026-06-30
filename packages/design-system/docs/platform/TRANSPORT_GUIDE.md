# Transport Guide

A reusable transport framework. **The Design System provides the UI; the
application provides the behavior.**

## Render

```ts
import { renderTransport } from 'plantasonic-design-system/instrument';

const html = renderTransport({
  state: { tempo: 120, time: '1.1.0', sync: 'Internal' },
  record: true,   // show record (default true)
  loop: true,     // show loop
  tempo: true,    // show tempo display
  time: true,     // show time/clock
  sync: true,     // show sync indicator
  performance: true, // show performance-mode toggle
});
```

Reuses the existing `.ps-transport`, `.ps-transport-btn`, `.ps-tempo-display`,
and `.ps-time-display` surfaces. The toolbar has `role="toolbar"` and labelled
controls.

## Bind behavior

```ts
import { bindTransport } from 'plantasonic-design-system/instrument';

const cleanup = bindTransport(root, {
  play:   (s) => s.playing ? engine.start() : engine.pause(),
  stop:   () => engine.stop(),
  record: (s) => engine.setRecording(s.recording),
  loop:   (s) => engine.setLoop(s.looping),
  performance: (on) => setShellMode(instrumentRoot, on ? 'performance' : 'edit'),
  change: (s) => console.log('transport', s),
}, { tempo: 120 });
```

`bindTransport` maintains a `TransportState`, toggles button UI, calls your
handlers, and dispatches bubbling CustomEvents so multiple listeners can react:

- `ps-transport-play`, `ps-transport-stop`, `ps-transport-record`,
  `ps-transport-loop`, `ps-transport-performance`
- `ps-transport-change` (fires for every action)

```ts
root.addEventListener('ps-transport-change', (e) => updateClock(e.detail.time));
```

## TransportState

```ts
type TransportState = {
  playing: boolean;
  recording: boolean;
  looping: boolean;
  tempo: number;   // BPM
  time: string;    // position label
  sync?: string;   // clock source
  performance?: boolean;
};
```

`DEFAULT_TRANSPORT_STATE` provides sensible defaults (120 BPM, internal sync).
