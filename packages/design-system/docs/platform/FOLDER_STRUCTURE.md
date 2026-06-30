# Folder Structure

```
plantasonic-design-system/
├── tokens/                 W3C Design Tokens JSON (foundation + themes)
├── css/                    Generated CSS custom properties
├── scss/                   Bootstrap theme + css-theme-bridge
├── generated/              Generated TypeScript types
├── scripts/                Build, validate, generate, release
├── cli/                    `plantasonic` CLI
├── templates/              Starter apps (react-vite, nextjs, …)
├── showcase/               Design system showcase (Vite)
├── docs/                   Human + generated documentation
│   ├── platform/           Developer platform guides
│   └── generated/          Auto-generated token/component docs
├── tests/                  Automated validation tests
└── prompts/                AI assistant prompts
```

## Key files

| Path | Purpose |
| --- | --- |
| `tokens/foundation.tokens.json` | Primitives shared by all themes |
| `tokens/theme.dark.tokens.json` | Dark semantic tokens |
| `tokens/theme.light.tokens.json` | Light semantic overrides |
| `scripts/lib/tokens.mjs` | Token resolution and CSS generation |
| `scss/css-theme-bridge.scss` | Bootstrap runtime theming |
| `cli/index.mjs` | `npx plantasonic create` entry |
