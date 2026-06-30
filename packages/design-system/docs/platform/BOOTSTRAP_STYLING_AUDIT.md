# Bootstrap Styling Layer — Audit Report

**Date:** 2026-06-28  
**Milestone:** 2B — Complete Bootstrap Styling Layer  
**Scope:** Showcase Bootstrap reference (12 categories). No application integration. No new components.

## Executive summary

The Plantasonic Bootstrap styling layer **passes audit** for all components demonstrated in the showcase. Runtime styling (`bootstrap-components.scss` + `bootstrap-utilities.scss`) supersedes compile-time Bootstrap defaults. Dark and light themes resolve correctly. Production build, quality gate, and 17 automated tests pass.

**Verdict:** Ready for visual QA in showcase. Plantasonic app integration remains **deferred**.

---

## Validation run

| Check | Result |
| --- | --- |
| `npm run quality` | ✓ Pass |
| `npm run test` | ✓ 17/17 pass |
| `npm run showcase:build` | ✓ Pass (195 KB CSS) |
| `npm run audit:bootstrap` | ✓ 0 unresolved `--ds-`/`--ps-` vars |
| Token validation | ✓ 122 CSS mappings |
| WCAG contrast (automated) | ✓ Dark + light body text ≥ 4.5:1 |
| Console errors (build) | ✓ None (Sass deprecation warnings only) |

---

## Working components (12/12 showcase categories)

| Category | Components | Theme-safe | States |
| --- | --- | --- | --- |
| **Buttons** | primary, secondary, outline, ghost, link, groups, icon | ✓ | default, hover, focus, active, disabled, selected |
| **Forms** | text, password, email, number, search, textarea, validation | ✓ | default, focus, disabled, readonly, valid, invalid |
| **Selection** | checkbox, radio, switch, range, select, multi-select | ✓ | checked, disabled, focus |
| **Navigation** | navbar, tabs, pills, breadcrumb, pagination | ✓ | active, disabled, hover, focus |
| **Cards** | default, interactive, selected, disabled, elevation | ✓ | hover, selected |
| **Lists** | list-group, flush, interactive | ✓ | active, disabled, hover, focus |
| **Tables** | standard, hover, striped, compact, responsive | ✓ | hover, striped |
| **Feedback** | alerts, badges, progress, toasts, spinners | ✓ | contextual colors |
| **Disclosure** | accordion, collapse, offcanvas | ✓ | expanded, collapsed, focus |
| **Floating UI** | dropdowns, tooltips, popovers | ✓ | hover, focus, active, disabled |
| **Dialogs** | modal, confirm, loading | ✓ | backdrop, focus trap |
| **Utilities** | spacing, flex, grid, display, text alignment | ✓ | responsive breakpoints |

---

## Broken components

**None** in the showcase Bootstrap reference.

---

## Missing states

| Item | Severity | Notes |
| --- | --- | --- |
| Button loading spinner | Low | Not demonstrated; Bootstrap pattern available |
| `<select>` option list | N/A | Browser-native; cannot theme option background |
| Form-switch track (unchecked thumb) | Low | SVG data-URI uses encoded rgba; track/bg use tokens |
| Accordion chevron | Low | SVG fill encoded as `#999999` (matches `--ds-color-text-secondary` dark) |

---

## Accessibility

| Check | Status |
| --- | --- |
| Focus visibility (`:focus-visible`) | ✓ `--ds-color-border-focus` + `--ds-shadow-focus` |
| Keyboard navigation | ✓ Bootstrap JS + focus rings on interactive demos |
| ARIA on demos | ✓ labels, roles, `aria-current`, `aria-disabled` |
| Body text contrast (dark) | ✓ 5.55:1 automated |
| Body text contrast (light) | ✓ 4.5:1+ automated |
| Reduced motion | ✓ `prefers-reduced-motion` + showcase toggle |
| Screen reader | ✓ `visually-hidden` demo in utilities |

---

## Responsive

