# Platform Overview

Home documentation for the Plantasonic Platform development environment.

## What is plantasonic-platform?

The **orchestration layer** for the Plantasonic ecosystem. It connects applications to the Design System, Sound Engine, and Visual Engine without duplicating any of them.

## Ecosystem map

```
Applications (creative layer)
    ↓
@plantasonic/platform (this repo)
    ↓
Design System · Sound Engine · Visual Engine
```

## Repository structure

| Path | Purpose |
|------|---------|
| `packages/sdk/` | `@plantasonic/platform` — orchestration SDK |
| `packages/shared-types/` | `@plantasonic/platform-types` — contracts |
| `packages/create-plantasonic-app/` | Prototype generator CLI |
| `apps/demo/` | Full platform demo |
| `apps/plantasonic-reference/` | Thin consumer reference |
| `templates/` | Prototype template catalog |
| `skills/` | Cursor agent workflows |
| `.cursor/rules/` | Always-on AI rules |
| `docs/` | Documentation framework |
| `scripts/` | Future tooling interfaces |
| `examples/` | Pattern documentation |

## Development workflow

```
Build shared infrastructure
    ↓
Generate application (pnpm create:app)
    ↓
Customize application (creative layer only)
    ↓
Test (validation checklist)
    ↓
Deploy
    ↓
Iterate
```

## Related documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) — layer model and dependency rules
- [PACKAGE_RESPONSIBILITIES.md](./PACKAGE_RESPONSIBILITIES.md) — ownership boundaries
- [APPLICATION_GUIDE.md](./APPLICATION_GUIDE.md) — building thin apps
- [GENERATOR_GUIDE.md](./GENERATOR_GUIDE.md) — scaffolding apps
- [SDK_GUIDE.md](./SDK_GUIDE.md) — platform API reference
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) — legacy app cutover
- [VALIDATION_CHECKLIST.md](./VALIDATION_CHECKLIST.md) — release checks

## External repositories (not modified from here)

- `plantasonic-design-system` — UI, tokens, shell
- `plantasia-sound-engine` — audio
- `ascii-visual-engine` — visuals
- `plantasonic-xyz` — production application
