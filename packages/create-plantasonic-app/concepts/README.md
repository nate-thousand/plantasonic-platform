# Concept Templates

Lightweight app identity layer for the Prototype Generator.

- **Prototype type** — technical setup (instrument, audio-reactive, visual-synth)
- **Concept template** — branding, presets, copy, visual/sound direction (identity only)
- **Application blueprint** — full startup experience (see `../blueprints/`)

## Available concepts

| ID | Name | Tagline |
|----|------|---------|
| `plantasonic` | Plantasonic | Generative audio-visual flora |
| `flowers` | Flowers | Grow sound into light. |

## Application blueprints

For complete startup experiences (workspace, HUD, theme, scenes, assets), use a blueprint:

| ID | Name | Command |
|----|------|---------|
| `signal-9` | Signal 9 Live | `--concept signal-9` |

See [blueprints/README.md](../blueprints/README.md).

## Usage

```bash
pnpm plantasonic create audio-reactive signal-9-live --concept signal-9
pnpm plantasonic create audio-reactive flowers --concept flowers
pnpm plantasonic create audio-reactive plantasonic-v2 --concept plantasonic
```

Each concept provides overlay files under `concepts/<id>/overlay/` that replace neutral prototype content.
