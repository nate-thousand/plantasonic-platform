---
name: create-prototype
description: Creates a new Plantasonic app inside plantasonic-platform from platform templates. Use when creating a prototype, new app, or running pnpm create:app.
---

# Skill: Create Plantasonic Prototype

## Purpose

Scaffold a thin platform consumer app inside `plantasonic-platform`.

## Inputs

- app name
- prototype type (`instrument`, `audio-reactive`, `generative-art`, etc.)
- core concept
- engines needed (sound, visual, both)
- special controls (optional)

## Outputs

- App directory at `apps/{{app-name}}/`
- README.md and ROADMAP.md
- Pre-wired platform consumer structure

## Required packages

- `@plantasonic/platform`
- `@plantasonic/platform-types`
- `@plantasonic/platform-demo`
- `plantasonic-design-system`
- `plantasia-sound-engine` (if sound enabled)
- `ascii-visual-engine` (if visual enabled)

## Steps

1. Create app from the closest platform template (`templates/{{prototype-type}}/`).
2. App must consume `@plantasonic/platform`.
3. App must consume `plantasonic-design-system` through the platform mount API.
4. App must not define local tokens, layouts, shell, MIDI plumbing, preset infrastructure, or engine internals.
5. App-specific code is limited to: name, concept, copy, assets, preset bundles, mappings, default workspace config.
6. Create README.md and ROADMAP.md.
7. Confirm the app runs.

## Command pattern

```bash
pnpm plantasonic create {{prototype-type}} {{app-name}}
pnpm plantasonic create instrument my-app
pnpm plantasonic create audio-reactive pulse-field --name "Pulse Field"

# Legacy (defaults to instrument):
pnpm create:app {{app-name}} [--type audio-reactive]
```

## Fallback

If the generator is not implemented, manually create the app using `templates/instrument/` or `packages/create-plantasonic-app/templates/instrument/`.

## Validation checklist

- [ ] `mountInstrumentApp()` in main.ts
- [ ] No local runtime, adapters, or MIDI modules
- [ ] DS CSS imported, no duplicated tokens
- [ ] `validate` script passes
- [ ] `pnpm build` passes

## Success criteria

- app installs
- app runs
- uses platform SDK
- uses design system
- sound works if enabled
- visuals work if enabled
- presets work
- documentation exists

## Common mistakes

- Copying demo `*Integration.ts` files into the app
- Building a custom shell instead of using DS instrument shell
- Implementing local preset registry or MIDI routing
- Duplicating Bootstrap theme or token CSS

## Example usage

```bash
pnpm create:app flora-lab --name "Flora Lab"
pnpm --filter @plantasonic/flora-lab dev
```

See also: `docs/GENERATOR_GUIDE.md`, `templates/instrument/`, `apps/plantasonic-reference/`.
