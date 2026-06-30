# Token Usage

## Source files

| File | Contents |
| --- | --- |
| `tokens/foundation.tokens.json` | Shared primitives |
| `tokens/theme.dark.tokens.json` | Dark semantics |
| `tokens/theme.light.tokens.json` | Light semantics |

## CSS variables

All exported tokens map to `--ds-*` custom properties in `css/variables.css`.

```css
.my-panel {
  background: var(--ds-color-surface-card);
  color: var(--ds-color-text-primary);
  padding: var(--ds-space-4);
  border-radius: var(--ds-radius-default);
}
```

## TypeScript

Generated types: `generated/css-vars.d.ts`

```typescript
import type { DsCssVar, DsTokenPath } from 'plantasonic-design-system/generated/css-vars';
```

## SCSS

Generated SCSS aliases: `scss/_tokens.generated.scss`

```scss
@import '@ds/scss/tokens.generated';
.card { background: $ds-color-surface-card; }
```

## Commands

```bash
npm run tokens:validate      # alias + reference checks
npm run tokens:build-css     # regenerate css/variables.css
npm run generate:token-docs  # docs/generated/TOKENS.md
```

## Full reference

See [generated TOKENS.md](../generated/TOKENS.md) after running `npm run docs`.
