# Application Development Guide

Build creative applications on the Plantasonic Design System v1.0 platform.

## Recommended path

1. **Choose an example** — [examples/README.md](../../examples/README.md) (dashboard, instrument, generative-art, …)
2. **Scaffold** — `npx plantasonic create <type> <name>` or `plantasonic spec "<brief>" --name "…"`
3. **Customize** — creative logic only; install engines, never embed
4. **Validate** — `npm run validate` (inherited from platform)
5. **Deploy** — `vercel.json` included; see [Deployment Guide](./DEPLOYMENT_GUIDE.md)

## Architecture

```
project.json (spec) → studio orchestrator → Vite app
                      ↓
platform.json (manifest) → engines, services, workflows
                      ↓
Design System tokens + shell + components
```

## Consume public APIs only

| Need | Import |
| --- | --- |
| App chrome | `./shell` |
| Layout | `./primitives` |
| Controls | `./components` |
| Motion | `./motion` |
| Creative instrument | `./instrument`, `./app` |
| Compliance | `./ai` → `validateApplication()` |
| Full scaffold | `./studio` → `createProjectFromConcept()` |

Do **not** import `src/shell/internal/*` or duplicate tokens.

## Tokens

```typescript
// Entry
import 'plantasonic-design-system/css/variables.css';
```

```scss
@import 'plantasonic-design-system/scss/bootstrap-theme';
@import 'plantasonic-design-system/scss/css-theme-bridge';
```

Theme: `data-theme="dark" | "light"` on `<html>`.

## Validation checklist

- [ ] No hardcoded colors (use `--ds-*` tokens)
- [ ] `platform.json` / `project.json` present
- [ ] Engines installed via npm, not copied
- [ ] `npm run validate` passes
- [ ] README, CHANGELOG, validation checklist docs

## Plantasonic (production app)

The live [Plantasonic](https://github.com/nate-thousand/plantasonic) app consumes `./shell` + SCSS layers and uses a local platform client shim validated by `npm run verify:platform`.

## Further reading

- [API Reference](./API_REFERENCE.md)
- [Creative Application Guide](./CREATIVE_APPLICATION_GUIDE.md)
- [Application Compliance](./APPLICATION_COMPLIANCE_GUIDE.md)
- [Studio Migration](./STUDIO_MIGRATION_GUIDE.md)
