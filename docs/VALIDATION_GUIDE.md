# Validation Guide

How to validate platform and application changes.

## Quick commands

```bash
# Platform monorepo
pnpm build && pnpm typecheck && pnpm validate:reference

# Reference app
pnpm dev:reference

# Full checklist
# See VALIDATION_CHECKLIST.md
```

## Validation layers

1. **Build** — all packages compile
2. **Typecheck** — strict TypeScript
3. **Architecture** — thin-app constraints (`validate-app.mjs`)
4. **Integration** — demo/reference boot
5. **Documentation** — docs match current APIs

## Future tooling

Placeholder interfaces in `scripts/`:

- `validate.ts` — unified runner
- `audit.ts` — boundary and duplication checks

## Cross references

- [VALIDATION_CHECKLIST.md](./VALIDATION_CHECKLIST.md)
- Skill: `release-candidate`
