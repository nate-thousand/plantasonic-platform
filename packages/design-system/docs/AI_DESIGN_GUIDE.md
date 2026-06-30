# AI Design Guide

How to generate, integrate, and validate AI-produced UI against the Plantasonic Design System.

This guide is the canonical reference for v0, Cursor, and future AI development tools building interfaces in the Plantasonic ecosystem.

---

## Workflow

```text
Figma
  ↓
Figma MCP
  ↓
Design Tokens (tokens/*.tokens.json)
  ↓
Plantasonic Design System
  ↓
v0 (rapid UI generation)
  ↓
Cursor (integration + refinement)
  ↓
Application
```

1. **Figma** — designers define components, layouts, and semantic roles in the Plantasonic Figma file.
2. **Figma MCP** — sync exports into `tokens/figma-source/`, then run `npm run tokens:import-figma`.
3. **Design Tokens** — foundation + theme JSON is the single source of truth; CSS and SCSS are generated.
4. **Plantasonic Design System** — tokens, Bootstrap theme, components, primitives, motion, and machine-readable AI context (`generated/ai/`).
5. **v0** — generate initial UI from prompts using [V0 Guidelines](./V0_GUIDELINES.md) and the [Prompt Library](./PROMPTS/README.md).
6. **Cursor** — integrate generated code, replace hardcoded values with tokens, wire Application Shell, validate compliance.
7. **Application** — ship UI that passes token audit and matches the showcase.

---

## Generating UI with v0

Use v0 for **exploration and scaffolding**, not as the final implementation.

Before prompting:

1. Read [V0 Guidelines](./V0_GUIDELINES.md) for prompt structure and constraints.
2. Attach or reference `generated/ai/index.json` and [TOKEN_REFERENCE](./generated/ai/TOKEN_REFERENCE.md) so the model knows available tokens and components.
3. Pick a starter prompt from [docs/PROMPTS/](./PROMPTS/README.md) closest to your target UI.
4. Specify stack constraints: Bootstrap 5.0.2, CSS custom properties (`--ds-*`), no Tailwind unless the app already uses it.

After generation, treat v0 output as **draft markup** — always run the integration checklist below before merging.

---

## Integrating Generated Code

### 1. Import the design system

```html
<link rel="stylesheet" href="plantasonic-design-system/css/variables.css" />
```

```scss
@import 'plantasonic-design-system/scss/bootstrap-theme';
@import 'bootstrap/scss/bootstrap';
@import 'plantasonic-design-system/scss/css-theme-bridge';
@import 'plantasonic-design-system/scss/components';
@import 'plantasonic-design-system/scss/primitives';
@import 'plantasonic-design-system/scss/motion';
```

Set theme on the document root:

```html
<html data-theme="dark">
```

### 2. Replace framework defaults

| v0 often generates | Replace with |
| --- | --- |
| Tailwind color classes (`bg-zinc-900`) | `var(--ds-color-surface-app)` or Bootstrap + tokens |
| Arbitrary spacing (`p-4`, `gap-6`) | `--ds-space-*` or Bootstrap spacing utilities backed by tokens |
| Inline `style={{ color: '#00FF57' }}` | `var(--ds-color-primary)` |
| Custom `<Button>` components | Bootstrap `.btn` or `plantasonic-design-system/components` |
| shadcn/ui primitives | Bootstrap 5.0.2 classes per [COMPONENT_MAPPING](./COMPONENT_MAPPING.md) |

### 3. Use shared platform APIs where applicable

```typescript
import { renderApplicationShell } from 'plantasonic-design-system/shell';
import { button, panel, toolbar } from 'plantasonic-design-system/components';
import { stack, grid, sidebar } from 'plantasonic-design-system/primitives';
import { animate, prefersReducedMotion } from 'plantasonic-design-system/motion';
```

Prefer platform render functions over duplicating markup the design system already provides.

### 4. Validate before merge

```bash
npm run audit:bootstrap    # hardcoded value scan
```

