# v0 Guidelines

Best practices for using [v0](https://v0.dev) to generate UI that integrates cleanly with the Plantasonic Design System.

v0 accelerates exploration. Final UI must conform to tokens, Bootstrap, and platform APIs before shipping.

---

## Prompt Structure

Use this template for every v0 prompt:

```text
Context: Plantasonic Design System — dark instrument UI, Bootstrap 5.0.2, CSS custom properties.

Stack: [HTML/CSS/TS | React + Vite | Next.js App Router]
Theme: data-theme="dark" | "light" | app-specific (e.g. retro)

Layout: [describe regions — nav, stage, dock, sidebar, inspector]

Components needed: [buttons, sliders, panels, toolbar, modal, etc.]

Constraints:
- Use var(--ds-*) CSS variables for all colors, spacing, typography, radius, shadow, motion
- Use Bootstrap 5.0.2 classes for standard controls
- No hardcoded hex, px spacing literals, or custom parallel component systems
- Stage/canvas is the visual hero; chrome recedes
- Accessible: keyboard nav, focus rings, aria labels, 2.75rem min touch targets
- Respect prefers-reduced-motion

Reference: Plantasonic token prefixes --ds-* (semantic) and --ps-* (product layout)
```

Attach or paste relevant sections from [Prompt Library](./PROMPTS/README.md) for your UI type.

---

## Token Usage

Instruct v0 to use **semantic tokens**, not foundation values or literals:

| Category | v0 instruction |
| --- | --- |
| Backgrounds | `var(--ds-color-surface-app)`, `var(--ds-color-surface-raised)`, `var(--ds-color-surface-stage)` |
| Text | `var(--ds-color-text-primary)`, `var(--ds-color-text-secondary)`, `var(--ds-color-text-muted)` |
| Actions | `var(--ds-color-primary)`, `var(--ds-color-primary-hover)` |
| Borders | `var(--ds-color-border-default)`, `var(--ds-color-border-focus)` |
| Spacing | `var(--ds-space-1)` through `var(--ds-space-*)` |
| Typography | `var(--ds-font-family-sans)`, `var(--ds-font-size-body)`, `var(--ds-font-weight-headings)` |
| Radius | `var(--ds-radius-default)` |
| Elevation | `var(--ds-shadow-md)`, `var(--ds-shadow-focus)` |
| Motion | `var(--ds-transition-fast)`, `var(--ds-ease-standard)` |

If v0 outputs Tailwind classes, request a **Bootstrap + CSS variables** version in a follow-up prompt.

After generation, cross-check values against [TOKEN_REFERENCE](./generated/ai/TOKEN_REFERENCE.md).

---

## Component Usage

Prefer documented components over invented markup:

| Need | Use |
| --- | --- |
| Buttons | `.btn .btn-primary`, `.btn-outline-secondary`, or `button()` from `plantasonic-design-system/components` |
| Sliders | `.form-range` with `.form-label` |
| Cards | `.card` / `.card-body` or `card()` helper |
| Panels | `.ps-panel` / `panel()` |
| Toolbars | `.ps-toolbar` / `toolbar()` |
| Badges | `.badge` / `badge()` |
| Modals | Bootstrap `.modal` with token-backed overrides |

Do not accept v0-generated custom `<Button variant="neon">` components — map to Bootstrap + tokens.

See [Component Library](./platform/COMPONENT_LIBRARY.md) and [COMPONENT_MAPPING](./COMPONENT_MAPPING.md).

---

## Layout Rules

Plantasonic layouts follow an **instrument-first** hierarchy:

```text
┌─────────────────────────────────────┐
│ TopNav (--ps-nav-height)            │
├──────────┬──────────────────────────┤
│ Sidebar  │ Stage (primary focus)    │
│ (opt.)   │                          │
├──────────┴──────────────────────────┤
│ ControlDock (--ps-dock-height)      │
└─────────────────────────────────────┘
```

Rules for v0 prompts:

- **Stage dominates** — largest region, darkest surface (`--ds-color-surface-stage`)
- **Chrome recedes** — nav, dock, sidebar use `--ds-color-surface-nav` / `--ds-color-surface-dock`
- **Floating overlays** — inspector, transport, HUD float above stage; not permanent dashboard columns
- **Use layout primitives** — `stack`, `grid`, `sidebar` from `plantasonic-design-system/primitives`
- **Creative Workspace presets** — `instrument`, `visualizer`, `studio`, `presentation`, `installation`

For dashboard-style UIs, still keep a clear primary content region — avoid equal-weight widget grids that compete for attention.

---

## Accessibility Expectations

Every v0 prompt should include:

- Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<aside>`)
- Visible focus rings using `var(--ds-shadow-focus)` or `var(--ds-color-border-focus)`
- `aria-label` on icon-only buttons
- `aria-valuemin` / `aria-valuemax` / `aria-valuenow` on range inputs
- `aria-expanded` on collapsible panels
- `role="dialog"` + focus trap for modals
- Minimum touch target: `var(--ps-touch-target)` (2.75rem)
- Color contrast: primary text on surfaces must meet WCAG AA

Run the showcase contrast audit as a visual reference after integration.

---

## Responsive Behavior

Prompt v0 for responsive layouts using Bootstrap breakpoints:

- **Mobile first** — stack chrome vertically; stage remains primary
- **Collapse sidebar** — off-canvas or icon rail below `md`
- **Dock** — horizontal scroll or compact icon row on narrow viewports
- **Typography** — use token scale; do not invent viewport-specific font sizes
- **Spacing** — reduce padding with `--ds-space-2` / `--ds-space-3` on mobile, not arbitrary pixels

Test at 375px, 768px, and 1280px before accepting generated layout.

---

## Animation Guidelines

Motion must communicate state — not decorate.

| Use case | Token / preset |
| --- | --- |
| Panel open | `animate(el, 'drawerIn')` or `--ds-transition-base` |
| Modal | `animate(el, 'modalIn')` |
| Toast | `animate(el, 'toastIn')` |
| Button press | `animate(el, 'press')` |
| Loading | `animate(el, 'loadingPulse')` |

Rules:

- Durations from `--ds-motion-duration-micro|fast|base|slow|slower`
- Easing from `--ds-ease-standard`, `--ds-ease-emphasized`, `--ds-ease-spring`
- Always handle `prefers-reduced-motion: reduce` — instant state change, no animation
- No bounce, parallax, or decorative particle effects on control surfaces

See [Motion System](./platform/MOTION_SYSTEM.md).

---

## Dark Mode

Default theme is **dark** (`data-theme="dark"` or unset `:root`).

v0 prompts should specify:

```html
<html data-theme="dark">
```

Dark mode tokens:

- App background: `--ds-color-surface-app` (`#070f0a`)
- Stage: `--ds-color-surface-stage` (`#000000`)
- Raised panels: `--ds-color-surface-raised` (`#1A1A1A`)
- Primary text: `--ds-color-text-primary` (`#e5e5e5`)
- Accent: `--ds-color-primary` (`#00FF57`)

Verify generated UI in dark mode first. Light mode is a semantic override — components must not hardcode dark-only colors.

---

## Retro Theme Support

Some applications (e.g. **Signal 9**) ship an app-owned **retro terminal** theme alongside design system defaults.

When prompting v0 for retro UI:

1. Specify `data-theme="retro"` (or the app's theme attribute value)
2. Require **semantic token references** — the app provides retro values via CSS variable overrides, not inline amber/green hex
3. Use `--ds-font-family-mono` (DM Mono) for terminal readouts
4. Keep Bootstrap structure — retro is a token skin, not a separate component library
5. CRT/scanline effects belong on the **stage/canvas**, not on control chrome

Example prompt clause:

```text
Theme: retro terminal via data-theme="retro". Monospace readouts use var(--ds-font-family-mono).
All colors via var(--ds-color-*). No hardcoded #33ff33 or amber hex. Control surfaces use
standard Bootstrap + Plantasonic tokens; retro aesthetic applies to stage content only.
```

See [Retro Terminal prompt](./PROMPTS/retro-terminal.md).

---

## Post-Generation Checklist

Before merging v0 output:

- [ ] All colors use `var(--ds-*)` — no hex literals
- [ ] Spacing uses `--ds-space-*` — no arbitrary px padding/margin
- [ ] Bootstrap classes used for standard controls
- [ ] No duplicate components that exist in `plantasonic-design-system/components`
- [ ] `data-theme` set and both dark/light verified (plus app themes if applicable)
- [ ] Focus states visible
- [ ] Reduced motion respected
- [ ] Integrated with Application Shell if app chrome is involved

See [AI Design Guide](./AI_DESIGN_GUIDE.md) for the full integration workflow.

---

## Related

- [AI Design Guide](./AI_DESIGN_GUIDE.md)
- [Prompt Library](./PROMPTS/README.md)
- [Design Principles](./DESIGN_PRINCIPLES.md)
- [Brand Guidelines](./BRAND_GUIDELINES.md)
