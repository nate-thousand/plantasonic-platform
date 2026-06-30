/**
 * Plantasonic Design System — Unified Creative Ecosystem types.
 *
 * Every application is a lightweight client consuming shared platform services.
 * Applications install engines, plugins, assets, and workflows — they never
 * duplicate core infrastructure.
 */

export type PlatformStatus = 'stable' | 'beta' | 'experimental' | 'deprecated';

/** Known shared engine identifiers. */
export type EngineId =
  | 'engine.sound'
  | 'engine.visual'
  | 'engine.physics'
  | 'engine.particle'
  | 'engine.animation'
  | 'engine.lighting'
  | 'engine.midi'
  | 'engine.osc'
  | 'engine.camera'
  | 'engine.ai';

export type AssetKind =
  | 'image'
  | 'video'
  | 'audio'
  | 'model'
  | 'font'
  | 'glyph-set'
  | 'texture'
  | 'preset'
  | 'lut'
  | 'particle-system';

export type DeploymentTarget =
  | 'local'
  | 'preview'
  | 'production'
  | 'desktop'
  | 'mobile'
  | 'pwa'
  | 'embedded';

export type DeploymentStatus = 'local' | 'preview' | 'production' | 'archived';

export type ServiceId =
  | 'logging'
  | 'settings'
  | 'telemetry'
  | 'storage'
  | 'undo-redo'
  | 'history'
  | 'autosave'
  | 'file-import'
  | 'file-export'
  | 'search'
  | 'notifications'
  | 'recent-projects';

/** Metadata for a installable shared engine. */
export interface EngineSpec {
  id: EngineId;
  name: string;
  version: string;
  purpose: string;
  status: PlatformStatus;
  /** npm package or repo URL — apps install, never embed source. */
  package?: string;
  dependencies?: EngineId[];
  documentation?: string;
}

/** Registered asset reference (centralized, not duplicated per app). */
export interface AssetRef {
  id: string;
  kind: AssetKind;
  name: string;
  /** URI, path, or package reference. */
  uri: string;
  tags?: string[];
  version?: string;
  checksum?: string;
}

/** Preset with versioning and sharing metadata. */
export interface PresetRecord {
  id: string;
  name: string;
  version: string;
  category: string;
  tags: string[];
  favorite?: boolean;
  dependencies?: string[];
  /** Engine or asset ids this preset requires. */
  requires?: string[];
  data: Record<string, unknown>;
  source?: 'local' | 'import' | 'cloud' | 'ai-generated';
}

/** Reusable creative workflow definition. */
export interface WorkflowSpec {
  id: string;
  name: string;
  purpose: string;
  /** SDK entrypoint or command id apps invoke. */
  invoke: string;
  inputs?: string[];
  outputs?: string[];
  tags?: string[];
}

/** Project manifest — every prototype/app registers in the ecosystem. */
export interface ProjectManifest {
  id: string;
  name: string;
  type: string;
  version: string;
  description?: string;
  layout?: string;
  engines: EngineId[];
  plugins: string[];
  assets: string[];
  workflows: string[];
  services: ServiceId[];
  dependencies: Record<string, string>;
  documentation: string[];
  deployment: {
    target: DeploymentTarget;
    status: DeploymentStatus;
    url?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectConfig {
  /** Prototype type (from prototype catalog). */
  type: string;
  name: string;
  /** Additional engines beyond type defaults. */
  engines?: EngineId[];
  plugins?: string[];
  workflows?: string[];
  services?: ServiceId[];
  deployment?: DeploymentTarget;
  brief?: string;
}

export interface ProjectContext {
  manifest: ProjectManifest;
  architecture: Record<string, unknown>;
  ai: Record<string, unknown>;
}

export interface PlatformValidationCheck {
  id: string;
  label: string;
  ok: boolean;
  message?: string;
}

export interface PlatformValidationReport {
  ok: boolean;
  checks: PlatformValidationCheck[];
}
