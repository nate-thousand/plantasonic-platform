import type {
  AudioReactiveBridge,
  PerformanceControlManager,
  PresetBundleRegistry,
  ProjectApplyResult,
  ProjectState,
  ProjectValidationResult,
  SerializedProject,
  SoundEngineAdapter,
  UIState,
  VisualEngineAdapter,
  Workspace,
  WorkspaceState,
} from '@plantasonic/platform-types';

import { DEFAULT_AUDIO_REACTIVE_MAPPINGS } from './audioReactiveBridge.js';
import { DEFAULT_PERFORMANCE_MAPPINGS } from './performanceControls.js';
import type { PluginManagerWithServices } from './pluginManager.js';
import { applyWorkspacePresetToRegions } from './presetBundleRegistry.js';

/** Current project state schema version */
export const PROJECT_STATE_VERSION = '1.0.0';

export class ProjectValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProjectValidationError';
  }
}

/** Services used to capture and apply project state */
export interface ProjectStateContext {
  applicationId?: string;
  presetBundles?: PresetBundleRegistry;
  sound?: SoundEngineAdapter;
  visual?: VisualEngineAdapter;
  bridge?: AudioReactiveBridge;
  performance?: PerformanceControlManager;
  pluginManager?: PluginManagerWithServices;
  workspace?: Workspace;
  /** Optional UI hooks supplied by the application layer */
  collectUIState?: () => UIState;
  applyUIState?: (state: UIState) => void | Promise<void>;
}

function defaultBridgeState(): ProjectState['bridge'] {
  return {
    enabled: false,
    sensitivity: 0.75,
    smoothing: 0.65,
    mappings: DEFAULT_AUDIO_REACTIVE_MAPPINGS.map((mapping) => ({ ...mapping })),
  };
}

function defaultPerformanceState(): ProjectState['performance'] {
  return {
    performanceModeEnabled: false,
    mappings: DEFAULT_PERFORMANCE_MAPPINGS.map((mapping) => ({ ...mapping })),
  };
}

/** Default empty project state */
export function createDefaultProjectState(applicationId?: string): ProjectState {
  return {
    version: PROJECT_STATE_VERSION,
    applicationId,
    activePresetBundleId: null,
    sound: { presetId: null, parameters: {} },
    visual: { presetId: null, parameters: {} },
    bridge: defaultBridgeState(),
    workspace: {},
    plugins: [],
    performance: defaultPerformanceState(),
    ui: {},
  };
}

/** Capture current project state from platform managers */
export function captureProjectState(context: ProjectStateContext): ProjectState {
  const { sound, visual, bridge, performance, pluginManager, presetBundles, workspace } =
    context;

  const bridgeStatus = bridge?.getStatus();
  const performanceStatus = performance?.getStatus();
  const ui = context.collectUIState?.() ?? {};

  const workspaceState = captureWorkspaceState(workspace, ui);

  return {
    version: PROJECT_STATE_VERSION,
    applicationId: context.applicationId,
    activePresetBundleId: presetBundles?.getActiveBundleId() ?? null,
    sound: {
      presetId: sound?.getStatus().currentPresetId ?? null,
      parameters: sound ? { ...sound.getParameterSnapshot() } : {},
    },
    visual: {
      presetId: visual?.getStatus().currentPresetId ?? null,
      parameters: visual ? { ...visual.getParameterSnapshot() } : {},
    },
    bridge: bridgeStatus
      ? {
          enabled: bridgeStatus.enabled,
          sensitivity: bridgeStatus.sensitivity,
          smoothing: bridgeStatus.smoothing,
          mappings: bridgeStatus.mappings.map((mapping) => ({ ...mapping })),
        }
      : defaultBridgeState(),
    workspace: workspaceState,
    plugins:
      pluginManager?.getAllPluginStatuses().map((status) => ({
        pluginId: status.pluginId,
        enabled: status.enabled,
      })) ?? [],
    performance: performanceStatus
      ? {
          performanceModeEnabled: performanceStatus.performanceModeEnabled,
          mappings: performanceStatus.mappings.map((mapping) => ({ ...mapping })),
        }
      : defaultPerformanceState(),
    ui,
  };
}

