# Milestone 2B — Bootstrap Styling Audit

Audit performed before implementing the complete Bootstrap styling layer.

## Pre-M2B gaps

| Component | Issue |
| --- | --- |
| **Architecture** | `bootstrap-theme.scss` contained 280+ lines of hardcoded hex values duplicating tokens |
| **Runtime layer** | Single monolithic `css-theme-bridge.scss` — incomplete interaction states |
| **Missing files** | No `bootstrap-components.scss` or `bootstrap-utilities.scss` |
| **Buttons** | Secondary hover/active; success/warning/info/danger variants; btn-group selected state |
| **Inputs** | Disabled/readonly; input-group; hover border |
| **Selects** | Disabled styling incomplete |
| **Checkboxes/radios** | Disabled checked; form-switch track (default Bootstrap gray) |
| **Range** | Firefox track/thumb missing |
| **Alerts** | Hardcoded `rgba()` in bridge — not token-sourced |
| **Badges** | Warning badge used Bootstrap `text-dark` |
| **Tables** | thead styling; active row |
| **Tabs/pills** | Hover and focus on nav-link |
| **Accordions** | Focus ring; chevron color |
| **Dropdowns** | Header, divider, disabled item |
| **Pagination** | Hover states |
| **Breadcrumbs** | Divider color |
| **Modals/offcanvas** | btn-close used Bootstrap SVG (wrong on dark) |
| **Toasts** | Header background |
| **Tooltips/popovers** | Compile-time colors didn't follow theme switch |
| **Spinners** | Contextual colors |
| **Progress** | Success variant |
| **Utilities** | `.text-*`, `.bg-*`, `.border-*` still Bootstrap defaults |
| **Showcase** | State labels incomplete (no selected); M2 messaging |

## M2B resolution

| Layer | File | Role |
| --- | --- | --- |
| Compile-time | `_bootstrap-compile.generated.scss` | Token values for Bootstrap SCSS build (auto-generated) |
| Variables | `bootstrap-theme.scss` | Bootstrap `$variable` overrides — no hardcoded values |
| Runtime | `bootstrap-components.scss` | Full component styling via CSS custom properties |
| Utilities | `bootstrap-utilities.scss` | Token-based utility class overrides |
| Compatibility | `css-theme-bridge.scss` | Re-exports components + utilities |

## Import order (apps)

```scss
@import '@ds/scss/bootstrap-theme';
@import 'bootstrap/scss/bootstrap';
@import '@ds/scss/bootstrap-components';
@import '@ds/scss/bootstrap-utilities';
```

Plus `@ds/css/variables.css` at app entry for runtime theme switching.

## Remaining gaps (none blocking M2B)

- Bootstrap 5.0.2 Sass `@import` deprecation warnings (upstream; migrate to `@use` in future)
- `<select>` option list colors are browser-controlled
- Alert success/info/warning backgrounds use `--ds-color-overlay-scrim-light` + status border (no dedicated alert-surface tokens yet)

## Plantasonic app integration

**Deferred.** Do not wire into Plantasonic until M2B is validated in showcase (dark + light themes).
