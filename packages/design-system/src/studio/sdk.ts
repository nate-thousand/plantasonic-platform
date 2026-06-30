/**
 * Public Creative Studio SDK — orchestration APIs for apps and automation.
 */
import { generateSpecification } from './specification.ts';
import { planDependencyUpgrade } from './refactoring.ts';
import { generatePortfolioReport } from './portfolio.ts';
import { validateWorkspace as validateWs } from './validation.ts';
import type {
  AutomationSpec,
  CreativeWorkspace,
  OrchestrationResult,
  PipelineStage,
  PortfolioReport,
  ProjectSpecification,
  RefactoringPlan,
  WorkspaceValidationReport,
} from './types.ts';

export { STUDIO_VERSION, PIPELINE_STAGES } from './types.ts';
export { SPEC_VERSION } from './specification.ts';
export type {
  PipelineStage,
  ProjectSpecification,
  PipelineArtifact,
  PipelineResult,
  OrchestrationResult,
  CreativeWorkspace,
  WorkspaceProject,
  PortfolioReport,
  KnowledgeEntry,
  RefactoringPlan,
  AutomationSpec,
  AssetAnalysis,
  WorkspaceValidationReport,
} from './types.ts';

export {
  generateSpecification,
  parseSpecification,
  serializeSpecification,
  specToCreateConfig,
  syncSpecFromManifest,
  markPipelineStage,
} from './specification.ts';

export { runPipeline, artifactsForStage, generateStageFiles } from './pipeline.ts';

export { orchestrateProject, createProjectFromConcept, reproduceFromSpecification } from './orchestrator.ts';

export {
  classifyAsset,
  analyzeAsset,
  organizeAssets,
  registerAnalyzedAsset,
  findDuplicateAssets,
} from './asset-intelligence.ts';

export {
  KnowledgeRepository,
  knowledgeRepository,
  recordDecision,
  recordTechnicalDebt,
  exportKnowledge,
} from './knowledge.ts';

export {
  STUDIO_VALIDATION_GATES,
  validateSpecification,
  validateStudioProject,
  validateWorkspace,
  analyzeValidationImpact,
} from './validation.ts';

export {
  planDependencyUpgrade,
  planTokenMigration,
  planComponentReplacement,
  planEngineMigration,
  planDocumentationUpdate,
  analyzeRefactoringNeeds,
  refactoringImpactGraph,
} from './refactoring.ts';

export { generatePortfolioReport, sharedDependencyGraph } from './portfolio.ts';

export {
  WorkspaceManager,
  workspaceManager,
  loadWorkspace,
  loadWorkspaceFromFiles,
  workspaceCommands,
} from './workspace.ts';

export {
  AUTOMATION_CATALOG,
  getAutomations,
  getAutomation,
  runAutomation,
  reproduceProject,
  portfolioReport,
} from './automation.ts';

export const STUDIO_SDK_VERSION = '1.0.0';

/** Creative Studio architecture summary. */
export function getStudioArchitecture() {
  return {
    name: 'plantasonic-creative-studio',
    sdkVersion: STUDIO_SDK_VERSION,
    pipeline: [
      'concept',
      'specification',
      'architecture',
      'roadmap',
      'generation',
      'implementation',
      'testing',
      'documentation',
      'deployment',
      'iteration',
    ],
    authoritativeSpec: 'project.json',
    principles: [
      'Automate engineering — not human creativity',
      'Every stage produces structured artifacts',
      'Projects reproducible from specification',
      'Continuous validation throughout development',
      'Shared knowledge across portfolio',
    ],
  };
}

/** Alias for generateSpecification — stable API name from spec. */
export function generateSpecificationFromBrief(input: {
  name: string;
  concept?: string;
  brief?: string;
  category?: string;
}): ProjectSpecification {
  return generateSpecification(input);
}

/** Upgrade project — returns refactoring plan (safe preview before apply). */
export function upgradeProject(spec: ProjectSpecification, packageName: string, version: string): RefactoringPlan {
  return planDependencyUpgrade(spec, packageName, version);
}

/** Publish workspace — portfolio report + validation. */
export function publishWorkspace(workspace: CreativeWorkspace): {
  report: PortfolioReport;
  validation: WorkspaceValidationReport;
} {
  return {
    report: generatePortfolioReport(workspace),
    validation: validateWs(workspace),
  };
}

/** createProject alias — orchestrate from concept/brief. */
export { createProjectFromConcept as createStudioProject } from './orchestrator.ts';
