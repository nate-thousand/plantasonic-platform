# Plantasonic Theme System

Platform-owned catalog for reusable Plantasonic themes.

## Ownership

- **Design System** owns base token sources, generated CSS variables, SCSS bridges, and component theme behavior in `packages/design-system/`.
- **Theme System** owns reusable theme package definitions in `themes/`.
- **Applications** own app-specific theme choices, such as which theme is active in shell config or whether an app adds local visual treatment.

## Current themes

| Theme | Status | Runtime behavior |
|-------|--------|------------------|
| `default` | Active mirror | Mirrors Design System dark/light semantic token files exactly. |
| `plantasia` | Planned | Placeholder for a reusable Plantasia brand theme package. |
| `signal9` | Planned | Placeholder for a reusable Signal 9 theme package; app-owned Signal 9 values remain untouched. |

## Runtime contract

Phase 2 does not change runtime imports or generated CSS. Applications still consume `plantasonic-design-system` tokens and CSS exactly as before.

Supported runtime selectors today:

```html
<html data-theme="dark">
<html data-theme="light">
```

Future phases may teach generators and apps to discover themes from this catalog. That is not part of Phase 2.
