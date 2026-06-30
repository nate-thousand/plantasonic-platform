import type { WorkspaceConfig } from '@plantasonic/platform-types';

/** Regions bound to Creative Workspace floating surfaces via mountInstrumentApp() */
export const defaultWorkspaceConfig: WorkspaceConfig = {
  regions: [
    { id: 'stage', label: 'Stage' },
    { id: 'transport', label: 'Transport' },
    { id: 'inspector', label: 'Inspector' },
    { id: 'preset-browser', label: 'Presets' },
    { id: 'status', label: 'Status' },
  ],
};
