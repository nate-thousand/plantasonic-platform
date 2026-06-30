---
name: application-migration
description: Migrates legacy Plantasonic apps to thin platform consumers. Use when cutting over production apps, removing local runtime, or converting preset worlds to PresetBundle.
---

# Skill: Application Migration

## Purpose

Convert a self-contained Plantasonic application into a thin `@plantasonic/platform` consumer.

## Inputs

- Target application repository (e.g. `plantasonic-xyz`)
- Existing preset worlds / creative content
- Legacy infrastructure inventory (runtime, ui, adapters, interaction)

## Outputs

- `platform-consumer/` or equivalent thin content layer
- `main.ts` bootstrapping via `mountInstrumentApp()`
- Preset worlds converted to `PresetBundle[]`
- Legacy infrastructure removed
- Updated docs and verify scripts

## Required packages

- `@plantasonic/platform`
- `@plantasonic/platform-types`
- `@plantasonic/platform-demo`
- Existing engines and Design System (unchanged)

## Validation checklist

- [ ] `createPlantasonicPlatformApp()` or `mountInstrumentApp()` is boot path
- [ ] No `src/runtime/`, `src/ui/`, `src/interaction/`, `src/audio/`, `src/platform/`
- [ ] Preset worlds preserved in `src/presets/worlds/`
- [ ] `worldToBundle.ts` or equivalent converts to platform bundles
- [ ] Verify scripts test platform shell (not legacy DOM)
- [ ] CI checks out platform sibling repo

## Success criteria

- App installs and runs
- UI from Design System through platform
- Sound/visual via platform adapters
- Presets, MIDI/keyboard, project save/load work
- App source is thin (<600 lines creative layer target)

## Common mistakes

- Leaving legacy code on disk while switching boot path only
- Copying demo integration modules instead of using mount API
- Losing preset world metadata during bundle conversion
- Not updating verify scripts (CI still tests legacy app)

## Example usage

Follow phased checklist in `docs/MIGRATION_GUIDE.md`:

1. Add platform dependencies
2. Create `platform-consumer/` content layer
3. Switch `main.ts` bootstrap
4. Convert worlds → `PresetBundle[]`
5. Remove legacy infrastructure
6. Update verify scripts and CI
7. Update README, ARCHITECTURE, CHANGELOG

See also: `docs/PLANTASONIC_APP_MIGRATION.md`, `apps/plantasonic-reference/`, `../plantasonic-xyz/src/platform-consumer/`.
