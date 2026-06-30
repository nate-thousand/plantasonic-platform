# Generator Guide

How to scaffold new platform consumer applications.

## Unified CLI

```bash
pnpm plantasonic create <prototype-type> <app-slug> [options]
```

Examples:

```bash
pnpm plantasonic create instrument flora-lab
pnpm plantasonic create audio-reactive pulse-field --name "Pulse Field"
pnpm plantasonic create audio-reactive reactive-lab --port 5180 --force
```

Options:

| Flag | Description |
|------|-------------|
| `--name` | Display name (default: title-cased slug) |
| `--port` | Dev server port (default: per prototype type) |
| `--output` | Output directory (default: `apps/<slug>` in monorepo) |
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
