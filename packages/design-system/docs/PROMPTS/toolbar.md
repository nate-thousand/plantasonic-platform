# Toolbar

```text
Build a [React + Vite | HTML/CSS] horizontal toolbar for [transport | editing | view controls] in a Plantasonic application.

Layout:
- Full-width bar (--ps-dock-height or compact variant)
- Left cluster: primary actions (play, stop, record)
- Center cluster (optional): tempo, time display (var(--ds-font-family-mono))
- Right cluster: view toggles, overflow menu
- Groups separated by subtle dividers (var(--ds-color-border-subtle))

Controls:
- Icon buttons: square, aria-label required, min var(--ps-touch-target)
- Toggle buttons: aria-pressed state
- [List specific actions: e.g. Play, Pause, Loop, Metronome, Mixer, Fullscreen]

Design System: Plantasonic Design System
Stack: Bootstrap 5.0.2 + CSS custom properties (--ds-*, --ps-*)
Theme: data-theme="dark"

Visual:
- Toolbar background: var(--ds-color-surface-dock)
- Active/pressed: var(--ds-color-primary) or var(--ds-color-surface-raised-hover)
- Icons: var(--ds-color-text-primary); disabled: var(--ds-color-text-muted)
- Spacing between groups: var(--ds-space-3)

Structure:
- role="toolbar" with aria-label
- Inner groups: role="group" with aria-label per group
- Use .ps-toolbar / toolbar() + toolbarGroup() patterns

Rules:
- Bootstrap .btn.btn-sm for text actions; icon-only buttons need aria-label
- No custom toolbar component — reuse platform toolbar API
- Horizontal scroll on narrow viewports, not wrapping into multi-row clutter
- Press feedback: animate(el, 'press') when motion allowed
- Respect prefers-reduced-motion
```
