# Spacing Rules

Spacing scale and layout rhythm for Plantasonic UI.

**Source of truth:** `tokens/foundation.tokens.json`  
**Runtime:** `css/variables.css` (`--ds-space-*`)

---

## Scale (4px base grid)

| Token | CSS variable | Value | Bootstrap utility |
| ----- | ------------ | ----- | ----------------- |
| `space.0` | `--ds-space-0` | 0 | — |
| `space.1` | `--ds-space-1` | 0.25rem (4px) | `*-1` |
| `space.2` | `--ds-space-2` | 0.5rem (8px) | `*-2` |
| `space.3` | `--ds-space-3` | 1rem (16px) | `*-3` |
| `space.4` | `--ds-space-4` | 1.5rem (24px) | `*-4` |
| `space.5` | `--ds-space-5` | 2rem (32px) | `*-5` |
| `space.6` | `--ds-space-6` | 3rem (48px) | — |
| `space.8` | `--ds-space-8` | 4rem (64px) | — |

Bootstrap `$spacer` maps to `space.3` (1rem).

---

## Product Layout Tokens

| Token | CSS variable | Value | Usage |
| ----- | ------------ | ----- | ----- |
| `product.nav-height` | `--ps-nav-height` | 3.5rem | Top navigation |
| `product.dock-height` | `--ps-dock-height` | 4.5rem | Control dock |
| `product.sidebar-width` | `--ps-sidebar-width` | 18rem | Collapsible menu |
| `product.touch-target` | `--ps-touch-target` | 2.75rem | Minimum interactive size |

---

## Typical Usage (Plantasonic Shell)

| Context | Token |
| ------- | ----- |
| Dock section gap | `space.2` |
| Sidebar padding | `space.3` |
| Stage placeholder padding | `space.5` |
| Nav/dock horizontal padding | `space.4` |

Prefer Bootstrap utilities (`gap-2`, `p-3`, `px-4`) backed by this scale.

---

## Rules

- Use spacing tokens — avoid arbitrary pixel values
- Single-direction spacing in vertical stacks
- Reduce section spacing on mobile
- Instrument UI uses efficient density — not marketing spacing

---

## Related

- [TOKEN_ARCHITECTURE.md](./TOKEN_ARCHITECTURE.md)
- [PATTERNS.md](./PATTERNS.md)
