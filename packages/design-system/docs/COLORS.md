# Color Rules

Semantic color roles for the Plantasonic dark instrument theme (default) and light variant.

**Source of truth:** `tokens/foundation.tokens.json`, `tokens/theme.dark.tokens.json`, `tokens/theme.light.tokens.json`  
**Runtime:** `css/variables.css` (`--ds-color-*`, `--ps-*`)

---

## Brand Palette (Foundation)

| Name | Token | Value | Usage |
| ---- | ----- | ----- | ----- |
| Primary green | `color.green.500` | `#00FF57` | Primary actions, play, CTA |
| Accent green | `color.green.700` | `#4DFF89` | Secondary emphasis, active borders, links |
| Forest app | `color.green.900` | `#070F0A` | App background anchor |

Do not use primary or accent green for body text at large sizes. Green is for interactive emphasis and the instrument's "alive" signal.

---

## Semantic Roles (Dark Theme)

| Role | Token | CSS variable | Dark value |
| ---- | ----- | ------------ | ---------- |
| Primary action | `color.primary.default` | `--ds-color-primary` | `#00FF57` |
| Primary hover | `color.primary.hover` | `--ds-color-primary-hover` | `#4DFF89` |
| Secondary action | `color.secondary` | `--ds-color-secondary` | `#4DFF89` |
| Accent / highlight | `color.accent` | `--ds-color-accent` | `#4DFF89` |
| App surface | `color.surface.app` | `--ds-color-surface-app` | `#070F0A` |
| Stage / sunken | `color.surface.stage` | `--ds-color-surface-stage` | `#000000` |
| Nav / dock | `color.surface.nav` | `--ds-color-surface-nav` | `#101C15` |
| Raised panel | `color.surface.raised` | `--ds-color-surface-raised` | `#1A1A1A` |
| Input surface | `color.surface.input` | `--ds-color-surface-input` | `#333333` |
| Primary text | `color.text.primary` | `--ds-color-text-primary` | `#E5E5E5` |
| Secondary text | `color.text.secondary` | `--ds-color-text-secondary` | `#999999` |
| Muted text | `color.text.muted` | `--ds-color-text-muted` | `#808080` |
| Accent text | `color.text.accent` | `--ds-color-text-accent` | `#4DFF89` |
| Link | `color.text.link` | `--ds-color-text-link` | `#4DFF89` |
| Default border | `color.border.default` | `--ds-color-border-default` | `rgba(255,255,255,0.14)` |
| Focus border | `color.border.focus` | `--ds-color-border-focus` | `#4DFF89` |
| Backdrop | `color.overlay.backdrop` | `--ds-color-overlay-backdrop` | `rgba(0,0,0,0.65)` |

Light theme overrides live in `tokens/theme.light.tokens.json` and the `[data-theme="light"]` block in `css/variables.css`.

---

## Status Colors

| Role | Token | Value |
| ---- | ----- | ----- |
| Success | `color.status.success` | `#00FF57` |
| Warning | `color.status.warning` | `#F5C542` |
| Error | `color.status.error` | `#FF5C5C` |
| Info | `color.status.info` | `#4DFF89` |

Status colors map to Bootstrap `$success`, `$warning`, `$danger`, `$info`. Do not use status colors for non-status decoration.

---

## Rules

- Meet WCAG 2.1 AA contrast for text on surfaces
- Reference semantic tokens — never hardcode hex in application code
- Body text uses `text.primary` (neutral), not brand green
- Green accent is for actions, links, active states, and emphasis labels

---

## Bootstrap Bridge

| Design token | Bootstrap variable |
| ------------ | ------------------ |
| `color.primary.default` | `$primary` |
| `color.surface.default` | `$body-bg` |
| `color.text.primary` | `$body-color` |
| `color.border.default` | `$border-color` |
| `color.text.link` | `$link-color` |

For runtime theme switching, import `scss/css-theme-bridge.scss` after Bootstrap.

---

## Related

- [BRAND_GUIDELINES.md](./BRAND_GUIDELINES.md)
- [TOKEN_ARCHITECTURE.md](./TOKEN_ARCHITECTURE.md)
