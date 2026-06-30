# Application Compliance Guide

This guide explains how applications stay compliant with the Plantasonic Design System and how to produce actionable migration reports. Compliance tooling audits an application and reports incorrect token usage, local styling, duplicate components, deprecated APIs, missing accessibility, and layout/theme violations.

---

## Why compliance matters

The Design System is the authoritative source of truth. Applications that diverge — hardcoding colors, redefining components, or using deprecated APIs — drift visually and break when the system evolves. Compliance checks keep every application aligned and make upgrades safe.

---

## Running a compliance audit

```typescript
import { validateApplication, formatValidationReport } from 'plantasonic-design-system/ai';
import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';

const files = globSync('src/**/*.{css,scss,ts,tsx}').map((path) => ({
  path,
  content: readFileSync(path, 'utf8'),
}));

const report = validateApplication(files);
console.log(formatValidationReport(report));
process.exit(report.ok ? 0 : 1);
```

See the [Validation Guide](./VALIDATION_GUIDE.md) for the full rule set and configuration.

---

## What is reported

| Category | Rule | How to fix |
| --- | --- | --- |
| Incorrect token usage | `unknown-design-token` | Replace with a registry token (`getTokens()`). |
| Local styling | `no-hardcoded-color`, `no-raw-color-function` | Use `var(--ds-color-*)` tokens. |
| Duplicate components | `duplicate-component` | Import from `plantasonic-design-system/components`. |
| Deprecated APIs | `deprecated-api` | Follow the element's `migration` history. |
| Deprecated tokens | `deprecated-token` | Switch to the token's `replacement`. |

Accessibility, layout, and theme expectations are described in each element's metadata (`accessibility`, `supportedLayouts`, `supportedThemes`) and can be cross-checked via the registry.

---

## Migration reports

When the Design System deprecates an element, query the impact and generate a migration checklist:

```typescript
import { getImpact, getComponent, getToken } from 'plantasonic-design-system/ai';

const impact = getImpact('token.color.primary.default');
// impact.transitiveDependents → everything that must be reviewed
```

Combine impact analysis with a validation run to produce a per-file, actionable migration report before upgrading.

---

## Recommended workflow

1. Add a compliance step to CI that runs `validateApplication` and fails on errors.
2. Treat warnings as a backlog; drive them to zero before major releases.
3. On Design System upgrades, run impact analysis for any deprecated ids and migrate referenced files.
4. Keep application UI in sync with the showcase and the generated catalogs (`docs/generated/ai/`).
