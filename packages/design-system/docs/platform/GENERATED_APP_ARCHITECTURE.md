# Generated App Architecture Guide

Structure of a prototype scaffolded by the Prototype Platform.

```text
my-prototype/
├── package.json              DS dependency, dev/build/validate scripts
├── vite.config.ts            @ds alias + DS module resolutions
├── tsconfig.json
├── index.html                data-theme, lang, color-scheme
├── vercel.json               Static deploy config
├── README.md                 Stack, commands, structure
├── ROADMAP.md                Type-specific + brief roadmap
├── CHANGELOG.md
├── scripts/
│   └── validate.mjs          Structure + AI compliance
├── docs/
│   ├── VALIDATION_CHECKLIST.md
│   └── SPEC.md               (when generated from brief)
└── src/
    ├── main.ts               Instrument or standard shell bootstrap
    ├── prototype-config.ts   Type, layout, features, registry refs
    ├── styles/
    │   └── main.scss         Tokens, bootstrap, components, motion, shell
    ├── engines/              Domain placeholders (your code)
    │   ├── visual.ts
    │   ├── audio.ts
    │   └── …
    └── panels/               Inspector panels (DS components)
        └── parameters.ts
```

## Instrument prototypes

Use `createApplication()` from `plantasonic-design-system/app`:

- Canvas workspace via `renderCanvasMount` + `canvas2dAdapter`
- Optional transport, status metrics, inspector panels
- `@ds/scss/instrument` stylesheet layer

Implement creative logic in `src/engines/` — not in shell markup.

## Standard-shell prototypes

Use `renderApplicationShell()` + `bindApplicationShell()`:

- Dashboard, portfolio, research, AI assistant layouts
- `@ds/scss/navigation-framework` + `application-shell`

## Boundaries

| Layer | Owner |
| --- | --- |
| Tokens, theme, motion, a11y defaults | Design System (generated) |
| Shell, layout, panels chrome | Design System (generated) |
| Engines, business logic | Your prototype (`src/engines/`) |
| Assets, presets, domain models | Your prototype |

Do not copy token definitions or shell layout code into prototypes. Import from the package.

## Validation pipeline

1. **Structure** — required files, DS dependency, token imports, motion, reduced motion
2. **Compliance** — `validateApplication()` from `plantasonic-design-system/ai`
3. **Build** — `npm run build` (run locally / CI)

Generated `scripts/validate.mjs` runs steps 1–2.
