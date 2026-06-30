---
description: Plantasonic Platform — orchestration layer rules, boundaries, and development workflow
alwaysApply: true
---

# Plantasonic Platform Rules

This repository is the orchestration layer for the Plantasonic ecosystem.

## Platform responsibilities

- application SDK (`@plantasonic/platform`)
- prototype generator (`@plantasonic/create-app`)
- shared events (event bus contracts)
- shared types (`@plantasonic/platform-types`)
- engine adapters (sound, visual)
- plugins (registration, capabilities, contributions)
- preset bundles (unified sound + visual + bridge + workspace + UI state)
- workspace persistence (project save/load/export/import)
- documentation, templates, skills, validation framework

## Repository boundaries

| Repository | Owns |
|------------|------|
| **plantasonic-platform** (this repo) | SDK, generator, adapters, orchestration, docs |
| **plantasonic-design-system** | UI, components, tokens, layout, motion, accessibility |
| **plantasia-sound-engine** | Audio synthesis, presets, MIDI at engine level |
| **ascii-visual-engine** | ASCII rendering, visual presets |
| **Application repos** | Concept, copy, assets, preset bundles, mappings, config |

Do not modify external repositories unless explicitly requested.

## Do not

- duplicate Design System code
- duplicate Sound Engine code
- duplicate Visual Engine code
- define local design tokens in apps or platform SDK
- create local shell infrastructure inside generated apps
- make engines depend on UI
- make UI depend on engine internals
- copy demo `*Integration.ts` modules into application repos
- implement platform features inside application repos

## Every generated app must be thin

Apps own: concept, copy, assets, presets, mappings, config.

Platform owns: lifecycle, event bus, engine adapters, preset registry, performance controls, project state, generator.

## Architecture principles

1. Applications compose platform + Design System + engines — they do not reimplement orchestration.
2. Adapters are the only bridge between platform and engines.
3. `@plantasonic/platform-types` has zero runtime dependencies.
4. `@plantasonic/platform` depends only on types (+ engine npm packages inside adapters).
5. UI flows: User → Design System → platform eventBus → adapters → engines.
6. Use `mountInstrumentApp()` from `@plantasonic/platform-demo/instrument-app` for full wiring.

## Dependency rules

- Apps depend on: `@plantasonic/platform`, `@plantasonic/platform-types`, `@plantasonic/platform-demo`, `plantasonic-design-system`, engine npm packages.
- Platform SDK must not import Design System source.
- Engine packages must not import platform or each other.

## Coding standards

- pnpm monorepo, TypeScript strict, Vite for apps
- Minimize scope — platform owns orchestration only
- No `any` in exported APIs
- Barrel exports via `index.ts` where applicable
- Done means: `pnpm build` and `pnpm typecheck` pass

## Documentation requirements

- New packages: README + cross-reference in `docs/`
- New apps: README + ROADMAP
- API changes: update `docs/SDK_GUIDE.md` and `CHANGELOG.md`
- Migration changes: update `docs/MIGRATION_GUIDE.md`

## Migration rules

- Production apps migrate to thin consumers via `mountInstrumentApp()`
- Legacy runtime, local adapters, local MIDI routing must be removed from apps
- Preset worlds convert to platform `PresetBundle[]`
- See `docs/MIGRATION_GUIDE.md` and `docs/PLANTASONIC_APP_MIGRATION.md`

## Validation requirements

- Run `docs/VALIDATION_CHECKLIST.md` before release
- Generated apps must pass `validate-app.mjs`
- Reference app must pass `pnpm validate:reference`

## Generator rules

- Command pattern: `pnpm create:app <slug>` (future: `pnpm plantasonic create <type> <name>`)
- Templates live in `templates/` and `packages/create-plantasonic-app/templates/`
- Generated apps must not include local tokens, shell, MIDI plumbing, or engine internals
- See `docs/GENERATOR_GUIDE.md` and skill `create-prototype`

## Key docs

- `docs/PLATFORM_OVERVIEW.md` — ecosystem home
- `docs/ARCHITECTURE.md` — layer model
- `skills/` and `.cursor/skills/` — agent workflows
