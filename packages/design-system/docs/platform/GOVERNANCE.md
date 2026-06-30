# Governance

Long-term maintenance policies for Plantasonic Design System v1.0+.

## Release cadence

| Type | Frequency |
| --- | --- |
| Patch | As needed (fixes, token tweaks) |
| Minor | Monthly or when a platform milestone completes |
| Major | When public API breaks are required |

Release candidates (`1.0.0-rc.x`) precede major platform milestones.

## Support policy

| Version | Support |
| --- | --- |
| Latest major | Full support, security fixes |
| Previous major | 6 months security patches after next major |
| Older | Best-effort; upgrade recommended |

## API review process

1. Proposed change documented in PR
2. Classify: public / internal / experimental / deprecated
3. Update `scripts/api-surface.mjs` if export changes
4. Run `npm run generate:api-surface && node scripts/platform-audit.mjs`
5. Update API Reference + CHANGELOG
6. Two maintainers approve for public API changes

## Deprecation policy

1. Mark `deprecated` in metadata + `api-surface.json`
2. Document replacement in MIGRATION.md
3. Emit console warning in dev (when applicable)
4. Remove in next **major** version minimum 1 release later

## Contribution workflow

See [CONTRIBUTING.md](../../CONTRIBUTING.md). All PRs must pass:

```bash
npm run quality && npm run test && npm run build
```

## Quality standards

- Token validation: 100% alias resolution
- Public exports: documented in API Reference
- New components: metadata in `src/ai/components.ts` + showcase section
- Prototypes: `validate:prototypes` must pass
- Examples: `validate:examples` must pass

## Version support matrix

| Package version | Node | Bootstrap | Status |
| --- | --- | --- | --- |
| 1.0.x | 18+ (24 recommended) | 5.0.2 pinned | **Current** |
| 0.x | — | — | Unsupported |

## Scope boundary

Per [VISION_AND_SCOPE.md](../VISION_AND_SCOPE.md): design system and developer platform only — no product runtime, no engine source, no application business logic in this repo.

Future work transitions from **infrastructure development** to **application development and ecosystem expansion** in consuming repos.
