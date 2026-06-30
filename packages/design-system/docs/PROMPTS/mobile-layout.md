# Mobile Layout

```text
Build a [React + Vite | HTML/CSS] mobile-first layout for a Plantasonic application (viewport ≤ 768px).

Layout:
- Full-width stage/canvas as primary viewport (100dvh minus compact chrome)
- Bottom tab bar or floating action button for primary navigation (min var(--ps-touch-target))
- Top bar: minimal — back/menu icon, title, one action max
- Sheets/drawers for inspector and settings (slide up from bottom)
- No permanent sidebar — use bottom sheet or hamburger menu

Regions:
- [Main stage content]
- [Bottom nav: 3–5 items with icons + labels]
- [Optional pull-up panel for parameters]

Design System: Plantasonic Design System
Stack: Bootstrap 5.0.2 + CSS custom properties (--ds-*, --ps-*)
Theme: data-theme="dark"

Visual:
- Safe area padding for notched devices
- Touch spacing: var(--ds-space-4) between tappable elements
- Bottom bar: var(--ds-color-surface-dock), var(--ds-shadow-md) top edge
- Sheet surface: var(--ds-color-surface-raised)

Rules:
- Mobile-first Bootstrap (.col-12 default, enhance at md+)
- All interactive targets ≥ var(--ps-touch-target) (2.75rem)
- No hover-only interactions — use tap/click
- Sliders full-width with large thumb hit area
- Drawer/sheet: role="dialog" or role="region" with aria-label
- Respect prefers-reduced-motion for sheet transitions
- Test at 375px width
```
