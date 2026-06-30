# Platform Architecture Guide

The **Unified Creative Ecosystem** turns every application into a lightweight client on shared infrastructure. Engines, assets, plugins, workflows, services, and documentation live in the Design System — not inside individual prototypes.

---

## Layer stack

```
tokens → primitives → components → motion → shell → instrument → app
        ↓
      ai (registry, validation, generators, plugins, knowledge graph)
        ↓
   prototype (12 types, brief → plan → scaffold)
        ↓
   platform (engines, assets, presets, workflows, projects, services, deployment, quality)
        ↓
<your-project>/   platform.json + src/platform/* + creative logic only
```

| Layer | Export | Purpose |
| --- | --- | --- |
| Design System | `./primitives`, `./components`, `./motion`, `./shell`, `./instrument`, `./app` | Tokens, UI, shell, creative framework |
| AI | `./ai`, `./generated/ai/*.json` | Machine-readable registry, validation, generators |
| Prototype | `./prototype` | Scaffold Vite apps from type or brief |
| Platform | `./platform`, `./generated/ecosystem/*.json` | Shared engines, assets, workflows, project registry |

---

## Principles

1. **Applications are lightweight clients** — configuration + creative logic only.
2. **Install engines — never embed** — `installEngine('engine.sound')` resolves npm packages.
3. **Reference shared assets — never duplicate** — `assets://` URIs in the asset registry.
4. **Invoke workflows — never reimplement** — `workflow.import-assets`, `workflow.generate-demo`, etc.
5. **Use platform services — never rebuild locally** — logging, settings, storage, undo/redo, autosave.

---

## Public SDK

```typescript
import {
  createProject,
  installEngine,
  registerAsset,
  registerWorkflow,
  createPlatformServices,
  validateProject,
  buildEcosystemContext,
  getPlatformArchitecture,
} from 'plantasonic-design-system/platform';

const { manifest, files } = createProject({
  type: 'generative-art',
  name: 'Flower Study',
  sound: true,
});
```

`createProject()` wraps `createPrototype()` and adds:

- `platform.json` — authoritative manifest (engines, plugins, assets, workflows, services, deployment)
- `docs/PLATFORM.md`, `docs/DEPLOYMENT.md`, `docs/AI_CONTEXT.json`
- `src/platform/services.ts`, `src/platform/engines.ts`
- Quality scripts (`npm run validate` includes platform checks)

---

## AI collaboration

Non-TypeScript tools consume `generated/ecosystem/*.json`:

```bash
npm run generate:ecosystem-context
```

`buildEcosystemContext()` merges design-system registry, engine catalog, workflows, services, and project metadata into one document AI agents can use to modify applications consistently.

---

## Related guides

- [Engine Integration](./ENGINE_INTEGRATION_GUIDE.md)
- [Ecosystem Plugins](./ECOSYSTEM_PLUGIN_GUIDE.md)
- [Asset Pipeline](./ASSET_PIPELINE_GUIDE.md)
- [Workflow Automation](./WORKFLOW_AUTOMATION_GUIDE.md)
- [Project Registry](./PROJECT_REGISTRY_GUIDE.md)
- [Deployment](./DEPLOYMENT_GUIDE.md)
- [Quality Assurance](./QUALITY_ASSURANCE_GUIDE.md)
