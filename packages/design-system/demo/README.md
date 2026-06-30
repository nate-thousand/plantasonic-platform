# Component Demo

A **vanilla HTML** showcase for Plantasonic design tokens, platform components, and Bootstrap patterns. No TypeScript — plain HTML rendered by JavaScript modules, styled with the same SCSS layers as the full showcase.

## Quick start

```bash
# From repository root (first time)
cd demo && npm install

# Development server → http://localhost:5173
npm run demo:dev

# Production build
npm run demo:build
npm run demo:preview
```

From the `demo/` directory: `npm run dev`, `npm run build`, `npm run preview`.

## What's included

| Section | Content |
| --- | --- |
| **Foundations** | Colors, typography, spacing, radius, shadows, motion |
| **Platform** | Button, icon button, toolbar, badge, status, card, panel |
| **Bootstrap** | Buttons, forms, selection, navigation, cards, lists, tables, feedback, disclosure, dialogs, utilities |

## Full showcase

For navigation framework, application shell, token inspector, and creative instrument components, use the full interactive showcase:

```bash
npm run showcase:dev   # from repository root
```

## Stack

- Vanilla HTML + ES modules
- Bootstrap 5.0.2 (themed via Plantasonic tokens)
- Vite (SCSS compilation only)

Copy markup from the rendered page directly into your application.
