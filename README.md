# Plantasonic Platform

The **home of Plantasonic Platform development** — the AI First Application Platform for creative, audio-reactive, and instrument-style applications.

This repository is the source of truth for orchestration, SDK, generator, templates, skills, and documentation. Every future application, engine integration, and prototype follows the workflow defined here.

**Current milestone:** `v0.12.0` — **Foundation Complete**.

## What this is

- **AI First Application Platform** — orchestration layer for the entire ecosystem
- **Orchestration SDK** — `@plantasonic/platform`
- **Shared types** — `@plantasonic/platform-types`
- **Design System** — `plantasonic-design-system` in `packages/design-system`
- **Theme System** — reusable theme catalog in `themes/`
- **Prototype generator** — `@plantasonic/create-app`
- **Development environment** — rules, skills, templates, docs, validation

## What this is not

- Not an application repository
- Not published to npm yet

Sound and visual engines live in `packages/sound-engine` and `packages/visual-engine` as vendored workspace packages — they remain separate codebases with their own git remotes.

## Repository structure

```
plantasonic-platform/
├── .cursor/rules/          # Always-on AI rules
├── skills/                 # Agent workflows (synced to .cursor/skills/)
├── templates/              # Prototype template catalog
├── themes/                 # Reusable theme packages
├── docs/                   # Documentation framework
├── packages/
│   ├── sdk/                # @plantasonic/platform
│   ├── shared-types/       # @plantasonic/platform-types
│   ├── create-plantasonic-app/
│   ├── design-system/      # plantasonic-design-system
│   ├── sound-engine/       # plantasia-sound-engine
│   └── visual-engine/      # ascii-visual-engine
├── apps/
│   ├── demo/               # Full platform demo
│   └── plantasonic-reference/
├── scripts/                # Future tooling (placeholders)
└── examples/               # Pattern documentation
```

## Ecosystem relationships

```
Plantasonic Platform              ← source of truth (this repo)
    ↓
plantasonic-xyz v0.4.0            ← official reference host
    ↓
Signal 9 Live                     ← first real product app
    ↓
Future apps                       ← inherit platform; customize themes, tokens, assets, app logic
```

| Repository / app | Role |
|------------------|------|
| **plantasonic-platform** | SDK, generator, orchestration, engines, themes, templates, docs |
| **plantasonic-design-system** | UI, tokens, shell, Creative Workspace layouts |
| **plantasonic-xyz** v0.4.0 | Official reference host — demonstrates all platform capabilities |
| **Signal 9 Live** (`apps/signal-9-live/`) | First real product app — blueprint `signal-9` |
| **plantasia-sound-engine** | Audio (vendored in `packages/sound-engine/`) |
| **ascii-visual-engine** | Visuals (vendored in `packages/visual-engine/`) |
| **Future apps** | Generated via `pnpm create:app`; own creative layer only |

See [docs/REFERENCE_APP.md](./docs/REFERENCE_APP.md) for the reference application guide.

## Foundation Complete

`v0.12.0` marks the completed foundation for the Plantasonic AI First Application Platform.

- The Platform owns reusable orchestration, engines, Design System, Theme System, templates, AI workflow, and documentation.
- `plantasonic-xyz` is the official reference application.
- Signal 9 is the first product application to build on the foundation.
- Future apps should inherit platform systems and customize only app-specific themes, tokens, assets, presets, plugins, mappings, and product logic.

## Requirements

- Node.js ≥ 20
- pnpm ≥ 9

## Install

```bash
pnpm install
pnpm build
```

Design System, themes, sound, and visual engines are platform-owned reusable systems under `packages/design-system`, `themes/`, `packages/sound-engine`, and `packages/visual-engine`.

## Theme System

Reusable theme packages live in `themes/`.

- `themes/default/` mirrors the active Design System dark/light semantic token files exactly.
- `themes/plantasia/` and `themes/signal9/` are planned placeholders until reusable theme definitions are approved.
- Apps choose active themes and may keep app-specific visual treatment locally.

The Design System still owns base token generation and runtime CSS output in `packages/design-system/`.

## AI First Development Workflow

Plantasonic officially supports an AI first development workflow from design through deployment. Each tool has a defined role; the platform remains the source of truth for orchestration and architecture.

