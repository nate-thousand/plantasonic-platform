/**
 * Creative workspace — multi-project development environment.
 */
import { projectRegistry } from '../platform/projects.ts';
import type { CreativeWorkspace, ProjectSpecification, WorkspaceProject } from './types.ts';
import { parseSpecification } from './specification.ts';
import { validateWorkspace } from './validation.ts';

export class WorkspaceManager {
  #workspaces = new Map<string, CreativeWorkspace>();

  create(id: string, name: string): CreativeWorkspace {
    const workspace: CreativeWorkspace = {
      id,
      name,
      projects: [],
      sharedAssets: [],
      sharedEngines: [],
    };
    this.#workspaces.set(id, workspace);
    return workspace;
  }

  get(id: string): CreativeWorkspace | undefined {
    return this.#workspaces.get(id);
  }

  addProject(workspaceId: string, spec: ProjectSpecification, rootDir?: string): CreativeWorkspace {
    const ws = this.#workspaces.get(workspaceId);
    if (!ws) throw new Error(`Unknown workspace: ${workspaceId}`);

    const manifest = projectRegistry.get(spec.id);
    const entry: WorkspaceProject = { spec, active: true };
    if (manifest) entry.manifest = manifest;
    if (rootDir) entry.rootDir = rootDir;

    ws.projects.push(entry);
    ws.sharedEngines = [...new Set([...ws.sharedEngines, ...spec.engines])];
    ws.sharedAssets = [...new Set([...ws.sharedAssets, ...spec.assets])];
    if (!ws.activeProjectId) ws.activeProjectId = spec.id;

    return ws;
  }

  switchProject(workspaceId: string, projectId: string): CreativeWorkspace {
    const ws = this.#workspaces.get(workspaceId);
    if (!ws) throw new Error(`Unknown workspace: ${workspaceId}`);
    const found = ws.projects.some((p) => p.spec.id === projectId);
    if (!found) throw new Error(`Project ${projectId} not in workspace ${workspaceId}`);
    ws.activeProjectId = projectId;
    for (const p of ws.projects) p.active = p.spec.id === projectId;
    return ws;
  }

  search(workspaceId: string, query: string): WorkspaceProject[] {
    const ws = this.#workspaces.get(workspaceId);
    if (!ws) return [];
    const q = query.toLowerCase();
    return ws.projects.filter(
      (p) =>
        p.spec.name.toLowerCase().includes(q) ||
        p.spec.description.toLowerCase().includes(q) ||
        p.spec.category.includes(q),
    );
  }

  all(): CreativeWorkspace[] {
    return [...this.#workspaces.values()];
  }
}

export const workspaceManager = new WorkspaceManager();

/** Load or create a creative workspace from project specifications. */
export function loadWorkspace(
  id: string,
  name: string,
  specs: ProjectSpecification[],
): CreativeWorkspace {
  let ws = workspaceManager.get(id);
  if (!ws) ws = workspaceManager.create(id, name);
  for (const spec of specs) {
    workspaceManager.addProject(id, spec);
  }
  return ws;
}

/** Load workspace from project.json files. */
export function loadWorkspaceFromFiles(
  id: string,
  name: string,
  projectJsonContents: string[],
): CreativeWorkspace {
  const specs = projectJsonContents.map(parseSpecification);
  return loadWorkspace(id, name, specs);
}

/** Global command palette entries for workspace navigation. */
export function workspaceCommands(workspace: CreativeWorkspace): Array<{ id: string; label: string; action: string }> {
  const commands = workspace.projects.map((p) => ({
    id: `switch:${p.spec.id}`,
    label: `Open ${p.spec.name}`,
    action: `workspace.switch('${workspace.id}', '${p.spec.id}')`,
  }));
  commands.push({
    id: 'validate',
    label: 'Validate workspace',
    action: `validateWorkspace('${workspace.id}')`,
  });
  return commands;
}

export { validateWorkspace };
