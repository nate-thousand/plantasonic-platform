# Developer Platform

Milestone 4 transforms the design system into a **developer platform**.

## Quick start

```bash
# Create a new app
npx plantasonic create my-app

# From the design system repo
npm run build          # tokens + validate
npm run generate       # types, scss, docs
npm run docs           # documentation index
npm run quality        # full validation gate
npm run test           # automated tests
npm run showcase:dev   # visual reference
```

## What's included

| Capability | Location |
| --- | --- |
| CLI | `cli/` — `npx plantasonic create` |
| Starters | `templates/react-vite`, `react-bootstrap`, `nextjs`, `electron` — all use `plantasonic-design-system/shell` |
| Code generation | `scripts/generate-*.mjs` |
| Quality gates | `scripts/quality-check.mjs`, `tests/` |
| Documentation | `docs/platform/` + `docs/generated/` |

## Guides

- [Architecture](./ARCHITECTURE.md)
- [Folder Structure](./FOLDER_STRUCTURE.md)
- [Theme System](./THEME_SYSTEM.md)
- [Bootstrap Integration](./BOOTSTRAP.md)
- [Navigation & Workspace Framework](./NAVIGATION_FRAMEWORK.md)
- [Application Shell Framework](./APPLICATION_SHELL.md)
- [Component Usage](./COMPONENTS.md)
- [Token Usage](./TOKENS.md)
- [Accessibility](./ACCESSIBILITY.md)
- [Versioning](./VERSIONING.md)
- [Migration](./MIGRATION.md)
- [Examples](./EXAMPLES.md)
- [FAQ](./FAQ.md)
