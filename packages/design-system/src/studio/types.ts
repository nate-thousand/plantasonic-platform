/**
 * Autonomous Creative Studio — types for the full creative lifecycle.
 */
import type {
  AssetKind,
  DeploymentTarget,
  EngineId,
  PlatformValidationReport,
  ProjectManifest,
  ServiceId,
} from '../platform/types.ts';

export const STUDIO_VERSION = '1.0.0';

/** End-to-end creative pipeline stages. */
export type PipelineStage =
  | 'concept'
  | 'specification'
  | 'architecture'
  | 'roadmap'
  | 'generation'
  | 'implementation'
  | 'testing'
  | 'documentation'
  | 'deployment'
  | 'iteration';

export const PIPELINE_STAGES: PipelineStage[] = [
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
];

/** Authoritative project specification (project.json). */
export interface ProjectSpecification {
  /** Schema version for migrations. */
  specVersion: string;
  id: string;
  name: string;
  description: string;
  /** Prototype / application category. */
  category: string;
  version: string;
  /** Creative concept — human-authored intent. */
  concept?: string;
  /** Written brief for AI / spec parser. */
  brief?: string;
  engines: EngineId[];
  layouts: string[];
  components: string[];
  plugins: string[];
  assets: string[];
  /** AI capabilities enabled for this project. */
  aiCapabilities: string[];
  deploymentTargets: DeploymentTarget[];
  documentation: string[];
  qualityRequirements: string[];
  services?: ServiceId[];
  workflows?: string[];
  /** Pipeline stage completion timestamps. */
  pipeline?: Partial<Record<PipelineStage, string>>;
  createdAt: string;
  updatedAt: string;
}

export interface PipelineArtifact {
  stage: PipelineStage;
  path: string;
  kind: 'json' | 'markdown' | 'code' | 'config';
  description: string;
}

export interface PipelineResult {
  spec: ProjectSpecification;
  stage: PipelineStage;
  artifacts: PipelineArtifact[];
  completedStages: PipelineStage[];
}

export interface AssetAnalysis {
  id: string;
  kind: AssetKind;
  uri: string;
  tags: string[];
  metadata: Record<string, unknown>;
  duplicates?: string[];
  dependencies?: string[];
}

export interface KnowledgeEntry {
  id: string;
  type: 'decision' | 'rationale' | 'api-evolution' | 'migration' | 'roadmap' | 'debt' | 'principle' | 'practice';
  title: string;
  body: string;
  projectId?: string;
  tags: string[];
  createdAt: string;
}

export interface RefactoringPlan {
  id: string;
  kind: 'dependency-upgrade' | 'api-migration' | 'component-replacement' | 'token-migration' | 'layout-migration' | 'documentation';
  description: string;
  steps: string[];
  impact: string[];
  safe: boolean;
}

export interface PortfolioReport {
  generatedAt: string;
  activeProjects: number;
  projects: Array<{
    id: string;
    name: string;
    category: string;
    version: string;
    engines: EngineId[];
    deploymentStatus: string;
    documentationCoverage: number;
    pipelineStage?: PipelineStage;
  }>;
  sharedDependencies: Record<string, string[]>;
  engineVersions: Record<string, string[]>;
  technicalDebt: KnowledgeEntry[];
}

export interface WorkspaceProject {
  spec: ProjectSpecification;
  manifest?: ProjectManifest;
  rootDir?: string;
  active: boolean;
}

export interface CreativeWorkspace {
  id: string;
  name: string;
  projects: WorkspaceProject[];
  sharedAssets: string[];
  sharedEngines: EngineId[];
  activeProjectId?: string;
}

export interface WorkspaceValidationReport {
  ok: boolean;
  workspace: string;
  projects: Array<{ id: string; report: PlatformValidationReport }>;
  checks: Array<{ id: string; label: string; ok: boolean; message?: string }>;
}

export interface AutomationSpec {
  id: string;
  name: string;
  purpose: string;
  invoke: string;
  pipelineStages?: PipelineStage[];
}

export interface OrchestrationResult {
  spec: ProjectSpecification;
  manifest: ProjectManifest;
  files: Array<{ path: string; content: string }>;
  artifacts: PipelineArtifact[];
  validation: PlatformValidationReport;
}
