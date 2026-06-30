# Brand Guidelines

Plantasonic is a generative audiovisual instrument. The design system reflects that identity: dark, focused, and alive with green energy — like a stage lit for performance, not a marketing landing page.

Read [VISION_AND_SCOPE.md](./VISION_AND_SCOPE.md) for the full vision, inspiration sources, and scope boundaries.

---

## Brand Essence

| Attribute | Expression |
| --------- | ---------- |
| Instrument | UI chrome recedes; the stage is the hero |
| Organic | Green palette, soft glows, rounded controls |
| Technical | Monospace for status and values; precise spacing |
| Performable | Large touch targets, keyboard-first, low latency |
| Quiet confidence | Calm, intentional, handcrafted — not visual spectacle |

---

## Inspiration

The visual language draws from botanical illustration, scientific field journals, museum exhibits, Japanese gardens, Braun/Dieter Rams industrial design, vintage laboratory instruments, modular synthesizers, and architectural wayfinding.

The goal is quiet confidence — not corporate SaaS aesthetics or decorative excess.

---

## Color Identity

**Primary green** (`#00FF57`) is the signature action color — play, focus, active states. It should feel electric but not neon-fatiguing over long sessions.

**Accent green** (`#4DFF89`) handles secondary emphasis: labels, active borders, slider thumbs.

**Deep forest background** (`#070F0A`) anchors the app. Surfaces layer from sunken stage black through raised nav panels.

Do not use primary green for body text at large sizes — it is reserved for interactive emphasis and the instrument's "alive" signal.

---

## Typography Voice

| Role | Font | Tone |
| ---- | ---- | ---- |
| UI chrome | Helvetica | Clear, neutral, readable |
| Status / tempo / values | DM Mono | Technical, precise |
| Headings | Helvetica Bold (700) | Confident, not shouty |

Use uppercase sparingly. Labels and overlines may use letter-spacing (`0.08em`) for instrument-panel feel.

---

## Visual Hierarchy

1. **Stage** — full-bleed visual canvas, darkest surface
2. **Active controls** — dock transport, current preset
3. **Secondary chrome** — nav, sidebar sliders
4. **Overlays** — preset browser, settings (elevated, large shadow)

---

## Logo & Wordmark

Plantasonic wordmark uses the primary green on dark surfaces. On light surfaces, use `#070F0A` text with green accent on the "sonic" suffix or active element.

---

## Do / Don't

**Do**
- Use semantic tokens (`--ds-color-*`) for all visual values
- Keep chrome opacity subtle in performance mode
- Maintain WCAG AA contrast for readable text

**Don't**
- Hardcode hex values in application code
- Use status colors (error, warning) for decoration
- Add decorative gradients to control surfaces
- Compete with the stage for visual attention

---

## Related

- [VISION_AND_SCOPE.md](./VISION_AND_SCOPE.md)
- [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md)
- [TOKEN_ARCHITECTURE.md](./TOKEN_ARCHITECTURE.md)
