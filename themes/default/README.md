# Default Theme

The default theme package mirrors the Design System's active semantic themes:

- `tokens/theme.dark.tokens.json`
- `tokens/theme.light.tokens.json`

These files are byte-for-byte copies of:

- `packages/design-system/tokens/theme.dark.tokens.json`
- `packages/design-system/tokens/theme.light.tokens.json`

## Runtime selectors

```html
<html data-theme="dark">
<html data-theme="light">
```

## Phase 2 boundary

This package documents reusable theme ownership without changing runtime behavior. The Design System remains the source for token builds and CSS generation.
