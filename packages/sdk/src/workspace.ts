import type {
  Workspace,
  WorkspaceConfig,
  WorkspaceRegion,
  WorkspaceRegionId,
} from '@plantasonic/platform-types';

/** Default workspace regions for Plantasonic applications */
export const DEFAULT_REGIONS: WorkspaceRegion[] = [
  { id: 'stage', label: 'Stage' },
  { id: 'transport', label: 'Transport' },
  { id: 'inspector', label: 'Inspector' },
  { id: 'preset-browser', label: 'Preset Browser' },
  { id: 'status', label: 'Status' },
];

/** Options for creating a workspace */
export interface WorkspaceOptions {
  regions?: WorkspaceRegion[];
}

/**
 * Create a workspace manager that defines layout regions for the application.
 * The Design System renders into bound regions — the platform owns the layout contract.
 */
export function createWorkspace(options: WorkspaceOptions = {}): Workspace {
  const config: WorkspaceConfig = {
    regions: options.regions ?? DEFAULT_REGIONS.map((r) => ({ ...r })),
  };

  return {
    config,

    bindRegion(id: WorkspaceRegionId, element: HTMLElement): void {
      const region = config.regions.find((r) => r.id === id);
      if (region) {
        region.element = element;
      }
    },

    getRegion(id: WorkspaceRegionId): WorkspaceRegion | undefined {
      return config.regions.find((r) => r.id === id);
    },

    listRegions(): WorkspaceRegion[] {
      return [...config.regions];
    },
  };
}
