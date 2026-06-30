# Typography Rules

Font families, type scale, and Bootstrap mapping for Plantasonic UI chrome.

**Source of truth:** `tokens/foundation.tokens.json`  
**Runtime:** `css/variables.css` (`--ds-font-*`)

---

## Font Families

| Role | Token | CSS variable | Stack |
| ---- | ----- | ------------ | ----- |
| Sans | `font.family.sans` | `--ds-font-family-sans` | Helvetica, Arial, sans-serif |
| Mono | `font.family.mono` | `--ds-font-family-mono` | DM Mono, ui-monospace, monospace |

Helvetica handles UI chrome. DM Mono handles status, tempo, and technical values.

---

## Type Scale

| Role | Token | CSS variable | Size |
| ---- | ----- | ------------ | ---- |
| Display | `font.size.display` | `--ds-font-size-display` | 2.5rem (40px) |
| H1 | `font.size.h1` | `--ds-font-size-h1` | 3rem (48px) |
| H2 | `font.size.h2` | `--ds-font-size-h2` | 2rem (32px) |
| H3 | `font.size.h3` | `--ds-font-size-h3` | 1.5rem (24px) |
| H4 | `font.size.h4` | `--ds-font-size-h4` | 1.125rem (18px) |
| Body | `font.size.body` | `--ds-font-size-body` | 1rem (16px) |
| Body small | `font.size.body-sm` | `--ds-font-size-body-sm` | 0.875rem (14px) |
| Caption | `font.size.caption` | `--ds-font-size-caption` | 0.75rem (12px) |
| Label | `font.size.label` | `--ds-font-size-label` | 0.875rem (14px) |
| Overline | `font.size.overline` | `--ds-font-size-overline` | 0.625rem (10px) |

---

## Font Weights

| Role | Token | CSS variable | Value |
| ---- | ----- | ------------ | ----- |
| Body | `font.weight.body` | `--ds-font-weight-body` | 400 |
| Headings | `font.weight.headings` | `--ds-font-weight-headings` | 700 |
| Labels | `font.weight.label` | `--ds-font-weight-label` | 700 |
| Mono | `font.weight.mono` | `--ds-font-weight-mono` | 300 |

---

## Letter Spacing

| Role | Token | Value |
| ---- | ----- | ----- |
| Label | `font.letter-spacing.label` | `0.08em` |
| Overline | `font.letter-spacing.overline` | `0.08em` |

Use uppercase sparingly. Labels and overlines may use letter-spacing for instrument-panel feel.

---

## Rules

- One H1 per page (instrument shell typically uses H2 for stage titles)
- Minimum 16px (1rem) body on all viewports
- Prefer spacing over smaller headings for separation
- Use `--ds-color-text-secondary` or Bootstrap `.text-muted` for secondary text
- Headings use Helvetica Bold (700) — confident, not shouty

---

## Bootstrap Mapping

| Role | Bootstrap |
| ---- | --------- |
| Muted secondary | `.text-secondary`, `.text-muted` |
| Mono | `.font-monospace` |
| Small | `.small`, `.btn-sm` |
| Headings | `.h1`–`.h6`, heading utilities |

---

## Related

- [BRAND_GUIDELINES.md](./BRAND_GUIDELINES.md)
- [TOKEN_ARCHITECTURE.md](./TOKEN_ARCHITECTURE.md)
