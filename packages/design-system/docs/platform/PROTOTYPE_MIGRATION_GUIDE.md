# Prototype Migration Guide

## Starter template → prototype

If you started with `plantasonic create my-app` (React starter) and need instrument/canvas features:

1. Scaffold a fresh prototype: `npx plantasonic create <type> <name>`
2. Move domain code into `src/engines/`
3. Port pages into inspector panels or workspace content
4. Delete duplicated shell/layout code — use `createApplication()` or Application Shell from the package

Do not merge starter layout files into prototypes; replace the shell bootstrap.

## Changing prototype type

Regenerate is preferred over manual migration:

```bash
npx plantasonic create generative-art my-project-v2 --dir ../experiments
# Copy src/engines/ and assets from the old project
```

Update `prototype-config.ts` only for feature flags — type and layout defaults come from the catalog.

## Design System version upgrade

1. Bump `plantasonic-design-system` in `package.json`
2. Run `npm install`
3. Run `npm run validate` — fix deprecated tokens/APIs reported by compliance
4. Check `CHANGELOG.md` in the Design System repo for breaking changes
5. Use `getImpact()` from `plantasonic-design-system/ai` for token/component changes

## Promoting prototype → product app

When a prototype graduates to a product repository:

- Keep the Design System as an npm dependency — never copy tokens
- Replace engine placeholders with real adapters (sound engine, visual engine)
- Expand validation in CI using `validateApplication()` on `src/`
- Update ROADMAP to product phases; keep CHANGELOG discipline

## Brief / spec changes

Re-run spec generation into a new directory or manually update:

- `docs/SPEC.md`
- `ROADMAP.md` first item
- `src/panels/` when new panels are inferred
- `src/engines/` when new features (sound, midi, touch) are enabled
