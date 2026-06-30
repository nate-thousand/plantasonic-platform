---
name: integrate-design-system
description: Integrates plantasonic-design-system with platform apps via instrument shell. Use when wiring UI, shell, transport, inspector, tokens, or layout regions.
---

# Skill: Integrate Design System

## Purpose

Wire `plantasonic-design-system` into a platform consumer app without duplicating tokens or shell code.

## Inputs

- Application shell config (`ApplicationShellConfig`)
- Workspace region bindings
- Transport/inspector/browser requirements
- Theme preference (dark/light)

## Outputs

- DS CSS/SCSS imports in app entry
- Instrument shell rendered via platform mount or manual `renderApplicationShell()`
- Regions bound to platform workspace

## Required packages

- `plantasonic-design-system` (application dependency)
- `@plantasonic/platform` (orchestration)
- `@plantasonic/platform-demo/instrument-app` (recommended mount API)

## Validation checklist

- [ ] `css/variables.css` imported in main.ts
- [ ] SCSS layers imported from DS package (not copied locally)
- [ ] `renderApplicationShell({ variant: 'instrument' })` used
- [ ] Workspace regions bound to `[data-ps-region]` landmarks
- [ ] No local token files or Bootstrap theme duplicates
- [ ] Transport wired to platform lifecycle

## Success criteria

- Instrument shell renders (stage, transport, inspector, browser, status)
- DS tokens drive all colors/spacing
- Theme initializes without flash
- No Design System source copied into app repo

## Common mistakes

- Copying `_tokens.generated.scss` locally
- Building custom `#ps-stage` layout instead of DS shell
- Importing DS in platform SDK packages (apps only)
- Skipping `initShellTheme()`

## Example usage

```typescript
import 'plantasonic-design-system/css/variables.css';
import { initShellTheme } from 'plantasonic-design-system/shell';
import { mountInstrumentApp } from '@plantasonic/platform-demo/instrument-app';

initShellTheme('dark');
await mountInstrumentApp(container, appContent);
```

See also: `docs/INTEGRATION_GUIDE.md` (Design System section), `docs/APPLICATION_GUIDE.md`.
