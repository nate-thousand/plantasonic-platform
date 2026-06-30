# Audio App UI

```text
Build a [React + Vite | HTML/CSS] audio instrument interface for a Plantasonic application.

Layout (instrument preset):
- Full-width stage/canvas region (--ds-color-surface-stage) as visual hero
- Floating transport bar at bottom (--ps-dock-height) with play/stop/record controls
- Collapsible inspector panel on the right for parameter editing
- Optional preset browser sidebar on the left
- Top nav (--ps-nav-height) minimal: title, project name, settings icon

Controls:
- Transport: icon buttons (play, pause, stop) in a .ps-toolbar
- Parameters: .form-range sliders with .form-label (e.g. tempo, bloom, density)
- Meters: status indicators using var(--ds-color-primary) for active signal
- Preset cards: .card with aria-selected state

Design System: Plantasonic Design System
Stack: Bootstrap 5.0.2 + CSS custom properties (--ds-*, --ps-*)
Theme: data-theme="dark"

Visual:
- Stage dominates viewport; chrome uses var(--ds-color-surface-nav) / var(--ds-color-surface-dock)
- Accent: var(--ds-color-primary) for active transport and signal
- Mono readouts: var(--ds-font-family-mono) for BPM, timecode
- Touch targets: min var(--ps-touch-target)

Rules:
- Use Bootstrap .btn, .form-range, .form-label — no custom slider components
- Floating panels use var(--ds-color-overlay-glass) backdrop
- Sliders need aria-valuemin, aria-valuemax, aria-valuenow
- Icon buttons require aria-label
- No DAW-style dense parameter walls — keep inspector focused
- Respect prefers-reduced-motion
```
