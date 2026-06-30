# Apply Plantasonic Design System

Instructions for AI agents building or modifying UI in Plantasonic ecosystem apps.

---

## Before You Generate UI

1. Read `docs/VISION_AND_SCOPE.md` — purpose, boundaries, decision filter
2. Read `docs/AI_DESIGN_GUIDE.md` — AI-first workflow, token rules, v0 integration
3. Read `docs/DESIGN_PRINCIPLES.md` — token-driven, Bootstrap, accessibility rules
4. Read `docs/COMPONENT_MAPPING.md` — use Bootstrap classes, not custom parallel systems
5. Read `docs/TOKEN_ARCHITECTURE.md` — understand `--ds-*` and `--ps-*` naming
6. For v0 output, read `docs/V0_GUIDELINES.md` and pick a prompt from `docs/PROMPTS/`
7. If building Plantasonic shell UI, read `docs/BRAND_GUIDELINES.md`

---

## Core Rules

1. **Align with vision** — every UI decision must pass the [decision filter](../docs/VISION_AND_SCOPE.md#decision-filter)
2. **Token-driven** — reference `--ds-*` / `--ps-*` CSS variables or `$ds-*` SCSS variables. Never hardcode hex, pixel, or millisecond values.
3. **Bootstrap as engine** — use Bootstrap 5.0.2 classes from `docs/COMPONENT_MAPPING.md`
4. **Interface recedes** — stage/canvas is the hero; chrome supports without competing
5. **Motion with purpose** — animation communicates state; respect reduced motion
6. **Accessible by default** — keyboard nav, focus rings, touch targets (2.75rem min), reduced motion
7. **No engineering content** — do not generate architecture, roadmaps, or deployment config in UI tasks

---

## Import Checklist

When setting up a new app or page:

```html
<!-- CSS variables -->
<link rel="stylesheet" href="plantasonic-design-system/css/variables.css" />
```

```scss
// Bootstrap theme
@import 'plantasonic-design-system/scss/bootstrap-theme';
@import 'bootstrap/scss/bootstrap';
@import 'plantasonic-design-system/scss/css-theme-bridge'; // when switching themes at runtime
```

Set theme on root:

```html
<html data-theme="dark">
```

---

## Token Reference (Common)

| Need | Token |
| ---- | ----- |
| App background | `--ds-color-surface-app` |
| Stage background | `--ds-color-surface-stage` |
| Panel background | `--ds-color-surface-raised` |
| Primary text | `--ds-color-text-primary` |
| Secondary text | `--ds-color-text-secondary` |
| Primary action | `--ds-color-primary` |
| Focus ring | `--ds-shadow-focus` |
| Default spacing | `--ds-space-3` (1rem) |
| Default radius | `--ds-radius-default` |
| Nav height | `--ps-nav-height` |
| Dock height | `--ps-dock-height` |
| Touch target | `--ps-touch-target` |

---

## Component Patterns

### Button

```html
<button type="button" class="btn btn-primary">Play</button>
<button type="button" class="btn btn-outline-secondary btn-sm">Stop</button>
<button type="button" class="btn btn-link">Menu</button>
```

### Slider

```html
<label class="form-label" for="tempo">Tempo</label>
<input type="range" class="form-range" id="tempo" min="40" max="240" value="120"
       aria-valuemin="40" aria-valuemax="240" aria-valuenow="120" />
```

### Card (preset)

```html
<div class="card">
  <div class="card-body">
    <h3 class="card-title h6">Preset Name</h3>
  </div>
</div>
```

Custom preset card styles should use:

```css
.preset-card {
  border: 1px solid var(--ps-preset-card-border);
  border-radius: var(--ds-radius-default);
}
.preset-card[aria-selected="true"] {
  border-color: var(--ps-preset-card-active-border);
  box-shadow: var(--ds-shadow-glow-accent);
}
```

---

## Layout Shell (Plantasonic Apps)

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

Layout classes (`ps-app`, `ps-stage`, `ps-dock`, etc.) are defined in the consuming app — not this package.

---

## Audit Checklist

Before delivering UI:

- [ ] All colors reference tokens (no raw hex)
- [ ] Bootstrap classes used per component mapping
- [ ] Focus states visible with `--ds-shadow-focus`
- [ ] Interactive elements ≥ `--ps-touch-target`
- [ ] `prefers-reduced-motion` respected
- [ ] Semantic HTML landmarks present
- [ ] ARIA attributes on custom controls (sliders, toggles, dialogs)

---

## Agent Roles

| Role | Responsibility |
| ---- | -------------- |
| UI Composer | Assemble pages from approved patterns and Bootstrap components |
| Design System Reviewer | Audit generated UI against docs and tokens |
| Token Auditor | Verify all visual values map to documented tokens |

---

## What Not To Do

- Copy token JSON into app repos — import this package
- Edit Bootstrap source in `node_modules/`
- Use status colors for non-status decoration
- Add decorative gradients to control surfaces
- Generate parallel component class systems (`.my-button-primary` etc.)
- Build generic dashboards, theme galleries, or disconnected one-off components
- Add anything that fails the [decision filter](../docs/VISION_AND_SCOPE.md#decision-filter)

---

## Related Files

- [../docs/AI_DESIGN_GUIDE.md](../docs/AI_DESIGN_GUIDE.md)
- [../docs/V0_GUIDELINES.md](../docs/V0_GUIDELINES.md)
- [../docs/PROMPTS/README.md](../docs/PROMPTS/README.md)
- [../docs/VISION_AND_SCOPE.md](../docs/VISION_AND_SCOPE.md)
- [../docs/DESIGN_PRINCIPLES.md](../docs/DESIGN_PRINCIPLES.md)
- [../docs/COMPONENT_MAPPING.md](../docs/COMPONENT_MAPPING.md)
- [../docs/TOKEN_ARCHITECTURE.md](../docs/TOKEN_ARCHITECTURE.md)
- [../docs/BRAND_GUIDELINES.md](../docs/BRAND_GUIDELINES.md)
