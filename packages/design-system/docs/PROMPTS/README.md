# AI Prompt Library

Reusable starter prompts for v0, Cursor, and other AI development tools building Plantasonic interfaces.

Copy a prompt below, customize the bracketed sections, and follow [V0 Guidelines](../V0_GUIDELINES.md) and [AI Design Guide](../AI_DESIGN_GUIDE.md) when integrating output.

---

## Prompts

| UI type | File | Use when |
| --- | --- | --- |
| Dashboard | [dashboard.md](./dashboard.md) | Metrics, status overview, admin views |
| Audio App | [audio-app.md](./audio-app.md) | Transport, mixer, waveform, instrument chrome |
| Game UI | [game-ui.md](./game-ui.md) | HUD, inventory, health, score overlays |
| Settings Panel | [settings-panel.md](./settings-panel.md) | Preferences, configuration forms |
| Inspector | [inspector.md](./inspector.md) | Parameter editor, property panel |
| Modal | [modal.md](./modal.md) | Dialogs, confirmations, focused tasks |
| Toolbar | [toolbar.md](./toolbar.md) | Transport bar, action clusters |
| Sidebar | [sidebar.md](./sidebar.md) | Navigation rail, preset browser |
| Mobile Layout | [mobile-layout.md](./mobile-layout.md) | Touch-first, narrow viewport layouts |
| Retro Terminal | [retro-terminal.md](./retro-terminal.md) | CRT/terminal aesthetic with token theming |

---

## Shared Constraints

Append these to every prompt:

```text
Design System: Plantasonic Design System
Stack: Bootstrap 5.0.2 + CSS custom properties (--ds-*, --ps-*)
Theme: data-theme="dark" (default)

Rules:
- All colors, spacing, typography, radius, shadow, and motion via var(--ds-*) tokens
- Bootstrap classes for standard controls — no parallel component systems
- No hardcoded hex, rgb, or arbitrary px spacing
- Accessible: semantic HTML, ARIA, focus rings, 2.75rem min touch targets
- Respect prefers-reduced-motion
- Stage/canvas is visual hero; chrome recedes
```

---

## Machine-Readable Context

Point AI tools at these exports for accurate token and component discovery:

- `generated/ai/index.json` — manifest
- `generated/ai/tokens.json` — full token catalog
- `generated/ai/components.json` — component metadata
- `generated/ai/layouts.json` — layout presets
- `docs/generated/ai/TOKEN_REFERENCE.md` — human-readable token table

Regenerate with `npm run ai:context`.
