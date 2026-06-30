/**
 * AI Collaboration Layer — expose full project context for AI tools.
 */
import { getArchitecture } from '../ai/sdk.ts';
import type { ProjectManifest, ProjectContext } from './types.ts';
import { projectRegistry } from './projects.ts';
import { getEngines, resolveEngineInstall } from './engines.ts';
import { assetRegistry } from './assets.ts';
import { presetRegistry } from './presets.ts';
import { workflowRegistry } from './workflows.ts';

/** Build AI-readable context for a single project. */
export function buildProjectContext(manifest: ProjectManifest): ProjectContext {
  const engines = resolveEngineInstall(manifest.engines);
  return {
    manifest,
    architecture: {
      platform: 'plantasonic-design-system',
      layer: 'creative-ecosystem',
      type: manifest.type,
      layout: manifest.layout,
      shellVariant: manifest.layout?.includes('instrument') || manifest.layout?.includes('canvas') ? 'instrument' : 'standard',
      engines: engines.map((e) => ({ id: e.id, name: e.name, package: e.package, status: e.status })),
      plugins: manifest.plugins,
      workflows: manifest.workflows.map((id) => workflowRegistry.get(id)),
      services: manifest.services,
      deployment: manifest.deployment,
    },
    ai: {
      designSystem: getArchitecture(),
      components: manifest.dependencies,
      documentation: manifest.documentation,
      roadmap: `See ROADMAP.md in project ${manifest.id}`,
      validation: manifest.documentation.includes('docs/VALIDATION_CHECKLIST.md'),
    },
  };
}

/** Ecosystem-wide context for AI agents managing multiple projects. */
export function buildEcosystemContext() {
  return {
    generatedAt: new Date().toISOString(),
    designSystem: getArchitecture(),
    projects: projectRegistry.all().map((m) => buildProjectContext(m)),
    engines: getEngines(),
    assets: assetRegistry.all(),
    presets: presetRegistry.all(),
    workflows: workflowRegistry.all(),
    engineUsage: Object.fromEntries(projectRegistry.engineUsage()),
  };
}

/** Serialize project context to JSON (for generated/ai/project context export). */
export function exportProjectContext(manifest: ProjectManifest): string {
  return JSON.stringify(buildProjectContext(manifest), null, 2);
}
