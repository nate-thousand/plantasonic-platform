/**
 * Flowers sound ↔ visual mapping notes.
 * Cross-engine resolution via @plantasonic/platform VisualEngineAdapter.
 */
export const {{APP_CONST}}_PRESET_MAPPING_NOTES = {
  description: 'Botanical sessions pair sound and visual preset ids through platform adapters.',
  examples: [
    { soundPresetId: 'seed', visualPresetId: 'seed', form: 'sprout' },
    { soundPresetId: 'root', visualPresetId: 'root', form: 'stem growth' },
    { soundPresetId: 'bloom', visualPresetId: 'bloom', form: 'petal unfold' },
    { soundPresetId: 'flowers', visualPresetId: 'flowers', form: 'full bloom' },
    { soundPresetId: 'moss', visualPresetId: 'moss', form: 'pollination drift' },
  ],
} as const;

export const {{APP_CONST}}_DEFAULT_TEMPO = {{DEFAULT_TEMPO}};
