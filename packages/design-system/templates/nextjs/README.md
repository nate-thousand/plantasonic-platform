# __APP_NAME__

Next.js App Router starter with the Plantasonic **Application Shell**.

## Includes

- App Router (`app/`)
- Application Shell from `plantasonic-design-system/shell`
- Design tokens, Bootstrap theme, shell SCSS layers
- Client `ShellHost` mounts workspace content from `app/page.tsx`

## Commands

```bash
npm install
npm run dev
npm run build
```

## Customize

- Shell config: `lib/shell-config.ts`
- Pages: `app/` directory
- Styles: `app/globals.scss`

## Note

The shell renders client-side via `ShellHost`. Configure navigation, routes, and commands in `shell-config.ts` — do not duplicate layout markup.
