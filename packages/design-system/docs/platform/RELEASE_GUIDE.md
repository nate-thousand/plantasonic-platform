# Release Guide

Version 1.0 release management for the Plantasonic Design System.

## Semantic versioning

| Bump | When |
| --- | --- |
| **Major** | Breaking public API, token rename, removed export |
| **Minor** | Additive export, new component, new prototype type |
| **Patch** | Bug fix, doc fix, generated artifact refresh |

Public API is defined in `generated/api-surface.json`.

## Release candidate (1.0.0-rc.1)

Current status: **Version 1.0 Ready** (release candidate).

Before `1.0.0` final:

1. `npm run build && npm run quality && npm run test`
2. `npm run validate:prototypes && npm run validate:examples`
3. `npm run validate:templates`
4. `node scripts/platform-audit.mjs`
5. Review `docs/generated/PLATFORM_AUDIT.json` — zero errors
6. Move `[Unreleased]` → `## [1.0.0] — date` in CHANGELOG.md

## Release automation

```bash
npm run release -- patch   # bump semver + docs/generated/RELEASE_NOTES.md
```

Manual steps after `release`:

1. Date the CHANGELOG section
2. Commit: `chore(release): v1.0.0`
3. Tag: `git tag v1.0.0`
4. Publish to npm/GitHub

## Changelog

Follow [Keep a Changelog](https://keepachangelog.com/). Group: Added, Changed, Deprecated, Removed, Fixed, Security.

## Migration documentation

Breaking changes require:

1. Entry in CHANGELOG `[Unreleased]`
2. Section in [MIGRATION.md](./MIGRATION.md)
3. `breakingChanges` in AI metadata for affected elements
4. Deprecation notice in `generated/api-surface.json` → `deprecated`

## Upgrade validation

Consuming apps should run:

```bash
npm run verify:design-system   # Plantasonic monorepo
npm run validate               # generated platform projects
```

## Breaking change detection

Before release:

- Diff `generated/api-surface.json` against previous tag
- Run full test suite (142+ tests)
- Run `validate:prototypes` (12 types) + `validate:examples` (7 references)

See [GOVERNANCE.md](./GOVERNANCE.md) for support policy.
