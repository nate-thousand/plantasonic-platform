/**
 * Continuous validation — architecture, tokens, components, performance, a11y, docs.
 */
import { validateApplication } from '../ai/validate.ts';
import { getImpact } from '../ai/sdk.ts';
import { validateManifest, validateProjectFiles, QUALITY_GATES } from '../platform/quality.ts';
import { resolveEngineInstall } from '../platform/engines.ts';
import type { PlatformValidationCheck, ProjectManifest } from '../platform/types.ts';
import type { ProjectSpecification, WorkspaceValidationReport, CreativeWorkspace } from './types.ts';

function check(id: string, label: string, ok: boolean, message?: string): PlatformValidationCheck {
  const c: PlatformValidationCheck = { id, label, ok };
  if (message !== undefined) c.message = message;
  return c;
}

/** Extended validation gates for Creative Studio. */
export const STUDIO_VALIDATION_GATES = [
  ...QUALITY_GATES,
  { id: 'architecture', label: 'Architecture compliance' },
  { id: 'performance', label: 'Performance constraints documented' },
  { id: 'plugin-compat', label: 'Plugin compatibility' },
  { id: 'engine-compat', label: 'Engine compatibility' },
  { id: 'spec-sync', label: 'Specification / manifest sync' },
] as const;

/** Validate project specification against platform rules. */
export function validateSpecification(spec: ProjectSpecification) {
  const checks: PlatformValidationCheck[] = [
    check('spec:version', 'Spec version set', !!spec.specVersion),
    check('spec:engines', 'Engines declared', spec.engines.length > 0),
    check('spec:layouts', 'Layouts declared', spec.layouts.length > 0),
    check('spec:quality', 'Quality requirements listed', spec.qualityRequirements.length > 0),
    check('spec:deploy', 'Deployment targets listed', spec.deploymentTargets.length > 0),
  ];

  for (const engineId of spec.engines) {
    try {
      resolveEngineInstall([engineId]);
      checks.push(check(`engine:${engineId}`, `Engine ${engineId} resolvable`, true));
    } catch (e) {
      checks.push(check(`engine:${engineId}`, `Engine ${engineId} resolvable`, false, String(e)));
    }
  }

  return { ok: checks.every((c) => c.ok), checks };
}

/** Validate generated files + spec + compliance (continuous validation hook). */
export function validateStudioProject(
  files: Array<{ path: string; content: string }>,
  spec: ProjectSpecification,
  manifest: ProjectManifest,
) {
  const checks: PlatformValidationCheck[] = [];

  const platform = validateProjectFiles(files, manifest);
  checks.push(...platform.checks);

  const specReport = validateSpecification(spec);
  checks.push(...specReport.checks);

  checks.push(
    check('spec:file', 'project.json present', files.some((f) => f.path === 'project.json')),
    check('spec:sync', 'Spec engines match manifest', JSON.stringify(spec.engines.sort()) === JSON.stringify(manifest.engines.sort())),
  );

  const cssFiles = files.filter((f) => /\.(css|scss|ts)$/.test(f.path));
  const compliance = validateApplication(cssFiles);
  checks.push(
    check('a11y:compliance', 'Accessibility / token compliance', compliance.errorCount === 0, `${compliance.warningCount} warnings`),
  );

  return { ok: checks.every((c) => c.ok), checks };
}

/** Validate entire creative workspace. */
export function validateWorkspace(workspace: CreativeWorkspace): WorkspaceValidationReport {
  const checks: Array<{ id: string; label: string; ok: boolean; message?: string }> = [];
  const projectReports: WorkspaceValidationReport['projects'] = [];

  checks.push(
    check('workspace:id', 'Workspace id set', !!workspace.id),
    check('workspace:projects', 'At least one project', workspace.projects.length > 0),
  );

  for (const project of workspace.projects) {
    const specReport = validateSpecification(project.spec);
    projectReports.push({ id: project.spec.id, report: specReport });
    if (project.manifest) {
      const manifestReport = validateManifest(project.manifest);
      projectReports.push({ id: `${project.spec.id}:manifest`, report: manifestReport });
    }
  }

  const allOk = checks.every((c) => c.ok) && projectReports.every((p) => p.report.ok);

  return {
    ok: allOk,
    workspace: workspace.id,
    projects: projectReports,
    checks,
  };
}

/** Preview impact before ecosystem changes. */
export function analyzeValidationImpact(componentOrTokenId: string) {
  return getImpact(componentOrTokenId);
}
