/**
 * Automation framework — reusable studio workflows.
 */
import { createProjectFromConcept, reproduceFromSpecification } from './orchestrator.ts';
import { generatePortfolioReport } from './portfolio.ts';
import { validateWorkspace, validateStudioProject } from './validation.ts';
import { planDependencyUpgrade, planDocumentationUpdate } from './refactoring.ts';
import { runPipeline } from './pipeline.ts';
import { generateSpecification, parseSpecification } from './specification.ts';
import type { AutomationSpec, CreativeWorkspace, OrchestrationResult, PipelineStage } from './types.ts';

export const AUTOMATION_CATALOG: AutomationSpec[] = [
  {
    id: 'automation.create-prototype',
    name: 'Create New Prototype',
    purpose: 'Concept → specification → generated project via full pipeline.',
    invoke: 'studio.createProjectFromConcept',
    pipelineStages: ['concept', 'specification', 'generation'],
  },
  {
    id: 'automation.upgrade-design-system',
    name: 'Upgrade Design System',
    purpose: 'Plan DS upgrade with impact analysis and migration steps.',
    invoke: 'studio.planDependencyUpgrade',
  },
  {
    id: 'automation.update-dependencies',
    name: 'Update Dependencies',
    purpose: 'Analyze and plan dependency upgrades across portfolio.',
    invoke: 'studio.analyzeRefactoringNeeds',
  },
  {
    id: 'automation.generate-documentation',
    name: 'Generate Documentation',
    purpose: 'Run documentation pipeline stage for a project.',
    invoke: 'studio.runPipeline',
    pipelineStages: ['documentation'],
  },
  {
    id: 'automation.publish-packages',
    name: 'Publish Packages',
    purpose: 'Prepare release notes and changelog for package publish.',
    invoke: 'studio.planDocumentationUpdate',
  },
  {
    id: 'automation.deploy-applications',
    name: 'Deploy Applications',
    purpose: 'Run deployment pipeline stage.',
    invoke: 'studio.runPipeline',
    pipelineStages: ['deployment'],
  },
  {
    id: 'automation.generate-release-notes',
    name: 'Generate Release Notes',
    purpose: 'Documentation update plan for releases.',
    invoke: 'studio.planDocumentationUpdate',
  },
  {
    id: 'automation.create-migration-guide',
    name: 'Create Migration Guide',
    purpose: 'Generate migration documentation from refactoring plan.',
    invoke: 'studio.planTokenMigration',
  },
  {
    id: 'automation.quality-audit',
    name: 'Run Quality Audit',
    purpose: 'Validate workspace or project against all quality gates.',
    invoke: 'studio.validateWorkspace',
  },
];

const catalog = new Map(AUTOMATION_CATALOG.map((a) => [a.id, a]));

export function getAutomations(): AutomationSpec[] {
  return [...AUTOMATION_CATALOG];
}

export function getAutomation(id: string): AutomationSpec | undefined {
  return catalog.get(id);
}

export interface AutomationRunResult {
  automationId: string;
  ok: boolean;
  output: unknown;
}

/** Run a named automation by id. */
export function runAutomation(id: string, input: Record<string, unknown> = {}): AutomationRunResult {
  switch (id) {
    case 'automation.create-prototype': {
      const result = createProjectFromConcept({
        name: String(input.name ?? 'Untitled'),
        concept: input.concept ? String(input.concept) : undefined,
        brief: input.brief ? String(input.brief) : undefined,
        category: input.category ? String(input.category) : undefined,
      });
      return { automationId: id, ok: result.validation.ok, output: result };
    }
    case 'automation.generate-documentation': {
      const spec = input.spec
        ? typeof input.spec === 'string'
          ? parseSpecification(input.spec)
          : (input.spec as import('./types.ts').ProjectSpecification)
        : generateSpecification({ name: 'Demo' });
      const pipeline = runPipeline(spec, 'documentation');
      return { automationId: id, ok: true, output: pipeline };
    }
    case 'automation.quality-audit': {
      const workspace = input.workspace as CreativeWorkspace | undefined;
      if (!workspace) return { automationId: id, ok: false, output: { error: 'workspace required' } };
      const report = validateWorkspace(workspace);
      return { automationId: id, ok: report.ok, output: report };
    }
    case 'automation.upgrade-design-system': {
      const spec = generateSpecification({ name: String(input.name ?? 'project') });
      const plan = planDependencyUpgrade(spec, 'plantasonic-design-system', String(input.version ?? 'latest'));
      return { automationId: id, ok: true, output: plan };
    }
    case 'automation.generate-release-notes': {
      const plan = planDocumentationUpdate((input.changedIds as string[]) ?? []);
      return { automationId: id, ok: true, output: plan };
    }
    default:
      return { automationId: id, ok: false, output: { error: `Unknown automation: ${id}` } };
  }
}

/** Reproduce project from project.json (automation helper). */
export function reproduceProject(json: string): OrchestrationResult {
  return reproduceFromSpecification(parseSpecification(json));
}

export function portfolioReport(workspace?: CreativeWorkspace) {
  return generatePortfolioReport(workspace);
}

export type { PipelineStage };
