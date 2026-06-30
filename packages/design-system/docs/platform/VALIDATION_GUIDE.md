# Validation Guide

The validation engine audits application source against Design System rules. It is dependency-free and operates on plain source strings, so it runs in CI, build tools, editor extensions, or an AI agent loop.

```typescript
import { validateApplication, formatValidationReport } from 'plantasonic-design-system/ai';

const report = validateApplication([
  { path: 'src/app.css', content: cssSource },
  { path: 'src/App.tsx', content: tsxSource },
]);

if (!report.ok) {
  console.error(formatValidationReport(report));
  process.exit(1);
}
```

`validateApplication` accepts a string, a single `{ path, content }` file, or an array of files.

---

## Rules

| Rule | Default severity | Detects |
| --- | --- | --- |
| `no-hardcoded-color` | error | Hardcoded hex colors — use `var(--ds-color-*)`. |
| `no-raw-color-function` | warning | Inline `rgb()`/`hsl()` colors not wrapped in `var()`. |
| `unknown-design-token` | warning | `--ds-*` / `--ps-*` variable not in the token registry. |
| `deprecated-token` | error | Use of a deprecated token (suggests replacement). |
| `deprecated-api` | error | Use of a deprecated component API. |
| `duplicate-component` | warning | Local component that duplicates a Design System component. |

Layout-primitive internal variables (`--ds-l-*`) are intentionally ignored.

The rule catalog is also exported as `generated/ai/compliance.json`.

## Report shape

```typescript
interface ValidationReport {
  ok: boolean;            // false when any error-severity violation exists
  filesChecked: number;
  errorCount: number;
  warningCount: number;
  violations: Violation[]; // { rule, severity, message, file?, line?, snippet? }
}
```

## Configuring rules

```typescript
validateApplication(files, {
  rules: {
    'no-raw-color-function': 'error', // promote to error
    'duplicate-component': false,     // disable
  },
});
```

## Using a custom registry

Pass `registry` to validate against a plugin-augmented or app-specific registry:

```typescript
import { createPluginHost } from 'plantasonic-design-system/ai';
const host = createPluginHost().use(myPlugin);
validateApplication(files, { registry: host.registry });
```

## CI integration

Add a check that fails the build on errors:

```bash
node -e "import('plantasonic-design-system/ai').then(async ({ validateApplication }) => { /* read files, validate, exit(1) on !ok */ })"
```

See the [Application Compliance Guide](./APPLICATION_COMPLIANCE_GUIDE.md) for a full compliance workflow and migration reporting.
