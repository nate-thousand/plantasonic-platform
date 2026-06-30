# Bootstrap Integration

Plantasonic standardizes on **Bootstrap 5.0.2** with a three-layer theme.

## Architecture

```
tokens/*.tokens.json
        ↓
_bootstrap-compile.generated.scss   Compile-time values (dark defaults)
_tokens.generated.scss              Runtime CSS var references
        ↓
bootstrap-theme.scss                Bootstrap $variable overrides
        ↓
bootstrap/scss/bootstrap            Bootstrap component CSS (compile-time)
        ↓
bootstrap-components.scss           Runtime component styling (CSS vars)
bootstrap-utilities.scss            Utility class overrides
        ↓
css/variables.css                   Loaded in app — enables data-theme switch
```

See [Milestone 2B Audit](./BOOTSTRAP_M2B_AUDIT.md) for gap analysis.

## Setup

### SCSS (required)

```scss
@import '@ds/scss/bootstrap-theme';
@import 'bootstrap/scss/bootstrap';
@import '@ds/scss/bootstrap-components';
@import '@ds/scss/bootstrap-utilities';
```

### CSS variables (required for theme switching)

```typescript
import '@ds/css/variables.css';
```

Set `data-theme="dark" | "light"` on `<html>`.

### Backward compatibility

`css-theme-bridge.scss` re-exports `bootstrap-components` + `bootstrap-utilities`. Existing imports continue to work.

## Validation

```bash
npm run tokens:build-bootstrap   # artifact + showcase build check
npm run showcase:build           # production CSS compile
npm run test                     # bootstrap coverage + contrast tests
```

Use showcase → Bootstrap categories to verify every interaction state (default, hover, focus, active, selected, disabled).

## App integration

**Do not integrate into Plantasonic app until M2B is validated here.** Apps should import this package with zero local Bootstrap overrides.
