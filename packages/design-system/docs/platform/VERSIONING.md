# Versioning

Plantasonic Design System follows [Semantic Versioning 2.0.0](https://semver.org/).

## Release types

| Bump | When |
| --- | --- |
| **major** | Breaking token renames, removed exports, incompatible Bootstrap changes |
| **minor** | New tokens, new templates, new showcase sections, backward-compatible features |
| **patch** | Bug fixes, contrast tweaks, documentation, non-breaking bridge fixes |

## Release workflow

1. Move `[Unreleased]` items in `CHANGELOG.md` to a dated version section
2. Run `npm run release -- patch|minor|major`
3. Review `docs/generated/RELEASE_NOTES.md`
4. Commit, tag (`v1.2.0`), push

## Consumer pinning

```json
"plantasonic-design-system": "github:nate-thousand/plantasonic-design-system#v1.1.0"
```

Pin to tags for production apps. Use `main` only for active development against the latest tokens.
