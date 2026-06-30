# Studio Architecture Guide

Layer stack for the Autonomous Creative Studio.

```
tokens → ai → prototype → platform → studio → <project.json> → <application>
```

| Layer | Export | Role |
| --- | --- | --- |
| AI | `./ai` | Registry, validation, impact analysis |
| Prototype | `./prototype` | Vite scaffold generation |
| Platform | `./platform` | Engines, assets, services, manifests |
| Studio | `./studio` | Pipeline, orchestrator, workspace, automation |

## Modules

| Module | Responsibility |
| --- | --- |
| `specification.ts` | `project.json` parse/generate |
| `pipeline.ts` | 10-stage creative pipeline + artifacts |
| `orchestrator.ts` | `orchestrateProject()`, reproducible generation |
| `asset-intelligence.ts` | Classify, tag, deduplicate assets |
| `knowledge.ts` | ADRs, debt, principles |
| `validation.ts` | Continuous validation + workspace audit |
| `refactoring.ts` | Safe migration plans with impact preview |
| `portfolio.ts` | Multi-project reporting |
| `workspace.ts` | Multi-project workspace |
| `automation.ts` | 9 reusable automations |

## Public APIs

```typescript
createProjectFromConcept()   // concept → full project
loadWorkspace()              // multi-project workspace
generateSpecification()      // project.json
validateWorkspace()          // continuous validation
upgradeProject()             // safe refactor preview
publishWorkspace()           // portfolio + validation
runAutomation()              // automation catalog
```

## AI context

```bash
npm run generate:studio-context
```

Outputs `generated/studio/*.json` for AI agents.

## Design constraint

The studio **automates engineering** — spec parsing, scaffolding, validation, docs, deployment prep. It does not replace creative decisions captured in `concept` and `brief` fields.
