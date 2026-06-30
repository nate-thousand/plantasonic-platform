# Component Library (Layer 1)

Reusable, token-driven, accessible UI components rendered as framework-agnostic HTML strings. Applications compose these instead of hand-building their own controls.

This is **slice 1** of the component library. Form controls, overlays, and data-display components arrive in later releases (see [ROADMAP](../../ROADMAP.md)).

## Public API

```typescript
import {
  button, iconButton,
  toolbar, toolbarGroup,
  panel, panelHeader,
  card, section, controlGroup, surface,
  badge, statusIndicator,
  COMPONENT_NAMES,
} from 'plantasonic-design-system/components';
```

Styles (import after the Bootstrap layers and `plantasonic-components`):

```scss
@import 'plantasonic-design-system/scss/components';
```

## Components

| Component | Notes |
| --- | --- |
| `button` | Variants: `primary`, `secondary`, `ghost`, `subtle`, `danger`. Sizes `sm`/`md`/`lg`. Supports `loading` (sets `aria-busy` + `disabled`), `pressed` (toggle), `icon`/`iconEnd`. |
| `iconButton` | Square, **requires** `ariaLabel`. Optional `title` tooltip and `pressed`. |
| `toolbar` | `role="toolbar"` with `aria-label` + `aria-orientation`. |
| `toolbarGroup` | `role="group"`, optional `divider`. |
| `panel` / `panelHeader` | Reuse the shell's themed `.ps-panel` structure; `collapsible` headers expose `aria-expanded`. |
| `card` | Themed Bootstrap `.card`; `interactive` adds focus ring + keyboard focus. |
| `section` | Titled content block using `.ps-section-header`; wires `aria-labelledby`. |
| `controlGroup` | `role="group"` cluster of controls with a (optionally hidden) label. |
| `badge` | Variants `default`/`accent`/`success`/`warning`/`error`/`info`, optional `pill`/`dot`. |
| `statusIndicator` | `role="status"`; states `online`/`active`/`idle`/`busy`/`error`/`offline`; optional `pulse`. |
| `surface` | Re-exported from [layout primitives](./LAYOUT_PRIMITIVES.md) — single implementation, no duplication. |

## Example

```typescript
import { toolbar, toolbarGroup, iconButton, button } from 'plantasonic-design-system/components';

const transport = toolbar({
  label: 'Transport',
  content:
    toolbarGroup({ content: iconButton({ icon: '▶', ariaLabel: 'Play', variant: 'primary' }) }) +
    toolbarGroup({ divider: true, label: 'View', content: button({ label: 'Mixer', variant: 'ghost', size: 'sm' }) }),
});
```

## Design principles

- **Token-driven** — all color, spacing, radius, and motion come from `--ds-*` tokens. No hex in render output or stylesheet (enforced by `tests/components.test.mjs`).
- **Reuse over duplication** — components build on existing themed surfaces (`.ps-toolbar`, `.ps-panel`, `.ps-section-header`, `.ps-param-group`, `.ps-status-dot`, Bootstrap `.card`/`.badge`). New `.ds-c-*` styles only fill gaps.
- **Theming** — dark/light are inherited through tokens; nothing is hardcoded per theme.
- **Accessibility** — semantic roles, required labels for icon-only controls, `aria-pressed`/`aria-busy`/`aria-expanded`, visible focus rings, and `prefers-reduced-motion` handling for spinners/pulses.
- **Escaping** — all user-provided text is HTML-escaped.

## Behavior

These are pure render functions. Interactive wiring (collapse toggles, command dispatch) is the application's responsibility or is handled by the [Application Shell](./APPLICATION_SHELL.md) `bindApplicationShell()` where applicable.