```
Figma
    ↓
Figma MCP
    ↓
Plantasonic Design System
    ↓
v0
    ↓
Cursor
    ↓
Plantasonic Platform
    ↓
GitHub
    ↓
Vercel Preview
    ↓
Production
```

| Phase | Tool | Role |
|-------|------|------|
| Design | Figma | Layouts, tokens, component specs |
| Handoff | Figma MCP | Design context into Cursor |
| UI foundation | Plantasonic Design System | Tokens, shell, Creative Workspace |
| UI generation | v0 | Initial component scaffolding |
| Development | Cursor | Primary implementation environment |
| Platform | Plantasonic Platform | SDK, generator, orchestration |
| Version control | GitHub | Pull requests and review |
| Deployment | Vercel | Preview deployments and production |

**Platform principles:**

- Plantasonic remains the source of truth
- Design tokens remain the source of truth
- Generated UI is integrated into the platform, not copied blindly
- AI generated code is reviewed and aligned with Plantasonic architecture before merging
- Reusable platform components are preferred over generated duplicates

See [docs/AI_WORKFLOW.md](./docs/AI_WORKFLOW.md) and [docs/TOOLCHAIN.md](./docs/TOOLCHAIN.md).

## Development workflow

```
Build shared infrastructure
    ↓
Generate application       →  pnpm create:app <slug>
    ↓
Customize application      →  creative layer only
    ↓
Test                       →  docs/VALIDATION_CHECKLIST.md
    ↓
Deploy
    ↓
Iterate
```

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Platform demo (5173) |
| `pnpm dev:reference` | Reference thin app (5174) |
| `pnpm create:app <slug>` | Scaffold new app |
| `pnpm validate:reference` | Validate reference app |
| `pnpm build` | Build all packages |
| `pnpm typecheck` | TypeScript check |

## Create applications

```bash
pnpm plantasonic create audio-reactive signal-9-live --concept signal-9
pnpm plantasonic create audio-reactive my-instrument --name "My Instrument"
pnpm --filter @plantasonic/signal-9-live dev
```

Application **blueprints** (`signal-9`) define full startup experiences. **Concept templates** (`plantasonic`, `flowers`) provide identity-only overlays.

See [docs/GENERATOR_GUIDE.md](./docs/GENERATOR_GUIDE.md) and skill `create-prototype`.

## Cursor skills

Agent workflows live in `skills/` (10 skills covering prototype creation, engine integration, plugins, persistence, migration, and release).

See [skills/README.md](./skills/README.md).

## Templates

Prototype templates in `templates/` — `instrument` is active; others are placeholders for future generator types.

See [templates/README.md](./templates/README.md).

## Documentation

| Document | Description |
|----------|-------------|
| [docs/REFERENCE_APP.md](./docs/REFERENCE_APP.md) | plantasonic-xyz v0.4.0 reference application |
| [docs/AI_WORKFLOW.md](./docs/AI_WORKFLOW.md) | AI first development workflow |
| [docs/TOOLCHAIN.md](./docs/TOOLCHAIN.md) | Official toolchain reference |
| [docs/PLATFORM_OVERVIEW.md](./docs/PLATFORM_OVERVIEW.md) | Ecosystem home |
| [HANDOFF.md](./HANDOFF.md) | Foundation Complete handoff |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Layer model |
| [docs/APPLICATION_GUIDE.md](./docs/APPLICATION_GUIDE.md) | Building thin apps |
| [docs/GENERATOR_GUIDE.md](./docs/GENERATOR_GUIDE.md) | Scaffolding |
| [docs/SDK_GUIDE.md](./docs/SDK_GUIDE.md) | Platform API |
| [docs/MIGRATION_GUIDE.md](./docs/MIGRATION_GUIDE.md) | App cutover |
| [docs/VALIDATION_CHECKLIST.md](./docs/VALIDATION_CHECKLIST.md) | Release checks |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Detailed architecture |
| [ROADMAP.md](./ROADMAP.md) | Milestones |

## Future roadmap

- Signal 9 product application development
- Additional application blueprints
- Additional prototype templates (installation, generative-art, etc.)
- `@plantasonic/app-kit` — stable mount API package
- Platform v1.0 publish

See [ROADMAP.md](./ROADMAP.md).

## License

Private — not published.