```typescript
import { validateApplication } from 'plantasonic-design-system/ai';

const report = validateApplication([{ path: 'src/app.css', content }]);
```

See [Application Compliance Guide](./platform/APPLICATION_COMPLIANCE_GUIDE.md).

---

## Replacing Generated Values with Plantasonic Tokens

Search generated code for these patterns and replace:

| Pattern | Action |
| --- | --- |
| `#RRGGBB`, `rgb()`, `hsl()` | Map to nearest semantic color token |
| Raw `px`/`rem` for spacing | Map to `--ds-space-{n}` |
| `font-size: 14px` | Map to `--ds-font-size-body-sm` or `--ds-font-size-caption` |
| `border-radius: 8px` | Map to `--ds-radius-default` or `--ds-radius-*` |
| `box-shadow: …` | Map to `--ds-shadow-*` |
| `transition: 200ms` | Map to `--ds-transition-*` or `--ds-motion-duration-*` |
| `font-family: Inter` | Map to `--ds-font-family-sans` or `--ds-font-family-mono` |

**Rule:** If a value exists in `generated/ai/tokens.json`, use the CSS variable — never copy the literal value into component code.

Example:

```css
/* Unacceptable — duplicated token value */
.panel { background: #1A1A1A; padding: 16px; }

/* Acceptable — semantic tokens */
.panel {
  background: var(--ds-color-surface-raised);
  padding: var(--ds-space-4);
  border-radius: var(--ds-radius-default);
}
```

---

## Semantic Tokens vs Hardcoded Values

Always reference **semantic** tokens that describe intent:

| Intent | Token |
| --- | --- |
| App background | `--ds-color-surface-app` |
| Primary content area | `--ds-color-surface-stage` |
| Panel / card surface | `--ds-color-surface-raised` |
| Primary text | `--ds-color-text-primary` |
| Secondary text | `--ds-color-text-secondary` |
| Primary action | `--ds-color-primary` |
| Focus ring | `--ds-shadow-focus` |
| Default spacing | `--ds-space-3` |
| Nav height | `--ps-nav-height` |
| Touch target minimum | `--ps-touch-target` |

Foundation tokens (`color.brand.primary.500`) are for theme authors — application UI should use semantic roles (`color.surface.raised`).

---

## Component Rules

Generated components **must**:

- Consume Plantasonic tokens (`--ds-*`, `--ps-*`) for all visual values
- Use shared primitives from `plantasonic-design-system/primitives` and `plantasonic-design-system/components`
- Use Bootstrap 5.0.2 classes per [COMPONENT_MAPPING](./COMPONENT_MAPPING.md) for standard controls
- Avoid duplicate components — check [Component Library](./platform/COMPONENT_LIBRARY.md) and `generated/ai/components.json` first
- Avoid hardcoded colors, spacing, typography, radius, shadow, and motion values
- Respect `prefers-reduced-motion` and provide visible focus states

Generated components **must not**:

- Introduce parallel class systems (`.my-btn-primary`, `.custom-card`)
- Copy token JSON into application repos
- Edit Bootstrap source in `node_modules/`
- Use status colors for non-status decoration

---

## Token Rules

AI-generated interfaces **must reference**:

| Category | Examples |
| --- | --- |
| Semantic color | `--ds-color-surface-*`, `--ds-color-text-*`, `--ds-color-border-*`, `--ds-color-primary` |
| Spacing | `--ds-space-0` through `--ds-space-*` |
| Typography | `--ds-font-family-*`, `--ds-font-size-*`, `--ds-font-weight-*`, `--ds-line-height-*` |
| Motion | `--ds-transition-*`, `--ds-motion-duration-*`, `--ds-motion-easing-*`, `--ds-ease-*` |
| Elevation | `--ds-shadow-sm`, `--ds-shadow-md`, `--ds-shadow-lg`, `--ds-shadow-focus`, `--ds-shadow-glow-accent` |
| Radius | `--ds-radius-default`, `--ds-radius-sm`, `--ds-radius-lg` |
| Product layout | `--ps-nav-height`, `--ps-dock-height`, `--ps-sidebar-width`, `--ps-touch-target` |

