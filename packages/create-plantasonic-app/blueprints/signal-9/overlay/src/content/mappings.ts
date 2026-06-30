/**
 * Signal 9 sound ↔ visual mapping notes.
 * Cross-engine resolution via @plantasonic/platform VisualEngineAdapter.
 */
export const {{APP_CONST}}_PRESET_MAPPING_NOTES = {
  description: 'Broadcast sessions pair sound and visual preset ids through platform adapters.',
  examples: [
    { soundPresetId: 'ambient', visualPresetId: 'ambient', session: 'broadcast carrier wave' },
    { soundPresetId: 'mold', visualPresetId: 'mold', session: 'interference static' },
    { soundPresetId: 'bacteria', visualPresetId: 'bacteria', session: 'jammer pulse' },
    { soundPresetId: 'mutation', visualPresetId: 'mutation', session: 'uplink burst' },
    { soundPresetId: 'drone', visualPresetId: 'drone', session: 'blackout collapse' },
  ],
} as const;

export const {{APP_CONST}}_DEFAULT_TEMPO = {{DEFAULT_TEMPO}};
