# Validation Checklist

Pre-release and pre-merge validation for plantasonic-platform.

## Architecture

- [ ] Platform SDK does not import Design System source
- [ ] Engine packages not duplicated in platform or apps
- [ ] Generated apps are thin (no local runtime/adapters/MIDI)
- [ ] Dependency rules match [ARCHITECTURE.md](./ARCHITECTURE.md)

## Dependencies

- [ ] `@plantasonic/platform-types` has zero runtime deps
- [ ] `@plantasonic/platform` depends only on types (+ engines in adapters)
- [ ] Apps use `workspace:*` or documented `file:` links
- [ ] No circular dependencies between packages

## Design System usage

- [ ] Apps import `css/variables.css` from DS package
- [ ] No local token files or Bootstrap theme copies
- [ ] Instrument shell via `renderApplicationShell({ variant: 'instrument' })`
- [ ] Creative Workspace instrument preset (`renderCreativeWorkspace`, `bindCreativeWorkspace`)
- [ ] Regions bound to Creative Workspace landmarks (`[data-ps-cw-surface]` + stage `[data-ps-region="stage"]`)

## Engine usage

- [ ] Sound via `createSoundEngineAdapter()` only
- [ ] Visual via `createVisualEngineAdapter()` only
- [ ] No direct engine imports in app UI code
- [ ] Preset bundles coordinate sound + visual state

## Documentation

- [ ] README reflects current workflow
- [ ] CHANGELOG updated for release
- [ ] SDK changes reflected in SDK_GUIDE / PUBLIC_API
- [ ] Migration docs current if app cutover involved

## Build

- [ ] `pnpm install` succeeds
- [ ] `pnpm build` passes all packages
- [ ] `pnpm typecheck` passes
- [ ] Demo builds (`apps/demo`)

## TypeScript

- [ ] Strict mode enabled
- [ ] No new `any` in exported APIs
- [ ] Types exported from `@plantasonic/platform-types`

## Workspace

- [ ] pnpm workspace includes all packages and apps
- [ ] Shared tsconfig base used consistently
- [ ] Vite configs resolve platform aliases

## Examples

- [ ] `examples/` README describes each pattern
- [ ] Runnable references: demo + plantasonic-reference

## Templates

- [ ] `templates/instrument/` documents generator source
- [ ] Placeholder templates have README + ROADMAP
- [ ] Generator produces valid app structure

## Skills & rules

- [ ] `.cursor/rules/plantasonic-platform.md` present
- [ ] All 10 skills in `skills/` directory
- [ ] Skills synced to `.cursor/skills/`

## Scripts (placeholders)

- [ ] `scripts/create-app.ts` interface defined
- [ ] `scripts/validate.ts` interface defined
- [ ] `scripts/generate-docs.ts` interface defined
- [ ] `scripts/release.ts` interface defined
- [ ] `scripts/audit.ts` interface defined

## Release-specific

- [ ] `pnpm validate:reference` passes
- [ ] Demo boots and transport works
- [ ] Reference app validates
- [ ] Consumer app verify passes (if in scope)

See also: [VALIDATION_GUIDE.md](./VALIDATION_GUIDE.md), skill `release-candidate`.
