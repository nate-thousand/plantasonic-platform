# Platform Overview

Home documentation for the **Plantasonic AI First Application Platform** development environment.

## What is Plantasonic?

**Plantasonic** is an AI First Application Platform — the source of truth for reusable systems that power creative, audio-reactive, and instrument-style applications.

**plantasonic-platform** (this repository) is where platform development happens: SDK, generator, Design System, Theme System, engines, templates, skills, and documentation.

Current stable milestone: **v0.12.0 — Foundation Complete**.

## Ecosystem hierarchy

```
Plantasonic Platform              ← source of truth for reusable systems
    ↓
plantasonic-xyz v0.4.0            ← official reference host
    ↓
Signal 9 Live                     ← first real product app
    ↓
Future apps                       ← inherit platform; customize themes, tokens, assets, app logic
```

| Layer | Repository / path | Role |
|-------|-------------------|------|
| **Platform** | `plantasonic-platform` | SDK, generator, orchestration, engines, themes, templates, docs |
| **Design System** | `packages/design-system/` | UI shell, tokens, components, Creative Workspace |
| **Theme System** | `themes/` | Reusable theme catalog |
| **Reference host** | `plantasonic-xyz` v0.4.0 | Official reference application — demonstrates all platform capabilities |
| **Product apps** | `apps/signal-9-live/`, generated apps | App-specific creative layer on top of platform |
| **Future apps** | `pnpm create:app <slug>` | Inherit platform; customize identity and content |

See [REFERENCE_APP.md](./REFERENCE_APP.md) for the full reference application guide.

## Ecosystem map

```
Applications (creative layer — Signal 9, future apps)
    ↓
plantasonic-xyz (reference host)
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
| `packages/design-system/` | `plantasonic-design-system` — tokens, shell, components, Creative Workspace |
| `themes/` | Reusable theme catalog |
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
- `plantasonic-xyz` — official reference host application (v0.4.0)
