# Game UI

```text
Build a [React + Vite | HTML/CSS] game-style HUD overlay for a Plantasonic creative application.

Layout:
- Full-screen stage/canvas (--ds-color-surface-stage) — game world or generative visual
- Non-blocking HUD corners: top-left (score/status), top-right (menu), bottom (action bar)
- Optional modal inventory/settings triggered from HUD buttons
- Minimal chrome — HUD floats above stage, does not partition the viewport

HUD elements:
- [Health/energy bar using Bootstrap .progress with token colors]
- [Score or timer: var(--ds-font-family-mono), var(--ds-font-size-caption)]
- [Quick action slots: icon buttons in .ps-toolbar]
- [Notification toasts: top-center, auto-dismiss]

Design System: Plantasonic Design System
Stack: Bootstrap 5.0.2 + CSS custom properties (--ds-*, --ps-*)
Theme: data-theme="dark"

Visual:
- HUD panels: var(--ds-color-surface-raised) at reduced opacity or var(--ds-color-overlay-glass)
- Borders: var(--ds-color-border-subtle)
- Status colors: var(--ds-color-success), var(--ds-color-warning), var(--ds-color-error) for game states only
- Text: var(--ds-color-text-primary) on HUD surfaces

Rules:
- HUD must not obscure center stage — corner and edge placement only
- All sizing via --ds-space-* and --ps-touch-target
- Bootstrap .progress, .badge, .btn for HUD widgets
- No neon gradients or decorative effects on control chrome
- Keyboard-accessible menu and dialog triggers
- Respect prefers-reduced-motion — no flashing HUD animations
```
