# Accessibility

## Token-level contrast

Automated tests in `tests/accessibility.test.mjs` verify WCAG AA contrast (4.5:1) for primary text on app surfaces in both themes.

Run: `npm run test`

## Bootstrap focus states

Focus rings use `--ds-color-border-focus` and `--ds-shadow-focus` via css-theme-bridge.

## Reduced motion

Showcase and starters respect `prefers-reduced-motion`. Apps should preserve:

```scss
@media (prefers-reduced-motion: reduce) { /* disable non-essential motion */ }
```

## Checklist for new UI

- [ ] Text meets 4.5:1 on its surface (4.5:1 body, 3:1 large text)
- [ ] Interactive elements have visible `:focus-visible` state
- [ ] Form controls expose labels and `aria-*` where needed
- [ ] Color is not the only state indicator

Validate in the showcase Accessibility section before shipping product UI.
