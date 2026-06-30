# Figma source exports

Canonical Figma Variable exports for `npm run tokens:import-figma`.

| File | Figma collection | Maps to |
| --- | --- | --- |
| `foundation/Mode 1.tokens.json` | foundation · Mode 1 | `tokens/foundation.tokens.json` |
| `Theme 1.tokens.json` | semantic · Theme 1 | `tokens/theme.dark.tokens.json` |
| `Theme 2.tokens.json` | semantic · Theme 2 | `tokens/theme.light.tokens.json` |

## Update workflow

1. In Figma: Local variables → export each collection/mode as W3C Design Tokens
2. Replace files in this folder
3. From repo root: `npm run tokens:import-figma && npm run build`
