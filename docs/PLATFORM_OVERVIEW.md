# Platform Overview

Home documentation for the **Plantasonic AI First Application Platform** development environment.

## What is Plantasonic?

**Plantasonic** is an AI First Application Platform — the source of truth for reusable systems that power creative, audio-reactive, and instrument-style applications.

**plantasonic-platform** (this repository) is where platform development happens: SDK, generator, Design System, Theme System, engines, templates, skills, and documentation.

Current stable milestone: **v0.12.0 — Foundation Complete**.

## Permanent Architecture Rule

The Plantasonic Platform is completely application agnostic.

Applications consume the Platform. Applications are developed, versioned, and deployed independently.

## Ecosystem hierarchy

```
Plantasonic Platform              ← source of truth for reusable systems
    ↓
Reusable Packages                 ← SDK · DS · themes · engines · templates · AI workflow
    ↓
Independent Applications          ← plantasonic-xyz · Signal 9 · Plantasia · future apps
```

| Layer | Repository / path | Role |
|-------|-------------------|------|
| **Platform** | `plantasonic-platform` | SDK, generator, orchestration, engines, themes, templates, docs |
| **Design System** | `packages/design-system/` | UI shell, tokens, components, Creative Workspace |
| **Theme System** | `themes/` | Reusable theme catalog |
| **Reference app** | `plantasonic-xyz` v0.4.0 | Independent official reference application |
| **Product apps** | Signal 9, Plantasia, future apps | Independent repositories that consume the Platform |

See [REFERENCE_APP.md](./REFERENCE_APP.md) for the full reference application guide.

## Ecosystem map

```
Plantasonic Platform
    ↓
Reusable Packages
    ↓
Independent Applications
```

## Repository structure

| Path | Purpose |
|------|---------|
| `packages/sdk/` | `@plantasonic/platform` — orchestration SDK |
| `packages/shared-types/` | `@plantasonic/platform-types` — contracts |
| `packages/create-plantasonic-app/` | Prototype generator CLI |
| `packages/design-system/` | `plantasonic-design-system` — tokens, shell, components, Creative Workspace |
| `themes/` | Reusable theme catalog |
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

- [REFERENCE_APP.md](./REFERENCE_APP.md) — plantasonic-xyz v0.4.0 reference application
- [ARCHITECTURE.md](./ARCHITECTURE.md) — layer model and dependency rules
- [PACKAGE_RESPONSIBILITIES.md](./PACKAGE_RESPONSIBILITIES.md) — ownership boundaries
- [APPLICATION_GUIDE.md](./APPLICATION_GUIDE.md) — building thin apps
- [GENERATOR_GUIDE.md](./GENERATOR_GUIDE.md) — scaffolding apps
- [SDK_GUIDE.md](./SDK_GUIDE.md) — platform API reference
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) — legacy app cutover
- [VALIDATION_CHECKLIST.md](./VALIDATION_CHECKLIST.md) — release checks

## External repositories and mirrors

- `../plantasonic-xyz/plantasonic-design-system` — temporary Design System mirror retained until Phase 6
- `plantasia-sound-engine` — audio (vendored in `packages/sound-engine/`)
- `ascii-visual-engine` — visuals (vendored in `packages/visual-engine/`)
- `plantasonic-xyz` — independent official reference application (v0.4.0)
- Signal 9 — independent first product application
- Plantasia — independent product/application ecosystem
