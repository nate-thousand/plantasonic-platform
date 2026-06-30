# Sidebar Navigation

```text
Build a [React + Vite | HTML/CSS] sidebar navigation for a Plantasonic application.

Layout:
- Fixed left sidebar (--ps-sidebar-width: 18rem)
- Collapsible to icon rail on toggle (narrow mode ~3.5rem)
- Sections: [Primary nav | Presets | Projects | Settings]
- Active item indicator; optional badge counts

Nav items:
- [Item 1: e.g. Workspace]
- [Item 2: e.g. Library]
- [Item 3: e.g. Export]
- Footer: user/settings link

Design System: Plantasonic Design System
Stack: Bootstrap 5.0.2 + CSS custom properties (--ds-*, --ps-*)
Theme: data-theme="dark"

Visual:
- Sidebar background: var(--ds-color-surface-nav)
- Active item: var(--ds-color-surface-raised-hover) + var(--ds-color-border-interactive) accent
- Text: var(--ds-color-text-primary); section labels: var(--ds-font-size-overline), var(--ds-color-text-muted)
- Dividers: var(--ds-color-border-subtle)
- Item padding: var(--ds-space-3); min height var(--ps-touch-target)

Structure:
- <nav aria-label="Main"> with <ul> list
- Current page: aria-current="page"
- Collapse toggle: aria-expanded, aria-controls

Rules:
- Bootstrap .nav / .nav-link or platform sidebar primitive
- Keyboard navigable: arrow keys between items, Enter to activate
- Focus ring: var(--ds-shadow-focus)
- Mobile: off-canvas drawer below md breakpoint
- No hardcoded widths except via --ps-sidebar-width token
- Respect prefers-reduced-motion for collapse transition
```
