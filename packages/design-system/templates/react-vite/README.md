# __APP_NAME__

Vite + React starter with the Plantasonic Design System **Application Shell**.

## Includes

- Design tokens and CSS variables (`@ds/css/variables.css`)
- Bootstrap 5 theme (compile + runtime layers)
- Plantasonic components, navigation, and application shell styles
- **Application Shell** — `renderApplicationShell()` + `bindApplicationShell()` from `plantasonic-design-system/shell`
- Shell config: navigation, routes, commands, docks, panels, theme, `persistState`
- Command palette (⌘K) and theme toggle (⌘⇧T)

## Commands

```bash
npm install
npm run dev
npm run build
```

## Customize

Edit `src/shell-config.ts` — navigation, routes, commands, docks, and panels. Put page content in `src/pages/`; `ShellHost` mounts it in the workspace slot.

## Design system

- Package API: `plantasonic-design-system/shell`
- Docs: [Application Shell](https://github.com/nate-thousand/plantasonic-design-system/blob/main/docs/platform/APPLICATION_SHELL.md)
- Showcase: `npm run showcase:dev` in the design system repo
