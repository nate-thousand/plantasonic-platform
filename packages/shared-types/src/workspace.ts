/**
 * Named regions in the application workspace.
 * The Design System renders into these regions; the platform defines the layout contract.
 */
export type WorkspaceRegionId =
  | 'stage'
  | 'transport'
  | 'inspector'
  | 'preset-browser'
  | 'status';

/**
 * A single region in the workspace layout.
 */
export interface WorkspaceRegion {
  /** Region identifier */
  id: WorkspaceRegionId;
  /** Display label for the region chrome */
  label: string;
  /** Optional DOM element target (set at runtime by the demo/app) */
  element?: HTMLElement;
}

/**
 * Configuration for the application workspace layout.
 */
export interface WorkspaceConfig {
  /** Ordered list of regions to render */
  regions: WorkspaceRegion[];
}

/** Contract for the platform workspace manager */
export interface Workspace {
  readonly config: WorkspaceConfig;
  /** Bind a DOM element to a region */
  bindRegion(id: WorkspaceRegionId, element: HTMLElement): void;
  /** Get a region by id */
  getRegion(id: WorkspaceRegionId): WorkspaceRegion | undefined;
  /** List all configured regions */
  listRegions(): WorkspaceRegion[];
}