function captureWorkspaceState(workspace: Workspace | undefined, ui: UIState): WorkspaceState {
  const state: WorkspaceState = {
    activeInspectorPanel: ui.activeInspectorPanel,
  };

  if (!workspace) return state;

  const regions: WorkspaceState['regions'] = {};
  for (const region of workspace.listRegions()) {
    const element = region.element;
    if (!element) continue;
    regions[region.id] = {
      visible: !element.hasAttribute('hidden'),
      label: element.dataset.psRegionLabel,
    };
  }

  if (Object.keys(regions).length > 0) {
    state.regions = regions;
  }

  return state;
}

/** Validate imported serialized project data */
export function validateSerializedProject(data: unknown): ProjectValidationResult {
  const warnings: string[] = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, warnings, error: 'Project data must be an object' };
  }

  const envelope = data as Partial<SerializedProject>;
  if (envelope.format !== 'plantasonic-project') {
    return { valid: false, warnings, error: 'Invalid project format — expected plantasonic-project' };
  }

  if (!envelope.state || typeof envelope.state !== 'object') {
    return { valid: false, warnings, error: 'Project envelope missing state object' };
  }

  const stateResult = validateProjectState(envelope.state);
  if (!stateResult.valid) {
    return stateResult;
  }

  if (envelope.version && envelope.version !== PROJECT_STATE_VERSION) {
    warnings.push(
      `Project version ${envelope.version} differs from platform ${PROJECT_STATE_VERSION}`,
    );
  }

  if (stateResult.state?.version && stateResult.state.version !== PROJECT_STATE_VERSION) {
    warnings.push(
      `State version ${stateResult.state.version} differs from platform ${PROJECT_STATE_VERSION}`,
    );
  }

  return {
    valid: true,
    state: stateResult.state,
    warnings: [...warnings, ...stateResult.warnings],
  };
}

/** Validate a project state object */
export function validateProjectState(data: unknown): ProjectValidationResult {
  const warnings: string[] = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, warnings, error: 'Project state must be an object' };
  }

  const state = data as Partial<ProjectState>;

  if (!state.version || typeof state.version !== 'string') {
    return { valid: false, warnings, error: 'Project state requires a version string' };
  }

  if (state.version !== PROJECT_STATE_VERSION) {
    warnings.push(`State version ${state.version} differs from platform ${PROJECT_STATE_VERSION}`);
  }

  if (!state.sound || typeof state.sound !== 'object') {
    return { valid: false, warnings, error: 'Project state requires sound section' };
  }

  if (!state.visual || typeof state.visual !== 'object') {
    return { valid: false, warnings, error: 'Project state requires visual section' };
  }

  if (!state.bridge || typeof state.bridge !== 'object') {
    return { valid: false, warnings, error: 'Project state requires bridge section' };
  }

  if (!state.performance || typeof state.performance !== 'object') {
    return { valid: false, warnings, error: 'Project state requires performance section' };
  }

  if (!Array.isArray(state.plugins)) {
    return { valid: false, warnings, error: 'Project state requires plugins array' };
  }

  return {
    valid: true,
    state: state as ProjectState,
    warnings,
  };
}

/** Serialize project state to export JSON */
export function serializeProject(state: ProjectState): string {
  const envelope: SerializedProject = {
    format: 'plantasonic-project',
    version: PROJECT_STATE_VERSION,
    savedAt: new Date().toISOString(),
    state,
  };
  return JSON.stringify(envelope, null, 2);
}

/** Parse exported project JSON */
export function deserializeProject(json: string): ProjectState {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new ProjectValidationError('Project JSON is not valid');
  }

  const validation = validateSerializedProject(parsed);
  if (!validation.valid || !validation.state) {
    throw new ProjectValidationError(validation.error ?? 'Invalid project data');
  }

  return validation.state;
}

