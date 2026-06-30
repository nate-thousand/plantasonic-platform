# Testing Report

Generated: 2026-06-30T20:42:04.652Z · Version: 1.0.1

## Summary

- **Test files:** 22
- **Quality gates:** `npm run test`, `npm run validate:prototypes`, `npm run validate:examples`, `npm run validate:templates`, `npm run quality`, `npm run build`

## Coverage by area

| Area | Files | Complete |
| --- | --- | --- |
| tokens | tokens.test.mjs, theme.test.mjs | ✓ |
| accessibility | accessibility.test.mjs | ✓ |
| bootstrap | bootstrap-coverage.test.mjs | ✓ |
| platform | primitives.test.mjs, components.test.mjs, motion.test.mjs, shell.test.mjs | ✓ |
| creative | instrument.test.mjs, instrument-shell.test.mjs, input.test.mjs, app-sdk.test.mjs | ✓ |
| ai | ai.test.mjs | ✓ |
| prototype | prototype.test.mjs | ✓ |
| ecosystem | platform.test.mjs | ✓ |
| studio | studio.test.mjs | ✓ |
| stabilization | stabilization.test.mjs, examples.test.mjs | ✓ |
| cli | cli.test.mjs, template-shell.test.mjs | ✓ |
| build | showcase-build.test.mjs | ✓ |

## Known gaps

- CLI execution integration (create/spec end-to-end)
- Visual regression (manual via showcase)
- App SDK DOM mount integration
