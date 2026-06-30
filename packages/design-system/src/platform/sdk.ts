/**
 * Public Platform SDK — unified creative ecosystem API.
 */
import type { CreateProjectConfig, EngineId, ProjectManifest } from './types.ts';
import type { CreateProjectResult } from './create-project.ts';

export { createProject, writeProject, scaffoldProject, publishPrototype, getProjectContext, generatePlatformFiles } from './create-project.ts';
export type { CreateProjectResult, PublishResult } from './create-project.ts';

export { getEngines, getEngine, installEngine, resolveEngineInstall, enginesForPrototype, ENGINE_CATALOG } from './engines.ts';

export { registerAsset, defineAsset, assetRegistry, AssetRegistry } from './assets.ts';

export { definePreset, exportPresets, importPresets, presetRegistry, PresetRegistry } from './presets.ts';

export { registerWorkflow, getWorkflows, workflowRegistry, WORKFLOW_CATALOG } from './workflows.ts';

export { getServices, getService, defaultServices, createPlatformServices, generateServicesBootstrap, SERVICE_CATALOG } from './services.ts';

export { registerProject, createManifest, projectRegistry, ProjectRegistry } from './projects.ts';

export {
  defineEcosystemPlugin,
  createEcosystemPluginHost,
  installPlugin,
  type EcosystemPlugin,
  type EcosystemPluginHost,
} from './ecosystem-plugins.ts';

export { getDeploymentTargets, generateVercelConfig, generateDeployDocs, markDeployed, DEPLOYMENT_TARGETS } from './deployment.ts';

export { validateProject, validateProjectFiles, validateManifest, QUALITY_GATES, generateQualityConfig } from './quality.ts';

export { buildProjectContext, buildEcosystemContext, exportProjectContext } from './collaboration.ts';

export const PLATFORM_SDK_VERSION = '1.0.0';

/** Convenience: full ecosystem summary. */
export function getPlatformArchitecture() {
  return {
    name: 'plantasonic-creative-ecosystem',
    sdkVersion: PLATFORM_SDK_VERSION,
    layers: [
      { id: 'design-system', purpose: 'Tokens, components, layouts, motion, shell.' },
      { id: 'ai', purpose: 'Registry, validation, documentation, knowledge graph.' },
      { id: 'prototype', purpose: 'Prototype generation and scaffolding.' },
      { id: 'platform', purpose: 'Engines, assets, presets, workflows, projects, services, deployment, quality.' },
    ],
    principles: [
      'Applications are lightweight clients',
      'Install engines — never embed',
      'Reference shared assets — never duplicate',
      'Invoke workflows — never reimplement',
      'Use platform services — never rebuild locally',
    ],
  };
}

export type { CreateProjectConfig, EngineId, ProjectManifest, CreateProjectResult };
