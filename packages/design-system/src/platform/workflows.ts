/**
 * Workflow automation — reusable creative workflows apps invoke, not reimplement.
 */
import type { WorkflowSpec } from './types.ts';

export const WORKFLOW_CATALOG: WorkflowSpec[] = [
  {
    id: 'workflow.import-assets',
    name: 'Import Assets',
    purpose: 'Import images, audio, video, and models into the shared asset registry.',
    invoke: 'platform.importAssets',
    inputs: ['files'],
    outputs: ['assetIds'],
    tags: ['assets', 'import'],
  },
  {
    id: 'workflow.generate-textures',
    name: 'Generate Textures',
    purpose: 'AI/procedural texture generation into asset registry.',
    invoke: 'platform.generateTextures',
    inputs: ['prompt', 'count'],
    outputs: ['assetIds'],
    tags: ['assets', 'ai', 'generate'],
  },
  {
    id: 'workflow.generate-sound-worlds',
    name: 'Generate Sound Worlds',
    purpose: 'Generate ambient sound presets via sound engine.',
    invoke: 'platform.generateSoundWorlds',
    inputs: ['mood', 'duration'],
    outputs: ['presetIds'],
    tags: ['sound', 'ai', 'generate'],
  },
  {
    id: 'workflow.generate-midi-mappings',
    name: 'Generate MIDI Mappings',
    purpose: 'Auto-map MIDI CC to parameters.',
    invoke: 'platform.generateMidiMappings',
    inputs: ['deviceId', 'parameters'],
    outputs: ['mappingPreset'],
    tags: ['midi', 'ai'],
  },
  {
    id: 'workflow.generate-visual-presets',
    name: 'Generate Visual Presets',
    purpose: 'AI-generated visual parameter presets.',
    invoke: 'platform.generateVisualPresets',
    inputs: ['brief', 'count'],
    outputs: ['presetIds'],
    tags: ['visual', 'ai', 'generate'],
  },
  {
    id: 'workflow.generate-documentation',
    name: 'Generate Documentation',
    purpose: 'Generate README, API docs, and validation checklist from project manifest.',
    invoke: 'platform.generateDocumentation',
    inputs: ['projectId'],
    outputs: ['docs'],
    tags: ['docs', 'ai'],
  },
  {
    id: 'workflow.generate-marketing-assets',
    name: 'Generate Marketing Assets',
    purpose: 'Screenshots, social cards, and demo copy from project state.',
    invoke: 'platform.generateMarketingAssets',
    inputs: ['projectId', 'formats'],
    outputs: ['assetIds'],
    tags: ['marketing', 'ai'],
  },
  {
    id: 'workflow.generate-demo',
    name: 'Generate Demo',
    purpose: 'Record or build a shareable demo from current project.',
    invoke: 'platform.generateDemo',
    inputs: ['projectId', 'duration'],
    outputs: ['url'],
    tags: ['demo', 'deploy'],
  },
];

const catalog = new Map(WORKFLOW_CATALOG.map((w) => [w.id, w]));

export class WorkflowRegistry {
  #workflows = new Map<string, WorkflowSpec>();

  constructor(seed: WorkflowSpec[] = WORKFLOW_CATALOG) {
    for (const w of seed) this.#workflows.set(w.id, w);
  }

  register(workflow: WorkflowSpec): this {
    this.#workflows.set(workflow.id, workflow);
    return this;
  }

  get(id: string): WorkflowSpec | undefined {
    return this.#workflows.get(id);
  }

  all(): WorkflowSpec[] {
    return [...this.#workflows.values()];
  }

  byTag(tag: string): WorkflowSpec[] {
    return this.all().filter((w) => (w.tags ?? []).includes(tag));
  }
}

export const workflowRegistry = new WorkflowRegistry();

export function registerWorkflow(workflow: WorkflowSpec): WorkflowSpec {
  workflowRegistry.register(workflow);
  return workflow;
}

export function getWorkflows(): WorkflowSpec[] {
  return workflowRegistry.all();
}
