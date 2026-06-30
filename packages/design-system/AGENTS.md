# AGENTS.md

Guidance for AI coding assistants working in this repository.

## Purpose

This repo is the **Plantasonic Design System** — tokens, Bootstrap theme, showcase, CLI, and starter templates. It is **not** a product application.

## Do

- Implement design system features, tokens, showcase sections, CLI, templates, docs, and build scripts here
- Run `npm run tokens:validate` and `npm run test` after token or theme changes
- Implement new UI in the **showcase** before suggesting product app changes
- Follow [Vision and Scope](./docs/VISION_AND_SCOPE.md) as the decision filter
- Use existing patterns: `scripts/lib/tokens.mjs`, `@ds` alias, `data-theme` switching

## Version

**1.0.0 — stable.** No new architectural layers in 1.x. Public API: `generated/api-surface.json`.

## Do not

- Modify Plantasonic product applications unless explicitly requested
- Add application features (audio, presets, MIDI, etc.)
- Duplicate tokens in templates — templates consume this package
- Edit `css/variables.css` manually — run `npm run tokens:build-css`
- Upgrade Bootstrap without updating bridge + showcase coverage

## Key commands

```bash
npm run build              # tokens build + validate
npm run generate           # types, scss, token/component docs
npm run docs               # documentation index
npm run quality            # validation gate
npm run test               # node:test suite
npm run validate:prototypes # all 12 prototype scaffolds
npm run generate:ecosystem-context # ecosystem AI context export
npm run validate:examples  # 7 reference example specs
npm run audit:platform     # API surface + platform audit
npm run showcase:dev       # visual reference at :5173
npm run tokens:import-figma # sync tokens from tokens/figma-source/
node cli/index.mjs create generative-art my-study --no-install
node cli/index.mjs spec "Generative art study" --name "Study"
```

## Architecture

```
tokens → scripts/lib/tokens.mjs → css/variables.css + scss/
                                 → showcase + templates + CLI
```

## File ownership

| Area | Path |
| --- | --- |
| Token source | `tokens/*.tokens.json` |
| Build logic | `scripts/` |
| CLI | `cli/` |
| Starters | `templates/` |
| Visual reference | `showcase/` |
| AI layer | `src/ai/`, `generated/ai/` |
| Prototype layer | `src/prototype/` |
| Platform layer | `src/platform/`, `generated/ecosystem/` |
| Creative Studio | `src/studio/`, `generated/studio/` |
| Platform docs | `docs/platform/` |

## Commit style

Concise imperative messages. Update `CHANGELOG.md` under `[Unreleased]` for user-visible changes.
