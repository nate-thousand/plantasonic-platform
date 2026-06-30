import type { AudioReactiveMapping } from './audioReactive.js';
import type { WorkspaceRegionId } from './workspace.js';

/** Category label for grouping preset bundles */
export type PresetCategory = string;

/** Tag for filtering preset bundles */
export type PresetTag = string;

/** Reference to a Sound Engine preset by id */
export interface SoundPresetRef {
  presetId: string;
}

/** Reference to a Visual Engine preset by id */
export interface VisualPresetRef {
  presetId: string;
}

/** Audio reactive bridge configuration within a preset bundle */
export interface AudioReactivePreset {
  enabled?: boolean;
  sensitivity?: number;
  smoothing?: number;
  mappings?: AudioReactiveMapping[];
}

/** Workspace layout hints applied with a preset bundle */
export interface WorkspacePreset {
  /** Per-region visibility and label overrides */
  regions?: Partial<
    Record<WorkspaceRegionId, { visible?: boolean; label?: string }>
  >;
  /** Inspector panel id to expand (platform/demo applies via UI handler) */
  activeInspectorPanel?: string;
}

/** UI control state restored when a preset bundle is applied */
export interface UIPresetState {
  audioReactiveEnabled?: boolean;
  tempo?: number;
  /** Sound ecological control values (0–1) */
  soundParameters?: Record<string, number>;
  /** Visual engine control values (0–1) */
  visualParameters?: Record<string, number>;
  /** Per-feature bridge mapping amounts (0–1) */
  bridgeMappingAmounts?: Partial<Record<string, number>>;
  bridgeSensitivity?: number;
  bridgeSmoothing?: number;
}

/**
 * Unified platform preset bundle coordinating sound, visual, bridge,
 * workspace, and UI state without direct engine coupling.
 */
export interface PresetBundle {
  id: string;
  name: string;
  description?: string;
  category?: PresetCategory;
  tags?: PresetTag[];
  sound?: SoundPresetRef;
  visual?: VisualPresetRef;
  audioReactive?: AudioReactivePreset;
  workspace?: WorkspacePreset;
  ui?: UIPresetState;
}

/** Result of applying a preset bundle */
export interface PresetBundleApplyResult {
  bundleId: string;
  applied: boolean;
  warnings: string[];
}

/** Contract for the unified preset bundle registry */
export interface PresetBundleRegistry {
  registerBundle(bundle: PresetBundle): void;
  unregisterBundle(id: string): void;
  getBundle(id: string): PresetBundle | undefined;
  getBundles(): PresetBundle[];
  getBundlesByCategory(category: PresetCategory): PresetBundle[];
  getBundlesByTag(tag: PresetTag): PresetBundle[];
  applyBundle(id: string): Promise<PresetBundleApplyResult>;
  exportBundle(id: string): string;
  importBundle(json: string): PresetBundle;
  getActiveBundleId(): string | null;
}
