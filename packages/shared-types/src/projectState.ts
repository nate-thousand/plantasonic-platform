import type { AudioReactiveMapping } from './audioReactive.js';
import type { ControlMapping } from './performanceControls.js';
import type { WorkspaceRegionId } from './workspace.js';

/** Current project state format version */
export type ProjectStateVersion = string;

/** Sound engine snapshot for persistence */
export interface SoundState {
  presetId: string | null;
  parameters: Record<string, number>;
}

/** Visual engine snapshot for persistence */
export interface VisualState {
  presetId: string | null;
  parameters: Record<string, number>;
}

/** Combined engine snapshots */
export interface EngineState {
  sound: SoundState;
  visual: VisualState;
}

/** Audio reactive bridge snapshot */
export interface BridgeState {
  enabled: boolean;
  sensitivity: number;
  smoothing: number;
  mappings: AudioReactiveMapping[];
}

/** Workspace layout snapshot */
export interface WorkspaceState {
  regions?: Partial<
    Record<WorkspaceRegionId, { visible?: boolean; label?: string }>
  >;
  activeInspectorPanel?: string;
}

/** Plugin enablement snapshot */
export interface PluginState {
  pluginId: string;
  enabled: boolean;
}

/** Performance control snapshot */
export interface PerformanceState {
  performanceModeEnabled: boolean;
  mappings: ControlMapping[];
}

/** UI and inspector snapshot */
export interface UIState {
  activeInspectorPanel?: string;
  inspectorPanels?: Partial<Record<string, { collapsed?: boolean }>>;
  performanceModeEnabled?: boolean;
  audioReactiveEnabled?: boolean;
  tempo?: number;
  soundParameters?: Record<string, number>;
  visualParameters?: Record<string, number>;
  bridgeMappingAmounts?: Partial<Record<string, number>>;
  bridgeSensitivity?: number;
  bridgeSmoothing?: number;
}

/** Full platform project state */
export interface ProjectState {
  version: ProjectStateVersion;
  applicationId?: string;
  activePresetBundleId?: string | null;
  sound: SoundState;
  visual: VisualState;
  bridge: BridgeState;
  workspace: WorkspaceState;
  plugins: PluginState[];
  performance: PerformanceState;
  ui: UIState;
}

/** JSON envelope for export/import */
export interface SerializedProject {
  format: 'plantasonic-project';
  version: ProjectStateVersion;
  savedAt: string;
  state: ProjectState;
}

/** Result of applying a project state */
export interface ProjectApplyResult {
  applied: boolean;
  warnings: string[];
  error?: string;
}

/** Result of validating imported project data */
export interface ProjectValidationResult {
  valid: boolean;
  state?: ProjectState;
  warnings: string[];
  error?: string;
}

/** Replaceable storage backend for workspace persistence */
export interface ProjectStorageAdapter {
  read(key: string): string | null;
  write(key: string, value: string): void;
  remove(key: string): void;
}

/** Workspace persistence contract */
export interface WorkspacePersistence {
  getCurrentState(): ProjectState;
  saveProject(): Promise<ProjectApplyResult>;
  loadProject(): Promise<ProjectApplyResult>;
  exportProject(): string;
  importProject(json: string): Promise<ProjectApplyResult>;
  resetProject(): Promise<ProjectApplyResult>;
}
