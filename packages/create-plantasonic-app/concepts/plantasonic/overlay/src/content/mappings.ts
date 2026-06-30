/**
 * Plantasonic sound ↔ visual mapping notes.
 * Cross-engine resolution is handled by @plantasonic/platform VisualEngineAdapter.
 */
export const {{APP_CONST}}_PRESET_MAPPING_NOTES = {
  description:
    'Plantasonic unified preset bundles reference sound and visual preset ids separately.',
  examples: [
    { soundPresetId: 'seed', visualPresetId: 'seed', flora: 'gentle sprout' },
    { soundPresetId: 'root', visualPresetId: 'root', flora: 'deep roots' },
    { soundPresetId: 'bloom', visualPresetId: 'bloom', flora: 'floral canopy' },
    { soundPresetId: 'mycelium', visualPresetId: 'mycelium', flora: 'network texture' },
    { soundPresetId: 'mutation', visualPresetId: 'mutation', flora: 'corrupted evolution' },
  ],
} as const;

export const {{APP_CONST}}_DEFAULT_TEMPO = {{DEFAULT_TEMPO}};
