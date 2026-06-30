/**
 * Project Registry — track every prototype in the ecosystem.
 */
import type { DeploymentStatus, DeploymentTarget, EngineId, ProjectManifest, ServiceId } from './types.ts';

export class ProjectRegistry {
  #projects = new Map<string, ProjectManifest>();

  register(manifest: ProjectManifest): this {
    this.#projects.set(manifest.id, manifest);
    return this;
  }

  get(id: string): ProjectManifest | undefined {
    return this.#projects.get(id);
  }

  all(): ProjectManifest[] {
    return [...this.#projects.values()];
  }

  byType(type: string): ProjectManifest[] {
    return this.all().filter((p) => p.type === type);
  }

  byEngine(engineId: EngineId): ProjectManifest[] {
    return this.all().filter((p) => p.engines.includes(engineId));
  }

  byDeploymentStatus(status: DeploymentStatus): ProjectManifest[] {
    return this.all().filter((p) => p.deployment.status === status);
  }

  /** Cross-project dependency analysis — which projects share an engine. */
  engineUsage(): Map<EngineId, string[]> {
    const map = new Map<EngineId, string[]>();
    for (const p of this.all()) {
      for (const e of p.engines) {
        if (!map.has(e)) map.set(e, []);
        map.get(e)!.push(p.id);
      }
    }
    return map;
  }
}

export const projectRegistry = new ProjectRegistry();

export function registerProject(manifest: ProjectManifest): ProjectManifest {
  projectRegistry.register(manifest);
  return manifest;
}

export function createManifest(partial: {
  id: string;
  name: string;
  type: string;
  version?: string;
  description?: string;
  layout?: string;
  engines?: EngineId[];
  plugins?: string[];
  assets?: string[];
  workflows?: string[];
  services?: ServiceId[];
  dependencies?: Record<string, string>;
  deployment?: { target?: DeploymentTarget; status?: DeploymentStatus; url?: string };
}): ProjectManifest {
  const now = new Date().toISOString();
  const manifest: ProjectManifest = {
    version: partial.version ?? '0.1.0',
    description: partial.description,
    layout: partial.layout,
    engines: partial.engines ?? [],
    plugins: partial.plugins ?? [],
    assets: partial.assets ?? [],
    workflows: partial.workflows ?? [],
    services: partial.services ?? [],
    dependencies: partial.dependencies ?? { 'plantasonic-design-system': 'latest' },
    documentation: ['README.md', 'ROADMAP.md', 'CHANGELOG.md', 'docs/VALIDATION_CHECKLIST.md'],
    deployment: {
      target: partial.deployment?.target ?? 'local',
      status: partial.deployment?.status ?? 'local',
      url: partial.deployment?.url,
    },
    createdAt: now,
    updatedAt: now,
    id: partial.id,
    name: partial.name,
    type: partial.type,
  };
  return registerProject(manifest);
}
