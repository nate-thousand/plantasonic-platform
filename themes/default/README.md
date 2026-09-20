# Default Theme

The default theme package mirrors the Design System's active semantic themes:

- `tokens/theme.light.tokens.json` — the default (`:root`)
- `tokens/theme.dark.tokens.json` — opt-in via `data-theme="dark"`

These files are byte-for-byte copies of the sibling repository's files:

- `../plantasonic-design-system/tokens/theme.light.tokens.json`
- `../plantasonic-design-system/tokens/theme.dark.tokens.json`

Refresh them after pulling a new design-system version:

```bash
pnpm themes:sync
```

`theme.json` records which design-system version the mirrors were taken from.

## Runtime selectors

```html
<html data-theme="light">  <!-- default -->
<html data-theme="dark">
```

## Boundary

This package documents reusable theme ownership without changing runtime behavior. The Design System remains the source for token builds and CSS generation; applications consume `plantasonic-design-system/css/variables.css` directly.