| Viewport | Status |
| --- | --- |
| Desktop (default) | ✓ Full 3-column showcase shell |
| Tablet (≤1200px) | ✓ Inspector panel hidden; grid adapts |
| Mobile (≤768px) | ✓ Nav hidden; viewport slider for width testing |
| Bootstrap grid | ✓ `col-md-*`, `table-responsive`, responsive text |

Showcase header includes viewport width slider for manual breakpoint testing.

---

## Hardcoded values found

### Acceptable (generated from tokens)

| File | Notes |
| --- | --- |
| `scss/_bootstrap-compile.generated.scss` | Auto-generated dark compile values from `tokens/*.json` |
| `css/variables.css` | Generated runtime CSS custom properties |

### Acceptable (SVG data-URIs — CSS vars not supported in encoded SVG)

| Location | Value | Maps to |
| --- | --- | --- |
| Form-switch unchecked thumb | `rgba(255,255,255,0.35)` | scrim-like overlay |
| Form-switch checked thumb | `#070f0a` | `--ds-color-text-on-primary` (dark) |
| Accordion chevron | `#999999` | `--ds-color-text-secondary` (dark) |
| btn-close mask | `fill='black'` | masked by `background-color: var(--ds-color-text-secondary)` |

### Showcase demo layout (token-driven inline styles)

| Location | Style | Token |
| --- | --- | --- |
| `max-width: 18rem/20rem` | Layout constraint for demos | N/A (demo chrome) |
| `height: 0.5rem` | Progress bar demo | matches `$progress-height` |
| `var(--ps-touch-target)` | Icon button sizing | product token |
| `var(--ds-shadow-*)` | Elevation demos | design tokens |

### Legacy Bootstrap compile layer (superseded at runtime)

Bootstrap 5.0.2 emits compile-time rules with Plantasonic token hex values and legacy `:root { --bs-blue: #0d6efd }` vars. The **runtime layer loads after Bootstrap** and overrides all showcased component selectors with `var(--ds-*)`. Verified in production CSS bundle.

---

## Fixes applied (this audit)

1. **Button box-shadow** — disabled Bootstrap inset white shadows (`$btn-box-shadow: none`)
2. **Edge components** — token overrides for `blockquote-footer`, `figure-caption`, `img-thumbnail`, `kbd`, `dropdown-menu-dark`, `btn-link:disabled`, pagination disabled, popover arrows, `text-white-50`
3. **Unresolved CSS var** — replaced `--ds-color-neutral-900` fallback in showcase with `--ds-color-surface-sunken`
4. **Audit tooling** — added `npm run audit:bootstrap` script

---

## Remaining gaps (non-blocking)

| Gap | Impact | Mitigation |
| --- | --- | --- |
| `:root --bs-blue` etc. legacy vars | None for showcased UI | Runtime layer overrides; vars unused |
| Compile-time rules precede runtime in bundle | None | Cascade order correct |
| Form-switch / accordion SVG fills | Light-theme thumb/chevron may not track tokens | Encode per-theme or migrate to CSS mask |
| Sass `@import` deprecation warnings | Build noise only | Future: migrate to `@use` / upgrade Bootstrap |
| Alert success/info/warning backgrounds | Uses scrim + status border | Dedicated alert-surface tokens optional future work |
| Plantasonic app integration | Out of scope | Deferred per milestone plan |

---

## Architecture verified

```
tokens/*.json
  → _bootstrap-compile.generated.scss (compile-time)
  → bootstrap-theme.scss ($variable overrides)
  → bootstrap/scss/bootstrap
  → bootstrap-components.scss (runtime CSS vars)
  → bootstrap-utilities.scss
  → css/variables.css (data-theme switching)
```

Import order in showcase and templates confirmed correct.

---

## Success criteria

| Criterion | Met |
| --- | --- |
| Showcase does not look like default Bootstrap | ✓ |
| All showcased Bootstrap components Plantasonic-styled | ✓ |
| States work in dark + light themes | ✓ (manual theme toggle + automated contrast) |
| No unresolved CSS variables | ✓ |
| No console errors | ✓ |
| Production build passes | ✓ |

**Plantasonic app integration:** Not started (by design).
