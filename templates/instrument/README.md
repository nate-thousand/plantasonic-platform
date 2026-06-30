# Instrument Template

Thin audiovisual instrument — sound + visual + transport + preset browser.

## Status

**Reference implementation:** `packages/create-plantasonic-app/templates/instrument/`

This directory is the canonical template catalog entry. The generator copies from `packages/create-plantasonic-app/templates/instrument/` when scaffolding.

## Includes

- `mountInstrumentApp()` bootstrap
- Design System instrument shell
- Sound + visual adapters
- Audio-reactive bridge
- Preset bundles
- Performance controls
- Plugin manager
- Project persistence

## App-specific customization

- App name, branding, copy
- `PresetBundle[]` definitions
- Workspace config
- Optional plugins

## Generate

```bash
pnpm create:app my-instrument --name "My Instrument"
```

See `docs/GENERATOR_GUIDE.md` and skill `create-prototype`.
