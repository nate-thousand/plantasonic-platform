# Migration Guides

See [GOVERNANCE.md](./docs/platform/GOVERNANCE.md) for API review and deprecation policy.

## Upgrading to 1.0.0

Version 1.0 is **additive** — no breaking changes from v1.4.x public APIs.

1. Update dependency: `"plantasonic-design-system": "1.0.0"` (or latest `1.0.x`)
2. Run `npm run build` in the design system repo to refresh generated artifacts
3. Verify exports against [API Reference](./platform/API_REFERENCE.md)
4. Adopt `project.json` + platform client pattern for new apps (see [Application Development Guide](./platform/APPLICATION_DEVELOPMENT_GUIDE.md))
5. Run `npm run validate:examples` if using reference example specs

Deprecated:

- `ai-native-design-system` package → use `plantasonic-design-system`
- Copied layout files → use `./shell`

## From inline tokens to design system package

1. Add dependency: `plantasonic-design-system`
2. Remove duplicated `--ds-*` / `--ps-*` definitions from app CSS
3. Import `@ds/css/variables.css` once at app entry
4. Replace SCSS palette with `@ds/scss/bootstrap-theme` + bridge
5. Run visual QA against showcase Bootstrap reference

## From ai-native-design-system (legacy)

That package is deprecated. Point all docs and imports at `plantasonic-design-system`. Token paths and CSS variable names are stable in this repo.

## Theme text color fix (v1.1+)

`color.text.primary` is neutral (`#e5e5e5` dark). Accent green is `color.text.accent`. Update any app code that assumed primary text was green.

## Upgrading Bootstrap

Plantasonic pins Bootstrap **5.0.2**. Do not upgrade Bootstrap in consuming apps without a design system release — variable names and bridge selectors may break.

## Template refresh

Re-scaffold is not required. Compare your `theme.ts` and SCSS imports with the latest template in `templates/react-vite/` when upgrading major versions.

## Adopting the platform layers (v1.3+)

The platform layers — [layout primitives](./LAYOUT_PRIMITIVES.md), [component library](./COMPONENT_LIBRARY.md), and [motion system](./MOTION_SYSTEM.md) — are **fully additive**. There is nothing to migrate: existing apps, the Application Shell, all tokens, and all `.ps-*`/`.bs-*` classes are unchanged.

To adopt them:

1. Import the SCSS you need, after the existing layers:

   ```scss
   @import 'plantasonic-design-system/scss/primitives';
   @import 'plantasonic-design-system/scss/components';
   @import 'plantasonic-design-system/scss/motion';
   ```

2. Import the render/runtime APIs:

   ```typescript
   import { stack, grid } from 'plantasonic-design-system/primitives';
   import { button, card } from 'plantasonic-design-system/components';
   import { animate } from 'plantasonic-design-system/motion';
   ```

3. Incrementally replace hand-built controls and layout CSS with these APIs. No big-bang migration is required — adopt component by component.

## Adopting the Creative Application Framework (v1.4+)

The Creative Application Framework — the [instrument shell](./INSTRUMENT_SHELL_GUIDE.md),
[regions](./WORKSPACE_GUIDE.md), [transport](./TRANSPORT_GUIDE.md),
[canvas mounts](./CANVAS_GUIDE.md), [panels](./PANEL_GUIDE.md), display modes,
floating behavior, input/output layers, and the
[`createApplication()` SDK](./APPLICATION_ARCHITECTURE_GUIDE.md) — is **fully
additive**. `renderApplicationShell()` with no `variant` is byte-for-byte the
same standard navigation shell as before; every new config field is optional.

To adopt it:

1. Import the instrument SCSS after the existing layers:

   ```scss
   @import 'plantasonic-design-system/scss/instrument';
   ```

2. Either opt into the instrument shell directly:

   ```typescript
   import { renderApplicationShell } from 'plantasonic-design-system/shell';
   renderApplicationShell({ variant: 'instrument', instrument: { /* regions */ } });
   ```

   …or let the SDK wire everything:

   ```typescript
   import { createApplication } from 'plantasonic-design-system/app';
   const app = createApplication({ title: 'My Instrument' });
   // register workspace / transport / inspector / status / input, then:
   await app.mount(rootEl);
   ```

3. Nothing else changes. Standard-shell apps require no edits. Start the
   [Creative Application Guide](./CREATIVE_APPLICATION_GUIDE.md) for the full
   tour.
