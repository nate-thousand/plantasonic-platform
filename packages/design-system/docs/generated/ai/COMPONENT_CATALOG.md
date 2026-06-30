# Component Catalog

Generated from the registry. 29 entries.

### Button `component.button`

> Token-driven action trigger with variants, sizes, loading, and toggle states.

- **Status:** stable · **Category:** controls · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/components`
- **Variants:** primary, secondary, ghost, subtle, danger

| Prop | Type | Required | Default |
| --- | --- | --- | --- |
| `label` | `string` | yes |  |
| `variant` | `ButtonVariant` |  | `primary` |
| `size` | `'sm' | 'md' | 'lg'` |  | `md` |
| `icon` | `string` |  |  |
| `iconEnd` | `string` |  |  |
| `disabled` | `boolean` |  | `false` |
| `loading` | `boolean` |  | `false` |
| `pressed` | `boolean` |  |  |
| `fullWidth` | `boolean` |  | `false` |
| `type` | `'button' | 'submit' | 'reset'` |  | `button` |
| `ariaLabel` | `string` |  |  |

- **Accessibility:** role `button` · WCAG 2.1.1, 4.1.2

```typescript
button({ label: 'Play', variant: 'primary' })
button({ label: 'Save', loading: true })
```

### Icon Button `component.iconButton`

> Compact icon-only control with a required accessible name.

- **Status:** stable · **Category:** controls · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/components`
- **Variants:** primary, secondary, ghost, subtle, danger

| Prop | Type | Required | Default |
| --- | --- | --- | --- |
| `icon` | `string` | yes |  |
| `ariaLabel` | `string` | yes |  |
| `variant` | `ButtonVariant` |  | `ghost` |
| `size` | `'sm' | 'md' | 'lg'` |  | `md` |
| `pressed` | `boolean` |  |  |
| `title` | `string` |  |  |

- **Accessibility:** role `button` · WCAG 4.1.2

```typescript
iconButton({ icon: '▶', ariaLabel: 'Play' })
```

### Toolbar `component.toolbar`

> Accessible toolbar landmark that groups controls with arrow-key orientation.

- **Status:** stable · **Category:** navigation · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/components`

| Prop | Type | Required | Default |
| --- | --- | --- | --- |
| `label` | `string` | yes |  |
| `content` | `string` |  |  |
| `orientation` | `'horizontal' | 'vertical'` |  | `horizontal` |

- **Accessibility:** role `toolbar`

### Toolbar Group `component.toolbarGroup`

> Semantic grouping of related toolbar controls with optional divider.

- **Status:** stable · **Category:** navigation · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/components`

| Prop | Type | Required | Default |
| --- | --- | --- | --- |
| `content` | `string` |  |  |
| `label` | `string` |  |  |
| `divider` | `boolean` |  | `false` |

- **Accessibility:** role `group`

### Panel `component.panel`

> Labelled, optionally collapsible content surface matching the shell panel chrome.

- **Status:** stable · **Category:** containers · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/components`

| Prop | Type | Required | Default |
| --- | --- | --- | --- |
| `title` | `string` | yes |  |
| `content` | `string` |  |  |
| `actions` | `string` |  |  |
| `collapsible` | `boolean` |  | `false` |
| `collapsed` | `boolean` |  | `false` |
| `ariaLabel` | `string` |  |  |

- **Accessibility:** role `region`

### Panel Header `component.panelHeader`

> Panel title row with optional collapse toggle and actions.

- **Status:** stable · **Category:** containers · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/components`

| Prop | Type | Required | Default |
| --- | --- | --- | --- |
| `title` | `string` | yes |  |
| `actions` | `string` |  |  |
| `collapsible` | `boolean` |  |  |
| `collapsed` | `boolean` |  |  |

- **Accessibility:** role `button`

### Surface `component.surface`

> Token-driven box with surface level, padding, radius, and optional border.

- **Status:** stable · **Category:** containers · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/components`
- **Variants:** sunken, default, raised, overlay

| Prop | Type | Required | Default |
| --- | --- | --- | --- |
| `level` | `SurfaceLevel` |  | `default` |
| `padding` | `SpaceToken` |  | `4` |
| `radius` | `'sm' | 'default' | 'lg' | 'xl'` |  | `default` |
| `border` | `boolean` |  | `true` |

### Card `component.card`

> Composition surface with header, body, footer, actions, and interactive affordance.

- **Status:** stable · **Category:** containers · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/components`

