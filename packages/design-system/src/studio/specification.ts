/**
 * Project specification — project.json as authoritative source of truth.
 */
import type { ProjectSpecification } from './types.ts';
import type { CreateProjectConfig, EngineId, ProjectManifest } from '../platform/types.ts';
import { enginesForPrototype } from '../platform/engines.ts';
import { defaultServices } from '../platform/services.ts';
import { WORKFLOW_CATALOG } from '../platform/workflows.ts';
import { planFromBrief } from '../prototype/spec-parser.ts';
import type { PrototypeType } from '../prototype/types.ts';

export const SPEC_VERSION = '1.0.0';

function slugify(name: string): string {
  return name
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase();
}

function defaultWorkflows(category: string): string[] {
  const ids = ['workflow.import-assets', 'workflow.generate-documentation'];
  if (category.includes('audio') || category.includes('music') || category.includes('visual')) {
    ids.push('workflow.generate-visual-presets');
  }
  return ids.filter((id) => WORKFLOW_CATALOG.some((w) => w.id === id));
}

/** Generate a project specification from concept or brief. */
export function generateSpecification(input: {
  name: string;
  concept?: string;
  brief?: string;
  category?: string;
  engines?: EngineId[];
}): ProjectSpecification {
  const now = new Date().toISOString();
  let category = input.category ?? 'generative-art';
  let engines: EngineId[] = input.engines ?? ['engine.visual'];
  let layouts: string[] = ['canvas'];
  let components: string[] = ['panel', 'toolbar'];
  let aiCapabilities: string[] = ['compliance', 'documentation'];

  if (input.brief) {
    const plan = planFromBrief(input.brief, input.name);
    category = plan.type;
    engines = [
      ...new Set([
        ...enginesForPrototype(plan.features, plan.type),
        ...(input.engines ?? []),
      ]),
    ] as EngineId[];
    layouts = [plan.layout];
    components = plan.panels;
    if (plan.features.midi) aiCapabilities.push('midi-mapping');
    if (/\bai\b|llm|copilot/i.test(input.brief)) aiCapabilities.push('generation');
  }

  const id = slugify(input.name);

  return {
    specVersion: SPEC_VERSION,
    id,
    name: input.name,
    description: input.concept ?? input.brief ?? `${input.name} creative prototype`,
    category,
    version: '0.1.0',
    concept: input.concept,
    brief: input.brief,
    engines,
    layouts,
    components,
    plugins: [],
    assets: [],
    aiCapabilities: [...new Set(aiCapabilities)],
    deploymentTargets: ['local', 'preview', 'production'],
    documentation: ['README.md', 'ROADMAP.md', 'CHANGELOG.md', 'project.json', 'docs/VALIDATION_CHECKLIST.md'],
    qualityRequirements: ['tokens', 'layout', 'components', 'accessibility', 'documentation', 'build', 'dependencies'],
    services: defaultServices(),
    workflows: defaultWorkflows(category),
    pipeline: { concept: now },
    createdAt: now,
    updatedAt: now,
  };
}

/** Parse project.json string into validated specification. */
export function parseSpecification(json: string): ProjectSpecification {
  const raw = JSON.parse(json) as ProjectSpecification;
  if (!raw.specVersion || !raw.id || !raw.name) {
    throw new Error('Invalid project.json: specVersion, id, and name are required.');
  }
  return raw;
}

/** Serialize specification to project.json content. */
export function serializeSpecification(spec: ProjectSpecification): string {
  return JSON.stringify(spec, null, 2) + '\n';
}

/** Convert specification → platform createProject config. */
export function specToCreateConfig(spec: ProjectSpecification): CreateProjectConfig {
  const config: CreateProjectConfig = {
    type: spec.category,
    name: spec.name,
    engines: spec.engines,
    plugins: spec.plugins,
    workflows: spec.workflows,
    services: spec.services,
    deployment: spec.deploymentTargets[0] ?? 'preview',
  };
  if (spec.brief) config.brief = spec.brief;
  return config;
}

/** Sync specification from generated platform manifest. */
export function syncSpecFromManifest(spec: ProjectSpecification, manifest: ProjectManifest): ProjectSpecification {
  return {
    ...spec,
    version: manifest.version,
    engines: manifest.engines,
    plugins: manifest.plugins,
    assets: manifest.assets,
    workflows: manifest.workflows,
    services: manifest.services,
    documentation: manifest.documentation,
    updatedAt: new Date().toISOString(),
  };
}

/** Mark a pipeline stage complete on the specification. */
export function markPipelineStage(spec: ProjectSpecification, stage: import('./types.ts').PipelineStage): ProjectSpecification {
  return {
    ...spec,
    pipeline: { ...spec.pipeline, [stage]: new Date().toISOString() },
    updatedAt: new Date().toISOString(),
  };
}

/** Infer prototype type from category string. */
export function categoryToPrototypeType(category: string): PrototypeType {
  return category as PrototypeType;
}
