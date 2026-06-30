# Application Blueprints

Data-driven **identity and startup experience** definitions for the Prototype Generator.

- **Prototype type** — technical setup (`instrument`, `audio-reactive`, `visual-synth`)
- **Application blueprint** — name, tagline, startup workspace, presets, scenes, HUD, theme, assets

Blueprints do not modify the Platform SDK, Design System, or engine internals. They generate app-owned configuration files only.

## Available blueprints

| ID | Name | Tagline |
|----|------|---------|
| `signal-9` | Signal 9 Live | Revolution is Broadcast. |

## Usage

```bash
pnpm plantasonic create audio-reactive signal-9-live --concept signal-9
```

The `--concept` flag accepts a blueprint id (legacy name: concept template). Blueprints live under `blueprints/<id>/`:

```
blueprints/signal-9/
  blueprint.json       # canonical data definition
  overlay/             # generated app file overrides
```

## Blueprint scope

Each blueprint defines:

1. **Identity** — name, tagline, description
2. **Startup workspace** — Instrument Creative Workspace layout intent
3. **Startup presets** — titled sessions with mood, accent, placeholder mappings
4. **Startup visual/sound scenes** — aesthetic direction via existing engine parameters
5. **HUD** — status field catalog
6. **Theme** — app-scoped semantic colors (not global Design System tokens)
7. **Assets** — placeholder hooks for logo, media packs, animations

## Adding a blueprint

1. Create `blueprints/<id>/blueprint.json` with the schema from `signal-9/blueprint.json`
2. Add overlay files under `blueprints/<id>/overlay/` mirroring the generated app structure
3. Register validation terms in `generator.forbiddenTerms` / `allowedTerms`
4. Document in this README

Concept templates (`concepts/`) remain for lighter identity-only overlays. Prefer blueprints for complete startup experiences.
