# Theme System

Plantasonic uses **semantic design tokens** resolved into CSS custom properties.

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

See [Bootstrap Integration](./BOOTSTRAP.md).
