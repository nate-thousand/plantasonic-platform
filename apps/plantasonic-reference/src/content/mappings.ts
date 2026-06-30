/**
 * Plantasonic sound ↔ visual preset mapping notes.
 *
 * Runtime mapping is handled by @plantasonic/platform via resolveVisualPresetId().
 * This file documents app-level expectations — do not duplicate engine preset tables here.
 *
 * Sound preset ids (plantasia-sound-engine) map to visual preset ids (ascii-visual-engine)
 * through the platform VisualEngineAdapter compatibility layer.
 */
export const PLANTASONIC_PRESET_MAPPING_NOTES = {
  description:
    'Unified PresetBundle entries reference sound and visual preset ids separately. The platform adapter resolves cross-engine ids.',
  examples: [
    { soundPresetId: 'seed', visualPresetId: 'seed', flora: 'gentle sprout' },
    { soundPresetId: 'root', visualPresetId: 'root', flora: 'deep roots' },
    { soundPresetId: 'bloom', visualPresetId: 'bloom', flora: 'floral canopy' },
    { soundPresetId: 'mycelium', visualPresetId: 'mycelium', flora: 'network texture' },
    { soundPresetId: 'mutation', visualPresetId: 'mutation', flora: 'corrupted evolution' },
  ],
} as const;

/** Default transport tempo for Plantasonic sessions */
export const PLANTASONIC_DEFAULT_TEMPO = 68;
