# Contributing

Thank you for contributing to the Plantasonic Design System.

## Scope

This repository contains design tokens, CSS variables, Bootstrap theme overrides, and documentation only. Do not add application logic, engine code, or product-specific runtime code here.

All contributions must align with [docs/VISION_AND_SCOPE.md](./docs/VISION_AND_SCOPE.md) and pass its [decision filter](./docs/VISION_AND_SCOPE.md#decision-filter).

## Version 1.0 stabilization

Before opening a PR:

```bash
npm run quality && npm run test && npm run build
npm run validate:prototypes && npm run validate:examples
npm run audit:platform
```

## Public API policy (v1.0+)

- Only consume exports listed in [API Reference](./docs/platform/API_REFERENCE.md) and `generated/api-surface.json`
- Do not import `src/*/internal/*` modules
- Export changes require API review per [Governance](./docs/platform/GOVERNANCE.md)

## Workflow

1. Edit token JSON in `tokens/` — never edit `css/variables.css` directly
2. Run `npm run build` to validate and regenerate CSS + generated artifacts
3. Run `npm run quality && npm run test` before opening a PR
4. Update `CHANGELOG.md` under `[Unreleased]`
5. Open a pull request with a clear summary of token or documentation changes

## Developer platform

- **CLI** — `cli/`; test with `node cli/index.mjs create my-app --no-install`
- **Templates** — `templates/`; each must import the design system package, not duplicate tokens
- **Generation** — run `npm run generate` after changing `CSS_VAR_NAME` or token mappings in `scripts/lib/tokens.mjs`
- **Docs** — platform guides live in `docs/platform/`; generated output in `docs/generated/`

## Token changes

- **Foundation** (`foundation.tokens.json`) — theme-agnostic primitives only
- **Themes** (`theme.dark.tokens.json`, `theme.light.tokens.json`) — semantic overrides only
- Use `{token.path}` aliases instead of duplicating hex values
- All aliases must resolve — `npm run tokens:validate` must pass

## AI metadata (registry)

The Design System is AI-native: every exported element registers structured metadata so the registry and SDK stay authoritative. When you add or change a public element:

- **Components / primitives** — add or update a record in `src/ai/components.ts` (`defineComponent`)
- **Layouts** — `src/ai/layouts.ts` (`defineLayout`)
- **Patterns** — `src/ai/patterns.ts` (`definePattern`)
- **Tokens / themes** — do **not** hand-edit; they are generated from `tokens/*.tokens.json` by `npm run generate:ai-tokens`
- Run `npm run ai:context` (or `npm run build`) to regenerate `generated/ai/*.json` and `docs/generated/ai/*.md`
- Keep `version`, `status`, `migration`, and `breakingChanges` accurate — they drive migration guides and compliance
- Never edit generated files (`src/ai/tokens.generated.ts`, `generated/ai/`, `docs/generated/`) by hand

See the [Metadata Specification](./docs/platform/METADATA_SPECIFICATION.md) and [AI Architecture Guide](./docs/platform/AI_ARCHITECTURE.md).

## Documentation

Update relevant docs in `docs/` when changing token architecture, brand rules, or Bootstrap mapping. New tokens and components should document purpose, usage, examples, accessibility, and do/don't guidance per [VISION_AND_SCOPE.md](./docs/VISION_AND_SCOPE.md#documentation). Catalog documentation (components, layouts, patterns, tokens) is generated from the registry — do not duplicate it by hand.

## Commits

Use clear, imperative commit messages. Group token JSON and regenerated CSS in the same commit.

## Questions

Open a GitHub issue for architectural questions before large changes.
