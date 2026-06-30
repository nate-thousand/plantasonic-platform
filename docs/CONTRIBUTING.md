# Contributing

Guidelines for contributing to plantasonic-platform.

## Scope

This repository owns orchestration — not UI, audio synthesis, or rendering.

## Before contributing

1. Read [PLATFORM_OVERVIEW.md](./PLATFORM_OVERVIEW.md)
2. Read [.cursor/rules/plantasonic-platform.md](../.cursor/rules/plantasonic-platform.md)
3. Check [ROADMAP.md](../ROADMAP.md) for active milestones

## Development setup

```bash
pnpm install
pnpm build
pnpm typecheck
pnpm dev
```

## Pull request checklist

- [ ] `pnpm build` passes
- [ ] `pnpm typecheck` passes
- [ ] No duplicated DS/engine code
- [ ] Docs updated for API changes
- [ ] CHANGELOG updated

## Where to put changes

| Change type | Location |
|-------------|----------|
| SDK orchestration | `packages/sdk/` |
| Shared types | `packages/shared-types/` |
| Generator | `packages/create-plantasonic-app/` |
| Demo integration | `apps/demo/` |
| Documentation | `docs/` |
| Agent skills | `skills/` + `.cursor/skills/` |

## Do not

- Modify external repositories in platform PRs
- Add application-specific creative content to SDK
- Copy Design System or engine source

## Cross references

- [STYLE_GUIDE.md](./STYLE_GUIDE.md)
- [VALIDATION_CHECKLIST.md](./VALIDATION_CHECKLIST.md)
