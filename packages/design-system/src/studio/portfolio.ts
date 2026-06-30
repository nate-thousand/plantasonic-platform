/**
 * Portfolio management — ecosystem-wide reporting across projects.
 */
import { projectRegistry } from '../platform/projects.ts';
import { ENGINE_CATALOG } from '../platform/engines.ts';
import { knowledgeRepository } from './knowledge.ts';
import type { PipelineStage, PortfolioReport, ProjectSpecification } from './types.ts';
import type { CreativeWorkspace } from './types.ts';

/** Compute documentation coverage ratio (0–1). */
function documentationCoverage(spec: ProjectSpecification): number {
  const required = ['README.md', 'ROADMAP.md', 'CHANGELOG.md', 'project.json'];
  const present = required.filter((d) => spec.documentation.includes(d)).length;
  return present / required.length;
}

/** Latest pipeline stage from spec. */
function latestStage(spec: ProjectSpecification): PipelineStage | undefined {
  const stages = Object.keys(spec.pipeline ?? {}) as PipelineStage[];
  return stages[stages.length - 1];
}

/** Generate portfolio report from workspace or global registry. */
export function generatePortfolioReport(workspace?: CreativeWorkspace): PortfolioReport {
  const projects = workspace
    ? workspace.projects.map((p) => p.spec)
    : projectRegistry.all().map((m) => ({
        specVersion: '1.0.0',
        id: m.id,
        name: m.name,
        description: m.description ?? '',
        category: m.type,
        version: m.version,
        engines: m.engines,
        layouts: m.layout ? [m.layout] : [],
        components: [],
        plugins: m.plugins,
        assets: m.assets,
        aiCapabilities: [],
        deploymentTargets: [m.deployment.target],
        documentation: m.documentation,
        qualityRequirements: [],
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
      }));

  const sharedDependencies: Record<string, string[]> = {};
  for (const spec of projects) {
    for (const engine of spec.engines) {
      if (!sharedDependencies[engine]) sharedDependencies[engine] = [];
      sharedDependencies[engine]!.push(spec.id);
    }
  }

  const engineVersions: Record<string, string[]> = {};
  for (const engine of ENGINE_CATALOG) {
    const users = sharedDependencies[engine.id] ?? [];
    if (users.length) engineVersions[engine.id] = users;
  }

  return {
    generatedAt: new Date().toISOString(),
    activeProjects: projects.length,
    projects: projects.map((spec) => ({
      id: spec.id,
      name: spec.name,
      category: spec.category,
      version: spec.version,
      engines: spec.engines,
      deploymentStatus: spec.deploymentTargets[0] ?? 'local',
      documentationCoverage: documentationCoverage(spec),
      pipelineStage: latestStage(spec),
    })),
    sharedDependencies,
    engineVersions,
    technicalDebt: knowledgeRepository.byType('debt'),
  };
}

/** Track shared dependency usage across portfolio. */
export function sharedDependencyGraph(workspace: CreativeWorkspace): Record<string, string[]> {
  const graph: Record<string, string[]> = {};
  for (const project of workspace.projects) {
    for (const engine of project.spec.engines) {
      if (!graph[engine]) graph[engine] = [];
      graph[engine]!.push(project.spec.id);
    }
    for (const plugin of project.spec.plugins) {
      const key = `plugin:${plugin}`;
      if (!graph[key]) graph[key] = [];
      graph[key]!.push(project.spec.id);
    }
  }
  return graph;
}
