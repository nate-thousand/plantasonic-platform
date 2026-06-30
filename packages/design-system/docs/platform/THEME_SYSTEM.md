# Theme System

Plantasonic uses **semantic design tokens** resolved into CSS custom properties.

## Ownership

- **Design System** owns base token files, generated CSS variables, SCSS bridges, and component behavior.
- **Theme System** owns reusable theme package definitions in `themes/` at the platform root.
- **Applications** own app-specific theme choices and local visual treatment.

## Themes

- **Dark** (default) — instrument UI, low-light environments
- **Light** — documentation, bright environments

## Runtime switching

Set `data-theme` on the document root:

```html
<html data-theme="dark">
```

```typescript
document.documentElement.setAttribute('data-theme', 'light');
```

Generated CSS provides:

- `:root` — dark defaults
- `[data-theme="dark"]` — explicit dark
- `[data-theme="light"]` — light overrides

## Token layers

1. **Foundation** — raw scales (space, radius, font sizes)
2. **Semantic** — `color.surface.app`, `color.text.primary`, etc.
3. **CSS output** — `--ds-color-surface-app`, etc.

## Bootstrap bridge

`scss/css-theme-bridge.scss` maps Bootstrap component classes to `--ds-*` variables so Bootstrap re-themes when `data-theme` changes without recompiling SCSS.

## Platform theme catalog

Phase 2 mirrors the active dark/light semantic token files into `themes/default/` without changing values. `themes/plantasia/` and `themes/signal9/` are placeholders until reusable mappings are approved.

See [Bootstrap Integration](./BOOTSTRAP.md).
