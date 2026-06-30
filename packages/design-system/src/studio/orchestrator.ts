/**
 * Project orchestrator — coordinate generation, docs, testing, deployment from spec.
 */
import { createProject } from '../platform/create-project.ts';
import { validateProjectFiles } from '../platform/quality.ts';
import type { OrchestrationResult, PipelineArtifact, ProjectSpecification } from './types.ts';
import { generateStageFiles, runPipeline } from './pipeline.ts';
import {
  generateSpecification,
  serializeSpecification,
  specToCreateConfig,
  syncSpecFromManifest,
} from './specification.ts';

/** Orchestrate full project creation from a specification. */
export function orchestrateProject(spec: ProjectSpecification): OrchestrationResult {
  const pipeline = runPipeline(spec, 'generation');
  let currentSpec = pipeline.spec;

  const project = createProject(specToCreateConfig(currentSpec));
  currentSpec = syncSpecFromManifest(currentSpec, project.manifest);

  const stageFiles: Array<{ path: string; content: string }> = [];
  for (const stage of ['concept', 'specification', 'architecture', 'roadmap'] as const) {
    stageFiles.push(...generateStageFiles(currentSpec, stage));
  }

  // Ensure project.json is authoritative
  stageFiles.push({ path: 'project.json', content: serializeSpecification(currentSpec) });

  const pathSet = new Set(project.files.map((f) => f.path));
  const merged = [...project.files];
  for (const file of stageFiles) {
    if (!pathSet.has(file.path)) {
      merged.push(file);
      pathSet.add(file.path);
    }
  }

  const validation = validateProjectFiles(merged, project.manifest);
  const artifacts: PipelineArtifact[] = [...pipeline.artifacts];

  return {
    spec: markOrchestrationComplete(currentSpec),
    manifest: project.manifest,
    files: merged,
    artifacts,
    validation,
  };
}

function markOrchestrationComplete(spec: ProjectSpecification): ProjectSpecification {
  const now = new Date().toISOString();
  return {
    ...spec,
    pipeline: {
      ...spec.pipeline,
      generation: spec.pipeline?.generation ?? now,
      documentation: now,
      testing: now,
    },
    updatedAt: now,
  };
}

/** Create project from concept/brief — full pipeline entry point. */
export function createProjectFromConcept(input: {
  name: string;
  concept?: string;
  brief?: string;
  category?: string;
}): OrchestrationResult {
  const spec = generateSpecification(input);
  return orchestrateProject(spec);
}

/** Reproduce project files from existing project.json. */
export function reproduceFromSpecification(spec: ProjectSpecification): OrchestrationResult {
  return orchestrateProject(spec);
}
