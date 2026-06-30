# Settings Panel

```text
Build a [React + Vite | HTML/CSS] settings panel for a Plantasonic application.

Layout:
- Panel container (.ps-panel or .card) with scrollable body
- Section headers for grouped settings: Audio, Display, Input, Account
- Sticky footer with Save / Cancel actions

Controls:
- Toggles: Bootstrap .form-check.form-switch
- Selects: Bootstrap .form-select
- Text inputs: Bootstrap .form-control
- Range sliders: Bootstrap .form-range with visible value label
- [List specific settings: e.g. theme, reduced motion, MIDI device, output volume]

Design System: Plantasonic Design System
Stack: Bootstrap 5.0.2 + CSS custom properties (--ds-*, --ps-*)
Theme: data-theme="dark"

Visual:
- Panel background: var(--ds-color-surface-raised)
- Section dividers: var(--ds-color-border-subtle)
- Labels: var(--ds-font-size-label), var(--ds-color-text-secondary)
- Focus: var(--ds-color-border-focus), var(--ds-shadow-focus)
- Spacing between sections: var(--ds-space-5)

Rules:
- Every input has an associated <label> or aria-labelledby
- Group related controls with fieldset/legend or role="group"
- Theme selector sets data-theme on document root — no inline theme colors
- No hardcoded hex or custom toggle components
- Save button: .btn.btn-primary; Cancel: .btn.btn-outline-secondary
- Respect prefers-reduced-motion
```
