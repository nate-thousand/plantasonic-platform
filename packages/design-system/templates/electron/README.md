# __APP_NAME__

Electron + Vite desktop app with the Plantasonic **Application Shell**.

## Includes

- Electron main/preload in `electron/`
- Application Shell from `plantasonic-design-system/shell`
- Design tokens, Bootstrap theme, shell styles
- Command palette, theme toggle, persisted window state

## Commands

```bash
npm install
npm run dev          # Vite dev server + Electron
npm run build        # Production renderer build
npm run start        # Electron with built renderer
```

## Customize

Edit `src/shell-config.ts`. Page content in `src/pages/`.
