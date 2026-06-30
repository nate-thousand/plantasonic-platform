# Modal Dialog

```text
Build a [React + Vite | HTML/CSS] modal dialog for [confirm delete | save preset | export | onboarding step] in a Plantasonic application.

Structure:
- Bootstrap .modal with .modal-dialog-centered
- Backdrop: var(--ds-color-overlay-backdrop)
- Header: title + close button (aria-label="Close")
- Body: [describe content — form, message, preview]
- Footer: primary + secondary actions

Design System: Plantasonic Design System
Stack: Bootstrap 5.0.2 + CSS custom properties (--ds-*, --ps-*)
Theme: data-theme="dark"

Visual:
- Modal surface: var(--ds-color-surface-raised)
- Border radius: var(--ds-radius-default)
- Shadow: var(--ds-shadow-lg)
- Title: var(--ds-font-size-h4), var(--ds-color-text-primary)
- Body text: var(--ds-font-size-body), var(--ds-color-text-secondary)
- Primary action: .btn.btn-primary; dismiss: .btn.btn-outline-secondary

Behavior:
- role="dialog" aria-modal="true" aria-labelledby pointing to title
- Focus trap within modal; return focus to trigger on close
- Enter on primary action; Escape closes (unless destructive confirm requires explicit click)
- Open animation: modalIn preset or var(--ds-transition-base); skip animation when prefers-reduced-motion

Rules:
- No hardcoded backdrop rgba — use var(--ds-color-overlay-backdrop)
- No custom modal component library — Bootstrap modal + token overrides
- Destructive confirm: .btn.btn-danger for delete, clear warning text
- Respect prefers-reduced-motion
```
