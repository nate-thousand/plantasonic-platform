# Token Architecture

How Plantasonic design tokens are organized, named, and consumed.

---

## Layer Model

```text
foundation.tokens.json     Primitives — palette, scale, typography, motion
        ↓
theme.dark.tokens.json     Semantic roles — dark instrument theme (default)
theme.light.tokens.json    Semantic roles — light variant
        ↓
css/variables.css            Runtime CSS custom properties
scss/bootstrap-theme.scss    Bootstrap 5 SCSS variable overrides
```

---

## File Responsibilities

| File | Scope | Examples |
| ---- | ----- | -------- |
| `foundation.tokens.json` | Theme-agnostic primitives | `color.green.500`, `space.3`, `radius.default` |
| `theme.dark.tokens.json` | Dark semantic + product tokens | `color.surface.app`, `shadow.md`, `product.nav-height` |
| `theme.light.tokens.json` | Light semantic overrides | Inverted surfaces, adjusted borders/shadows |

Foundation tokens use W3C Design Tokens format (`$type`, `$value`). Theme files reference foundation values with `{token.path}` aliases.

---

## Naming Conventions

### CSS Custom Properties

```css
--ds-color-{role}           /* design system semantic */
--ds-font-{property}        /* typography */
--ds-space-{scale}          /* spacing */
--ds-radius-{size}          /* border radius */
--ds-shadow-{elevation}     /* elevation */
--ds-transition-{speed}     /* motion duration */
--ps-{product-token}        /* product-specific layout */
```

### SCSS Variables

Same paths with `$` prefix and hyphens: `$ds-color-primary`, `$ps-nav-height`.

---

## Color Token Groups

| Group | Tokens | Purpose |
| ----- | ------ | ------- |
| Primary | `color.primary.*` | Actions, play, CTA |
| Surface | `color.surface.*` | Backgrounds — app, stage, nav, input |
| Text | `color.text.*` | Content hierarchy |
| Border | `color.border.*` | Dividers, focus, interactive |
| Overlay | `color.overlay.*` | Modals, scrims, glass |
| Status | `color.status.*` | Success, warning, error, info |

---

## Product Tokens

The `product` group holds layout dimensions specific to the Plantasonic instrument shell. Other apps may ignore or override these:

| Token | Value | Usage |
| ----- | ----- | ----- |
| `product.nav-height` | 3.5rem | Top navigation |
| `product.dock-height` | 4.5rem | Control dock |
| `product.sidebar-width` | 18rem | Collapsible menu |
| `product.touch-target` | 2.75rem | Minimum interactive size |

---

## Theme Switching

Load `css/variables.css`. Default theme is dark (`:root`).

```html
<html data-theme="dark">   <!-- default -->
<html data-theme="light">  <!-- light variant -->
```

Light overrides live in the `[data-theme="light"]` block in `variables.css`.

---

## Build Pipeline

Regenerate CSS after editing token JSON:

```bash
npm run tokens:validate   # check aliases
npm run tokens:build-css  # write css/variables.css
npm run build             # alias for tokens:build-css
```

Source: `scripts/lib/tokens.mjs` merges foundation + theme files, resolves `{aliases}`, maps to `--ds-*` / `--ps-*` custom properties.

---

## Bootstrap Bridge

`scss/bootstrap-theme.scss` maps semantic tokens to Bootstrap 5.0.2 SCSS variables:

| Design token | Bootstrap variable |
| ------------ | ------------------ |
| `color.primary.default` | `$primary` |
| `color.surface.default` | `$body-bg` |
| `color.text.primary` | `$body-color` |
| `color.border.default` | `$border-color` |
| `space.3` | `$spacer` |
| `radius.default` | `$border-radius` |

See [COMPONENT_MAPPING.md](./COMPONENT_MAPPING.md) for component-level mapping.

---

## Figma Sync

Tokens originate from Figma Variables (foundation/Mode 1, semantic Theme 1 = dark, Theme 2 = light).

1. Export variable collections from Figma as W3C `.tokens.json` zip files
2. Place exports in `tokens/figma-source/`:
   - `foundation/Mode 1.tokens.json`
   - `Theme 1.tokens.json`
   - `Theme 2.tokens.json`
3. Run `npm run tokens:import-figma`
4. Run `npm run build`
5. Verify showcase in both themes
6. Update CHANGELOG.md

Manual edits to `tokens/*.tokens.json` are overwritten by import — edit Figma or adjust `scripts/import-figma-tokens.mjs` mapping.

---

## Related

- [COLORS.md](./COLORS.md)
- [TYPOGRAPHY.md](./TYPOGRAPHY.md)
- [SPACING.md](./SPACING.md)
- [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md)
- [COMPONENT_MAPPING.md](./COMPONENT_MAPPING.md)
