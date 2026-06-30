---
name: release-candidate
description: Validates platform and consumer apps before release. Use when preparing release, cutover, or asking if the platform is ready to ship.
---

# Skill: Release Candidate

## Purpose

Run pre-release validation across platform monorepo and dependent consumer apps.

## Inputs

- Target version number
- Release scope (platform only, platform + consumer app)
- Changelog entries

## Outputs

- Validation report (pass/fail per checklist item)
- Updated CHANGELOG and version bumps (when requested)
- Release readiness summary

## Required packages

- All workspace packages built
- Sibling repos available for consumer validation (optional)

## Validation checklist

### Platform

- [ ] `pnpm install && pnpm build && pnpm typecheck`
- [ ] `pnpm validate:reference`
- [ ] Demo boots at http://localhost:5173
- [ ] Reference app boots at http://localhost:5174
- [ ] `docs/VALIDATION_CHECKLIST.md` complete

### Consumer app (if in scope)

- [ ] `validate:app` passes
- [ ] Integration verify passes
- [ ] No legacy runtime directories
- [ ] README/ARCHITECTURE/CHANGELOG updated

## Success criteria

- All build and typecheck green
- Reference validation passes
- Documentation matches current architecture
- No duplicated engine/DS code in apps
- Version and CHANGELOG aligned

## Common mistakes

- Releasing with broken `file:` sibling links undocumented
- Skipping reference app validation
- Forgetting to update migration docs after cutover
- Publishing without running integration verify

## Example usage

```bash
cd plantasonic-platform
pnpm build && pnpm typecheck && pnpm validate:reference

cd ../plantasonic-xyz
npm run validate:app && npm run verify:integration && npm run build
```

See also: `docs/VALIDATION_CHECKLIST.md`, `docs/VALIDATION_GUIDE.md`.
