# Quality Assurance Guide

Every application inherits platform quality gates — no custom infrastructure required.

---

## Quality gates

`QUALITY_GATES` defines inherited checks:

| Gate | Scope |
| --- | --- |
| `lint` | ESLint / project linter |
| `types` | TypeScript strict |
| `tokens` | No hardcoded colors; DS token usage |
| `compliance` | `validateApplication()` from AI layer |
| `structure` | Required files and platform manifest |
| `accessibility` | Landmarks, reduced motion, color-scheme |
| `dependencies` | Engine and DS versions |
| `documentation` | README, PLATFORM, validation checklist |

---

## validateProject()

```typescript
import { validateProject, validateProjectFiles, validateManifest } from 'plantasonic-design-system/platform';

const report = validateProjectFiles(generatedFiles, manifest);
// report.ok, report.checks[]

const manifestReport = validateManifest(manifest);
```

Generated apps include `scripts/validate.mjs` wiring prototype structure checks + platform manifest validation.

---

## Generated config

```typescript
import { generateQualityConfig } from 'plantasonic-design-system/platform';

const config = generateQualityConfig(manifest);
// package.json scripts: validate, lint, typecheck
```

---

## Repository quality gate

Design System CI runs:

```bash
npm run quality    # tokens, exports, AI layer, prototype layer, platform layer
npm run test       # ai + prototype + platform test suites
npm run build      # includes generate:ecosystem-context
```

Platform presence is asserted in `scripts/quality-check.mjs` (`createProject`, `ENGINE_CATALOG`, `ProjectRegistry`, `getPlatformArchitecture`).

---

## Visual regression & performance

Visual regression and performance monitoring integrate at the application level via shared services (`telemetry` service) and the compliance engine. Extend with ecosystem plugins contributing `validationRules`.
