# Inspector Panel

```text
Build a [React + Vite | HTML/CSS] floating inspector panel for editing [entity/preset/parameter] properties in a Plantasonic application.

Layout:
- Narrow floating panel (width ~18–22rem) docked right or left of stage
- Collapsible header with title and close/collapse control
- Scrollable body with grouped parameter sections
- Optional pin/lock toggle in header

Parameter groups:
- [Group 1: e.g. Transform — position, scale, rotation as sliders]
- [Group 2: e.g. Appearance — opacity, blend, color role pickers using semantic tokens]
- [Group 3: e.g. Behavior — toggles and selects]

Design System: Plantasonic Design System
Stack: Bootstrap 5.0.2 + CSS custom properties (--ds-*, --ps-*)
Theme: data-theme="dark"

Visual:
- Panel: var(--ds-color-surface-raised), border var(--ds-color-border-default)
- Header: var(--ds-font-size-label), var(--ds-font-weight-label)
- Compact spacing: var(--ds-space-2) between controls, var(--ds-space-3) between groups
- Sliders: .form-range; numeric readouts: var(--ds-font-family-mono)

Rules:
- Use .ps-panel / panel() structure with aria-expanded on collapsible header
- .controlGroup pattern for labeled slider clusters
- Inspector floats above stage — var(--ds-shadow-lg)
- Do not compete with stage for visual weight
- All parameters keyboard-focusable with visible focus ring
- aria-valuenow on sliders; aria-pressed on toggles
- Respect prefers-reduced-motion
```
