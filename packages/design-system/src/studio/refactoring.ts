/**
 * Intelligent refactoring — safe migrations with impact analysis before implementation.
 */
import { getImpact, getKnowledgeGraph } from '../ai/sdk.ts';
import { ENGINE_CATALOG } from '../platform/engines.ts';
import type { EngineId, ProjectSpecification } from '../platform/types.ts';
import type { RefactoringPlan } from './types.ts';

/** Analyze dependency upgrade impact across a project. */
export function planDependencyUpgrade(
  spec: ProjectSpecification,
  packageName: string,
  targetVersion: string,
): RefactoringPlan {
  const steps = [
    `Update ${packageName} to ${targetVersion} in package.json`,
    'Run validateWorkspace() and npm run validate',
    'Update CHANGELOG.md under [Unreleased]',
  ];
  if (packageName === 'plantasonic-design-system') {
    steps.push('Review token migration guide', 'Run compliance audit on all CSS/SCSS');
  }
  return {
    id: `upgrade.${packageName}`,
    kind: 'dependency-upgrade',
    description: `Upgrade ${packageName} to ${targetVersion}`,
    steps,
    impact: spec.engines.map((e) => `Engine ${e} may require adapter changes`),
    safe: packageName !== 'plantasonic-design-system',
  };
}

/** Plan token migration using impact analysis. */
export function planTokenMigration(tokenId: string): RefactoringPlan {
  const impact = getImpact(tokenId);
  return {
    id: `token.${tokenId}`,
    kind: 'token-migration',
    description: `Migrate usages of ${tokenId}`,
    steps: [
      `Search for ${tokenId} references`,
      'Replace with new token path',
      'Run validateApplication() on affected files',
    ],
    impact: impact.transitiveDependents,
    safe: impact.transitiveDependents.length < 10,
  };
}

/** Plan component replacement. */
export function planComponentReplacement(fromId: string, toId: string): RefactoringPlan {
  const impact = getImpact(fromId);
  return {
    id: `component.${fromId}-to-${toId}`,
    kind: 'component-replacement',
    description: `Replace ${fromId} with ${toId}`,
    steps: [
      `Find all ${fromId} usages via registry`,
      `Swap to ${toId} API`,
      'Update documentation and showcase',
    ],
    impact: impact.transitiveDependents,
    safe: impact.transitiveDependents.length < 5,
  };
}

/** Plan engine version migration. */
export function planEngineMigration(engineId: EngineId, targetVersion: string): RefactoringPlan {
  const spec = ENGINE_CATALOG.find((e) => e.id === engineId);
  return {
    id: `engine.${engineId}`,
    kind: 'api-migration',
    description: `Migrate ${spec?.name ?? engineId} to ${targetVersion}`,
    steps: [
      `Update ${spec?.package ?? engineId} dependency`,
      'Review adapter contract in src/platform/engines.ts',
      'Run engine-specific verification scripts',
    ],
    impact: [`All projects using ${engineId}`],
    safe: spec?.status === 'stable',
  };
}

/** Generate documentation update plan after API changes. */
export function planDocumentationUpdate(changedIds: string[]): RefactoringPlan {
  return {
    id: 'docs.sync',
    kind: 'documentation',
    description: 'Update documentation after API changes',
    steps: [
      'Regenerate AI context (npm run ai:context)',
      'Update affected platform guides',
      'Refresh CHANGELOG [Unreleased]',
    ],
    impact: changedIds,
    safe: true,
  };
}

/** List refactoring plans recommended for a specification. */
export function analyzeRefactoringNeeds(spec: ProjectSpecification): RefactoringPlan[] {
  const plans: RefactoringPlan[] = [
    planDependencyUpgrade(spec, 'plantasonic-design-system', 'latest'),
  ];
  for (const engineId of spec.engines) {
    const engine = ENGINE_CATALOG.find((e) => e.id === engineId);
    if (engine?.status === 'experimental') {
      plans.push(planEngineMigration(engineId, engine.version));
    }
  }
  return plans;
}

/** Export knowledge graph nodes affected by a change. */
export function refactoringImpactGraph(id: string) {
  return {
    impact: getImpact(id),
    graph: getKnowledgeGraph(),
  };
}
