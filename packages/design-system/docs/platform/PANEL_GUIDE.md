# Panel Guide

There are two complementary panel systems in the Creative Application Framework:

1. **Inspector panels** — docked, registry-driven content panels.
2. **Floating panels** — draggable, snappable, collapsible overlays.

## Inspector panels

Applications contribute panels; the Design System renders them into the
`.ps-inspector` surface.

```ts
import { createInspector, bindInspector } from 'plantasonic-design-system/instrument';

const inspector = createInspector();
inspector
  .registerPanel({ id: 'props', title: 'Properties', group: 'Inspect', render: () => '<p>…</p>' })
  .registerPanel({ id: 'perf', title: 'Performance', group: 'Inspect', collapsed: true, render: () => '<p>…</p>' });

element.innerHTML = inspector.render();
const cleanup = bindInspector(element); // collapse/expand toggles
```

`InspectorPanel` fields: `id`, `title`, optional `group`, `order`, `collapsed`,
and a `render()` that returns body HTML. Panels are grouped and sorted by
`order`. Headers are buttons with `aria-expanded`/`aria-controls` and keyboard
support.

Use inspector panels for: properties, parameters, metadata, debug,
performance, presets, automation, MIDI. Apps contribute; the DS renders.

## Floating panels

Layered on the existing `.ps-floating-panel` surface. Mark up panels with
`data-ps-floating-*` hooks and call `bindFloating`:

```html
<div class="ps-floating-panel" data-ps-floating-panel="mixer" style="left:1rem; top:1rem">
  <div class="ps-floating-panel__handle" data-ps-floating-handle>
    Mixer
    <button data-ps-floating-pin aria-pressed="false">pin</button>
    <button data-ps-floating-collapse>–</button>
  </div>
  <div class="ps-floating-panel__body">…</div>
</div>
```

```ts
import { bindFloating } from 'plantasonic-design-system/instrument';
const cleanup = bindFloating(root, { persist: true, storageKey: 'my-app', snapThreshold: 24 });
```

Supports: **drag** (handle), **edge snap**, **collapse**, **pin**, and
**remembered position** (localStorage, when `persist`). Multi-monitor and
auto-hide animations deepen in a later release; the API is stable now.

## Accessibility

- Inspector headers are focusable buttons with `aria-expanded`.
- Floating handles use `touch-action: none` and pointer capture for reliable
  dragging across mouse/touch/pen.
- Reduced motion neutralizes panel transitions.
