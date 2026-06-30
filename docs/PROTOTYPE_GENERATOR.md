# Prototype Generator

CLI for scaffolding thin Plantasonic platform consumer applications.

## Quick start

From the platform monorepo root:

```bash
pnpm plantasonic create instrument my-instrument
pnpm plantasonic create audio-reactive pulse-field --name "Pulse Field"
pnpm install
pnpm --filter @plantasonic/my-instrument dev
```

Legacy (defaults to `instrument`):

```bash
pnpm create:app my-instrument
pnpm create:app pulse-field --type audio-reactive
```

Or run the CLI directly:

```bash
node packages/create-plantasonic-app/bin/plantasonic.mjs create audio-reactive pulse-field
node packages/create-plantasonic-app/bin/create-plantasonic-app.mjs my-instrument --name "My Instrument"
```

## What gets generated

```
apps/my-instrument/
  src/
    main.ts              # mountInstrumentApp(container, appContent)
    appContent.ts        # injects app-owned configuration
    config/              # ApplicationConfig, shell, workspace
    content/             # preset bundles, plugins, branding
    styles/              # Design System imports only
  scripts/validate-app.mjs
  package.json
  vite.config.ts
  tsconfig.json
  index.html
  README.md
```

Generated apps include the full platform stack pre-wired:

- Design System instrument shell
- Sound + visual engine adapters
- Audio reactive bridge
- Preset bundle registry
- Performance controls
- Plugin manager
- Project persistence

App code is limited to **creative configuration** — names, presets, branding, plugins.

## CLI options

### `pnpm plantasonic create <type> <slug>`

| Option | Description |
|--------|-------------|
| `<prototype-type>` | Required. `instrument` or `audio-reactive` |
| `<app-slug>` | Required. Lowercase kebab-case id (e.g. `flora-lab`) |
| `--name` | Display name (default: title-cased slug) |
| `--port` | Vite dev server port (default: per type — 5175 instrument, 5176 audio-reactive) |
| `--output` | Output directory (default: `apps/<slug>` in monorepo) |
| `--force` | Overwrite existing directory |

### `pnpm create:app <slug>` (legacy)

Same options plus `--type <string>` (default: `instrument`).

## Monorepo detection

When run inside `plantasonic-platform` (detects `pnpm-workspace.yaml` + `packages/sdk`):

- Output defaults to `apps/<slug>/`
- Package name: `@plantasonic/<slug>`
- Dependencies use `workspace:*`

When run outside the monorepo, output defaults to `./<slug>/` with the same dependency paths documented in the reference app.

## Validation

Each generated app includes:

```bash
pnpm validate   # checks mountInstrumentApp, deps, no duplicated tokens
pnpm typecheck
pnpm build
```

Platform-level generator validation:

```bash
pnpm --filter @plantasonic/create-app typecheck
```

## Templates

### instrument

Mirrors `apps/plantasonic-reference/`:

- Single starter preset bundle (via plugin)
- Empty `PRESET_BUNDLES` array ready for creative content
- Default port: 5175

### audio-reactive

Bridge-focused with three preset bundles:

- **Pulse** — bass→density, transient→glitch
- **Drift** — mids→motion, amplitude→scale
- **Glitch** — high sensitivity experimental mapping
- Default port: 5176

## Architecture

```
plantasonic / create-plantasonic-app
        │
        ▼
  lib/create-app.mjs
        │
        ▼
  templates/<type>/       (Handlebars-style {{PLACEHOLDERS}})
        │
        ▼
  apps/<slug>/            (thin consumer)
        │
        ▼
  mountInstrumentApp()    (@plantasonic/platform-demo/instrument-app)
        │
        ▼
  @plantasonic/platform   (orchestration)
```

## Known limitations

- Only `instrument` and `audio-reactive` templates implemented
- Monorepo workspace deps assumed for generated apps inside platform repo
- Standalone generation outside monorepo requires manual path fixes for DS/engines
- Generated apps depend on `@plantasonic/platform-demo` for wiring (future `@plantasonic/app-kit`)
- No interactive prompts yet — use flags for name and port

## Related docs

- [GENERATOR_GUIDE.md](./GENERATOR_GUIDE.md) — template catalog and cross-refs
- [PLANTASONIC_APP_MIGRATION.md](./PLANTASONIC_APP_MIGRATION.md) — production migration path
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) — adapter patterns
- [apps/plantasonic-reference/](../apps/plantasonic-reference/) — hand-authored reference
