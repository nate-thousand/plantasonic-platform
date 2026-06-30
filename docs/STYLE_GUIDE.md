# Style Guide

Coding and documentation conventions for plantasonic-platform.

## TypeScript

- Strict mode enabled
- No `any` in exported public APIs
- Prefer explicit return types on exported functions
- Use `@plantasonic/platform-types` for shared interfaces

## Monorepo

- pnpm workspaces (`packages/*` plus internal validation workspaces)
- Internal deps: `workspace:*`
- Build order: types → sdk → reusable packages → internal demos/scaffolds

## Naming

- Packages: `@plantasonic/<name>`
- Events: `domain:action` (e.g. `sound:preset-change`, `project:save`)
- Preset bundle ids: kebab-case

## Documentation

- One concern per doc file
- Cross-reference related docs
- Keep README concise; detail in `docs/`

## Applications

- Independent repositories — creative layer only
- DS imports via package paths, never copied locally
- `mountInstrumentApp()` for bootstrap
- Platform repo `apps/` entries are internal demos/scaffolds only, not product app ownership

## Cross references

- [.cursor/rules/plantasonic-platform.md](../.cursor/rules/plantasonic-platform.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
