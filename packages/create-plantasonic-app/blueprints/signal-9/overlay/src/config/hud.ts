/**
 * Signal 9 HUD field catalog — maps to platform metrics where available.
 * Blueprint: signal-9
 */
export const {{APP_CONST}}_HUD_FIELDS = [
  { id: 'active-bundle', label: 'Current preset', metricId: 'active-bundle' },
  { id: 'signal-strength', label: 'Signal strength', metricId: 'bridge-state' },
  { id: 'transmission-status', label: 'Transmission status', metricId: 'lifecycle' },
  { id: 'tempo', label: 'BPM', source: 'transport' },
  { id: 'sound-level', label: 'Audio level', metricId: 'sound-state' },
  { id: 'visual-fps', label: 'Visual FPS', metricId: 'visual-fps' },
] as const;

export type {{APP_CONST}}HudField = (typeof {{APP_CONST}}_HUD_FIELDS)[number];
