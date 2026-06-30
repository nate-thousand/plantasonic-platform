/**
 * Creative pipeline — concept through iteration with structured artifacts.
 */
import type { PipelineArtifact, PipelineResult, PipelineStage, ProjectSpecification } from './types.ts';
import { PIPELINE_STAGES } from './types.ts';
import { markPipelineStage, serializeSpecification } from './specification.ts';

function artifact(
  stage: PipelineStage,
  path: string,
  kind: PipelineArtifact['kind'],
  description: string,
): PipelineArtifact {
  return { stage, path, kind, description };
}

/** Artifacts produced at each pipeline stage. */
export function artifactsForStage(spec: ProjectSpecification, stage: PipelineStage): PipelineArtifact[] {
  switch (stage) {
    case 'concept':
      return [artifact('concept', 'docs/CONCEPT.md', 'markdown', 'Creative concept and intent')];
    case 'specification':
      return [artifact('specification', 'project.json', 'json', 'Authoritative project specification')];
    case 'architecture':
      return [
        artifact('architecture', 'docs/ARCHITECTURE.md', 'markdown', 'System architecture'),
        artifact('architecture', 'docs/AI_CONTEXT.json', 'json', 'AI-readable project context'),
      ];
    case 'roadmap':
      return [artifact('roadmap', 'ROADMAP.md', 'markdown', 'Delivery roadmap')];
    case 'generation':
      return [
        artifact('generation', 'package.json', 'config', 'Project package manifest'),
        artifact('generation', 'platform.json', 'json', 'Platform client manifest'),
        artifact('generation', 'src/main.ts', 'code', 'Application entry'),
      ];
    case 'implementation':
      return [artifact('implementation', 'src/', 'code', 'Application source')];
    case 'testing':
      return [
        artifact('testing', 'scripts/validate.mjs', 'code', 'Validation script'),
        artifact('testing', 'docs/VALIDATION_CHECKLIST.md', 'markdown', 'Manual validation checklist'),
      ];
    case 'documentation':
      return [
        artifact('documentation', 'README.md', 'markdown', 'Project README'),
        artifact('documentation', 'CHANGELOG.md', 'markdown', 'Change log'),
      ];
    case 'deployment':
      return [
        artifact('deployment', 'vercel.json', 'config', 'Deployment config'),
        artifact('deployment', 'docs/DEPLOYMENT.md', 'markdown', 'Deployment guide'),
      ];
    case 'iteration':
      return [artifact('iteration', 'docs/ITERATION.md', 'markdown', 'Iteration notes and next steps')];
    default:
      return [];
  }
}

function generateConceptDoc(spec: ProjectSpecification): string {
  return `# Concept — ${spec.name}

${spec.description}

## Category

\`${spec.category}\`

## Engines

${spec.engines.map((e) => `- \`${e}\``).join('\n')}

## AI capabilities

${spec.aiCapabilities.map((c) => `- ${c}`).join('\n')}
`;
}

function generateArchitectureDoc(spec: ProjectSpecification): string {
  return `# Architecture — ${spec.name}

Lightweight client on the Plantasonic Creative Ecosystem.

## Layouts

${spec.layouts.map((l) => `- \`${l}\``).join('\n')}

## Components

${spec.components.map((c) => `- \`${c}\``).join('\n')}

## Quality requirements

${spec.qualityRequirements.map((q) => `- ${q}`).join('\n')}

See \`project.json\` for the authoritative specification.
`;
}

function generateRoadmap(spec: ProjectSpecification): string {
  return `# Roadmap — ${spec.name}

## Phase 1 — Scaffold ✅

Generated from \`project.json\` via Creative Studio pipeline.

## Phase 2 — Creative logic

Implement domain-specific behavior on shared platform infrastructure.

## Phase 3 — Polish

Performance, accessibility, deployment.
`;
}

function generateIterationDoc(spec: ProjectSpecification): string {
  const completed = Object.keys(spec.pipeline ?? {}).join(', ') || 'concept';
  return `# Iteration — ${spec.name}

Pipeline completed: ${completed}

Run \`validateWorkspace()\` before each iteration.
`;
}

/** Generate file content for pipeline stage artifacts. */
export function generateStageFiles(
  spec: ProjectSpecification,
  stage: PipelineStage,
): Array<{ path: string; content: string }> {
  const files: Array<{ path: string; content: string }> = [];
  switch (stage) {
    case 'concept':
      files.push({ path: 'docs/CONCEPT.md', content: generateConceptDoc(spec) });
      break;
    case 'specification':
      files.push({ path: 'project.json', content: serializeSpecification(spec) });
      break;
    case 'architecture':
      files.push({ path: 'docs/ARCHITECTURE.md', content: generateArchitectureDoc(spec) });
      files.push({
        path: 'docs/AI_CONTEXT.json',
        content: JSON.stringify({ project: spec.id, architecture: generateArchitectureDoc(spec) }, null, 2) + '\n',
      });
      break;
    case 'roadmap':
      files.push({ path: 'ROADMAP.md', content: generateRoadmap(spec) });
      break;
    case 'iteration':
      files.push({ path: 'docs/ITERATION.md', content: generateIterationDoc(spec) });
      break;
    default:
      break;
  }
  return files;
}

/** Run pipeline through a target stage (inclusive). */
export function runPipeline(
  spec: ProjectSpecification,
  throughStage: PipelineStage = 'generation',
): PipelineResult {
  const endIdx = PIPELINE_STAGES.indexOf(throughStage);
  if (endIdx < 0) throw new Error(`Unknown pipeline stage: ${throughStage}`);

  let current = spec;
  const artifacts: PipelineArtifact[] = [];

  for (let i = 0; i <= endIdx; i++) {
    const stage = PIPELINE_STAGES[i]!;
    current = markPipelineStage(current, stage);
    artifacts.push(...artifactsForStage(current, stage));
  }

  return {
    spec: current,
    stage: throughStage,
    artifacts,
    completedStages: PIPELINE_STAGES.slice(0, endIdx + 1),
  };
}
