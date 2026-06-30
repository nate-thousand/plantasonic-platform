# Layout Primitives (Layer 9)

Low-level, composable layout building blocks that render framework-agnostic HTML strings. These are the structural foundation every application layout and higher-level component is built from.

## Public API

```typescript
import {
  stack, inline, cluster, grid, sidebar, split, frame, center, cover,
  container, surface, section, region, viewport, spacer, inset, flow,
  PRIMITIVE_NAMES,
} from 'plantasonic-design-system/primitives';
```

Styles:

```scss
@import 'plantasonic-design-system/scss/primitives';
```

Every primitive returns an HTML `string`, applies a `.ds-l-*` class, and configures itself through `--ds-l-*` custom properties. Spacing is always supplied via spacing **tokens** (`gap`, `padding`, `gutter` props accept `'0' | '1' | '2' | '3' | '4' | '5' | '6' | '8'`), never hardcoded values.

## Primitives

| Primitive | Purpose | Key options |
| --- | --- | --- |
| `stack` | Vertical rhythm | `gap`, `align`, `justify` |
| `inline` | Horizontal row | `gap`, `align`, `justify`, `wrap` |
| `cluster` | Wrapping group (tags, chips) | `gap`, `align`, `justify` |
| `grid` | Responsive auto-fill grid | `gap`, `minItemWidth`, `columns` |
| `sidebar` | Fixed side + fluid main | `side`, `end`, `contentMin`, `sidebarContent`, `mainContent` |
| `split` | Two regions by ratio | `fraction`, `vertical`, `startContent`, `endContent` |
| `frame` | Fixed aspect ratio media box | `ratio` |
| `center` | Centered measure | `maxWidth`, `gutter`, `intrinsic` |
| `cover` | Header / centered main / footer | `minHeight`, `headerContent`, `mainContent`, `footerContent` |
| `container` | Max-width page wrapper | `maxWidth`, `gutter` |
| `surface` | Token-driven box | `level`, `padding`, `radius`, `border` |
| `section` | Spaced semantic block | `spacing` |
| `region` | Labelled landmark | `role`, `label` |
| `viewport` | Full-height, safe-area shell | — |
| `spacer` | Flexible or fixed gap | `size`, `axis` |
| `inset` | Uniform padding box | `padding` |
| `flow` | Spacing between children | `gap` |

## Example

```typescript
import { sidebar, stack, surface } from 'plantasonic-design-system/primitives';

const layout = sidebar({
  side: '16rem',
  gap: '4',
  sidebarContent: stack({ gap: '2', content: navHtml }),
  mainContent: surface({ level: 'raised', padding: '5', content: pageHtml }),
});
```

## Accessibility

- `region` renders a labelled landmark (`role`, `aria-label`).
- `sidebar` accepts a `label` for the landmark.
- `spacer` is `aria-hidden` (purely decorative).
- Primitives apply no color or typography beyond inheritance, so contrast is governed by the surrounding token context.

## Responsive behavior

`sidebar`, `grid`, and `split` collapse gracefully (flex-basis / `auto-fill` / grid). `viewport` honors `env(safe-area-inset-*)` for notched devices. All sizing uses logical properties (`inline-size`, `block-size`) for RTL support.

## Constraints

- Spacing comes from spacing tokens only.
- No hex colors in render output or stylesheet (enforced by `tests/primitives.test.mjs`).
- Alignment/justification values are resolved to valid CSS in TypeScript and passed via `--ds-l-align` / `--ds-l-justify`.
