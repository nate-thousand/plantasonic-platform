# Plantasonic v2

Clean **platform-based replacement scaffold** for the production Plantasonic app.

Generated with:

```bash
pnpm plantasonic create audio-reactive plantasonic-v2 --name "Plantasonic"
```

## Run

```bash
pnpm install
pnpm --filter @plantasonic/plantasonic-v2 dev
```

Opens at http://localhost:5177.

## Architecture

```
main.ts → mountInstrumentApp(plantasonicV2AppContent)
              ↓
    @plantasonic/platform-demo (orchestration wiring)
              ↓
    @plantasonic/platform (SDK: adapters, bridge, registry, plugins, persistence)
              ↓
    plantasonic-design-system (shell + Creative Workspace + instrument UI)
```

## What this app owns

- App name, branding copy, and workspace config
- Preset bundles (Seed, Root, Bloom, Mycelium, Mutation)
- Per-bundle audio→visual reactive mappings
- Plugin manifests for seed preset and adapter metadata

## What this app does not own

- Shell, tokens, or Bootstrap theme (Design System)
- Sound/visual engine internals (platform adapters)
- MIDI routing, preset registry, bridge loop, project persistence (platform SDK)

## Validation

```bash
pnpm --filter @plantasonic/plantasonic-v2 validate
pnpm --filter @plantasonic/plantasonic-v2 build
```

## Status

This scaffold lives in `plantasonic-platform` only. It does **not** overwrite the existing `plantasonic-xyz` repository.

See [docs/PLANTASONIC_APP_MIGRATION.md](../../docs/PLANTASONIC_APP_MIGRATION.md) for the production cutover path.
