# Migration Guide

Migrating legacy Plantasonic applications to thin platform consumers.

> Detailed checklist: [PLANTASONIC_APP_MIGRATION.md](./PLANTASONIC_APP_MIGRATION.md)

## Overview

Legacy apps owned runtime, UI shell, adapters, MIDI routing, and persistence locally. Platform consumers inject creative content only.

## Phases

1. **Add dependencies** — `@plantasonic/platform`, types, demo mount API
2. **Create content layer** — config, bundles, branding, plugins
3. **Switch bootstrap** — `mountInstrumentApp()`
4. **Convert presets** — worlds → `PresetBundle[]`
5. **Remove legacy** — runtime, ui, interaction, local adapters
6. **Update verify/CI** — platform-focused tests
7. **Update docs** — README, ARCHITECTURE, CHANGELOG

## What to keep in the app

- Preset worlds / creative definitions
- Visual language taxonomy
- Branding, copy, assets
- Theme flash prevention (optional)

## What to remove

- `src/runtime/`, `src/ui/`, `src/interaction/`
- Local engine adapters
- Local MIDI/keyboard modules
- Duplicated tokens or shell

## Reference implementations

- `apps/plantasonic-reference/` — scaffold proof
- `../plantasonic-xyz/` — production cutover (v0.3.0)

## Cross references

- Skill: `application-migration`
- [APPLICATION_GUIDE.md](./APPLICATION_GUIDE.md)
