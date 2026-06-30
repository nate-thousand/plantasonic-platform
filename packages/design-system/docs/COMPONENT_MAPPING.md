# Component Mapping

Maps Plantasonic design system component names to Bootstrap 5.0.2 classes. Use these when building UI — do not invent parallel class systems.

---

## Rules

1. Import `scss/bootstrap-theme.scss` before Bootstrap SCSS
2. Import `scss/css-theme-bridge.scss` after Bootstrap when switching themes at runtime
3. Never edit files in `node_modules/bootstrap/`
4. Custom layout classes use the `ps-` prefix in consuming apps
5. Reference tokens, not raw values, in custom styles

---

## Shell Components (Plantasonic)

| Design system component | Bootstrap 5.0.2 | Usage |
| ----------------------- | --------------- | ----- |
| Navbar | `.navbar`, `.navbar-dark`, `.bg-dark` | Top navigation |
| Button — primary | `.btn .btn-primary` | Primary actions |
| Button — outline | `.btn .btn-outline-secondary` | Secondary actions |
| Button — link | `.btn .btn-link` | Menu toggle, text actions |
| Button — small | `.btn-sm` | Dock controls |
| Nav | `.nav`, `.nav-link` | Menu items |
| Offcanvas | `.offcanvas` | Mobile sidebar |
| Modal | `.modal`, `.modal-dialog` | Overlays |
| Form — range | `.form-range` | Sliders |
| Form — checkbox | `.form-check`, `.form-check-input` | Toggles |
| Card | `.card`, `.card-body` | Preset cards |
| Badge | `.badge` | Status indicators |
| Spinner | `.spinner-border` | Loading states |
| Tooltip | `[data-bs-toggle="tooltip"]` | Control hints |
| Alert | `.alert` | Error banners |

---

## Full Component Map

| Design system component | Bootstrap 5.0.2 |
| ----------------------- | --------------- |
| Button — primary | `.btn .btn-primary` |
| Button — secondary | `.btn .btn-secondary` |
| Button — outline | `.btn .btn-outline-*` |
| Button — link | `.btn .btn-link` |
| Card | `.card`, `.card-body` |
| Form — text input | `.form-control` |
| Form — select | `.form-select` |
| Form — checkbox | `.form-check`, `.form-check-input` |
| Form — range | `.form-range` |
| Navbar | `.navbar`, `.navbar-expand-*` |
| Modal | `.modal`, `.modal-dialog` |
| Badge / Tag | `.badge`, `.bg-*` |
| Spinner | `.spinner-border` |
| Offcanvas | `.offcanvas` |
| Dropdown | `.dropdown`, `.dropdown-menu` |
| Progress | `.progress`, `.progress-bar` |
| Table | `.table` |
| List group | `.list-group`, `.list-group-item` |

---

## Interaction States

| State | Token / treatment |
| ----- | ----------------- |
| Default | Token colors, no shadow |
| Hover | Lighter surface (`color.surface.raised-hover`), slider thumb scale |
| Focus | `--ds-shadow-focus` outline |
| Active / pressed | Scale 0.98 on buttons, `aria-pressed` |
| Disabled | 0.45 opacity |
| Error | `--ds-color-error`, `.alert-danger` |

---

## Layout Classes (Product Apps)

These are defined in consuming apps, not this package:

| Class | Purpose |
| ----- | ------- |
| `ps-app` | Root grid shell |
| `ps-main` | Stage + sidebar grid |
| `ps-sidebar` | Collapsible control panel |
| `ps-stage` | Visualizer region |
| `ps-dock` | Bottom transport dock |
| `ps-overlay-host` | Modal overlay container |
| `ps-app--performance` | Performance mode |
| `ps-app--fullscreen` | Fullscreen adjustments |

---

## Import Example

```scss
// app bootstrap entry
@import 'plantasonic-design-system/scss/bootstrap-theme';
@import 'bootstrap/scss/bootstrap';
@import 'plantasonic-design-system/scss/css-theme-bridge'; // runtime theme switching
```

```html
<link rel="stylesheet" href="node_modules/plantasonic-design-system/css/variables.css" />
```

---

## Related

- [TOKEN_ARCHITECTURE.md](./TOKEN_ARCHITECTURE.md)
- [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md)
