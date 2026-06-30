/**
 * Signal 9 startup workspace — Instrument Creative Workspace layout intent.
 * Blueprint: signal-9
 */
export const {{APP_CONST}}_STARTUP_WORKSPACE = {
  creativeWorkspacePreset: 'instrument',
  stageFullscreen: true,
  floatingTransport: true,
  floatingHud: true,
  presetBrowserVariant: 'compact' as const,
  inspectorDefaultVisible: false,
  commandPaletteEnabled: true,
} as const;

export type {{APP_CONST}}StartupWorkspace = typeof {{APP_CONST}}_STARTUP_WORKSPACE;
