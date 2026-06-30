/**
 * Plantasonic Design System — Unified Creative Ecosystem Platform.
 *
 * Every application is a lightweight client consuming shared engines, assets,
 * plugins, workflows, and services.
 *
 *   import { createProject, installEngine, validateProject } from 'plantasonic-design-system/platform';
 */

export type {
  PlatformStatus,
  EngineId,
  AssetKind,
  DeploymentTarget,
  DeploymentStatus,
  ServiceId,
  EngineSpec,
  AssetRef,
  PresetRecord,
  WorkflowSpec,
  ProjectManifest,
  CreateProjectConfig,
  ProjectContext,
  PlatformValidationCheck,
  PlatformValidationReport,
} from './types.ts';

export type { CreateProjectResult, PublishResult } from './create-project.ts';
export type {
  EcosystemPlugin,
  EcosystemPluginHost,
  PanelContribution,
  RendererContribution,
  EffectContribution,
  ValidationRuleContribution,
  EcosystemContributions,
} from './ecosystem-plugins.ts';
export type { DeploymentSpec } from './deployment.ts';
export type { PlatformServiceSpec } from './services.ts';

export {
  PLATFORM_SDK_VERSION,
  getPlatformArchitecture,
  createProject,
  writeProject,
  scaffoldProject,
  publishPrototype,
  getProjectContext,
  generatePlatformFiles,
  getEngines,
  getEngine,
  installEngine,
  resolveEngineInstall,
  enginesForPrototype,
  ENGINE_CATALOG,
  registerAsset,
  defineAsset,
  assetRegistry,
  AssetRegistry,
  definePreset,
  exportPresets,
  importPresets,
  presetRegistry,
  PresetRegistry,
  registerWorkflow,
  getWorkflows,
  workflowRegistry,
  WORKFLOW_CATALOG,
  getServices,
  getService,
  defaultServices,
  createPlatformServices,
  generateServicesBootstrap,
  SERVICE_CATALOG,
  registerProject,
  createManifest,
  projectRegistry,
  ProjectRegistry,
  defineEcosystemPlugin,
  createEcosystemPluginHost,
  installPlugin,
  getDeploymentTargets,
  generateVercelConfig,
  generateDeployDocs,
  markDeployed,
  DEPLOYMENT_TARGETS,
  validateProject,
  validateProjectFiles,
  validateManifest,
  QUALITY_GATES,
  generateQualityConfig,
  buildProjectContext,
  buildEcosystemContext,
  exportProjectContext,
} from './sdk.ts';