/** Apply project state through platform managers */
export async function applyProjectState(
  context: ProjectStateContext,
  state: ProjectState,
): Promise<ProjectApplyResult> {
  const warnings: string[] = [];

  try {
    await applyPluginStates(context, state, warnings);
    await applyPresetBundleState(context, state, warnings);
    await applyEngineStates(context, state, warnings);
    await applyBridgeState(context, state);
    applyPerformanceState(context, state);
    applyWorkspaceState(context, state);

    if (context.applyUIState) {
      await context.applyUIState(state.ui ?? {});
    }

    return { applied: true, warnings };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { applied: false, warnings, error: message };
  }
}

async function applyPluginStates(
  context: ProjectStateContext,
  state: ProjectState,
  warnings: string[],
): Promise<void> {
  const manager = context.pluginManager;
  if (!manager) return;

  for (const pluginState of state.plugins) {
    const status = manager.getPluginStatus(pluginState.pluginId);
    if (!status) {
      warnings.push(`Missing plugin: ${pluginState.pluginId}`);
      continue;
    }
    if (status.enabled === pluginState.enabled) continue;
    if (pluginState.enabled) {
      await manager.enablePlugin(pluginState.pluginId);
    } else {
      await manager.disablePlugin(pluginState.pluginId);
    }
  }
}

async function applyPresetBundleState(
  context: ProjectStateContext,
  state: ProjectState,
  warnings: string[],
): Promise<void> {
  const bundleId = state.activePresetBundleId;
  if (!bundleId || !context.presetBundles) return;

  const bundle = context.presetBundles.getBundle(bundleId);
  if (!bundle) {
    warnings.push(`Missing preset bundle: ${bundleId}`);
    return;
  }

  const result = await context.presetBundles.applyBundle(bundleId);
  warnings.push(...result.warnings);
}

async function applyEngineStates(
  context: ProjectStateContext,
  state: ProjectState,
  warnings: string[],
): Promise<void> {
  const { sound, visual, presetBundles } = context;
  const bundleApplied =
    Boolean(state.activePresetBundleId) &&
    Boolean(presetBundles?.getBundle(state.activePresetBundleId ?? ''));

  if (!bundleApplied) {
    if (sound && state.sound.presetId) {
      try {
        await sound.playPreset(state.sound.presetId);
      } catch {
        warnings.push(`Sound preset not applied: ${state.sound.presetId}`);
      }
    }

    if (visual && state.visual.presetId) {
      try {
        await visual.setPreset(state.visual.presetId);
      } catch {
        warnings.push(`Visual preset not applied: ${state.visual.presetId}`);
      }
    }
  }

  if (sound) {
    for (const [name, value] of Object.entries(state.sound.parameters)) {
      await sound.updateParameter(name, value).catch(() => {
        warnings.push(`Sound parameter skipped: ${name}`);
      });
    }
  }

  if (visual) {
    for (const [name, value] of Object.entries(state.visual.parameters)) {
      await visual.updateParameter(name, value).catch(() => {
        warnings.push(`Visual parameter skipped: ${name}`);
      });
    }
  }
}

async function applyBridgeState(
  context: ProjectStateContext,
  state: ProjectState,
): Promise<void> {
  if (!context.bridge) return;
  context.bridge.updateMapping({
    enabled: state.bridge.enabled,
    sensitivity: state.bridge.sensitivity,
    smoothing: state.bridge.smoothing,
    mappings: state.bridge.mappings.map((mapping) => ({ ...mapping })),
  });
}

function applyPerformanceState(context: ProjectStateContext, state: ProjectState): void {
  if (!context.performance) return;
  context.performance.updateMappings(state.performance.mappings.map((mapping) => ({ ...mapping })));
  context.performance.enablePerformanceMode(state.performance.performanceModeEnabled);
}

function applyWorkspaceState(context: ProjectStateContext, state: ProjectState): void {
  if (!context.workspace) return;

  const workspacePreset = {
    regions: state.workspace.regions,
    activeInspectorPanel:
      state.workspace.activeInspectorPanel ?? state.ui.activeInspectorPanel,
  };

  applyWorkspacePresetToRegions(context.workspace, workspacePreset);
}
