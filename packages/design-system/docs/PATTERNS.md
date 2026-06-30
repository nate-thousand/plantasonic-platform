# Pattern Guidance

Interaction and layout patterns for Plantasonic applications.

See [VISION_AND_SCOPE.md](./VISION_AND_SCOPE.md) for the full interaction philosophy.

---

## App Shell

Persistent instrument layout shared across Plantasonic apps:

```text
┌─────────────────────────────────┐
│ TopNav (--ps-nav-height)        │
├──────────┬──────────────────────┤
│ Sidebar  │ Stage (primary focus)  │
│ (opt.)   │                      │
├──────────┴──────────────────────┤
│ ControlDock (--ps-dock-height)  │
└─────────────────────────────────┘
```

| Region | Purpose | Surface token |
| ------ | ------- | ------------- |
| TopNav | Brand, global actions, status | `surface.nav` |
| Sidebar | Presets, settings, sliders | `surface.raised` |
| Stage | Visual canvas — darkest, quietest | `surface.stage` |
| ControlDock | Transport, primary controls | `surface.dock` |
| Overlays | Preset browser, settings, dialogs | `surface.overlay` + elevation |

Layout classes (`ps-app`, `ps-stage`, `ps-dock`, etc.) are defined in consuming apps — not this package. See [COMPONENT_MAPPING.md](./COMPONENT_MAPPING.md).

---

## Instrument-First

- Stage owns visual priority; chrome supports without competing
- Controls live in the dock and sidebar — not overlaid on the stage
- In performance mode, chrome recedes via `--ps-performance-chrome-opacity`
- Stage area stays visually quiet — chrome uses muted text tokens

---

## Interaction Patterns

| Pattern | Behavior |
| ------- | -------- |
| Primary action | One primary button per view section |
| Focus | Visible ring via `--ds-shadow-focus` |
| Touch | Minimum `--ps-touch-target` (2.75rem) |
| Hover | Surface lift (`surface.raised-hover`), subtle — never decorative |
| Motion | Communicates state; respect `prefers-reduced-motion` |
| Overlays | Backdrop `--ds-color-overlay-backdrop`, elevated shadow |

---

## Responsive Behavior

- Desktop: sidebar + stage + dock grid
- Tablet: collapsible sidebar, full-width stage
- Mobile: offcanvas sidebar, dock controls use `btn-sm` with touch targets preserved
- Large displays / installations: scale spacing, preserve identity

---

## Future Patterns

Document as they are standardized in this package:

- Empty states (preset list)
- Error display (runtime failures)
- Loading states (engine init)

---

## Related

- [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md)
- [COMPONENT_MAPPING.md](./COMPONENT_MAPPING.md)
