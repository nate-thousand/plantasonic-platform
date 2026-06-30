# Showcase

The **official Plantasonic Design System Showcase** — canonical visual reference for the entire ecosystem. Not a product application.

## Milestones

| Milestone | Status | Scope |
| --------- | ------ | ----- |
| **M1** | ✅ Complete | Foundations, shell, theme switcher, inspector |
| **M2** | ✅ Complete | **Bootstrap Reference** — 12 category pages |
| **M3** | Planned | Plantasonic instrument components |

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

From repository root: `npm run showcase:dev`

## Milestone 2 — Bootstrap Reference

Definitive Bootstrap 5.0.2 implementation using Plantasonic tokens only.

**Sidebar → Bootstrap:**

- Bootstrap Overview (coverage checklist)
- Buttons · Forms · Selection Controls · Navigation
- Cards · Lists · Tables · Feedback
- Disclosure · Floating UI · Dialogs · Utilities

Every component shows default, hover, focus, active, and disabled states where applicable.

**Validation:**

1. Switch dark/light themes in header — no reload
2. Click any component — inspect Bootstrap classes + CSS variables (right panel)
3. Test viewport at desktop, tablet, mobile
4. Tab through interactive demos for focus visibility

**Imports (design system only):**

- `tokens/*.json` (catalog)
- `css/variables.css`
- `scss/bootstrap-theme.scss`
- `scss/css-theme-bridge.scss`
- Bootstrap 5.0.2 from npm

No Plantasonic app imports. No hardcoded colors.

## Milestone 3 — Plantasonic Components (planned)

Knob, Slider, Transport Bar, Dock, Preset Card, Preset Browser, Parameter Group, MIDI Status, Piano Keyboard, Visualizer Frame, Notification, Overlay, Empty State, Error State, Loading State.

Do not start M3 until Bootstrap reference is validated in both themes.
