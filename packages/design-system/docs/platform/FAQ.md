# FAQ

## How do I create a new Plantasonic app?

```bash
npx plantasonic create my-app
```

Choose a template with `--template react-vite|react-bootstrap|nextjs|electron`.

## Do I need to copy tokens into my app?

No. Install `plantasonic-design-system` and import CSS/SCSS exports. Never duplicate token JSON or `--ds-*` blocks.

## How do I switch dark/light theme?

Set `data-theme` on `<html>`. Starters include `theme.ts` with `initTheme()` and `toggleTheme()`.

## Where is the component library?

Bootstrap components are themed via this package. Plantasonic-specific instrument components are reference implementations in the **showcase** (Milestone 3).

## Can I modify Bootstrap version?

Not independently — the design system pins 5.0.2. Request a design system release for upgrades.

## How do I validate my token changes?

```bash
npm run tokens:validate
npm run quality
npm run test
```

## Where are generated docs?

`docs/generated/` after `npm run docs`.

## Does this repo modify Plantasonic apps?

No. This is the foundation only. Apps consume the package; they are not modified by this milestone.
