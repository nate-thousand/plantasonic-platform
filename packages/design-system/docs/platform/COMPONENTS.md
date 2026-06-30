# Component Usage

## Bootstrap components

Use standard Bootstrap 5 markup. The Plantasonic theme styles all components via SCSS + css-theme-bridge.

Reference implementations live in the **showcase** under Bootstrap categories.

## Plantasonic components

Instrument-specific reference components (knobs, transport, dock, etc.) ship in the showcase under Milestone 3. Copy patterns — do not duplicate styling in apps.

## Import pattern (React + Vite)

```typescript
import '@ds/css/variables.css';
import './styles/main.scss'; // bootstrap-theme + bootstrap + bridge
```

## Layout

Starter templates include `AppLayout` with header, theme toggle, and main content region. Extend — do not replace — unless the product requires a different shell.

## Generated catalog

Run `npm run generate:component-docs` for an auto-generated list of showcase categories.
