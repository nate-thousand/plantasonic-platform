# Generator Guide

How to scaffold new platform consumer applications.

Generated applications are thin consumers of the Plantasonic Platform. Product applications should be developed, versioned, and deployed as independent repositories.

## Unified CLI

```bash
pnpm plantasonic create <prototype-type> <app-slug> --concept <blueprint-or-concept-id> [options]
```

Examples:

```bash
pnpm plantasonic create audio-reactive signal-9-live --concept signal-9
pnpm plantasonic create audio-reactive flowers --concept flowers
pnpm plantasonic create audio-reactive plantasonic-v2 --concept plantasonic
```

**Prototype type** controls technical setup. **Application blueprint** or **concept template** controls app identity and startup experience.

### Application blueprints

Full startup experiences (identity, workspace, presets, scenes, HUD, theme, assets):

| Blueprint | Identity |
|-----------|----------|
| `signal-9` | Signal 9 Live — cyberpunk broadcast instrument |

See `packages/create-plantasonic-app/blueprints/`.

### Concept templates

Identity-only overlays (branding, presets, copy):

| Concept | Identity |
|---------|----------|
| `plantasonic` | Plantasonic flora presets and copy |
| `flowers` | Botanical audio-reactive instrument |

See `packages/create-plantasonic-app/concepts/`.

Options:

| Flag | Description |
|------|-------------|
| `--concept` | Blueprint or concept id (`signal-9`, `plantasonic`, `flowers`) |
| `--name` | Display name (default: concept name or title-cased slug) |
| `--port` | Dev server port (default: per prototype type) |
| `--output` | Output directory (monorepo defaults are for local scaffolding only; product apps should live in independent repositories) |
| `--force` | Overwrite existing directory |

Implementation: `packages/create-plantasonic-app/lib/create-app.mjs`

## Legacy CLI

```bash
pnpm create:app <slug> [--type instrument|audio-reactive] [--name "Display Name"] [--port 5175]
```

Defaults to `instrument` type. Prefer `pnpm plantasonic create` for new apps.

> Detailed reference: [PROTOTYPE_GENERATOR.md](./PROTOTYPE_GENERATOR.md)

## TypeScript interface

`scripts/create-app.ts` documents the generator options. Runtime implementation is in the create-app package.

## Template catalog

| Template | Path | Status |
|----------|------|--------|
| instrument | `packages/create-plantasonic-app/templates/instrument/` | **Active** |
| audio-reactive | `packages/create-plantasonic-app/templates/audio-reactive/` | **Active** |
| generative-art | `templates/generative-art/` | Placeholder |
| installation | `templates/installation/` | Placeholder |
| visual-synth | `templates/visual-synth/` | Placeholder |
| portfolio-demo | `templates/portfolio-demo/` | Placeholder |
| research | `templates/research/` | Placeholder |

### Default ports

| Type | Port |
|------|------|
| instrument | 5175 |
| audio-reactive | 5176 |

## Generated app validation

Each generated app includes `scripts/validate-app.mjs`:

```bash
pnpm --filter @plantasonic/<slug> validate
pnpm --filter @plantasonic/<slug> build
```

## Cross references

- Skill: `create-prototype`
- [APPLICATION_GUIDE.md](./APPLICATION_GUIDE.md)
- `.cursor/rules/plantasonic-platform.md` (Generator rules)