| Prop | Type | Required | Default |
| --- | --- | --- | --- |
| `title` | `string` |  |  |
| `subtitle` | `string` |  |  |
| `content` | `string` |  |  |
| `footer` | `string` |  |  |
| `actions` | `string` |  |  |
| `interactive` | `boolean` |  | `false` |
| `ariaLabel` | `string` |  |  |

- **Accessibility:** role `—` · WCAG 2.4.7

### Section `component.section`

> Titled content section with description and heading-row actions.

- **Status:** stable · **Category:** containers · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/components`

| Prop | Type | Required | Default |
| --- | --- | --- | --- |
| `title` | `string` | yes |  |
| `description` | `string` |  |  |
| `content` | `string` |  |  |
| `actions` | `string` |  |  |

- **Accessibility:** role `region`

### Control Group `component.controlGroup`

> Labelled group of related controls with row/column layout.

- **Status:** stable · **Category:** controls · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/components`

| Prop | Type | Required | Default |
| --- | --- | --- | --- |
| `label` | `string` | yes |  |
| `content` | `string` |  |  |
| `direction` | `'row' | 'column'` |  | `column` |
| `hideLabel` | `boolean` |  | `false` |

- **Accessibility:** role `group`

### Badge `component.badge`

> Compact status / count label mapped to semantic color tokens.

- **Status:** stable · **Category:** feedback · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/components`
- **Variants:** default, accent, success, warning, error, info

| Prop | Type | Required | Default |
| --- | --- | --- | --- |
| `label` | `string` | yes |  |
| `variant` | `BadgeVariant` |  | `default` |
| `pill` | `boolean` |  | `false` |
| `dot` | `boolean` |  | `false` |

- **Accessibility:** role `—` · WCAG 1.4.1

### Status Indicator `component.statusIndicator`

> Live status dot + label with optional pulse animation.

- **Status:** stable · **Category:** feedback · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/components`
- **Variants:** online, active, idle, busy, error, offline

| Prop | Type | Required | Default |
| --- | --- | --- | --- |
| `status` | `StatusKind` | yes |  |
| `label` | `string` | yes |  |
| `hideLabel` | `boolean` |  | `false` |
| `pulse` | `boolean` |  | `false` |

- **Accessibility:** role `status` · WCAG 1.4.1, 4.1.3

### Stack `primitive.stack`

> Vertical rhythm container with token gap and alignment.

- **Status:** stable · **Category:** layout · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/primitives`

### Inline `primitive.inline`

> Horizontal row with token gap, alignment, and wrap.

- **Status:** stable · **Category:** layout · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/primitives`

### Cluster `primitive.cluster`

> Wrapping group of items with consistent gaps.

- **Status:** stable · **Category:** layout · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/primitives`

### Grid `primitive.grid`

> Responsive auto-fill / fixed-column grid.

- **Status:** stable · **Category:** layout · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/primitives`

### Sidebar `primitive.sidebar`

> Sidebar + fluid main region that collapses responsively.

- **Status:** stable · **Category:** layout · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/primitives`

### Split `primitive.split`

> Two regions divided by a ratio, horizontal or vertical.

- **Status:** stable · **Category:** layout · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/primitives`

### Frame `primitive.frame`

> Fixed aspect-ratio media container.

- **Status:** stable · **Category:** layout · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/primitives`

### Center `primitive.center`

> Horizontally centered measure with optional intrinsic centering.

- **Status:** stable · **Category:** layout · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/primitives`

### Cover `primitive.cover`

> Header / centered main / footer full-height layout.

- **Status:** stable · **Category:** layout · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/primitives`

### Container `primitive.container`

> Max-width wrapper with token gutters.

- **Status:** stable · **Category:** layout · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/primitives`

### Surface `primitive.surface`

> Token-driven box with surface level, padding, radius, border.

- **Status:** stable · **Category:** layout · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/primitives`

### Section `primitive.section`

> Spaced semantic block.

- **Status:** stable · **Category:** layout · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/primitives`

### Region `primitive.region`

> Labelled landmark with configurable role.

- **Status:** stable · **Category:** layout · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/primitives`

### Viewport `primitive.viewport`

> Full-height, safe-area aware shell wrapper.

- **Status:** stable · **Category:** layout · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/primitives`

### Spacer `primitive.spacer`

> Flexible or fixed gap.

- **Status:** stable · **Category:** layout · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/primitives`

### Inset `primitive.inset`

> Uniform padding box.

- **Status:** stable · **Category:** layout · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/primitives`

### Flow `primitive.flow`

> Vertical flow spacing (lobotomized owl).

- **Status:** stable · **Category:** layout · **Version:** 1.3.0
- **Source:** `plantasonic-design-system/primitives`
