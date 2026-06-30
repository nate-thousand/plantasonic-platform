# Workflow Automation Guide

Reusable creative workflows — applications **call** workflows instead of implementing automation locally.

---

## Built-in workflows

| ID | Purpose |
| --- | --- |
| `workflow.import-assets` | Import files into asset registry |
| `workflow.generate-textures` | AI/procedural texture generation |
| `workflow.generate-sound-worlds` | Ambient sound preset generation |
| `workflow.generate-midi-mappings` | Auto-map MIDI CC to parameters |
| `workflow.generate-visual-presets` | AI visual parameter presets |
| `workflow.generate-documentation` | README + API docs from manifest |
| `workflow.generate-marketing-assets` | Screenshots, social cards, copy |
| `workflow.generate-demo` | Shareable demo recording |

---

## Register custom workflows

```typescript
import { registerWorkflow } from 'plantasonic-design-system/platform';

registerWorkflow({
  id: 'workflow.batch-export',
  name: 'Batch Export',
  purpose: 'Export all presets to cloud storage',
  invoke: 'myPlugin.batchExport',
  inputs: ['projectId'],
  outputs: ['urls'],
  tags: ['export', 'cloud'],
});
```

Plugins contribute workflows via `defineEcosystemPlugin({ contributes: { workflows: [...] } })`.

---

## Project defaults

`createProject()` assigns default workflows per prototype type:

- All projects: `workflow.import-assets`, `workflow.generate-documentation`
- Audio/visual types: also `workflow.generate-visual-presets`

Listed in `platform.json` → `workflows`.

---

## Invocation contract

Each `WorkflowSpec` defines:

- `invoke` — platform handler or plugin command
- `inputs` / `outputs` — typed argument names for AI and tooling
- `tags` — discovery and filtering

Workflows are registered in `workflowRegistry` and exported in `generated/ecosystem/workflows.json`.
