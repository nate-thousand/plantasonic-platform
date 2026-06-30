# Design Principles

Implementation rules for applying the Plantasonic design system in any product.

Read [VISION_AND_SCOPE.md](./VISION_AND_SCOPE.md) first — it defines the north star, boundaries, and decision filter for every addition to this system.

---

## 1. Interface Disappears Behind the Experience

The user should focus on sound, visuals, and exploration — not the software itself.

The primary content area — stage, canvas, or main viewport — owns visual priority. Chrome (nav, dock, sidebar) supports interaction without competing for attention.

In performance mode, chrome further recedes via reduced opacity and minimal controls.

---

## 2. Calm, Intentional, Expressive

The design system should feel organic, tactile, minimal, and quietly sophisticated — never generic SaaS, never visual clutter.

Every element must have a clear purpose. Nothing exists purely for decoration.

Avoid excessive gradients, trend-driven styling, and decorative effects without purpose.

---

## 3. Token-Driven

Every color, spacing value, radius, shadow, and duration must reference a documented token.

| Prefix | Usage |
| ------ | ----- |
| `--ds-*` | Design system semantic tokens (preferred) |
| `--ps-*` | Product layout tokens (nav height, dock, touch targets) |
| `$ds-*` | SCSS compile-time equivalents |

Semantic tokens describe **intent** (`text.primary`, `surface.card`, `border.focus`) — never implementation details.

Never introduce raw hex, pixel, or millisecond values in component code.

---

## 4. Bootstrap as Implementation

Bootstrap 5.0.2 provides component behavior and accessibility primitives. Plantasonic tokens provide identity.

```text
tokens/*.json → css/variables.css → scss/bootstrap-theme.scss → Bootstrap SCSS
```

Rules:

- Import `bootstrap-theme.scss` **before** Bootstrap's variable definitions
- Import `css-theme-bridge.scss` **after** Bootstrap when runtime theme switching is required
- Never edit files in `node_modules/bootstrap/`
- App-specific layout classes use the `ps-` prefix

---

## 5. Motion Communicates State

Animation should never exist solely for decoration.

Movement should feel smooth, natural, subtle, responsive, and purposeful.

Avoid flashy transitions, unnecessary bounce, excessive duration, and distracting effects.

Respect `prefers-reduced-motion: reduce`.

---

## 6. Tactile Interaction

Every interaction should feel immediate, predictable, forgiving, and expressive.

Hover, focus, press, drag, and transition states must communicate intention clearly.

Every interaction should encourage exploration.

---

## 7. Accessible by Default

Non-negotiable requirements:

- Keyboard navigation for all interactive elements
- Visible focus rings using `--ds-shadow-focus`
- Minimum touch target: `--ps-touch-target` (2.75rem)
- Respect `prefers-reduced-motion: reduce`
- Semantic HTML landmarks (`nav`, `aside`, `section`, `footer`)
- WCAG 2.1 AA contrast for text on surfaces
- Scalable typography

Accessibility is a core requirement — never an afterthought.

---

## 8. Theme-Aware

Dark theme is the default — optimized for long performance sessions.

Light theme is available via `data-theme="light"` on the root element. Theme files:

- `tokens/theme.dark.tokens.json`
- `tokens/theme.light.tokens.json`

Switch themes by toggling the attribute and ensuring `css/variables.css` is loaded.

---

## 9. Reuse Over Reinvention

Every reusable component should exist only once in this system.

Applications consume components and tokens from this package. They do not redefine them.

Product apps (like Plantasonic) import this package; they do not duplicate token definitions or parallel component systems.

---

## Decision Filter

Before adding a token, component, or pattern, apply the filter in [VISION_AND_SCOPE.md](./VISION_AND_SCOPE.md#decision-filter).

If any answer is "no," reconsider the addition.

---

## Related

- [VISION_AND_SCOPE.md](./VISION_AND_SCOPE.md)
- [BRAND_GUIDELINES.md](./BRAND_GUIDELINES.md)
- [TOKEN_ARCHITECTURE.md](./TOKEN_ARCHITECTURE.md)
- [COMPONENT_MAPPING.md](./COMPONENT_MAPPING.md)
- [../prompts/APPLY_DESIGN_SYSTEM.md](../prompts/APPLY_DESIGN_SYSTEM.md)
