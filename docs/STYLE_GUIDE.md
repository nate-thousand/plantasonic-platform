# Style Guide

Coding and documentation conventions for plantasonic-platform.

## TypeScript

- Strict mode enabled
- No `any` in exported public APIs
- Prefer explicit return types on exported functions
- Use `@plantasonic/platform-types` for shared interfaces

## Monorepo

- pnpm workspaces (`packages/*`, `apps/*`)
- Internal deps: `workspace:*`
- Build order: types → sdk → apps

## Naming

- Packages: `@plantasonic/<name>`
- Events: `domain:action` (e.g. `sound:preset-change`, `project:save`)
- Preset bundle ids: kebab-case

## Documentation

- One concern per doc file
- Cross-reference related docs
- Keep README concise; detail in `docs/`

## Apps (generated or reference)

- Thin — creative layer only
- DS imports via package paths, never copied locally
- `mountInstrumentApp()` for bootstrap

## Cross references

- [.cursor/rules/plantasonic-platform.md](../.cursor/rules/plantasonic-platform.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
