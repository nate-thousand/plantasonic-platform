# Dashboard UI

```text
Build a [React + Vite | HTML/CSS] dashboard layout for a Plantasonic ecosystem application.

Layout:
- Top navigation bar (--ps-nav-height) with app title and theme toggle
- Optional collapsible sidebar (--ps-sidebar-width) with section links
- Main content area with a primary metrics region and secondary detail panels
- Status footer strip with connection/state indicators

Content regions:
- [Describe metrics: e.g. active sessions, CPU, memory, project count]
- [Describe panels: e.g. recent activity list, quick actions]

Design System: Plantasonic Design System
Stack: Bootstrap 5.0.2 + CSS custom properties (--ds-*, --ps-*)
Theme: data-theme="dark"

Visual:
- App background: var(--ds-color-surface-app)
- Cards/panels: var(--ds-color-surface-raised) with var(--ds-color-border-subtle) borders
- Primary text: var(--ds-color-text-primary); labels: var(--ds-color-text-secondary)
- Primary actions: .btn.btn-primary using var(--ds-color-primary)
- Spacing: var(--ds-space-3) default gap; var(--ds-space-4) section padding
- Radius: var(--ds-radius-default); elevation: var(--ds-shadow-md)

Rules:
- Bootstrap grid for responsive layout (.row, .col-md-*)
- Use .card for metric tiles; .badge for status chips
- No hardcoded hex or px spacing
- Accessible landmarks: header, nav, main, footer
- Focus rings: var(--ds-shadow-focus)
- Respect prefers-reduced-motion
```