**Never duplicate token values** inside generated components. The token file holds the value; components hold the reference.

Run `npm run ai:context` to refresh machine-readable token catalogs for AI tools.

---

## Theme Rules

Plantasonic ships **dark** (default) and **light** themes via `data-theme` on `<html>`. Applications may add **app-specific semantic themes** while remaining compatible with the design system.

### Built-in themes

```html
<html data-theme="dark">   <!-- default instrument theme -->
<html data-theme="light">  <!-- documentation / bright environments -->
```

### Application-owned themes (e.g. Signal 9)

Apps like **Signal 9** can define their own semantic theme by:

1. **Extending, not replacing** — add a new theme token file (e.g. `theme.retro.tokens.json`) that aliases foundation primitives into the same semantic roles (`color.surface.app`, `color.text.primary`, etc.).
2. **Generating CSS** — emit a `[data-theme="retro"]` block in the app's stylesheet that overrides `--ds-*` variables only.
3. **Keeping component code theme-agnostic** — components reference `--ds-color-surface-app`, never retro-specific hex values.
4. **Preserving Bootstrap bridge** — import `css-theme-bridge.scss` so Bootstrap components re-theme when `data-theme` changes.
5. **Documenting the theme** — register supported themes in app config; optionally export metadata for AI tools.

```text
foundation.tokens.json          (shared — owned by design system)
        ↓
theme.dark.tokens.json          (design system default)
theme.light.tokens.json         (design system default)
theme.retro.tokens.json         (app-owned — Signal 9 example)
        ↓
css/variables.css + app theme overrides
        ↓
Components use --ds-* only → work across all themes
```

Do **not** modify design system token values to support an app theme. App themes override semantic mappings at runtime.

See [Theme System](./platform/THEME_SYSTEM.md) and [Token Architecture](./TOKEN_ARCHITECTURE.md).

---

## Acceptable AI-Generated Patterns

- Bootstrap markup with Plantasonic token-backed styling
- Composition of `shell`, `components`, `primitives`, and `motion` APIs
- Semantic HTML with ARIA on custom controls
- Floating panels and overlays using `--ds-color-overlay-*` tokens
- Instrument layouts using Creative Workspace presets (`instrument`, `studio`, `presentation`)
- Theme switching via `data-theme` without reload
- v0-generated structure refactored to token references before merge

---

## Unacceptable Generated Patterns

- Hardcoded hex, rgb, or hsl in component CSS or inline styles
- Duplicated spacing scale (`8px`, `16px`, `24px` literals instead of `--ds-space-*`)
- Custom button/input systems parallel to Bootstrap
- Decorative gradients on control surfaces
- Animation without reduced-motion fallback
- Generic SaaS dashboard chrome that competes with stage/canvas content
- Copying `tokens/*.json` into application repositories
- Modifying design system token values in generated code
- Tailwind/shadcn output left unconverted in Bootstrap-based apps

---

## Related Documentation

| Doc | Purpose |
| --- | --- |
| [V0 Guidelines](./V0_GUIDELINES.md) | v0 prompt structure and best practices |
| [Prompt Library](./PROMPTS/README.md) | Reusable starter prompts |
| [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md) | Implementation rules |
| [TOKEN_ARCHITECTURE.md](./TOKEN_ARCHITECTURE.md) | Token layers and naming |
| [COMPONENT_MAPPING.md](./COMPONENT_MAPPING.md) | Bootstrap class reference |
| [AI Architecture](./platform/AI_ARCHITECTURE.md) | Registry, validation, generators |
| [prompts/APPLY_DESIGN_SYSTEM.md](../prompts/APPLY_DESIGN_SYSTEM.md) | Cursor agent instructions |
